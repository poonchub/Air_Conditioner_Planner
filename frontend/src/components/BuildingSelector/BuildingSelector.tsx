import { useState, useEffect } from "react";
import { Box, Grid, GridItem, Image, Text, Heading } from "@chakra-ui/react";

interface Item {
    id: number;
    title: string;
    image: string;
}

interface SelectedOption {
    buildingType?: string | null;
    subRoom?: string | null;
}

interface BuildingSelectorProps {
    onChange?: (option: SelectedOption) => void;
}

const BuildingSelector: React.FC<BuildingSelectorProps> = ({ onChange }) => {
    const [selectedOption, setSelectedOption] = useState<SelectedOption>({
        buildingType: null,
        subRoom: null,
    });

    // เรียก onChange หลังจาก selectedOption อัปเดตแล้ว
    useEffect(() => {
        if (onChange) {
            onChange(selectedOption);
        }
    }, [selectedOption, onChange]);

    const buildingType: Item[] = [
        { id: 1, title: "Home", image: "/images/option/home.png" },
        { id: 2, title: "Commercial", image: "/images/option/commercial.png" },
        { id: 3, title: "Public / education", image: "/images/option/public_education.png" },
    ];

    const subRoomMap: { [buildingTitle: string]: Item[] } = {
        Home: [
            { id: 101, title: "Bedroom", image: "/images/option/bedroom.png" },
            { id: 102, title: "LivingRoom", image: "/images/option/living_room.png" },
            { id: 103, title: "DiningRoom", image: "/images/option/dining_room.png" },
        ],
        Commercial: [
            { id: 201, title: "Office", image: "/images/option/office.png" },
            { id: 202, title: "Shop", image: "/images/option/store.png" },
            { id: 203, title: "Restaurant", image: "/images/option/restaurant.png" },
        ],
        "Public / education": [{ id: 301, title: "General", image: "/images/option/general.png" }],
    };

    const subRoomOptions = selectedOption.buildingType
        ? subRoomMap[selectedOption.buildingType] || []
        : [];

    return (
        <Box>
            {/* เลือกประเภทอาคาร */}
            <Box>
                <Heading size="2xl" color="#003475" mb={6}>
                    เลือกประเภทอาคาร
                </Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap={10} padding="1.4rem 2rem">
                    {buildingType.map((item) => (
                        <GridItem
                            key={item.id}
                            _hover={{ transform: "translate(0%, -2%)" }}
                            transition="all ease 0.5s"
                            onClick={() =>
                                setSelectedOption({ buildingType: item.title, subRoom: null })
                            }
                        >
                            <Box position="relative">
                                <Image
                                    rounded="md"
                                    src={item.image}
                                    border={
                                        selectedOption.buildingType === item.title
                                            ? "4px solid #fe7743"
                                            : "2px solid transparent"
                                    }
                                />
                                <Text
                                    position="absolute"
                                    top="70%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    width="100%"
                                    textAlign="center"
                                >
                                    {item.title}
                                </Text>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </Box>

            {/* เลือกประเภทห้องย่อย */}
            {subRoomOptions.length > 0 && (
                <Box mt={6}>
                    <Heading size="2xl" color="#003475" mb={4}>
                        เลือกประเภทห้องย่อย
                    </Heading>
                    <Grid templateColumns="repeat(3, 1fr)" gap={10} padding="1.4rem 2rem">
                        {subRoomOptions.map((item) => (
                            <GridItem
                                key={item.id}
                                _hover={{ transform: "translate(0%, -2%)" }}
                                transition="all ease 0.5s"
                                onClick={() =>
                                    setSelectedOption((prev) => ({ ...prev, subRoom: item.title }))
                                }
                            >
                                <Image
                                    rounded="md"
                                    src={item.image}
                                    border={
                                        selectedOption.subRoom === item.title
                                            ? "4px solid #fe7743"
                                            : "2px solid transparent"
                                    }
                                />
                                <Text marginTop={4}>{item.title}</Text>
                            </GridItem>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default BuildingSelector;