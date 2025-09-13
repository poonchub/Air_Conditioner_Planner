import React, { useEffect, useState } from "react";
import { Box, Grid, GridItem, Image, Heading, Field, Table, Flex, Button } from "@chakra-ui/react";
import { Chip, Collapse, FormControl, MenuItem, OutlinedInput, Select, type SelectChangeEvent } from "@mui/material";
import type { CalculateVariableProps, FormDataErrorProps, FormDataProps, WallValue } from "@/pages/MainPage/MainPage";
import { Controller, useForm } from "react-hook-form";

interface DirectionItem {
    value: string;
    label: string;
}

interface InstallationPositionSelectorProps {
    formData: FormDataProps;
    setFormData: React.Dispatch<React.SetStateAction<FormDataProps>>;
    setTabValue: React.Dispatch<React.SetStateAction<string>>;
    setCalculateVariable: React.Dispatch<React.SetStateAction<CalculateVariableProps>>;
    directions: DirectionItem[];
}

// @ts-ignore
const InstallationPositionSelector: React.FC<InstallationPositionSelectorProps> = ({
    formData,
    setFormData,
    setTabValue,
    setCalculateVariable,
    directions,
}) => {
    // @ts-ignore
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataErrorProps>({
        defaultValues: {
            wallValue: [],
            furniturePosition: [],
        },
    });

    // @ts-ignore
    const [formDataPre, setFormDataPre] = useState<FormDataProps>({
        furniturePosition: [],
        wallValue: [],
    });

    const [formDataAll, setFormDataAll] = useState<FormDataProps>();

    const handleFurniturePositionChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        const positionArr: string[] = typeof value === "string" ? value.split(",") : value;

        setFormData((prev) => {
            if (positionArr.includes("None")) {
                return {
                    ...prev,
                    furniturePosition: [],
                };
            }

            const prevPositions = prev.furniturePosition || [];
            const newPositions: string[] = [...prevPositions];

            positionArr.forEach((pos: string) => {
                if (!newPositions.includes(pos)) {
                    newPositions.push(pos);
                }
            });

            const filteredPositions = newPositions.filter((pos) => positionArr.includes(pos));

            return {
                ...prev,
                furniturePosition: filteredPositions,
            };
        });

        setFormDataPre((prev) => {
            if (positionArr.includes("None")) {
                return {
                    ...prev,
                    furniturePosition: [],
                };
            }

            const prevPositions = prev.furniturePosition || [];
            const newPositions: string[] = [...prevPositions];

            positionArr.forEach((pos: string) => {
                if (!newPositions.includes(pos)) {
                    newPositions.push(pos);
                }
            });

            const filteredPositions = newPositions.filter((pos) => positionArr.includes(pos));

            return {
                ...prev,
                furniturePosition: filteredPositions,
            };
        });
    };

    const handleWallDirectionChange = (event: SelectChangeEvent<string[]>, field: any) => {
        const { value } = event.target;

        const directionArr = typeof value === "string" ? value.split(",") : value;

        field.onChange(directionArr);

        setFormDataPre((prev) => {
            if (directionArr.includes("None")) {
                return {
                    ...prev,
                    wallValue: [
                        {
                            directionName: "None",
                            position: "",
                            material: "",
                            kWallColor: 0,
                            wallArea: 0,
                            glassAreaWindow: 0,
                            glassAreaDoor: 0,
                            haveShade: false,
                            haveCurtain: false,
                            glassType: "",
                            qWallByMonth: [],
                            qWallGlassByMonth: [],
                            qSolarWallGlassByMonth: [],
                            wallCondition: "",
                            hasOpenSpace: true,
                        },
                    ],
                };
            }

            const prevWalls = prev.wallValue || [];
            const newWalls: WallValue[] = [...prevWalls];

            directionArr?.forEach((dir) => {
                const exists = newWalls.find((d) => d.directionName === dir);
                if (!exists) {
                    newWalls.push({
                        directionName: dir,
                        position: "",
                        material: "",
                        kWallColor: 0.65,
                        wallArea: 0,
                        glassAreaWindow: 0,
                        glassAreaDoor: 0,
                        haveShade: false,
                        haveCurtain: false,
                        glassType: "",
                        qWallByMonth: [],
                        qWallGlassByMonth: [],
                        qSolarWallGlassByMonth: [],
                        wallCondition: "",
                        hasOpenSpace: true,
                    });
                }
            });

            const filteredWalls = newWalls.filter((d) => directionArr?.includes(d.directionName));

            return {
                ...prev,
                wallValue: filteredWalls,
            };
        });
    };

    const furniturePositionOptions = [
        { label: "ทิศเหนือ (N)", value: "N" },
        { label: "ทิศตะวันออกเฉียงเหนือ (NE)", value: "NE" },
        { label: "ทิศตะวันออก (E)", value: "E" },
        { label: "ทิศตะวันออกเฉียงใต้ (SE)", value: "SE" },
        { label: "ทิศใต้ (S)", value: "S" },
        { label: "ทิศตะวันตกเฉียงใต้ (SW)", value: "SW" },
        { label: "ทิศตะวันตก (W)", value: "W" },
        { label: "ทิศตะวันตกเฉียงเหนือ (NW)", value: "NW" },
        { label: "กลางห้อง", value: "Center" },
        { label: "ไม่มี", value: "None" },
    ];

    useEffect(() => {
        setFormData((prev) => {
            const newWallValue = prev.wallValue.map((wall) => {
                let solarExposure = 0
                let furnitureAndOccupants = 0
                let airDistribution = 0
                let doorsAndWindows = 0
                let pipingLayout = 0

                if (wall.wallCondition === "Shaded") {
                    solarExposure = 70
                } else if (wall.wallCondition === "Sunny") {
                    solarExposure = 40
                }

                const result = prev.furniturePosition.find((p) => p === wall.directionName)
                if (result) {
                    furnitureAndOccupants = 60
                } else {
                    furnitureAndOccupants = 100
                }

                if (prev.width === prev.depth) {
                    airDistribution = 90
                } else if (wall.position === "Width") {
                    airDistribution = 60
                } else if (wall.position === "Depth") {
                    airDistribution = 100
                }

                const windowCount = prev.windowValue.find((w) => w.directionName === wall.directionName)?.quantity || 0
                const doorCount = prev.doorValue.find((d) => d.directionName === wall.directionName)?.quantity || 0
                const sumWindowDoor = windowCount + doorCount
                switch (sumWindowDoor) {
                    case 0:
                        doorsAndWindows = 100
                        break
                    case 1:
                        doorsAndWindows = 80
                        break
                    case 2:
                        doorsAndWindows = 60
                        break
                    case 3:
                        doorsAndWindows = 40
                        break
                    default:
                        doorsAndWindows = 20
                }

                if (wall.hasOpenSpace) {
                    if (wall.wallCondition === "Shaded") {
                        pipingLayout = 100
                    } else if (wall.wallCondition === "Sunny") {
                        pipingLayout = 70
                    } else {
                        pipingLayout = 40
                    }
                }

                const totalScore =
                    solarExposure * 0.25 +
                    furnitureAndOccupants * 0.08 +
                    airDistribution * 0.25 +
                    doorsAndWindows * 0.12 +
                    pipingLayout * 0.30

                return {
                    ...wall,
                    wallScore: {
                        solarExposure: solarExposure * 0.25,
                        furnitureAndOccupants: furnitureAndOccupants * 0.08,
                        airDistribution: airDistribution * 0.25,
                        doorsAndWindows: doorsAndWindows * 0.12,
                        pipingLayout: pipingLayout * 0.30,
                        totalScore
                    }
                };
            });

            const isSame = JSON.stringify(prev.wallValue) === JSON.stringify(newWallValue);
            if (isSame) return prev;

            return { ...prev, wallValue: newWallValue };
        })

        setFormDataPre((prev) => {
            const newWallValue = prev.wallValue.map((wall) => {
                let solarExposure = 100
                let furnitureAndOccupants = 0
                let airDistribution = 0
                let doorsAndWindows = 0
                let pipingLayout = 40

                const result = prev.furniturePosition.find((p) => p === wall.directionName)
                if (result) {
                    furnitureAndOccupants = 60
                } else {
                    furnitureAndOccupants = 100
                }

                if (prev.width === prev.depth) {
                    airDistribution = 90
                } else if (wall.position === "Width") {
                    airDistribution = 60
                } else if (wall.position === "Depth") {
                    airDistribution = 100
                }

                const windowCount = prev.windowValue?.find((w) => w.directionName === wall.directionName)?.quantity || 0
                const doorCount = prev.doorValue?.find((d) => d.directionName === wall.directionName)?.quantity || 0
                const sumWindowDoor = windowCount + doorCount
                switch (sumWindowDoor) {
                    case 0:
                        doorsAndWindows = 100
                        break
                    case 1:
                        doorsAndWindows = 80
                        break
                    case 2:
                        doorsAndWindows = 60
                        break
                    case 3:
                        doorsAndWindows = 40
                        break
                    default:
                        doorsAndWindows = 20
                }

                const totalScore =
                    solarExposure * 0.25 +
                    furnitureAndOccupants * 0.08 +
                    airDistribution * 0.25 +
                    doorsAndWindows * 0.12 +
                    pipingLayout * 0.30

                return {
                    ...wall,
                    wallScore: {
                        solarExposure: solarExposure * 0.25,
                        furnitureAndOccupants: furnitureAndOccupants * 0.08,
                        airDistribution: airDistribution * 0.25,
                        doorsAndWindows: doorsAndWindows * 0.12,
                        pipingLayout: pipingLayout * 0.30,
                        totalScore
                    }
                };
            });

            const isSame = JSON.stringify(prev.wallValue) === JSON.stringify(newWallValue);
            if (isSame) return prev;

            return { ...prev, wallValue: newWallValue };
        })
    }, [formData.furniturePosition, formDataPre.wallValue])

    useEffect(() => {
        setFormDataAll({
            ...formData,
            ...formDataPre,
            wallValue: [...formData.wallValue, ...formDataPre.wallValue]
        });
    }, [formData, formDataPre])

    useEffect(() => {
        setCalculateVariable((prev) => ({
            ...prev,
            wallScoreAll: formDataAll?.wallValue ?? []
        }))
    }, [formDataAll])

    const onSubmit = (data: FormDataErrorProps) => {
        console.log("Form Data:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Heading size="2xl" color="#003475" mb={4}>
                    กำหนดตำแหน่งติดตั้ง
                </Heading>
                <Grid gridTemplateColumns="repeat(3, 1fr)" gap={10} padding="1.4rem 2rem">
                    {/* ภาพ 3D ห้อง */}
                    <GridItem
                        colSpan={1}
                        rowSpan={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        padding={5}
                    >
                        <Image height="400px" src="./images/background/room_3D.png" />
                    </GridItem>

                    {/* Outdoor */}
                    <GridItem colSpan={2} border="1px solid #c5c5c6" borderRadius={10} padding={5}>
                        <Grid gridTemplateColumns="repeat(5, 1fr)" gap={20}>
                            <GridItem colSpan={3} display="flex" alignItems="center">
                                <Field.Root>
                                    <Field.Label>ตำแหน่งที่สามารถติดตั้ง outdoor</Field.Label>
                                    <Table.Root size="sm" variant={"outline"}>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                    ทิศผนัง
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                    มีพื้นที่ว่างหรือไม่
                                                </Table.ColumnHeader>
                                                <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                    สภาพภายนอกผนัง
                                                </Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {formData.wallValue.map((item, index) => (
                                                <Table.Row key={index}>
                                                    {/* แสดงชื่อทิศ */}
                                                    <Table.Cell textAlign="center">
                                                        {directions.find((d) => d.value === item.directionName)?.label}
                                                    </Table.Cell>

                                                    {/* hasOpenSpace */}
                                                    <Table.Cell>
                                                        <Controller
                                                            name={`wallValue.${index}.hasOpenSpace`}
                                                            control={control}
                                                            rules={{ required: "กรุณาเลือกว่ามีพื้นว่างให้ติดตั้งเครื่องปรับอากาศหรือไม่" }}
                                                            // @ts-ignore
                                                            render={({ field, fieldState }) => (
                                                                <FormControl
                                                                    fullWidth
                                                                // error={!!fieldState.error}
                                                                >
                                                                    <Select
                                                                        {...field}
                                                                        displayEmpty
                                                                        onChange={(e) => {
                                                                            const newValue = e.target.value === "true";
                                                                            field.onChange(e.target.value);
                                                                            setFormData((prev) => {
                                                                                const updated = [...prev.wallValue];
                                                                                updated[index] = { ...updated[index], hasOpenSpace: newValue };
                                                                                return { ...prev, wallValue: updated };
                                                                            });
                                                                        }}
                                                                    >
                                                                        <MenuItem value="">
                                                                            <em>เลือกว่ามีพื้นว่างให้ติดตั้งเครื่องปรับอากาศหรือไม่</em>
                                                                        </MenuItem>
                                                                        <MenuItem value="true">มี</MenuItem>
                                                                        <MenuItem value="false">ไม่มี</MenuItem>
                                                                    </Select>
                                                                    {/* {fieldState.error && (
                                                                        <p style={{ color: "red", fontSize: "0.8rem" }}>{fieldState.error.message}</p>
                                                                    )} */}
                                                                </FormControl>
                                                            )}
                                                        />
                                                    </Table.Cell>

                                                    {/* wallCondition */}
                                                    <Table.Cell>
                                                        <Controller
                                                            name={`wallValue.${index}.wallCondition`}
                                                            control={control}
                                                            rules={{
                                                                required: item.hasOpenSpace ? "กรุณาเลือกสภาพผนัง" : false,
                                                            }}
                                                            // @ts-ignore
                                                            render={({ field, fieldState }) => (
                                                                <FormControl
                                                                    fullWidth
                                                                    // error={!!fieldState.error} 
                                                                    disabled={!item.hasOpenSpace}
                                                                >
                                                                    <Select
                                                                        {...field}
                                                                        displayEmpty
                                                                        onChange={(e) => {
                                                                            field.onChange(e);
                                                                            setFormData((prev) => {
                                                                                const updated = [...prev.wallValue];
                                                                                updated[index] = { ...updated[index], wallCondition: e.target.value };
                                                                                return { ...prev, wallValue: updated };
                                                                            });
                                                                        }}
                                                                    >
                                                                        <MenuItem value="">
                                                                            <em>เลือกสภาพผนัง</em>
                                                                        </MenuItem>
                                                                        <MenuItem value="Shaded">มีร่มเงา</MenuItem>
                                                                        <MenuItem value="Sunny">มีแดดส่อง</MenuItem>
                                                                    </Select>
                                                                    {/* {fieldState.error && (
                                                                        <p style={{ color: "red", fontSize: "0.8rem" }}>{fieldState.error.message}</p>
                                                                    )} */}
                                                                </FormControl>
                                                            )}
                                                        />
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Field.Root>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <Image width="100%" src="./images/background/outdoor.png" />
                            </GridItem>
                        </Grid>
                    </GridItem>

                    <GridItem colSpan={2} border="1px solid #c5c5c6" borderRadius={10} padding={5}>
                        <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                            <GridItem>
                                <Field.Root>
                                    <Field.Label>ผนัง (wall)</Field.Label>
                                    <Field.Label>
                                        ระบุทิศผนังภายในด้านที่เหลือทั้งหมด
                                    </Field.Label>
                                    <Controller
                                        name="wallValue"
                                        control={control}
                                        rules={{ required: "กรุณาเลือกทิศผนังอย่างน้อย 1 ด้าน" }}
                                        render={({ field }) => (
                                            <FormControl
                                                fullWidth
                                            // error={!!errors.wallValue}
                                            >
                                                <Select
                                                    multiple
                                                    displayEmpty
                                                    input={<OutlinedInput />}
                                                    value={formDataPre.wallValue.map((d) => d.directionName)}
                                                    onChange={(e) => handleWallDirectionChange(e, field)}
                                                    renderValue={(selected) => (
                                                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                            {selected.map((value) => (
                                                                <Chip key={value} label={value} />
                                                            ))}
                                                        </Box>
                                                    )}
                                                >
                                                    {directions.map((item, index) => (
                                                        <MenuItem key={index} value={item.value}>
                                                            {item.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {/* {errors.wallValue && (
                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                        {errors.wallValue.message}
                                                    </p>
                                                )} */}
                                            </FormControl>
                                        )}
                                    />
                                </Field.Root>
                            </GridItem>
                            <Collapse
                                in={
                                    formDataPre.wallValue.length > 0 &&
                                    formDataPre.wallValue[0].directionName !== "None"
                                }
                                timeout={400}
                                unmountOnExit
                            >
                                <GridItem>
                                    <Field.Root>
                                        <Field.Label>ระบุข้อมูลผนัง</Field.Label>
                                        <Table.Root size="sm" variant={"outline"}>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.ColumnHeader
                                                        fontWeight={600}
                                                        textAlign={"center"}
                                                    >
                                                        ทิศทาง
                                                    </Table.ColumnHeader>
                                                    <Table.ColumnHeader
                                                        fontWeight={600}
                                                        textAlign={"center"}
                                                    >
                                                        ตำแหน่ง
                                                    </Table.ColumnHeader>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {formDataPre.wallValue.map((item, index) => (
                                                    <Table.Row key={index}>
                                                        {/* ชื่อทิศ */}
                                                        <Table.Cell textAlign="center">
                                                            {directions.find((d) => d.value === item.directionName)?.label}
                                                        </Table.Cell>

                                                        {/* Position */}
                                                        <Table.Cell>
                                                            <Controller
                                                                name={`wallValue.${index}.position`}
                                                                control={control}
                                                                rules={{ required: "กรุณาเลือกตำแหน่งที่อ้างอิงจากขนาดห้อง" }}
                                                                // @ts-ignore
                                                                render={({ field, fieldState }) => (
                                                                    <FormControl
                                                                        fullWidth
                                                                    // error={!!fieldState.error}
                                                                    >
                                                                        <Select
                                                                            {...field}
                                                                            displayEmpty
                                                                            sx={{ width: "100%" }}
                                                                            onChange={(e) => {
                                                                                field.onChange(e); // อัปเดต react-hook-form

                                                                                // sync ค่าใน state formDataPre ด้วย
                                                                                setFormDataPre((prev) => {
                                                                                    const updated = [...prev.wallValue];
                                                                                    updated[index] = {
                                                                                        ...updated[index],
                                                                                        position: e.target.value,
                                                                                    };
                                                                                    return { ...prev, wallValue: updated };
                                                                                });
                                                                            }}
                                                                        >
                                                                            <MenuItem value="">
                                                                                <em>เลือกตำแหน่งที่อ้างอิงจากขนาดห้อง</em>
                                                                            </MenuItem>
                                                                            <MenuItem value="Width">ด้านสั้น</MenuItem>
                                                                            <MenuItem value="Depth">ด้านยาว</MenuItem>
                                                                        </Select>
                                                                        {/* {fieldState.error && (
                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                {fieldState.error.message}
                                                                            </p>
                                                                        )} */}
                                                                    </FormControl>
                                                                )}
                                                            />
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Root>
                                    </Field.Root>
                                </GridItem>
                            </Collapse>
                        </Grid>
                    </GridItem>

                    <GridItem colSpan={2} border="1px solid #c5c5c6" borderRadius={10} padding={5}>
                        <Field.Root>
                            <Field.Label>เลือกตำแหน่ง เฟอร์นิเจอร์/ผู้ใช้งานประจำ (เลือกได้หลายตำแหน่ง)</Field.Label>
                            <Controller
                                name="furniturePosition"
                                control={control}
                                rules={{ required: "กรุณาเลือกตำแหน่งอย่างน้อย 1 ตำแหน่ง" }}
                                // @ts-ignore
                                render={({ field, fieldState }) => (
                                    <FormControl
                                        fullWidth
                                    // error={!!fieldState.error}
                                    >
                                        <Select
                                            {...field}
                                            multiple
                                            displayEmpty
                                            input={<OutlinedInput />}
                                            value={formDataPre.furniturePosition}
                                            onChange={(e) => {
                                                field.onChange(e); // update react-hook-form

                                                // sync ค่าไปที่ state formDataPre
                                                handleFurniturePositionChange(e);
                                            }}
                                            renderValue={(selected) => (
                                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                    {selected.map((value: string) => (
                                                        <Chip
                                                            key={value}
                                                            label={
                                                                furniturePositionOptions.find((opt) => opt.value === value)
                                                                    ?.label || value
                                                            }
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {furniturePositionOptions.map((item, index) => (
                                                <MenuItem key={index} value={item.value}>
                                                    {item.label}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                        {/* {fieldState.error && (
                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )} */}
                                    </FormControl>
                                )}
                            />
                        </Field.Root>
                    </GridItem>
                </Grid>
            </Box>

            <Flex width={"100%"} justifyContent={"space-between"}>
                <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={() => setTabValue("three")}>
                    Previous
                </Button>
                <Button width={100} backgroundColor={"#003475"} fontSize={20}
                    // onClick={
                    //     handleSubmit(() => {
                    //         setTabValue("five");
                    //     },
                    //         (formErrors) => {
                    //             console.log("Form errors:", formErrors);
                    //         }
                    //     )
                    // }
                    onClick={() => setTabValue("five")}
                >
                    Next
                </Button>
            </Flex>
        </form>

    );
};

export default InstallationPositionSelector;
