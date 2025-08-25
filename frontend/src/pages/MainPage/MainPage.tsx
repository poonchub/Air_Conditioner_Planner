import { Box, Button, CloseButton, Collapsible, Container, createListCollection, Dialog, Field, Flex, Grid, GridItem, Heading, Image, NumberInput, Portal, Table, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./MainPage.css";
import { AirVent, FileText, Home, Info, MapPin } from "lucide-react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import BuildingSelector from "@/components/BuildingSelector/BuildingSelector";
import AirConditionerSelector from "@/components/AirConditionerSelector/AirConditionerSelector";
import InstallationPositionSelector from "@/components/InstallationPositionSelector/InstallationPositionSelector";
import { findMaximumLightingPowerDensity, loadWattLightData } from "@/data/WattLightService";
import type { WattLightRow } from "@/types/WattLightRow";

function MainPage() {
    const [selectedOption, setSelectedOption] = useState<{ buildingType?: string | null; subRoom?: string | null }>({
        buildingType: null,
        subRoom: null,
    });

    const [formData, setFormData] = useState({
        ballastFactor: 1
    });

    const [calculateVariable, setCalculateVariable] = useState({
        qLight: 0
    })

    const [tabValue, setTabValue] = useState("one");

    const [width, setWidth] = useState(3);
    const [depth, setDepth] = useState(3);
    const [height, setHeight] = useState(3);

    const [wattLightData, setWattLightData] = useState<WattLightRow[]>([]);
    const [lightPowerDensity, setLightPowerDensity] = useState<string | null>(null);

    useEffect(() => {
        loadWattLightData().then(setWattLightData);
    }, []);

    useEffect(() => {
        if (selectedOption.buildingType != null && selectedOption.subRoom != null) {
            const value = findMaximumLightingPowerDensity(
                wattLightData,
                selectedOption.buildingType,
                selectedOption.subRoom
            );
            console.log("lightPowerDensity: ", value)
            setLightPowerDensity(value);
        }
    }, [selectedOption])

    useEffect(()=>{
        console.log("ballastFactor: ", formData.ballastFactor)
        if (formData.ballastFactor && lightPowerDensity) {
            const qLight = width * depth * formData.ballastFactor * Number(lightPowerDensity)
            console.log("qLight: ", qLight)
            setCalculateVariable((prev)=> ({
                ...prev,
                qLight: qLight
            }))
        }
    }, [formData, lightPowerDensity])

    const airConditionerTypes = [
        { id: 1, title: "Wall Type", image: "/images/option/wall_type.png" },
        { id: 2, title: "Ceiling Suspended Type", image: "/images/option/ceiling_suspended_type.png" },
        { id: 3, title: "Cassette Type", image: "/images/option/cassette_type.png" },
    ];

    const airConditionerTypeImageShow = [
        { id: 1, title: "Wall Type", image: "./images/option/wall_type_show.png" },
        { id: 2, title: "Ceiling Suspended Type", image: "/images/option/ceiling_suspended_type_show.png" },
        { id: 3, title: "Cassette Type", image: "/images/option/cassette_type_show.png" },
    ];

    const steps = ["one", "two", "three", "four", "five"];

    const handleClickNext = () => {
        const currentIndex = steps.indexOf(tabValue);
        if (currentIndex < steps.length - 1) {
            setTabValue(steps[currentIndex + 1]);
        }
    };

    const handleClickPrev = () => {
        const currentIndex = steps.indexOf(tabValue);
        if (currentIndex > 0) {
            setTabValue(steps[currentIndex - 1]);
        }
    };

    const provinces = [
        { label: "กรุงเทพมหานคร", value: "1" },
        { label: "เชียงใหม่", value: "2" },
        { label: "ชลบุรี", value: "3" },
        { label: "ขอนแก่น", value: "4" },
        { label: "นครราชสีมา", value: "5" },
        { label: "ภูเก็ต", value: "6" },
        { label: "สงขลา", value: "7" },
        { label: "สุราษฎร์ธานี", value: "8" },
        { label: "นครศรีธรรมราช", value: "9" },
        { label: "อุดรธานี", value: "10" },
    ]

    const locationArea = createListCollection({
        items: [
            { label: "ชั้นบนสุด (ใต้หลังคา)", value: "1" },
            { label: "ชั้นอื่น ๆ", value: "2" },
            { label: "ชั้นล่างสุด", value: "3" },
        ],
    });

    const ceilingArea = createListCollection({
        items: [
            { label: "มีมากกว่า 30 ซม.", value: "1" },
            { label: "มีน้อยกว่า 30 ซม.", value: "2" },
            { label: "ไม่มี", value: "3" },
        ],
    });

    const directions = createListCollection({
        items: [
            { label: "ทิศเหนือ", value: "1" },
            { label: "ทิศตะวันออกเฉียงเหนือ", value: "2" },
            { label: "ทิศตะวันออก", value: "3" },
            { label: "ทิศตะวันออกเฉียงใต้", value: "4" },
            { label: "ทิศใต้", value: "5" },
            { label: "ทิศตะวันตกเฉียงใต้", value: "6" },
            { label: "ทิศตะวันตก", value: "W" },
            { label: "ทิศตะวันตกเฉียงเหนือ", value: "7" },
            { label: "ไม่มี", value: "8" },
        ],
    });

    const hourOptions = createListCollection({
        items: Array.from({ length: 24 }, (_, i) => {
            const hour = (i + 1).toString().padStart(2, "0");
            return {
                value: hour, // ต้องเป็น string
                label: `${hour}:00 น.`,
            };
        }),
    });

    const roofShapes = createListCollection({
        items: [
            { label: "หลังคาทรงหน้าจั่ว", value: "1" },
            { label: "หลังคาทรงหมาแหงน", value: "2" },
            { label: "หลังคาปั้นหยา", value: "3" },
            { label: "หลังคาทรงแบน", value: "4" },
            { label: "อื่น ๆ", value: "5" },
        ],
    });

    const materials = createListCollection({
        items: [
            { label: "กระจก", value: "1" },
            { label: "ไม้อัด", value: "2" },
            { label: "อิฐ + ปูน", value: "3" },
        ],
    });

    const wallSides = createListCollection({
        items: [
            { label: "ผนังด้านสั้น", value: "1" },
            { label: "ผนังด้านยาว", value: "2" },
        ],
    });

    const colors = createListCollection({
        items: [
            { label: "สีเข้ม", value: "1" },
            { label: "สีสว่าง", value: "2" },
        ],
    });

    const buildingTypes = createListCollection({
        items: [
            { label: "อาคารชั้นเดียว", value: "1" },
            { label: "อาคารหลายชั้น", value: "2" },
        ],
    });

    const filterAirConditionerTypes = airConditionerTypes.filter((item) => {
        // if (formData.ceilingAreaId[0] === "3") {
        //     return String(item.id) === "1";
        // } else if (formData.ceilingAreaId[0] === "2") {
        //     return String(item.id) !== "3";
        // } else {
        //     return item;
        // }
    });

    return (
        <Box className="main-page-container">
            <Box width={"100%"} padding={"5rem 2rem"} spaceY={4} backgroundImage={"url('/images/background/main_title.png')"} textAlign={"center"} color={"#FFF"}>
                <Heading size={"7xl"} fontWeight={600} letterSpacing="wide">
                    AIR CONDITIONER PLANNER
                </Heading>
                <Heading size={"4xl"} fontWeight={400} letterSpacing="wide">
                    BTU Calculation & Installation Guide
                </Heading>
            </Box>
            <Container py={"2rem"} spaceY={8}>
                <Tabs.Root value={tabValue} variant="enclosed">
                    <Tabs.List pointerEvents="none" width={"100%"} justifyContent={"center"}>
                        <Tabs.Trigger value="one" transition={"all ease 0.5s"}>
                            <Home />
                            ประเภทอาคาร
                        </Tabs.Trigger>
                        <Tabs.Trigger value="two" transition={"all ease 0.5s"}>
                            <FileText />
                            ข้อมูลอาคาร
                        </Tabs.Trigger>
                        <Tabs.Trigger value="three" transition={"all ease 0.5s"}>
                            <AirVent />
                            ประเภทเครื่องปรับอากาศ
                        </Tabs.Trigger>
                        <Tabs.Trigger value="four" transition={"all ease 0.5s"}>
                            <MapPin />
                            ตำแหน่งติดตั้ง
                        </Tabs.Trigger>
                        <Tabs.Trigger value="five" transition={"all ease 0.5s"}>
                            <MapPin />
                            แสดงผล
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value={"one"}>
                        <BuildingSelector onChange={setSelectedOption} />
                    </Tabs.Content>
                    <Tabs.Content value={"two"}>
                        <Box>
                            <Heading size={"2xl"} color={"#003475"}>
                                กรอกข้อมูลอาคาร
                            </Heading>

                            <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={10} padding={"1.4rem 2rem "}>
                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5}>
                                    <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={5}>
                                        <GridItem colSpan={2}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={''}
                                                    label="Age"
                                                // onChange={handleChange}
                                                >
                                                    {
                                                        provinces.map((item, index) => {
                                                            return (
                                                                <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <Field.Root>
                                                <Field.Label>ขนาดห้อง</Field.Label>
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                กว้าง
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ยาว
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                สูง
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        <Table.Row>
                                                            <Table.Cell>
                                                                <TextField
                                                                    type="number"
                                                                    value={width}
                                                                    onChange={(e) => setWidth(Number(e.target.value))}
                                                                />
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <TextField
                                                                    type="number"
                                                                    value={depth}
                                                                    onChange={(e) => setDepth(Number(e.target.value))}
                                                                />
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <TextField
                                                                    type="number"
                                                                    value={height}
                                                                    onChange={(e) => setHeight(Number(e.target.value))}
                                                                />
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table.Root>
                                            </Field.Root>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <Field.Root>
                                                <Field.Label>ช่วงเวลาที่ใช้งาน</Field.Label>
                                                <Grid templateColumns="repeat(2, 1fr)" width={"100%"} gap={3}>
                                                    {/* เวลาเริ่มต้น */}
                                                    <GridItem colSpan={1}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={""}
                                                                label="Age"
                                                            // onChange={handleChange}
                                                            >
                                                                {
                                                                    provinces.map((item, index) => {
                                                                        return (
                                                                            <MenuItem key={index} value={item.label}>{item.label}</MenuItem>
                                                                        )
                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </GridItem>

                                                    {/* เวลาสิ้นสุด */}
                                                    <GridItem colSpan={1}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={''}
                                                                label="Age"
                                                            // onChange={handleChange}
                                                            >
                                                                {
                                                                    provinces.map((item, index) => {
                                                                        return (
                                                                            <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                                                        )
                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </GridItem>
                                                </Grid>
                                            </Field.Root>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            {/* <Select.Root collection={ceilingArea} value={formData.ceilingAreaId} onValueChange={(e) => setFormData((prev) => ({ ...prev, ceilingAreaId: e.value }))}>
                                                <Select.HiddenSelect />
                                                <Select.Label display={'flex'} alignItems={'center'} gap={2}>
                                                    พื้นที่ฝ้าเพดาน
                                                    <Dialog.Root
                                                        placement={'center'}
                                                        motionPreset="slide-in-bottom"
                                                    >
                                                        <Dialog.Trigger asChild>
                                                            <Info size={16} />
                                                        </Dialog.Trigger>
                                                        <Dialog.Backdrop bg="blackAlpha.400" />
                                                        <Portal>
                                                            <Dialog.Backdrop />
                                                            <Dialog.Positioner>
                                                                <Dialog.Content bg={'white'} color={'black'}>
                                                                    <Dialog.Header>
                                                                        <Dialog.Title>คำอธิบายพื้นที่ฝ้าเพดาน</Dialog.Title>
                                                                    </Dialog.Header>
                                                                    <Dialog.Body>
                                                                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={4}>
                                                                            <Image
                                                                                height="200px"
                                                                                src="https://i.pinimg.com/736x/ca/7b/6a/ca7b6a0a99704261a18c972ae35718df.jpg"
                                                                            />
                                                                            <p>
                                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                                                Sed do eiusmod tempor incididunt ut labore et dolore magna
                                                                                aliqua.
                                                                            </p>
                                                                        </Box>

                                                                    </Dialog.Body>
                                                                    <Dialog.CloseTrigger asChild>
                                                                        <CloseButton size="sm" color={'gray'} />
                                                                    </Dialog.CloseTrigger>
                                                                </Dialog.Content>
                                                            </Dialog.Positioner>
                                                        </Portal>
                                                    </Dialog.Root>
                                                </Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="มีพื้นที่ฝ้าเพดานหรือไม่" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {ceilingArea.items.map((item) => (
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root> */}
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            {/* <Select.Root
                                                collection={buildingTypes}
                                                value={formData.buildingTypeId}
                                                onValueChange={(e) => setFormData((prev) => ({ ...prev, buildingTypeId: e.value }))}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>ประเภทอาคาร</Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="ระบุประเภทอาคาร" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {buildingTypes.items.map((item) => (
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root> */}
                                        </GridItem>

                                        {/* {formData.buildingTypeId[0] === "2" && (
                                            <Collapsible.Root open={formData.buildingTypeId[0] === "2"}>
                                                <Collapsible.Content height={"100%"}>
                                                    <GridItem colSpan={1}>
                                                        
                                                    </GridItem>
                                                </Collapsible.Content>
                                            </Collapsible.Root>
                                        )} */}


                                    </Grid>
                                </GridItem>
                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5}>
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            {/* <Select.Root
                                                multiple
                                                collection={directions}
                                                value={formData.wallSunlightDirectionsId}
                                                onValueChange={(e) => {
                                                    const selected = e.value.length > 0 ? e.value.filter((val) => val !== "0") : ["0"];
                                                    setFormData((prev) => ({ ...prev, wallSunlightDirectionsId: selected }));
                                                }}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>ผนัง</Select.Label>
                                                <Select.Label>ระบุทิศผนังที่โดนแดดและไม่ติดกับห้องอื่น (เลือกได้มากกว่า1)</Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="เลือกทิศ" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.ClearTrigger />
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {directions.items.map((item) => (
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root> */}
                                        </GridItem>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ระบุข้อมูลผนังห้อง</Field.Label>
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ทิศที่เลือก
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}></Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                วัสดุ
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                สีภายนอก
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                กันสาด
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {/* {formData.wallSunlightDirectionsId.map((id) => {
                                                            const direction = directions.items.find((item) => item.value === id);

                                                            return (
                                                                direction && (
                                                                    <Table.Row key={direction?.value}>
                                                                        <Table.Cell textAlign={"center"}>{direction?.label}</Table.Cell>
                                                                        <Table.Cell>
                                                                            
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                )
                                                            );
                                                        })} */}
                                                    </Table.Body>
                                                </Table.Root>
                                            </Field.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>

                                {/* Roof */}
                                {/* {(formData.locationAreaId[0] === "1" || formData.buildingTypeId[0] === "1") && (
                                    <Collapsible.Root open={formData.locationAreaId[0] === "1" || formData.buildingTypeId[0] === "1"}>
                                        <Collapsible.Content height={"100%"}>
                                            <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                                <Grid
                                                    gap={5}
                                                >
                                                    <GridItem>
                                                        <Field.Root>
                                                            <Field.Label>หลังคา (Roof)</Field.Label>
                                                            <Field.Label>ระบุข้อมูลหลังคา</Field.Label>
                                                            <Table.Root size="sm" variant={"outline"}>
                                                                <Table.Header>
                                                                    <Table.Row>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                            วัสดุ
                                                                        </Table.ColumnHeader>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                            ฉนวน
                                                                        </Table.ColumnHeader>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                            สีภายนอก
                                                                        </Table.ColumnHeader>
                                                                    </Table.Row>
                                                                </Table.Header>
                                                                <Table.Body>
                                                                    <Table.Row>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={roofShapes}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                        <Select.Content>
                                                                                            <Select.Item item={"1"} key={1}>
                                                                                                {"มี"}
                                                                                            </Select.Item>
                                                                                            <Select.Item item={"2"} key={2}>
                                                                                                {"ไม่มี"}
                                                                                            </Select.Item>
                                                                                        </Select.Content>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={roofShapes}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                        <Select.Content>
                                                                                            <Select.Item item={"1"} key={1}>
                                                                                                {"มี"}
                                                                                            </Select.Item>
                                                                                            <Select.Item item={"2"} key={2}>
                                                                                                {"ไม่มี"}
                                                                                            </Select.Item>
                                                                                        </Select.Content>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={colors}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                        <Select.Content>
                                                                                            {colors.items.map((item) => (
                                                                                                <Select.Item item={item.value} key={item.value}>
                                                                                                    {item.label}
                                                                                                </Select.Item>
                                                                                            ))}
                                                                                        </Select.Content>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                </Table.Body>
                                                            </Table.Root>
                                                        </Field.Root>
                                                    </GridItem>
                                                </Grid>
                                            </GridItem>
                                        </Collapsible.Content>
                                    </Collapsible.Root>
                                )} */}

                                {/* Floor */}
                                {/* {formData.locationAreaId[0] === "3" || formData.buildingTypeId[0] === "1" && (
                                    <Collapsible.Root open={formData.locationAreaId[0] === "3" || formData.buildingTypeId[0] === "1"}>
                                        <Collapsible.Content height={"100%"}>
                                            <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                                <Grid
                                                    gap={5}
                                                >
                                                    <GridItem>
                                                        <Field.Root>
                                                            <Field.Label>พื้น (Floor)</Field.Label>
                                                            <Field.Label>ระบุข้อมูลพื้น</Field.Label>
                                                            <Table.Root size="sm" variant={"outline"}>
                                                                <Table.Header>
                                                                    <Table.Row>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                            วัสดุ
                                                                        </Table.ColumnHeader>
                                                                    </Table.Row>
                                                                </Table.Header>
                                                                <Table.Body>
                                                                    <Table.Row>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={roofShapes}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                        <Select.Content>
                                                                                            <Select.Item item={"1"} key={1}>
                                                                                                {"มี"}
                                                                                            </Select.Item>
                                                                                            <Select.Item item={"2"} key={2}>
                                                                                                {"ไม่มี"}
                                                                                            </Select.Item>
                                                                                        </Select.Content>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                </Table.Body>
                                                            </Table.Root>
                                                        </Field.Root>
                                                    </GridItem>
                                                </Grid>
                                            </GridItem>
                                        </Collapsible.Content>
                                    </Collapsible.Root>
                                )} */}

                                {/* Door Direction */}
                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5}>
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            {/* <Select.Root
                                                multiple
                                                collection={directions}
                                                value={formData.doorDirectionsId}
                                                onValueChange={(e) => {
                                                    const selected = e.value.length > 0 ? e.value.filter((val) => val !== "0") : ["0"];
                                                    setFormData((prev) => ({ ...prev, doorDirectionsId: selected }));
                                                }}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>ประตู (Door)</Select.Label>
                                                <Select.Label>ระบุทิศทาง (เลือกได้มากกว่า1)</Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="เลือกทิศ" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.ClearTrigger />
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {directions.items.map((item) => (
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root> */}
                                        </GridItem>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ระบุข้อมูลประตู</Field.Label>
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ทิศทาง
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ประเภท
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                วัสดุ
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                สีภายนอก
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                จำนวน
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {/* {formData.doorDirectionsId.map((id) => {
                                                            const direction = directions.items.find((item) => item.value === id);

                                                            return (
                                                                direction && (
                                                                    <Table.Row key={direction?.value}>
                                                                        <Table.Cell textAlign={"center"}>{direction?.label}</Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={wallSides}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="ระบุประภท" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={materials}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="ระบุวัสดุ" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={colors}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="ระบุสีภายนอก" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                        <Select.Content>
                                                                                            {colors.items.map((item) => (
                                                                                                <Select.Item item={item.value} key={item.value}>
                                                                                                    {item.label}
                                                                                                </Select.Item>
                                                                                            ))}
                                                                                        </Select.Content>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <NumberInput.Root defaultValue="1">
                                                                                <NumberInput.Control />
                                                                                <NumberInput.Input />
                                                                            </NumberInput.Root>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                )
                                                            );
                                                        })} */}
                                                    </Table.Body>
                                                </Table.Root>
                                            </Field.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>

                                {/* Window Direction */}
                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5}>
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            {/* <Select.Root
                                                multiple
                                                collection={directions}
                                                value={formData.windowDirectionsId}
                                                onValueChange={(e) => {
                                                    const selected = e.value.length > 0 ? e.value.filter((val) => val !== "0") : ["0"];
                                                    setFormData((prev) => ({ ...prev, windowDirectionsId: selected }));
                                                }}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>หน้าต่าง (Window)</Select.Label>
                                                <Select.Label>ระบุทิศทาง (เลือกได้มากกว่า1)</Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="เลือกทิศ" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.ClearTrigger />
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {directions.items.map((item) => (
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root> */}
                                        </GridItem>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ระบุข้อมูลหน้าต่าง</Field.Label>
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ทิศทาง
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ประเภท
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                วัสดุ
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                จำนวน
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {/* {formData.windowDirectionsId.map((id) => {
                                                            const direction = directions.items.find((item) => item.value === id);

                                                            return (
                                                                direction && (
                                                                    <Table.Row key={direction?.value}>
                                                                        <Table.Cell textAlign={"center"}>{direction?.label}</Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={wallSides}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="ระบุประภท" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={materials}
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="ระบุวัสดุ" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <NumberInput.Root defaultValue="1">
                                                                                <NumberInput.Control />
                                                                                <NumberInput.Input />
                                                                            </NumberInput.Root>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                )
                                                            );
                                                        })} */}
                                                    </Table.Body>
                                                </Table.Root>
                                            </Field.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>

                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                    <Grid
                                        // gridTemplateColumns={'repeat(1, 1fr)'}
                                        gap={5}
                                    >
                                        {/* Light */}
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ความสว่าง (Light)</Field.Label>
                                                <Field.Label>มี Ballast ไหม</Field.Label>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={formData.ballastFactor ?? ''}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                ballastFactor: Number(e.target.value),
                                                            }))
                                                        }
                                                    >
                                                        <MenuItem value={1}>ไม่มีบัลลาสต์/ไม่ทราบ (เช่น หลอด LED, หลอดไส้)</MenuItem>
                                                        <MenuItem value={1.15}>มีบัลลาสต์ (เช่น ฟลูออเรสเซนต์, HID) </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Field.Root>
                                        </GridItem>

                                        {/* People */}
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ผู้อยู่อาศัย (People)</Field.Label>
                                                <Box display={'flex'} alignItems={'center'} gap={2}>
                                                    <Text fontSize={16} marginBottom={2}>จำนวนผู้อยู่อาศัยในอาคาร</Text>
                                                    <NumberInput.Root defaultValue="1">
                                                        <NumberInput.Control />
                                                        <NumberInput.Input />
                                                    </NumberInput.Root>
                                                    <Text fontSize={16} marginBottom={2}>คน</Text>
                                                </Box>

                                            </Field.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>

                                {/* Equipment */}
                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                    <Grid
                                        // gridTemplateColumns={'repeat(1, 1fr)'}
                                        gap={5}
                                    >
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>อุปกรณ์ (Equipment)</Field.Label>
                                                {/* <Field.Label>ระบุข้อมูลหลังคา</Field.Label> */}
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ประเภท
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                จำนวน
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                ลักษณะการใช้งาน
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {[...Array(3)].map((element, index) => (
                                                            <Table.Row key={index}>
                                                                <Table.Cell>
                                                                    {/* <Select.Root collection={roofShapes}>
                                                                        <Select.HiddenSelect />
                                                                        <Select.Control>
                                                                            <Select.Trigger>
                                                                                <Select.ValueText placeholder="เลือกประเภท" />
                                                                            </Select.Trigger>
                                                                            <Select.IndicatorGroup>
                                                                                <Select.Indicator />
                                                                            </Select.IndicatorGroup>
                                                                        </Select.Control>
                                                                        <Portal>
                                                                            <Select.Positioner>
                                                                                <Select.Content>
                                                                                </Select.Content>
                                                                            </Select.Positioner>
                                                                        </Portal>
                                                                    </Select.Root> */}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <NumberInput.Root defaultValue="1">
                                                                        <NumberInput.Control />
                                                                        <NumberInput.Input />
                                                                    </NumberInput.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {/* <Select.Root collection={roofShapes}>
                                                                        <Select.HiddenSelect />
                                                                        <Select.Control>
                                                                            <Select.Trigger>
                                                                                <Select.ValueText placeholder="เลือกลักษณะการใช้งาน" />
                                                                            </Select.Trigger>
                                                                            <Select.IndicatorGroup>
                                                                                <Select.Indicator />
                                                                            </Select.IndicatorGroup>
                                                                        </Select.Control>
                                                                        <Portal>
                                                                            <Select.Positioner>
                                                                                <Select.Content>
                                                                                    <Select.Item item={"1"} key="1">ตลอดเวลา</Select.Item>
                                                                                    <Select.Item item={"2"} key="2">บ่อยครั้ง</Select.Item>
                                                                                    <Select.Item item={"3"} key="3">บางเวลา</Select.Item>
                                                                                    <Select.Item item={"4"} key="4">ไม่เคย</Select.Item>
                                                                                </Select.Content>
                                                                            </Select.Positioner>
                                                                        </Portal>
                                                                    </Select.Root> */}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        ))}

                                                    </Table.Body>
                                                </Table.Root>
                                            </Field.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </Box>
                    </Tabs.Content>
                    <Tabs.Content value={"three"}>
                        <AirConditionerSelector filterAirConditionerTypes={filterAirConditionerTypes} />
                    </Tabs.Content>
                    <Tabs.Content value={"four"}>
                        <InstallationPositionSelector directions={directions} />
                    </Tabs.Content>
                    <Tabs.Content value={"five"}>
                        <Box>
                            <Heading size={"2xl"} color={"#003475"} marginBottom={4}>
                                แสดงผลข้อมูล
                            </Heading>
                            <Grid gridTemplateColumns={"repeat(3, 1fr)"} gap={10} padding={"1.4rem 2rem "}>
                                <GridItem colSpan={1}>
                                    <Grid>
                                        <GridItem>
                                            <Table.Root size="sm" border={0} fontSize={16}>
                                                <Table.Body>
                                                    <Table.Row border={0}>
                                                        <Table.Cell className="strong-text-blue">
                                                            ผลการคำนวณได้เท่ากับ
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            11,590
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">
                                                            BTU
                                                        </Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            แนะนำติดตั้งขนาด
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            12,000
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">
                                                            BTU
                                                        </Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            คำนวณค่าไฟรายปี
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            2,982
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">
                                                            บาท/ปี
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table.Root>

                                            <Box display={'flex'} gap={2} marginY={4}>
                                                <Text className="strong-text-blue">ประเภทแอร์ที่เลือก :</Text>
                                                {/* <Text className="strong-text">{airConditionerTypeImageShow[(selectedOption.airConditionerTypeID == 0 ? 0 : selectedOption.airConditionerTypeID - 1)].title}</Text> */}
                                            </Box>
                                            {/* <Image
                                                width="100%"
                                                src={airConditionerTypeImageShow[(selectedOption.airConditionerTypeID == 0 ? 0 : selectedOption.airConditionerTypeID - 1)].image}
                                                borderRadius={10}
                                            /> */}
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem colSpan={2} display="flex" gap={2} flexDirection={"column"}>
                                    <Text className="strong-text-blue">แนะนำตำแหน่งติดตั้งเครื่องปรับอากาศ (indoor) :</Text>
                                    <Box>
                                        <Text marginBottom={1}>ตำแหน่งที่ 1</Text>
                                        <Box border={"1px solid #c5c5c6"} borderRadius={10} paddingY={4} paddingX={6}>
                                            <Text>ผนังด้านทิศเหนือ สูงจากพื้น 2.2 เมตรหรือลงจากเพดาน  (อธิบายถึงความเหมาะสม)</Text>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Text marginBottom={1}>ตำแหน่งที่ 2</Text>
                                        <Box border={"1px solid #c5c5c6"} borderRadius={10} paddingY={4} paddingX={6}>
                                            <Text>ผนังด้านทิศเหนือ สูงจากพื้น 2.2 เมตรหรือลงจากเพดาน  (อธิบายถึงความเหมาะสม)</Text>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Text marginBottom={1}>ตำแหน่งที่ 3</Text>
                                        <Box border={"1px solid #c5c5c6"} borderRadius={10} paddingY={4} paddingX={6}>
                                            <Text>ผนังด้านทิศเหนือ สูงจากพื้น 2.2 เมตรหรือลงจากเพดาน  (อธิบายถึงความเหมาะสม)</Text>
                                        </Box>
                                    </Box>
                                </GridItem>
                            </Grid>
                        </Box>
                    </Tabs.Content>
                </Tabs.Root>
                <Collapsible.Root open={selectedOption.buildingType != ""}>
                    <Flex width={"100%"} justifyContent={tabValue === "one" ? "flex-end" : "space-between"}>
                        {
                            tabValue !== "one" &&
                            <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={handleClickPrev}>
                                Previous
                            </Button>
                        }
                        {
                            tabValue !== "five" &&
                            <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={handleClickNext}>
                                Next
                            </Button>
                        }
                    </Flex>
                </Collapsible.Root>
            </Container>
        </Box>
    );
}

export default MainPage;
