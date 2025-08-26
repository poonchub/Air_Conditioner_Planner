import { useState, useEffect } from "react";
import { Box, Grid, GridItem, Image, Text, Heading } from "@chakra-ui/react";
import { BASE_URL } from "@/pages/MainPage/MainPage";

interface Item {
    id: number;
    value: string;
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
        { id: 1, title: "Home", value: "Home", image: "/images/option/home.png" },
        { id: 2, title: "Commercial", value: "Commercial", image: "/images/option/commercial.png" },
        { id: 3, title: "Public / Education", value: "PublicEducation", image: "/images/option/public_education.png" },
    ];

    const subRoomMap: { [buildingTitle: string]: Item[] } = {
        Home: [
            { id: 101, title: "Bedroom", value: "Bedroom", image: "/images/option/bedroom.png" },
            { id: 102, title: "Living Room", value: "LivingRoom", image: "/images/option/living_room.png" },
            { id: 103, title: "Dining Room", value: "DiningRoom", image: "/images/option/dining_room.png" },
        ],
        Commercial: [
            { id: 201, title: "Office", value: "Office", image: "/images/option/office.png" },
            { id: 202, title: "Shop", value: "Shop", image: "/images/option/store.png" },
            { id: 203, title: "Restaurant", value: "Restaurant", image: "/images/option/restaurant.png" },
        ],
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
                            onClick={() => {
                                setSelectedOption({ buildingType: item.value, subRoom: item.value === "PublicEducation" ? "General" : null})
                            }}
                        >
                            <Box position="relative">
                                <Image
                                    rounded="md"
                                    src={`${BASE_URL}${item.image}`}
                                    border={
                                        selectedOption.buildingType === item.value
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
                                    fontSize={32}
                                    color={"#71B0FF"}
                                    fontWeight={700}
                                    fontStyle={'italic'}
                                    textShadow={"2px 2px 8px #000000ff"}
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
                                    setSelectedOption((prev) => ({ ...prev, subRoom: item.value }))
                                }
                                textAlign={"center"}
                            >
                                <Image
                                    rounded="md"
                                    src={`${BASE_URL}${item.image}`}
                                    border={
                                        selectedOption.subRoom === item.value
                                            ? "4px solid #fe7743"
                                            : "2px solid transparent"
                                    }
                                />
                                <Text 
                                    marginTop={4} 
                                    fontSize={22}
                                    color={"#003475"}
                                    fontWeight={600}
                                >{item.title}</Text>
                            </GridItem>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default BuildingSelector;