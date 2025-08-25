import { useState } from "react";
import { Box, Grid, GridItem, Image, Text, Heading } from "@chakra-ui/react";

interface Item {
    id: number;
    title: string;
    image: string;
}

interface SelectedOption {
    airConditionerTypeID: number | null;
}

interface AirConditionerSelectorProps {
    filterAirConditionerTypes: Item[];
}

const AirConditionerSelector: React.FC<AirConditionerSelectorProps> = ({
    filterAirConditionerTypes,
}) => {
    const [selectedOption, setSelectedOption] = useState<SelectedOption>({
        airConditionerTypeID: null,
    });

    return (
        <Box>
            <Heading size="2xl" color="#003475" mb={4}>
                เลือกประเภทเครื่องปรับอากาศ
            </Heading>
            <Heading size="lg" color="#003475" mb={4}>
                ประเภทเครื่องปรับอากาศที่แนะนำ
            </Heading>

            <Grid
                gridTemplateColumns="repeat(3, 1fr)"
                gap={10}
                padding="1.4rem 2rem"
                color="#71b0ff"
                fontSize={36}
                fontWeight={700}
                textShadow="2px 2px 4px #000000"
                fontStyle="italic"
            >
                {filterAirConditionerTypes.map((item) => (
                    <GridItem
                        key={item.id}
                        _hover={{ transform: "translate(0%, -2%)" }}
                        transition="all ease 0.5s"
                        onClick={() =>
                            setSelectedOption((prev) => ({
                                ...prev,
                                airConditionerTypeID: item.id,
                            }))
                        }
                    >
                        <Box position="relative">
                            <Image
                                rounded="md"
                                src={item.image}
                                border={
                                    selectedOption.airConditionerTypeID === item.id
                                        ? "4px solid #fe7743"
                                        : "2px solid transparent"
                                }
                                height={350}
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
    );
};

export default AirConditionerSelector;