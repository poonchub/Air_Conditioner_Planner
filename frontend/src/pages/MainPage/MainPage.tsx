import { Box, Button, CloseButton, Collapsible, Container, createListCollection, Dialog, Field, Flex, Grid, GridItem, Heading, Image, Input, NumberInput, Portal, Select, Table, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import "./MainPage.css";
import { AirVent, FileText, Home, Info, MapPin } from "lucide-react";

function MainPage() {
    const [selectedOption, setSelectedOption] = useState({
        buildingTypeID: 0,
        subRoomType1ID: 0,
        subRoomType2ID: 0,
        airConditionerTypeID: 0,
    });

    const [formData, setFormData] = useState({
        provinceId: ["0"],
        locationAreaId: ["0"],
        ceilingAreaId: ["0"],
        startUseTime: [""],
        endUseTime: [""],
        wallSunlightDirectionsId: ["0"],
        roofShapeId: ["0"],
        roofSunDirectionsId: ["0"],
        doorDirectionsId: ["0"],
        windowDirectionsId: ["0"],
        buildingTypeId: ["0"],
    });

    const [tabValue, setTabValue] = useState("two");

    const buildingType = [
        { id: 1, title: "Home", image: "/images/option/home.png" },
        { id: 2, title: "Commercial", image: "/images/option/commercial.png" },
        { id: 3, title: "Public / education", image: "/images/option/public_education.png" },
    ];
    const subRoomType1 = [
        { id: 1, title: "ห้องนอน", image: "/images/option/bedroom.png" },
        { id: 2, title: "ห้องนั่งเล่น", image: "/images/option/living_room.png" },
        { id: 3, title: "ห้องรับประทานอาหาร", image: "/images/option/dining_room.png" },
    ];
    const subRoomType2 = [
        { id: 1, title: "สำนักงาน", image: "/images/option/office.png" },
        { id: 2, title: "ร้านค้า", image: "/images/option/store.png" },
        { id: 3, title: "ร้านอาหาร", image: "/images/option/restaurant.png" },
    ];

    const airConditionerTypes = [
        { id: 1, title: "Wall Type", image: "/images/option/wall_type.png" },
        { id: 2, title: "Ceiling Suspended Type", image: "/images/option/ceiling_suspended_type.png" },
        { id: 3, title: "Cassette Type", image: "/images/option/cassette_type.png" },
    ];

    const handleClickNext = () => {
        if (tabValue === "one") {
            setTabValue("two");
        } else if (tabValue === "two") {
            setTabValue("three");
        } else if (tabValue === "three") {
            setTabValue("four");
        }
    };

    const handleClickBack = () => {
        if (tabValue === "four") {
            setTabValue("three");
        } else if (tabValue === "three") {
            setTabValue("two");
        } else if (tabValue === "two") {
            setTabValue("one");
        }
    };

    const provinces = createListCollection({
        items: [
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
        ],
    });

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

    console.log(formData);
    const filterAirConditionerTypes = airConditionerTypes.filter((item) => {
        if (formData.ceilingAreaId[0] === "3") {
            return String(item.id) === "1";
        } else if (formData.ceilingAreaId[0] === "2") {
            return String(item.id) !== "3";
        } else {
            return item;
        }
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
                    </Tabs.List>
                    <Tabs.Content value={"one"}>
                        <Box>
                            <Heading size={"2xl"} color={"#003475"}>
                                เลือกประเภทอาคาร
                            </Heading>
                            <Grid
                                gridTemplateColumns={"repeat(3, 1fr)"}
                                gap={10}
                                padding={"1.4rem 2rem "}
                                color={"#71b0ff"}
                                fontSize={36}
                                fontWeight={700}
                                textShadow={"2px 2px 4px #000000"}
                                fontStyle="italic"
                            >
                                {buildingType.map((item, index) => {
                                    return (
                                        <GridItem
                                            key={index}
                                            _hover={{ transform: "translate(0%, -2%)" }}
                                            transition={"all ease 0.5s"}
                                            onClick={() => setSelectedOption((prev) => ({ ...prev, buildingTypeID: item.id }))}
                                        >
                                            <Box position={"relative"}>
                                                <Image rounded="md" src={item.image} border={selectedOption.buildingTypeID === item.id ? "4px solid #fe7743" : "2px solid transparent"} />
                                                <Text position={"absolute"} top="70%" left="50%" transform="translate(-50%, -50%)" width={"100%"} textAlign={"center"}>
                                                    {item.title}
                                                </Text>
                                            </Box>
                                        </GridItem>
                                    );
                                })}
                            </Grid>
                        </Box>

                        <Collapsible.Root open={selectedOption.buildingTypeID === 1}>
                            <Collapsible.Content>
                                <Box>
                                    <Heading size={"2xl"} color={"#003475"}>
                                        เลือกประเภทห้องย่อย
                                    </Heading>
                                    <Grid gridTemplateColumns={"repeat(3, 1fr)"} padding={"1.4rem 2rem "} gap={10} color={"#003475"} fontSize={20} fontWeight={600} textAlign={"center"}>
                                        {subRoomType1.map((item, index) => {
                                            return (
                                                <GridItem
                                                    key={index}
                                                    _hover={{ transform: "translate(0%, -2%)" }}
                                                    transition={"all ease 0.5s"}
                                                    onClick={() => setSelectedOption((prev) => ({ ...prev, subRoomType1ID: item.id }))}
                                                >
                                                    <Image rounded="md" src={item.image} border={selectedOption.subRoomType1ID === item.id ? "4px solid #fe7743" : "2px solid transparent"} />
                                                    <Text marginTop={4}>{item.title}</Text>
                                                </GridItem>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            </Collapsible.Content>
                        </Collapsible.Root>
                        <Collapsible.Root open={selectedOption.buildingTypeID === 2}>
                            <Collapsible.Content>
                                <Box>
                                    <Heading size={"2xl"} color={"#003475"}>
                                        เลือกประเภทห้องย่อย
                                    </Heading>
                                    <Grid gridTemplateColumns={"repeat(3, 1fr)"} padding={"1.4rem 2rem "} gap={10} color={"#003475"} fontSize={20} fontWeight={600} textAlign={"center"}>
                                        {subRoomType2.map((item, index) => {
                                            return (
                                                <GridItem
                                                    key={index}
                                                    _hover={{ transform: "translate(0%, -2%)" }}
                                                    transition={"all ease 0.5s"}
                                                    onClick={() => setSelectedOption((prev) => ({ ...prev, subRoomType2ID: item.id }))}
                                                >
                                                    <Image rounded="md" src={item.image} border={selectedOption.subRoomType2ID === item.id ? "4px solid #fe7743" : "2px solid transparent"} />
                                                    <Text marginTop={4}>{item.title}</Text>
                                                </GridItem>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            </Collapsible.Content>
                        </Collapsible.Root>
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
                                            <Select.Root collection={provinces} value={formData.provinceId} onValueChange={(e) => setFormData((prev) => ({ ...prev, provinceId: e.value }))}>
                                                <Select.HiddenSelect />
                                                <Select.Label>จังหวัด</Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="เลือกจังหวัด" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {provinces.items.map((item) => (
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
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
                                                                <NumberInput.Root
                                                                    defaultValue="3"
                                                                    formatOptions={{
                                                                        style: "unit",
                                                                        unit: "meter",
                                                                        unitDisplay: "long",
                                                                    }}
                                                                >
                                                                    <NumberInput.Control />
                                                                    <NumberInput.Input />
                                                                </NumberInput.Root>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <NumberInput.Root
                                                                    defaultValue="3"
                                                                    formatOptions={{
                                                                        style: "unit",
                                                                        unit: "meter",
                                                                        unitDisplay: "long",
                                                                    }}
                                                                >
                                                                    <NumberInput.Control />
                                                                    <NumberInput.Input />
                                                                </NumberInput.Root>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <NumberInput.Root
                                                                    defaultValue="3"
                                                                    formatOptions={{
                                                                        style: "unit",
                                                                        unit: "meter",
                                                                        unitDisplay: "long",
                                                                    }}
                                                                >
                                                                    <NumberInput.Control />
                                                                    <NumberInput.Input />
                                                                </NumberInput.Root>
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
                                                        <Select.Root
                                                            collection={hourOptions}
                                                            value={formData.startUseTime}
                                                            onValueChange={(e) => setFormData((prev) => ({ ...prev, startUseTime: e.value }))}
                                                        >
                                                            <Select.HiddenSelect />
                                                            {/* <Select.Label>เวลาเริ่มต้น</Select.Label> */}
                                                            <Select.Control>
                                                                <Select.Trigger>
                                                                    <Select.ValueText placeholder="เลือกเวลาเริ่มต้น" />
                                                                </Select.Trigger>
                                                                <Select.IndicatorGroup>
                                                                    <Select.Indicator />
                                                                </Select.IndicatorGroup>
                                                            </Select.Control>
                                                            <Portal>
                                                                <Select.Positioner>
                                                                    <Select.Content>
                                                                        {hourOptions.items.map((item) => (
                                                                            <Select.Item item={item} key={item.value}>
                                                                                {item.label}
                                                                                <Select.ItemIndicator />
                                                                            </Select.Item>
                                                                        ))}
                                                                    </Select.Content>
                                                                </Select.Positioner>
                                                            </Portal>
                                                        </Select.Root>
                                                    </GridItem>

                                                    {/* เวลาสิ้นสุด */}
                                                    <GridItem colSpan={1}>
                                                        <Select.Root
                                                            collection={hourOptions}
                                                            value={formData.endUseTime}
                                                            onValueChange={(e) => setFormData((prev) => ({ ...prev, endUseTime: e.value }))}
                                                        >
                                                            <Select.HiddenSelect />
                                                            {/* <Select.Label>เวลาสิ้นสุด</Select.Label> */}
                                                            <Select.Control>
                                                                <Select.Trigger>
                                                                    <Select.ValueText placeholder="เลือกเวลาสิ้นสุด" />
                                                                </Select.Trigger>
                                                                <Select.IndicatorGroup>
                                                                    <Select.Indicator />
                                                                </Select.IndicatorGroup>
                                                            </Select.Control>
                                                            <Portal>
                                                                <Select.Positioner>
                                                                    <Select.Content>
                                                                        {hourOptions.items.map((item) => (
                                                                            <Select.Item item={item} key={item.value}>
                                                                                {item.label}
                                                                                <Select.ItemIndicator />
                                                                            </Select.Item>
                                                                        ))}
                                                                    </Select.Content>
                                                                </Select.Positioner>
                                                            </Portal>
                                                        </Select.Root>
                                                    </GridItem>
                                                </Grid>
                                            </Field.Root>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <Select.Root collection={ceilingArea} value={formData.ceilingAreaId} onValueChange={(e) => setFormData((prev) => ({ ...prev, ceilingAreaId: e.value }))}>
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
                                            </Select.Root>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <Select.Root
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
                                            </Select.Root>
                                        </GridItem>

                                        {formData.buildingTypeId[0] === "2" && (
                                            <Collapsible.Root open={formData.buildingTypeId[0] === "2"}>
                                                <Collapsible.Content height={"100%"}>
                                                    <GridItem colSpan={1}>
                                                        <Select.Root
                                                            collection={locationArea}
                                                            value={formData.locationAreaId}
                                                            onValueChange={(e) => setFormData((prev) => ({ ...prev, locationAreaId: e.value }))}
                                                        >
                                                            <Select.HiddenSelect />
                                                            <Select.Label>ตำแหน่งพื้นที่ห้อง</Select.Label>
                                                            <Select.Control>
                                                                <Select.Trigger>
                                                                    <Select.ValueText placeholder="ระบุตำแหน่งพื้นที่ห้อง" />
                                                                </Select.Trigger>
                                                                <Select.IndicatorGroup>
                                                                    <Select.Indicator />
                                                                </Select.IndicatorGroup>
                                                            </Select.Control>
                                                            <Portal>
                                                                <Select.Positioner>
                                                                    <Select.Content>
                                                                        {locationArea.items.map((item) => (
                                                                            <Select.Item item={item.value} key={item.value}>
                                                                                {item.label}
                                                                            </Select.Item>
                                                                        ))}
                                                                    </Select.Content>
                                                                </Select.Positioner>
                                                            </Portal>
                                                        </Select.Root>
                                                    </GridItem>
                                                </Collapsible.Content>
                                            </Collapsible.Root>
                                        )}


                                    </Grid>
                                </GridItem>
                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5}>
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            <Select.Root
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
                                            </Select.Root>
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
                                                        {formData.wallSunlightDirectionsId.map((id) => {
                                                            const direction = directions.items.find((item) => item.value === id);

                                                            return (
                                                                direction && (
                                                                    <Table.Row key={direction?.value}>
                                                                        <Table.Cell textAlign={"center"}>{direction?.label}</Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={wallSides}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="ระบุด้านผนัง" />
                                                                                    </Select.Trigger>
                                                                                    <Select.IndicatorGroup>
                                                                                        <Select.Indicator />
                                                                                    </Select.IndicatorGroup>
                                                                                </Select.Control>
                                                                                <Portal>
                                                                                    <Select.Positioner>
                                                                                        <Select.Content>
                                                                                            {wallSides.items.map((item) => (
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
                                                                            <Select.Root
                                                                                collection={materials}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                                        <Select.Content>
                                                                                            {materials.items.map((item) => (
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
                                                                            <Select.Root
                                                                                collection={colors}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                            <Select.Root
                                                                                collection={roofShapes}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
                                                                                <Select.Control>
                                                                                    <Select.Trigger>
                                                                                        <Select.ValueText placeholder="ระบุกันสาด" />
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
                                                                )
                                                            );
                                                        })}
                                                    </Table.Body>
                                                </Table.Root>
                                            </Field.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>

                                {/* Roof */}
                                {(formData.locationAreaId[0] === "1" || formData.buildingTypeId[0] === "1") && (
                                    <Collapsible.Root open={formData.locationAreaId[0] === "1" || formData.buildingTypeId[0] === "1"}>
                                        <Collapsible.Content height={"100%"}>
                                            <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                                <Grid
                                                    // gridTemplateColumns={'repeat(1, 1fr)'}
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
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                )}

                                {/* Floor */}
                                {formData.locationAreaId[0] === "3" && (
                                    <Collapsible.Root open={formData.locationAreaId[0] === "3"}>
                                        <Collapsible.Content height={"100%"}>
                                            <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                                <Grid
                                                    // gridTemplateColumns={'repeat(1, 1fr)'}
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
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                )}

                                {/* Door Direction */}
                                <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5}>
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            <Select.Root
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
                                            </Select.Root>
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
                                                        {formData.doorDirectionsId.map((id) => {
                                                            const direction = directions.items.find((item) => item.value === id);

                                                            return (
                                                                direction && (
                                                                    <Table.Row key={direction?.value}>
                                                                        <Table.Cell textAlign={"center"}>{direction?.label}</Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={wallSides}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                                        {/* <Select.Content>
                                                                                            {wallSides.items.map((item) => (
                                                                                                <Select.Item item={item.value} key={item.value}>
                                                                                                    {item.label}
                                                                                                </Select.Item>
                                                                                            ))}
                                                                                        </Select.Content> */}
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={materials}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                                        {/* <Select.Content>
                                                                                            {materials.items.map((item) => (
                                                                                                <Select.Item item={item.value} key={item.value}>
                                                                                                    {item.label}
                                                                                                </Select.Item>
                                                                                            ))}
                                                                                        </Select.Content> */}
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={colors}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                        })}
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
                                            <Select.Root
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
                                            </Select.Root>
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
                                                        {formData.windowDirectionsId.map((id) => {
                                                            const direction = directions.items.find((item) => item.value === id);

                                                            return (
                                                                direction && (
                                                                    <Table.Row key={direction?.value}>
                                                                        <Table.Cell textAlign={"center"}>{direction?.label}</Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={wallSides}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                                        {/* <Select.Content>
                                                                                            {wallSides.items.map((item) => (
                                                                                                <Select.Item item={item.value} key={item.value}>
                                                                                                    {item.label}
                                                                                                </Select.Item>
                                                                                            ))}
                                                                                        </Select.Content> */}
                                                                                    </Select.Positioner>
                                                                                </Portal>
                                                                            </Select.Root>
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <Select.Root
                                                                                collection={materials}
                                                                            // value={formData.roofShapeId}
                                                                            // onValueChange={(e) =>
                                                                            //     setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                            // }
                                                                            >
                                                                                <Select.HiddenSelect />
                                                                                {/* <Select.Label>ระบุรูปทรงหลังคา</Select.Label> */}
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
                                                                                        {/* <Select.Content>
                                                                                            {materials.items.map((item) => (
                                                                                                <Select.Item item={item.value} key={item.value}>
                                                                                                    {item.label}
                                                                                                </Select.Item>
                                                                                            ))}
                                                                                        </Select.Content> */}
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
                                                        })}
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
                                                <Field.Label>ระบุข้อมูลความสว่าง</Field.Label>
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
                                                        <Table.Row>
                                                            <Table.Cell>
                                                                <Select.Root collection={roofShapes}>
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
                                                                                {/* Add items if needed */}
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
                                                            <Table.Cell>
                                                                <Select.Root collection={roofShapes}>
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
                                                                </Select.Root>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table.Root>
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
                                                                    <Select.Root collection={roofShapes}>
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
                                                                                    {/* Add items if needed */}
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
                                                                <Table.Cell>
                                                                    <Select.Root collection={roofShapes}>
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
                                                                    </Select.Root>
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
                        <Box>
                            <Heading size={"2xl"} color={"#003475"} marginBottom={4}>
                                เลือกประเภทเครื่องปรับอากาศ
                            </Heading>
                            <Heading size={"lg"} color={"#003475"}>
                                ประเภทเครื่องปรับอากาศที่แนะนำ
                            </Heading>
                            <Grid
                                gridTemplateColumns={"repeat(3, 1fr)"}
                                gap={10}
                                padding={"1.4rem 2rem "}
                                color={"#71b0ff"}
                                fontSize={36}
                                fontWeight={700}
                                textShadow={"2px 2px 4px #000000"}
                                fontStyle="italic"
                            >
                                {filterAirConditionerTypes.map((item, index) => {
                                    return (
                                        <GridItem
                                            key={index}
                                            _hover={{ transform: "translate(0%, -2%)" }}
                                            transition={"all ease 0.5s"}
                                            onClick={() => setSelectedOption((prev) => ({ ...prev, airConditionerTypeID: item.id }))}
                                        >
                                            <Box position={"relative"}>
                                                <Image
                                                    rounded="md"
                                                    src={item.image}
                                                    border={selectedOption.airConditionerTypeID === item.id ? "4px solid #fe7743" : "2px solid transparent"}
                                                    height={350}
                                                />
                                                <Text position={"absolute"} top="70%" left="50%" transform="translate(-50%, -50%)" width={"100%"} textAlign={"center"}>
                                                    {item.title}
                                                </Text>
                                            </Box>
                                        </GridItem>
                                    );
                                })}
                            </Grid>
                        </Box>
                    </Tabs.Content>
                    <Tabs.Content value={"four"}>
                        <Box>
                            <Heading size={"2xl"} color={"#003475"} marginBottom={4}>
                                กำหนดตำแหน่งติดตั้ง
                            </Heading>
                            <Grid gridTemplateColumns={"repeat(3, 1fr)"} gap={10} padding={"1.4rem 2rem "}>
                                <GridItem colSpan={1} display={'flex'} justifyContent={'center'} alignItems={'center'} padding={5}>
                                    <Image
                                        height="300px"
                                        src="./images/background/room_3D.png"
                                    />
                                </GridItem>
                                <GridItem colSpan={2} border={"1px solid #c5c5c6"} borderRadius={10} padding={5}>
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            <Select.Root
                                                collection={directions}
                                                value={formData.provinceId}
                                            // onValueChange={(e) => setFormData((prev) => ({ ...prev, provinceId: e.value }))}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>ตำแหน่งที่สามารถติดตั้ง outdoor</Select.Label>
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
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
                                        </GridItem>
                                        <GridItem>
                                            <Select.Root
                                                collection={directions}
                                                value={formData.provinceId}
                                            // onValueChange={(e) => setFormData((prev) => ({ ...prev, provinceId: e.value }))}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>ตำแหน่งที่สามารถติดตั้ง indoor (ไม่มีสิ่งกีดขวาง)</Select.Label>
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
                                                                <Select.Item item={item.value} key={item.value}>
                                                                    {item.label}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </Box>
                    </Tabs.Content>
                </Tabs.Root>
                <Collapsible.Root open={selectedOption.buildingTypeID != 0}>
                    <Flex width={"100%"} justifyContent={"space-between"}>
                        <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={handleClickBack}>
                            Back
                        </Button>
                        <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={handleClickNext}>
                            Next
                        </Button>
                    </Flex>
                </Collapsible.Root>
            </Container>
        </Box>
    );
}

export default MainPage;
