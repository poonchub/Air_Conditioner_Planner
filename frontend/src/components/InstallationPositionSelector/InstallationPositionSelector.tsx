import React, { useState } from "react";
import { Box, Grid, GridItem, Image, Heading } from "@chakra-ui/react";

interface DirectionItem {
    value: string;
    label: string;
}

interface Directions {
    items: DirectionItem[];
}

interface FormData {
    indoorDirections: string[];
    outdoorDirections: string[];
}

interface InstallationPositionSelectorProps {
    directions: Directions;
}
// @ts-ignore
const InstallationPositionSelector: React.FC<InstallationPositionSelectorProps> = ({
    directions,
}) => {
    // @ts-ignore
    const [formData, setFormData] = useState<FormData>({
        indoorDirections: [],
        outdoorDirections: [],
    });

    // @ts-ignore
    const handleSelectChange = (type: "indoor" | "outdoor", value: string) => {
        setFormData((prev) => {
            const key = type === "indoor" ? "indoorDirections" : "outdoorDirections";
            const list = prev[key];
            if (list.includes(value)) {
                return { ...prev, [key]: list.filter((v) => v !== value) };
            } else {
                return { ...prev, [key]: [...list, value] };
            }
        });
    };

    return (
        <Box>
            <Heading size="2xl" color="#003475" mb={4}>
                กำหนดตำแหน่งติดตั้ง
            </Heading>
            <Grid gridTemplateColumns="repeat(3, 1fr)" gap={10} padding="1.4rem 2rem">
                {/* ภาพ 3D ห้อง */}
                <GridItem
                    colSpan={1}
                    rowSpan={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    padding={5}
                >
                    <Image height="400px" src="./images/background/room_3D.png" />
                </GridItem>

                {/* Indoor */}
                <GridItem colSpan={2} border="1px solid #c5c5c6" borderRadius={10} padding={5}>
                    <Grid gridTemplateColumns="repeat(5, 1fr)" gap={20}>
                        <GridItem colSpan={3} display="flex" alignItems="center">
                            {/* <Select.Root>
                                <Select.HiddenSelect />
                                <Select.Label>
                                    ตำแหน่งที่สามารถติดตั้ง indoor (เลือกได้มากกว่า1)
                                </Select.Label>
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="เลือกทิศ" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {directions.items.map((item) => (
                                                <Select.Item
                                                    key={item.value}
                                                    item={item.value}
                                                    onSelect={() =>
                                                        handleSelectChange("indoor", item.value)
                                                    }
                                                >
                                                    {item.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root> */}
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Image width="100%" src="./images/background/indoor.png" />
                        </GridItem>
                    </Grid>
                </GridItem>

                {/* Outdoor */}
                <GridItem colSpan={2} border="1px solid #c5c5c6" borderRadius={10} padding={5}>
                    <Grid gridTemplateColumns="repeat(5, 1fr)" gap={20}>
                        <GridItem colSpan={3} display="flex" alignItems="center">
                            {/* <Select.Root>
                                <Select.HiddenSelect />
                                <Select.Label>
                                    ตำแหน่งที่สามารถติดตั้ง outdoor [ไม่มีสิ่งกีดขวาง]
                                    (เลือกได้มากกว่า1)
                                </Select.Label>
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="เลือกทิศ" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {directions.items.map((item) => (
                                                <Select.Item
                                                    key={item.value}
                                                    item={item.value}
                                                    onSelect={() =>
                                                        handleSelectChange("outdoor", item.value)
                                                    }
                                                >
                                                    {item.label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root> */}
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Image width="100%" src="./images/background/outdoor.png" />
                        </GridItem>
                    </Grid>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default InstallationPositionSelector;