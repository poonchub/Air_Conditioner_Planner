import { Box, Button, Collapsible, Container, createListCollection, Field, Flex, Grid, GridItem, Heading, Image, Input, Portal, Select, Table, Tabs, Text } from "@chakra-ui/react"
import { useState } from "react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import './MainPage.css'

function MainPage() {
    const [selectedOption, setSelectedOption] = useState({
        buildingTypeID: 0,
        subRoomType1ID: 0,
        subRoomType2ID: 0,
    })

    const [formData, setFormData] = useState({
        provinceId: ['0'],
        locationAreaId: ['0'],
        ceilingAreaId: ['0'],
        startUseTime: [''],
        endUseTime: [''],
        wallSunlightDirectionsId: ['0'],
        roofShapeId: ['0'],
        roofSunDirectionsId: ['0']
    })

    const [tabValue, setTabValue] = useState("two");

    const buildingType = [
        { id: 1, title: 'Home', image: '/images/option/home.png' },
        { id: 2, title: 'Commercial', image: '/images/option/commercial.png' },
        { id: 3, title: 'Public / education', image: '/images/option/public_education.png' },
    ]
    const subRoomType1 = [
        { id: 1, title: 'ห้องนอน', image: '/images/option/bedroom.png' },
        { id: 2, title: 'ห้องนั่งเล่น', image: '/images/option/living_room.png' },
        { id: 3, title: 'ห้องรับประทานอาหาร', image: '/images/option/dining_room.png' },
    ]
    const subRoomType2 = [
        { id: 1, title: 'สำนักงาน', image: '/images/option/office.png' },
        { id: 2, title: 'ร้านค้า', image: '/images/option/store.png' },
        { id: 3, title: 'ร้านอาหาร', image: '/images/option/restaurant.png' },
    ]

    const handleClickNext = () => {
        if (tabValue === 'one') {
            setTabValue('two')
        } else if (tabValue === 'two') {
            setTabValue('three')
        }
    }

    const handleClickBack = () => {
        if (tabValue === 'three') {
            setTabValue('two')
        } else if (tabValue === 'two') {
            setTabValue('one')
        }
    }

    const provinces = createListCollection({
        items: [
            { label: 'กรุงเทพมหานคร', value: '1' },
            { label: 'เชียงใหม่', value: '2' },
            { label: 'ชลบุรี', value: '3' },
            { label: 'ขอนแก่น', value: '4' },
            { label: 'นครราชสีมา', value: '5' },
            { label: 'ภูเก็ต', value: '6' },
            { label: 'สงขลา', value: '7' },
            { label: 'สุราษฎร์ธานี', value: '8' },
            { label: 'นครศรีธรรมราช', value: '9' },
            { label: 'อุดรธานี', value: '10' },
        ],
    })

    const locationArea = createListCollection({
        items: [
            { label: 'ชั้นบนสุด (ใต้หลังคา)', value: '1' },
            { label: 'ชั้นอื่น ๆ', value: '2' },
            { label: 'ชั้นล่างสุด', value: '3' },
        ]
    })

    const ceilingArea = createListCollection({
        items: [
            { label: 'มีมากกว่า 30 ซม.', value: '1' },
            { label: 'มีน้อยกว่า 30 ซม.', value: '2' },
            { label: 'ไม่มี', value: '3' },
        ]
    })

    const directions = createListCollection({
        items: [
            { label: 'ทิศเหนือ', value: '1' },
            { label: 'ทิศตะวันออกเฉียงเหนือ', value: '2' },
            { label: 'ทิศตะวันออก', value: '3' },
            { label: 'ทิศตะวันออกเฉียงใต้', value: '4' },
            { label: 'ทิศใต้', value: '5' },
            { label: 'ทิศตะวันตกเฉียงใต้', value: '6' },
            { label: 'ทิศตะวันตก', value: 'W' },
            { label: 'ทิศตะวันตกเฉียงเหนือ', value: '7' },
            { label: 'ไม่มี', value: '8' },
        ],
    })


    const hourOptions = createListCollection({
        items: Array.from({ length: 24 }, (_, i) => {
            const hour = (i + 1).toString().padStart(2, '0')
            return {
                value: hour,          // ต้องเป็น string
                label: `${hour}:00 น.`,
            }
        }),
    })

    const roofShapes = createListCollection({
        items: [
            { label: "หลังคาทรงหน้าจั่ว", value: "1" },
            { label: "หลังคาทรงหมาแหงน", value: "2" },
            { label: "หลังคาปั้นหยา", value: "3" },
            { label: "หลังคาทรงแบน", value: "4" },
            { label: "อื่น ๆ", value: "5" },
        ],
    })

    console.log(formData)

    return (
        <Box className="main-page-container">
            <Box
                width={'100%'}
                padding={'5rem 2rem'}
                spaceY={4}
                backgroundImage={"url('/images/background/main_title.png')"}
                textAlign={'center'}
                color={'#FFF'}
            >
                <Heading size={'7xl'} fontWeight={600} letterSpacing="wide">
                    AIR CONDITIONER PLANNER
                </Heading>
                <Heading size={'4xl'} fontWeight={400} letterSpacing="wide">
                    BTU Calculation & Installation Guide
                </Heading>
            </Box>
            <Container py={'2rem'} spaceY={8}>
                <Tabs.Root value={tabValue} variant="enclosed">
                    <Tabs.List pointerEvents="none" width={'100%'} justifyContent={'center'} >
                        <Tabs.Trigger value="one" transition={'all ease 0.5s'}>
                            <LuUser />
                            Members
                        </Tabs.Trigger>
                        <Tabs.Trigger value="two" transition={'all ease 0.5s'}>
                            <LuFolder />
                            Projects
                        </Tabs.Trigger>
                        <Tabs.Trigger value="three" transition={'all ease 0.5s'}>
                            <LuSquareCheck />
                            Settings
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value={'one'}>
                        <Box>
                            <Heading size={'2xl'} color={'#003475'}>เลือกประเภทอาคาร</Heading>
                            <Grid
                                gridTemplateColumns={'repeat(3, 1fr)'}
                                gap={10}
                                padding={'1.4rem 2rem '}
                                color={'#71b0ff'}
                                fontSize={36}
                                fontWeight={700}
                                textShadow={'2px 2px 4px #000000'}
                                fontStyle="italic"
                            >
                                {
                                    buildingType.map((item, index) => {
                                        return (
                                            <GridItem
                                                key={index}
                                                _hover={{ transform: "translate(0%, -2%)" }}
                                                transition={'all ease 0.5s'}
                                                onClick={() => setSelectedOption((prev) => ({ ...prev, buildingTypeID: item.id }))}
                                            >
                                                <Box position={'relative'}>
                                                    <Image
                                                        rounded="md"
                                                        src={item.image}
                                                        border={
                                                            selectedOption.buildingTypeID === item.id ? '4px solid #fe7743' : '2px solid transparent'
                                                        }
                                                    />
                                                    <Text
                                                        position={'absolute'}
                                                        top="70%"
                                                        left="50%"
                                                        transform="translate(-50%, -50%)"
                                                        width={'100%'}
                                                        textAlign={'center'}
                                                    >{item.title}</Text>
                                                </Box>
                                            </GridItem>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>

                        <Collapsible.Root open={selectedOption.buildingTypeID === 1}>
                            <Collapsible.Content>
                                <Box>
                                    <Heading size={'2xl'} color={'#003475'}>เลือกประเภทห้องย่อย</Heading>
                                    <Grid
                                        gridTemplateColumns={'repeat(3, 1fr)'}
                                        padding={'1.4rem 2rem '}
                                        gap={10}
                                        color={'#003475'}
                                        fontSize={20}
                                        fontWeight={600}
                                        textAlign={'center'}
                                    >
                                        {
                                            subRoomType1.map((item, index) => {
                                                return (
                                                    <GridItem
                                                        key={index}
                                                        _hover={{ transform: "translate(0%, -2%)" }}
                                                        transition={'all ease 0.5s'}
                                                        onClick={() => setSelectedOption((prev) => ({ ...prev, subRoomType1ID: item.id }))}
                                                    >
                                                        <Image
                                                            rounded="md"
                                                            src={item.image}
                                                            border={
                                                                selectedOption.subRoomType1ID === item.id ? '4px solid #fe7743' : '2px solid transparent'
                                                            }
                                                        />
                                                        <Text marginTop={4}>{item.title}</Text>
                                                    </GridItem>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Box>
                            </Collapsible.Content>
                        </Collapsible.Root>
                        <Collapsible.Root open={selectedOption.buildingTypeID === 2}>
                            <Collapsible.Content>
                                <Box>
                                    <Heading size={'2xl'} color={'#003475'}>เลือกประเภทห้องย่อย</Heading>
                                    <Grid
                                        gridTemplateColumns={'repeat(3, 1fr)'}
                                        padding={'1.4rem 2rem '}
                                        gap={10}
                                        color={'#003475'}
                                        fontSize={20}
                                        fontWeight={600}
                                        textAlign={'center'}
                                    >
                                        {
                                            subRoomType2.map((item, index) => {
                                                return (
                                                    <GridItem
                                                        key={index}
                                                        _hover={{ transform: "translate(0%, -2%)" }}
                                                        transition={'all ease 0.5s'}
                                                        onClick={() => setSelectedOption((prev) => ({ ...prev, subRoomType2ID: item.id }))}
                                                    >
                                                        <Image
                                                            rounded="md"
                                                            src={item.image}
                                                            border={
                                                                selectedOption.subRoomType2ID === item.id ? '4px solid #fe7743' : '2px solid transparent'
                                                            }
                                                        />
                                                        <Text marginTop={4}>{item.title}</Text>
                                                    </GridItem>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Box>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    </Tabs.Content>
                    <Tabs.Content value={'two'}>
                        <Box>
                            <Heading size={'2xl'} color={'#003475'}>รับข้อมูล</Heading>
                            <Grid
                                gridTemplateColumns={'repeat(2, 1fr)'}
                                gap={10}
                                padding={'1.4rem 2rem '}
                            >
                                <GridItem
                                    border={'1px solid #c5c5c6'}
                                    borderRadius={10}
                                    padding={5}
                                >
                                    <Grid
                                        gridTemplateColumns={'repeat(2, 1fr)'}
                                        gap={5}
                                    >
                                        <GridItem colSpan={2}>
                                            <Select.Root
                                                collection={provinces}
                                                value={formData.provinceId}
                                                onValueChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, provinceId: e.value }))
                                                }
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>เลือกจังหวัด</Select.Label>
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
                                        <GridItem colSpan={1}>
                                            <Select.Root
                                                collection={locationArea}
                                                value={formData.locationAreaId}
                                                onValueChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, locationAreaId: e.value }))
                                                }
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>ระบุพื้นที่ในห้องของคุณ</Select.Label>
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="ระบุพื้นที่ในห้องของคุณ" />
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
                                        <GridItem colSpan={1} rowSpan={3}>
                                            <Box height={235}>
                                                <Image
                                                    src="https://placehold.co/600x800/png"
                                                    alt="description"
                                                    objectFit="cover"
                                                    width="100%"
                                                    height="100%"
                                                    borderRadius={10}
                                                />
                                            </Box>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <Select.Root
                                                collection={ceilingArea}
                                                value={formData.ceilingAreaId}
                                                onValueChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, ceilingAreaId: e.value }))
                                                }
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Label>มีพื้นที่ฝ้าเพดานหรือไม่</Select.Label>
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
                                            <Field.Root >
                                                <Field.Label>ช่วงเวลาที่ใช้งาน</Field.Label>
                                                <Grid templateColumns="repeat(2, 1fr)" width={'100%'} gap={3}>
                                                    {/* เวลาเริ่มต้น */}
                                                    <GridItem colSpan={1}>
                                                        <Select.Root
                                                            collection={hourOptions}
                                                            value={formData.startUseTime}
                                                            onValueChange={(e) =>
                                                                setFormData((prev) => ({ ...prev, startUseTime: e.value }))
                                                            }
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
                                                            onValueChange={(e) =>
                                                                setFormData((prev) => ({ ...prev, endUseTime: e.value }))
                                                            }
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
                                    </Grid>
                                </GridItem>
                                <GridItem border={'1px solid #c5c5c6'} borderRadius={10} padding={5}>
                                    <Grid
                                        gridTemplateColumns={'repeat(1, 1fr)'}
                                        gap={5}
                                    >
                                        <GridItem>
                                            <Select.Root
                                                multiple
                                                collection={directions}
                                                value={formData.wallSunlightDirectionsId}
                                                onValueChange={(e) => {
                                                    const selected = e.value.length > 0 ? e.value.filter((val) => val !== '0') : ['0'];
                                                    setFormData((prev) => ({ ...prev, wallSunlightDirectionsId: selected }));
                                                }}
                                            >
                                                <Select.HiddenSelect />
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
                                                <Field.Label>ระบุขนาดของผนังห้อง</Field.Label>
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row >
                                                            <Table.ColumnHeader fontWeight={600} textAlign={'center'}>ทิศที่เลือก</Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={'center'}>กว้าง</Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={'center'}>ยาว</Table.ColumnHeader>
                                                            <Table.ColumnHeader fontWeight={600} textAlign={'center'}>สูง</Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {formData.wallSunlightDirectionsId.map((id) => {
                                                            const direction = directions.items.find((item) => item.value === id)

                                                            return direction && (
                                                                <Table.Row key={direction?.value}>
                                                                    <Table.Cell textAlign={'center'}>{direction?.label}</Table.Cell>
                                                                    <Table.Cell>
                                                                        <Field.Root>
                                                                            <Field.Label>
                                                                                <Field.RequiredIndicator />
                                                                            </Field.Label>
                                                                            <Input />
                                                                            <Field.HelperText />
                                                                            <Field.ErrorText />
                                                                        </Field.Root>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <Field.Root>
                                                                            <Field.Label>
                                                                                <Field.RequiredIndicator />
                                                                            </Field.Label>
                                                                            <Input />
                                                                            <Field.HelperText />
                                                                            <Field.ErrorText />
                                                                        </Field.Root>
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <Field.Root>
                                                                            <Field.Label>
                                                                                <Field.RequiredIndicator />
                                                                            </Field.Label>
                                                                            <Input />
                                                                            <Field.HelperText />
                                                                            <Field.ErrorText />
                                                                        </Field.Root>
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        })}
                                                    </Table.Body>
                                                </Table.Root>
                                            </Field.Root>
                                        </GridItem>
                                    </Grid>
                                </GridItem>

                                {
                                    formData.locationAreaId[0] === '1' &&
                                    <Collapsible.Root open={formData.locationAreaId[0] === '1'}>
                                        <Collapsible.Content height={'100%'}>
                                            <GridItem border={'1px solid #c5c5c6'} borderRadius={10} padding={5} height={'100%'}>
                                                <Grid
                                                    // gridTemplateColumns={'repeat(1, 1fr)'}
                                                    gap={5}
                                                >
                                                    <GridItem>
                                                        <Field.Root>
                                                            <Field.Label>
                                                                หลังคา
                                                            </Field.Label>
                                                            <Select.Root
                                                                collection={roofShapes}
                                                                value={formData.roofShapeId}
                                                                onValueChange={(e) =>
                                                                    setFormData((prev) => ({ ...prev, roofShapeId: e.value }))
                                                                }
                                                            >
                                                                <Select.HiddenSelect />
                                                                <Select.Label>ระบุรูปทรงหลังคา</Select.Label>
                                                                <Select.Control>
                                                                    <Select.Trigger>
                                                                        <Select.ValueText placeholder="ระบุรูปทรงหลังคา" />
                                                                    </Select.Trigger>
                                                                    <Select.IndicatorGroup>
                                                                        <Select.Indicator />
                                                                    </Select.IndicatorGroup>
                                                                </Select.Control>
                                                                <Portal>
                                                                    <Select.Positioner>
                                                                        <Select.Content>
                                                                            {roofShapes.items.map((item) => (
                                                                                <Select.Item item={item.value} key={item.value}>
                                                                                    {item.label}
                                                                                </Select.Item>
                                                                            ))}
                                                                        </Select.Content>
                                                                    </Select.Positioner>
                                                                </Portal>
                                                            </Select.Root>
                                                        </Field.Root>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Select.Root
                                                            multiple
                                                            collection={directions}
                                                            value={formData.roofSunDirectionsId}
                                                            onValueChange={(e) => {
                                                                const selected = e.value.length > 0 ? e.value.filter((val) => val !== '0') : ['0'];
                                                                setFormData((prev) => ({ ...prev, roofSunDirectionsId: selected }));
                                                            }}
                                                        >
                                                            <Select.HiddenSelect />
                                                            <Select.Label>ระบุทิศที่โดนแสงแดด (เลือกได้มากกว่า1)</Select.Label>
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
                                                        <Table.Root size="sm" variant={"outline"}>
                                                            <Table.Header>
                                                                <Table.Row >
                                                                    <Table.ColumnHeader fontWeight={600} textAlign={'center'}>ทิศหลังคา</Table.ColumnHeader>
                                                                    <Table.ColumnHeader fontWeight={600} textAlign={'center'}>วัสดุ</Table.ColumnHeader>
                                                                    <Table.ColumnHeader fontWeight={600} textAlign={'center'}>สีภายนอก</Table.ColumnHeader>
                                                                </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {formData.roofSunDirectionsId.map((id) => {
                                                                    const direction = directions.items.find((item) => item.value === id)

                                                                    return direction && (
                                                                        <Table.Row key={direction?.value}>
                                                                            <Table.Cell textAlign={'center'}>{direction?.label}</Table.Cell>
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
                                                                                            <Select.ValueText placeholder="ระบุวัสดุ" />
                                                                                        </Select.Trigger>
                                                                                        <Select.IndicatorGroup>
                                                                                            <Select.Indicator />
                                                                                        </Select.IndicatorGroup>
                                                                                    </Select.Control>
                                                                                    <Portal>
                                                                                        <Select.Positioner>
                                                                                            <Select.Content>
                                                                                                {/* {roofShapes.items.map((item) => (
                                                                                                    <Select.Item item={item.value} key={item.value}>
                                                                                                        {item.label}
                                                                                                    </Select.Item>
                                                                                                ))} */}
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
                                                                                            <Select.ValueText placeholder="ระบุสีภายนอก" />
                                                                                        </Select.Trigger>
                                                                                        <Select.IndicatorGroup>
                                                                                            <Select.Indicator />
                                                                                        </Select.IndicatorGroup>
                                                                                    </Select.Control>
                                                                                    <Portal>
                                                                                        <Select.Positioner>
                                                                                            <Select.Content>
                                                                                                {/* {roofShapes.items.map((item) => (
                                                                                                    <Select.Item item={item.value} key={item.value}>
                                                                                                        {item.label}
                                                                                                    </Select.Item>
                                                                                                ))} */}
                                                                                            </Select.Content>
                                                                                        </Select.Positioner>
                                                                                    </Portal>
                                                                                </Select.Root>
                                                                            </Table.Cell>
                                                                        </Table.Row>
                                                                    )
                                                                })}
                                                            </Table.Body>
                                                        </Table.Root>
                                                    </GridItem>
                                                </Grid>
                                            </GridItem>
                                        </Collapsible.Content>
                                    </Collapsible.Root>
                                }

                                {
                                    formData.wallSunlightDirectionsId[0] !== '0' &&
                                    <Collapsible.Root open={formData.wallSunlightDirectionsId[0] !== '0'}>
                                        <Collapsible.Content height={'100%'}>
                                            <GridItem border={'1px solid #c5c5c6'} borderRadius={10} padding={5} height={'100%'}>
                                                <Grid gap={5}>
                                                    <GridItem colSpan={1}>
                                                        <Field.Root>
                                                            <Field.Label>
                                                                ผนัง
                                                            </Field.Label>
                                                            <Field.Label>
                                                                โปรดระบุข้อมูล
                                                            </Field.Label>
                                                            <Table.Root size="sm" variant={"outline"}>
                                                                <Table.Header>
                                                                    <Table.Row >
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={'center'}>ทิศหลังคา</Table.ColumnHeader>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={'center'}>วัสดุ</Table.ColumnHeader>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={'center'}>สีภายนอก</Table.ColumnHeader>
                                                                    </Table.Row>
                                                                </Table.Header>
                                                                <Table.Body>
                                                                    {formData.wallSunlightDirectionsId.map((id) => {
                                                                        const direction = directions.items.find((item) => item.value === id)

                                                                        return direction && (
                                                                            <Table.Row key={direction?.value}>
                                                                                <Table.Cell textAlign={'center'}>{direction?.label}</Table.Cell>
                                                                                <Table.Cell>
                                                                                    <Select.Root
                                                                                        collection={directions}
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
                                                                                                    {/* {roofShapes.items.map((item) => (
                                                                                                    <Select.Item item={item.value} key={item.value}>
                                                                                                        {item.label}
                                                                                                    </Select.Item>
                                                                                                ))} */}
                                                                                                </Select.Content>
                                                                                            </Select.Positioner>
                                                                                        </Portal>
                                                                                    </Select.Root>
                                                                                </Table.Cell>
                                                                                <Table.Cell>
                                                                                    <Select.Root
                                                                                        collection={directions}
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
                                                                                                    {/* {roofShapes.items.map((item) => (
                                                                                                    <Select.Item item={item.value} key={item.value}>
                                                                                                        {item.label}
                                                                                                    </Select.Item>
                                                                                                ))} */}
                                                                                                </Select.Content>
                                                                                            </Select.Positioner>
                                                                                        </Portal>
                                                                                    </Select.Root>
                                                                                </Table.Cell>
                                                                            </Table.Row>
                                                                        )
                                                                    })}
                                                                </Table.Body>
                                                            </Table.Root>
                                                        </Field.Root>
                                                    </GridItem>
                                                </Grid>
                                            </GridItem>
                                        </Collapsible.Content>
                                    </Collapsible.Root>
                                }

                                {
                                    formData.wallSunlightDirectionsId[0] !== '0' &&
                                    <Collapsible.Root open={formData.wallSunlightDirectionsId[0] !== '0'}>
                                        <Collapsible.Content height={'100%'}>
                                            <GridItem border={'1px solid #c5c5c6'} borderRadius={10} padding={5} height={'100%'}>
                                                <Grid gap={5}>
                                                    <GridItem colSpan={1}>
                                                        <Field.Root>
                                                            <Field.Label>
                                                                ประตู
                                                            </Field.Label>
                                                            <Field.Label>
                                                                โปรดระบุข้อมูล
                                                            </Field.Label>
                                                            <Table.Root size="sm" variant={"outline"}>
                                                                <Table.Header>
                                                                    <Table.Row >
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={'center'}>ทิศหลังคา</Table.ColumnHeader>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={'center'}>วัสดุ</Table.ColumnHeader>
                                                                        <Table.ColumnHeader fontWeight={600} textAlign={'center'}>สีภายนอก</Table.ColumnHeader>
                                                                    </Table.Row>
                                                                </Table.Header>
                                                                <Table.Body>
                                                                    {formData.wallSunlightDirectionsId.map((id) => {
                                                                        const direction = directions.items.find((item) => item.value === id)

                                                                        return direction && (
                                                                            <Table.Row key={direction?.value}>
                                                                                <Table.Cell textAlign={'center'}>{direction?.label}</Table.Cell>
                                                                                <Table.Cell>
                                                                                    <Select.Root
                                                                                        collection={directions}
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
                                                                                                    {/* {roofShapes.items.map((item) => (
                                                                                                    <Select.Item item={item.value} key={item.value}>
                                                                                                        {item.label}
                                                                                                    </Select.Item>
                                                                                                ))} */}
                                                                                                </Select.Content>
                                                                                            </Select.Positioner>
                                                                                        </Portal>
                                                                                    </Select.Root>
                                                                                </Table.Cell>
                                                                                <Table.Cell>
                                                                                    <Select.Root
                                                                                        collection={directions}
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
                                                                                                    {/* {roofShapes.items.map((item) => (
                                                                                                    <Select.Item item={item.value} key={item.value}>
                                                                                                        {item.label}
                                                                                                    </Select.Item>
                                                                                                ))} */}
                                                                                                </Select.Content>
                                                                                            </Select.Positioner>
                                                                                        </Portal>
                                                                                    </Select.Root>
                                                                                </Table.Cell>
                                                                            </Table.Row>
                                                                        )
                                                                    })}
                                                                </Table.Body>
                                                            </Table.Root>
                                                        </Field.Root>
                                                    </GridItem>
                                                </Grid>
                                            </GridItem>
                                        </Collapsible.Content>
                                    </Collapsible.Root>
                                }

                            </Grid>
                        </Box>
                    </Tabs.Content>
                    <Tabs.Content value={'three'}>
                        Manage your tasks for freelancers
                    </Tabs.Content>
                </Tabs.Root>
                <Collapsible.Root open={selectedOption.buildingTypeID != 0}>
                    <Flex width={'100%'} justifyContent={'space-between'}>
                        <Button
                            width={100}
                            backgroundColor={'#003475'}
                            fontSize={20}
                            onClick={handleClickBack}
                        >
                            Back
                        </Button>
                        <Button
                            width={100}
                            backgroundColor={'#003475'}
                            fontSize={20}
                            onClick={handleClickNext}
                        >
                            Next
                        </Button>
                    </Flex>
                </Collapsible.Root>
            </Container>
        </Box>

    )
}

export default MainPage