import {
    Box,
    Button,
    Container,
    Field,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Table,
    Tabs,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./MainPage.css";
import { AirVent, FileText, Home, MapPin } from "lucide-react";
import {
    Chip,
    Collapse,
    FormControl,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    type SelectChangeEvent,
} from "@mui/material";
import BuildingSelector from "@/components/BuildingSelector/BuildingSelector";
import AirConditionerSelector from "@/components/AirConditionerSelector/AirConditionerSelector";
import { findMaximumLightingPowerDensity, loadWattLightData } from "@/data/WattLightService";
import type { WattLightRow } from "@/types/WattLightRow";
import { findTotalHeat, loadOccupancyHeatGainData } from "@/data/OccupancyHeatGainService";
import type { OccupancyHeatGainRow } from "@/types/OccupancyHeatGainRow";
import type { EquipmentRow } from "@/types/EquipmentRow";
import { findCLF, findPowerW, getEquipmentOptions, loadEquipmentData } from "@/data/EquipmentService";
import type { DoorTypeRow } from "@/types/DoorTypeRow";
import { getDoorTypeData, loadDoorTypeData } from "@/data/DoorTypeService";
import type { ClimateDataRow } from "@/types/ClimateDataRow";
import { getClimateData, loadClimateData } from "@/data/ClimateDataService";
import { equipmentLabelMap } from "@/mapData/equipmentLabelMap";
import { doorTypeLabelMap } from "@/mapData/doorTypeLabelMap";
import { provinceLabelMap } from "@/mapData/provinceLabelMap";
import type { WindowTypeRow } from "@/types/WindowTypeRow";
import { getWindowTypeData, loadWindowTypeData } from "@/data/WindowTypeService";
import { windowTypeLabelMap } from "@/mapData/windowTypeLabelMap";
import type { UCLTDRoofRow } from "@/types/UCLTDRoofRow";
import { findUCLTDRoofTimeRange, findUvalue, loadUCLTDRoofData } from "@/data/UCLTDRoofService";
import type { LMWallAndRoofRow } from "@/types/LMWallAndRoofRow";
import { interpolateLMByLat, loadLMWallAndRoofData } from "@/data/LMWallAndRoofService";
import type { GlassCLFwithShadingRow } from "@/types/GlassCLFwithShadingRow";
import type { GlassCLFnoShadingRow } from "@/types/GlassCLFnoShadingRow";
import { findGlassCLFwithShadingTimeRange, loadGlassCLFwithShadingData } from "@/data/GlassCLFwithShadingService";
import { findGlassCLFnoShadingTimeRange, loadGlassCLFnoShadingData } from "@/data/GlassCLFnoShadingService";
import type { SHGFtoShadeRow } from "@/types/SHGFtoShadeRow";
import type { SHGFNoShadeRow } from "@/types/SHGFNoShadeRow";
// @ts-ignore
import { interpolateSHGFNoShadeByLat, loadSHGFNoShadeData } from "@/data/SHGFNoShadeService";
import { findSHGFtoShade, loadSHGFtoShadeData } from "@/data/SHGFtoShadeService";
import { findUCLTDWallTimeRange, findUvalueWall, getUCLTDWallData, loadUCLTDWallData } from "@/data/UCLTDWallService";
import type { UCLTDWallRow } from "@/types/UCLTDWallRow";
import type { GlassCLTDRow } from "@/types/GlassCLTDRow";
import { findCLTDGlassTimeRange, loadCLTDGlassData } from "@/data/CLTDService";
import { findU_SCglass, loadU_SCglassData } from "@/data/U_SCglassService";
import type { U_SCglassRow } from "@/types/U_SCglassRow";
import type { UfloorInRow } from "@/types/UfloorInRow";
import { findUfloorIn, loadUfloorInData } from "@/data/UfloorInService";
import type { BTUAirRow } from "@/types/BTUAirRow";
import { getClosestBTUAirData, loadBTUAirRowData } from "@/data/BTUAirService";
import InstallationPositionSelector from "@/components/InstallationPositionSelector/InstallationPositionSelector";
import { useForm, Controller } from "react-hook-form";

export const BASE_URL = import.meta.env.BASE_URL;

interface DataFindProps {
    lightPowerDensity: string | null;
    totalHeat: string | null;
    equipment: string[] | null;
}

type EquipmentValue = {
    equipmentName: string;
    label: string;
    quantity: number;
    powerW: number;
    clf: number;
    qEquipment: number;
};

type DoorValue = {
    directionName: string;
    doorType: string;
    material: string;
    haveShade: boolean;
    haveCurtain: boolean;
    quantity: number;
    cfm: number;
    glassType: string;
    doorArea: number;
    qDoorGlassByMonth: any[];
    qSolarDoorGlassByMonth: any[];
};

type WindowValue = {
    directionName: string;
    windowType: string;
    material: string;
    haveShade: boolean;
    haveCurtain: boolean;
    quantity: number;
    cfm: number;
    glassType: string;
    windowArea: number;
    qWindowGlassByMonth: any[];
    qSolarWindowGlassByMonth: any[];
};

export type WallValue = {
    directionName: string;
    position: string;
    material: string;
    kWallColor: number;
    wallArea: number;
    glassAreaWindow: number;
    glassAreaDoor: number;
    haveShade: boolean;
    haveCurtain: boolean;
    glassType: string;
    qWallByMonth: any[];
    qWallGlassByMonth: any[];
    qSolarWallGlassByMonth: any[];
    qSolarGlassByMonth?: any[];
    qGlassByMonth?: any[];
    wallCondition: string,
    hasOpenSpace: boolean,
    wallScore?: WallScore
};

type DoorValueError = {
    directionName: string;
    doorType: string;
    material: string;
    haveShade: string;
    haveCurtain: string;
    quantity: string;
    cfm: number;
    glassType: string;
    doorArea: number;
    qDoorGlassByMonth: any[];
    qSolarDoorGlassByMonth: any[];
};

type WindowValueError = {
    directionName: string;
    windowType: string;
    material: string;
    haveShade: string;
    haveCurtain: string;
    quantity: string;
    cfm: number;
    glassType: string;
    windowArea: number;
    qWindowGlassByMonth: any[];
    qSolarWindowGlassByMonth: any[];
};

export type WallValueError = {
    directionName: string;
    position: string;
    material: string;
    kWallColor: string;
    wallArea: number;
    glassAreaWindow: number;
    glassAreaDoor: number;
    haveShade: string;
    haveCurtain: string;
    glassType: string;
    qWallByMonth: any[];
    qWallGlassByMonth: any[];
    qSolarWallGlassByMonth: any[];
    qSolarGlassByMonth?: any[];
    qGlassByMonth?: any[];
    wallCondition: string,
    hasOpenSpace: boolean,
    wallScore?: WallScore
};

type NoAirDirectionValue = {
    directionName: string;
    position: string;
    material: string;
    haveInsulation: boolean;
    haveCeiling: boolean;
    glassType: string;
    qIn: number;
};

type FloorValue = {
    uFloor: number;
    qFloor: number;
};

type FloorValueError = {
    uFloor: string;
    qFloor: string;
};

type RoofValue = {
    qRoofByMonth: {
        Month: string;
        CLTDTime: any[];
    }[];
};

export type WallScore = {
    solarExposure: number;       // 1. ผนังร้อน/แดด
    furnitureAndOccupants: number; // 2. เฟอร์นิเจอร์/ผู้ใช้งาน
    airDistribution: number;     // 3. การกระจายลม
    doorsAndWindows: number;     // 4. ประตู/หน้าต่าง
    pipingLayout: number;        // 5. การเดินท่อ
    totalScore: number;
};

export type FormDataProps = {
    province: string;
    people: number;
    width: number;
    depth: number;
    height: number;
    startTime: string;
    endTime: string;
    ceiling: string;
    // ceilingHeight: string;
    buildingType: string;
    roomPosition: string;
    roofType: string;
    kRoofColor: number;
    ballastFactor: number;
    noAirDirectionValue: NoAirDirectionValue[];
    equipmentValue: EquipmentValue[];
    doorValue: DoorValue[];
    windowValue: WindowValue[];
    wallValue: WallValue[];
    floorValue: FloorValue;
    roofValue: RoofValue;
    furniturePosition: string[];
};

export type FormDataErrorProps = {
    province: string;
    people: number;
    width: number;
    depth: number;
    height: number;
    startTime: string;
    endTime: string;
    ceiling: string;
    // ceilingHeight: string;
    buildingType: string;
    roomPosition: string;
    roofType: string;
    kRoofColor: number;
    ballastFactor: number;
    noAirDirectionValue: NoAirDirectionValue[];
    equipmentValue: EquipmentValue[];
    doorValue: DoorValueError[];
    windowValue: WindowValueError[];
    wallValue: WallValueError[];
    floorValue: FloorValueError;
    roofValue: RoofValue;
    furniturePosition: string[];
};

export type CalculateVariableProps = {
    qLight: number;
    qPeople: number;
    qEquipmentSum: number;
    qInfiltration: number;
    qDoorCfmSum: number;
    qWindowCfmSum: number;
    areaValue: [];
    cltdW: number;
    totalQGlassByMonth: any[];
    totalQSolarByMonth: any[];
    totalQWallByMonth: any[];
    totalQLoadByMonth: any[];
    maxRecord: any;
    qTotalAll: number;
    totalQIn: number;
    airConditionerType: string;
    recommendedBTU: number;
    electricityCost: any;
    wallScoreAll: WallValue[]
};

type HourData = {
    Hour: string;
    qGlass?: number;
    qSolarGlass?: number;
};

function MainPage() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataErrorProps>({
        defaultValues: {
            province: "",
            people: 1,
            width: 3,
            depth: 3,
            height: 3,
            startTime: "",
            endTime: "",
            ceiling: "",
            // ceilingHeight: "",
            buildingType: "",
            roomPosition: "",
            roofType: "",
            kRoofColor: 1,
            ballastFactor: 1,
            noAirDirectionValue: [],
            equipmentValue: [],
            doorValue: [],
            windowValue: [],
            wallValue: [],
            floorValue: { uFloor: "", qFloor: "" },
            roofValue: { qRoofByMonth: [] },
            furniturePosition: [],
        },
    });

    const [selectedOption, setSelectedOption] = useState<{
        buildingType?: string | null;
        subRoom?: string | null;
        selectedAirConditionerType?: string | null;
        businessSize?: string | null;
    }>({
        buildingType: null,
        subRoom: null,
        selectedAirConditionerType: null,
        businessSize: null,
    });

    // const [formData, setFormData] = useState<FormDataProps>({
    //     province: "",
    //     people: 1,
    //     width: 3,
    //     depth: 3,
    //     height: 3,
    //     startTime: "",
    //     endTime: "",
    //     ceiling: "",
    //     ceilingHeight: "",
    //     buildingType: "",
    //     roomPosition: "",
    //     roofType: "",
    //     kRoofColor: 0,
    //     ballastFactor: 1,
    //     noAirDirectionValue: [],
    //     equipmentValue: [],
    //     doorValue: [],
    //     windowValue: [],
    //     wallValue: [],
    //     floorValue: { uFloor: 0, qFloor: 0 },
    //     roofValue: { qRoofByMonth: [] }
    // });
    const [formData, setFormData] = useState<FormDataProps>({
        province: "",
        people: 1,
        width: 3,
        depth: 3,
        height: 3,
        startTime: "",
        endTime: "",
        ceiling: "HaveCeilinglessthan",
        // ceilingHeight: "Low",
        buildingType: "Single",
        roomPosition: "",
        roofType: "Concrete",
        kRoofColor: 1,
        ballastFactor: 1,
        noAirDirectionValue: [],
        equipmentValue: [],
        doorValue: [],
        windowValue: [],
        wallValue: [],
        floorValue: { uFloor: 0, qFloor: 0 },
        roofValue: { qRoofByMonth: [] },
        furniturePosition: [],
    });

    // @ts-ignore
    const [calculateVariable, setCalculateVariable] = useState<CalculateVariableProps>({
        qLight: 0,
        qPeople: 0,
        qEquipmentSum: 0,
        qInfiltration: 0,
        qDoorCfmSum: 0,
        qWindowCfmSum: 0,
        areaValue: [],
        cltdW: 0,
        qTotalAll: 0,
        recommendedBTU: 0,
        electricityCost: 0,
        wallScoreAll: []
    });

    const [dataFind, setDataFind] = useState<DataFindProps>({
        lightPowerDensity: null,
        totalHeat: null,
        equipment: null,
    });

    const [tabValue, setTabValue] = useState("one");

    const [wattLightData, setWattLightData] = useState<WattLightRow[]>([]);
    const [occupancyHeatGainData, setOccupancyHeatGainData] = useState<OccupancyHeatGainRow[]>([]);
    const [equipmentData, setEquipmentData] = useState<EquipmentRow[]>([]);
    const [doorTypeData, setDoorTypeData] = useState<DoorTypeRow[]>([]);
    const [windowTypeData, setWindowTypeData] = useState<WindowTypeRow[]>([]);
    const [climateData, setClimateData] = useState<ClimateDataRow[]>([]);
    const [roofData, setRoofData] = useState<UCLTDRoofRow[]>([]);
    const [lmWallAndRoofData, setLMWallAndRoofData] = useState<LMWallAndRoofRow[]>([]);
    const [glassCLFwithShadingData, setGlassCLFwithShadingData] = useState<GlassCLFwithShadingRow[]>([]);
    const [glassCLFnoShadingData, setGlassCLFnoShading] = useState<GlassCLFnoShadingRow[]>([]);
    const [SHGFtoShadeData, setSHGFtoShadeData] = useState<SHGFtoShadeRow[]>([]);
    const [SHGFNoShadeData, setSHGFNoShadeData] = useState<SHGFNoShadeRow[]>([]);
    const [UCLTDWallData, setUCLTDWallData] = useState<UCLTDWallRow[]>([]);
    const [CLTDGlassData, setCLTDGlassData] = useState<GlassCLTDRow[]>([]);
    const [U_SCglassData, setU_SCglassData] = useState<U_SCglassRow[]>([]);
    const [UfloorInData, setUfloorInData] = useState<UfloorInRow[]>([]);
    const [BTUAirData, setBTUAirData] = useState<BTUAirRow[]>([]);

    const handleDoorDirectionChange = (
        event: SelectChangeEvent<string[]>,
        field: any // จาก Controller
    ) => {
        const { value } = event.target;
        const directionArr = typeof value === "string" ? value.split(",") : value;

        // อัปเดต react-hook-form
        field.onChange(directionArr);

        setFormData((prev) => {
            if (directionArr.includes("None")) {
                return {
                    ...prev,
                    doorValue: [
                        {
                            directionName: "None",
                            doorType: "",
                            material: "",
                            haveShade: false,
                            haveCurtain: false,
                            quantity: 0,
                            cfm: 0,
                            glassType: "",
                            doorArea: 0,
                            qDoorGlassByMonth: [],
                            qSolarDoorGlassByMonth: [],
                        },
                    ],
                };
            }

            const prevDoors = prev.doorValue || [];
            const newDoors: DoorValue[] = [...prevDoors];

            directionArr.forEach((dir) => {
                if (!newDoors.find((d) => d.directionName === dir)) {
                    newDoors.push({
                        directionName: dir,
                        doorType: "",
                        material: "",
                        haveShade: false,
                        haveCurtain: false,
                        quantity: 1,
                        cfm: 0,
                        glassType: "",
                        doorArea: 0,
                        qDoorGlassByMonth: [],
                        qSolarDoorGlassByMonth: [],
                    });
                }
            });

            const filteredDoors = newDoors.filter((d) =>
                directionArr.includes(d.directionName)
            );

            return {
                ...prev,
                doorValue: filteredDoors,
            };
        });
    };

    const handleWindowDirectionChange = (
        event: SelectChangeEvent<string[]>,
        field: any // จาก Controller
    ) => {
        const { value } = event.target;
        const directionArr = typeof value === "string" ? value.split(",") : value;

        // อัปเดต react-hook-form
        field.onChange(directionArr);

        setFormData((prev) => {
            if (directionArr.includes("None")) {
                return {
                    ...prev,
                    windowValue: [
                        {
                            directionName: "None",
                            windowType: "",
                            material: "",
                            haveShade: false,
                            haveCurtain: false,
                            quantity: 0,
                            cfm: 0,
                            glassType: "",
                            windowArea: 0,
                            qWindowGlassByMonth: [],
                            qSolarWindowGlassByMonth: [],
                        },
                    ],
                };
            }

            const prevWindows = prev.windowValue || [];
            const newWindows: WindowValue[] = [...prevWindows];

            directionArr.forEach((dir) => {
                if (!newWindows.find((d) => d.directionName === dir)) {
                    newWindows.push({
                        directionName: dir,
                        windowType: "",
                        material: "",
                        haveShade: false,
                        haveCurtain: false,
                        quantity: 1,
                        cfm: 0,
                        glassType: "",
                        windowArea: 0,
                        qWindowGlassByMonth: [],
                        qSolarWindowGlassByMonth: [],
                    });
                }
            });

            const filteredWindows = newWindows.filter((d) =>
                directionArr.includes(d.directionName)
            );

            return {
                ...prev,
                windowValue: filteredWindows,
            };
        });
    };

    const handleWallDirectionChange = (
        event: SelectChangeEvent<string[]>,
        field: any // จาก Controller
    ) => {
        const { value } = event.target;
        const directionArr = typeof value === "string" ? value.split(",") : value;

        // อัปเดต react-hook-form
        field.onChange(directionArr);

        setFormData((prev) => {
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
                            wallScore: {
                                solarExposure: 0,
                                furnitureAndOccupants: 0,
                                airDistribution: 0,
                                doorsAndWindows: 0,
                                pipingLayout: 0,
                                totalScore: 0
                            },
                        },
                    ],
                };
            }

            const prevWalls = prev.wallValue || [];
            const newWalls: WallValue[] = [...prevWalls];

            directionArr?.forEach((dir) => {
                if (!newWalls.find((d) => d.directionName === dir)) {
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
                        wallScore: {
                            solarExposure: 0,
                            furnitureAndOccupants: 0,
                            airDistribution: 0,
                            doorsAndWindows: 0,
                            pipingLayout: 0,
                            totalScore: 0
                        },
                    });
                }
            });

            const filteredWalls = newWalls.filter((d) =>
                directionArr?.includes(d.directionName)
            );

            return {
                ...prev,
                wallValue: filteredWalls,
            };
        });
    };

    const handleNoAirDirectionChange = (
        event: SelectChangeEvent<string[]>,
        field: any // จาก Controller
    ) => {
        const { value } = event.target;
        const directionArr = typeof value === "string" ? value.split(",") : value;

        // อัปเดต react-hook-form
        field.onChange(directionArr);

        setFormData((prev) => {
            if (directionArr.includes("None")) {
                return {
                    ...prev,
                    noAirDirectionValue: [
                        {
                            directionName: "None",
                            position: "",
                            material: "",
                            haveInsulation: false,
                            haveCeiling: false,
                            glassType: "",
                            qIn: 0,
                        },
                    ],
                };
            }

            const prevDirections = prev.noAirDirectionValue || [];
            const newDirections: NoAirDirectionValue[] = [...prevDirections];

            directionArr.forEach((dir) => {
                if (!newDirections.find((d) => d.directionName === dir)) {
                    newDirections.push({
                        directionName: dir,
                        position: "",
                        material: "",
                        haveInsulation: false,
                        haveCeiling: false,
                        glassType: "",
                        qIn: 0,
                    });
                }
            });

            const filteredDirections = newDirections.filter((d) =>
                directionArr.includes(d.directionName)
            );

            return {
                ...prev,
                noAirDirectionValue: filteredDirections,
            };
        });
    };

    useEffect(() => {
        loadWattLightData().then(setWattLightData);
        loadOccupancyHeatGainData().then(setOccupancyHeatGainData);
        loadEquipmentData().then(setEquipmentData);
        loadDoorTypeData().then(setDoorTypeData);
        loadWindowTypeData().then(setWindowTypeData);
        loadClimateData().then(setClimateData);
        loadUCLTDRoofData().then(setRoofData);
        loadLMWallAndRoofData().then(setLMWallAndRoofData);
        loadGlassCLFwithShadingData().then(setGlassCLFwithShadingData);
        loadGlassCLFnoShadingData().then(setGlassCLFnoShading);
        loadSHGFNoShadeData().then(setSHGFNoShadeData);
        loadSHGFtoShadeData().then(setSHGFtoShadeData);
        loadUCLTDWallData().then(setUCLTDWallData);
        loadCLTDGlassData().then(setCLTDGlassData);
        loadU_SCglassData().then(setU_SCglassData);
        loadUfloorInData().then(setUfloorInData);
        loadBTUAirRowData().then(setBTUAirData);
    }, []);

    useEffect(() => {
        if (selectedOption.buildingType != null && selectedOption.subRoom != null) {
            const lightPowerDensity = findMaximumLightingPowerDensity(
                wattLightData,
                selectedOption.buildingType,
                selectedOption.subRoom
            );
            // console.log("lightPowerDensity: ", lightPowerDensity)
            setDataFind((prev) => ({ ...prev, lightPowerDensity: lightPowerDensity }));

            const totalHeat = findTotalHeat(occupancyHeatGainData, selectedOption.buildingType, selectedOption.subRoom);
            // console.log("totalHeat: ", totalHeat)
            setDataFind((prev) => ({ ...prev, totalHeat: totalHeat }));

            const equipment = getEquipmentOptions(equipmentData, selectedOption.buildingType, selectedOption.subRoom);
            // console.log("equipment: ", equipment)
            setDataFind((prev) => ({ ...prev, equipment: equipment }));

            const equipmentValue = equipment.map((eq) => ({
                equipmentName: eq,
                label: equipmentLabelMap[eq] || eq,
                quantity: 0,
                powerW: Number(
                    findPowerW(equipmentData, selectedOption.buildingType ?? "", selectedOption.subRoom ?? "", eq)
                ),
                clf: Number(
                    findCLF(equipmentData, selectedOption.buildingType ?? "", selectedOption.subRoom ?? "", eq)
                ),
                qEquipment: 0,
            }));
            setFormData((prev) => ({ ...prev, equipmentValue }));
        }
    }, [selectedOption.buildingType, selectedOption.subRoom]);

    // qInfiltration
    useEffect(() => {
        if (formData.province && calculateVariable.qDoorCfmSum && calculateVariable.qWindowCfmSum) {
            const climatedt = getClimateData(climateData, formData.province);

            const qInfiltration =
                ((calculateVariable.qDoorCfmSum + calculateVariable.qWindowCfmSum) *
                    (1.1 * ((Number(climatedt?.DB_OutMax) - Number(climatedt?.DB_In)) * 1.8 + 32)) +
                    4748 * (Number(climatedt?.W_Out) - Number(climatedt?.W_In))) *
                0.29307;
            // console.log("qInfiltration: ", qInfiltration);
            setCalculateVariable((prev) => ({
                ...prev,
                qInfiltration: qInfiltration,
            }));
        }
    }, [
        formData.province,
        calculateVariable.qDoorCfmSum,
        calculateVariable.qWindowCfmSum,
        JSON.stringify(climateData),
    ]);

    // qLight
    useEffect(() => {
        if (formData.ballastFactor && dataFind.lightPowerDensity) {
            const qLight =
                formData.width * formData.depth * formData.ballastFactor * Number(dataFind.lightPowerDensity);
            // console.log("qLight: ", qLight);
            // console.log("lightPowerDensity: ", dataFind.lightPowerDensity);
            setCalculateVariable((prev) => ({
                ...prev,
                qLight: qLight,
            }));
        }
    }, [formData.width, formData.depth, formData.ballastFactor, JSON.stringify(dataFind.lightPowerDensity)]);

    // qPeople
    useEffect(() => {
        if (formData.people && dataFind.totalHeat) {
            const qPeople = formData.people * Number(dataFind.totalHeat);
            // console.log("qPeople: ", qPeople);
            setCalculateVariable((prev) => ({
                ...prev,
                qPeople: qPeople,
            }));
        }
    }, [formData.people, dataFind.totalHeat]);

    // qEquipmentValue
    useEffect(() => {
        if (formData.equipmentValue && formData.equipmentValue.length > 0) {
            const sum = formData.equipmentValue.reduce((acc, item) => acc + Number(item.qEquipment || 0), 0);

            // console.log("qEquipmentSum: ", sum);

            setCalculateVariable((prev) => ({
                ...prev,
                qEquipmentSum: sum,
            }));
        }
    }, [JSON.stringify(formData.equipmentValue)]);

    // DoorValue
    useEffect(() => {
        if (!formData.doorValue || formData.doorValue.length === 0) return;

        const updatedDoorValue = formData.doorValue.map((door) => {
            const doortypedt = getDoorTypeData(doorTypeData, door.doorType);
            const newCfm = Number(doortypedt?.cfm ?? 0) * door.quantity;

            if (door.cfm === newCfm) return door;

            return {
                ...door,
                cfm: newCfm,
                doorArea: Number(doortypedt?.DoorArea ?? 0) * door.quantity,
            };
        });

        const sum = updatedDoorValue.reduce((acc, d) => acc + Number(d.cfm || 0), 0);

        setFormData((prev) => ({ ...prev, doorValue: updatedDoorValue }));
        setCalculateVariable((prevCalc) => ({ ...prevCalc, qDoorCfmSum: sum }));
    }, [JSON.stringify(formData.doorValue.map((d) => [d.doorType, d.quantity, d.cfm])), doorTypeData]);

    // WindowValue
    useEffect(() => {
        if (!formData.windowValue || formData.windowValue.length === 0) return;

        const updatedWindowValue = formData.windowValue.map((window) => {
            const windowtypedt = getWindowTypeData(windowTypeData, window.windowType);
            const newCfm = Number(windowtypedt?.cfm ?? 0) * window.quantity;

            if (window.cfm === newCfm) return window;

            return {
                ...window,
                cfm: newCfm,
                windowArea: Number(windowtypedt?.WindowArea ?? 0) * window.quantity,
            };
        });

        const sum = updatedWindowValue.reduce((acc, w) => acc + Number(w.cfm || 0), 0);

        setFormData((prev) => ({ ...prev, windowValue: updatedWindowValue }));
        setCalculateVariable((prevCalc) => ({ ...prevCalc, qWindowCfmSum: sum }));
    }, [JSON.stringify(formData.windowValue.map((w) => [w.windowType, w.quantity, w.cfm])), windowTypeData]);

    // WallValue
    useEffect(() => {
        setFormData((prev) => {
            const newWallValue = prev.wallValue.map((wall) => {
                const matchedDoors = prev.doorValue.filter((d) => d.directionName === wall.directionName);
                const matchedWindows = prev.windowValue.filter((w) => w.directionName === wall.directionName);

                const totalWallArea =
                    wall.position === "Width"
                        ? prev.width * prev.height
                        : wall.position === "Depth"
                            ? prev.depth * prev.height
                            : 0;

                const glassAreaDoor = matchedDoors.reduce((sum, door) => {
                    if (door.material === "Glass") {
                        const doorArea = getDoorTypeData(doorTypeData, door.doorType);
                        return sum + Number(doorArea?.DoorArea ?? 0) * door.quantity;
                    }
                    return sum;
                }, 0);

                const glassAreaWindow = matchedWindows.reduce((sum, win) => {
                    if (win.material === "Glass") {
                        const windowArea = getWindowTypeData(windowTypeData, win.windowType);
                        return sum + Number(windowArea?.WindowArea ?? 0) * win.quantity;
                    }
                    return sum;
                }, 0);

                return {
                    ...wall,
                    wallArea: totalWallArea - (glassAreaDoor + glassAreaWindow),
                    glassAreaWindow,
                    glassAreaDoor,
                };
            });

            return { ...prev, wallValue: newWallValue };
        });
    }, [
        JSON.stringify(formData.doorValue.map((d) => [d.doorType, d.quantity, d.material])),
        JSON.stringify(formData.windowValue.map((w) => [w.windowType, w.quantity, w.material])),
        formData.width,
        formData.depth,
        formData.height,
    ]);

    // qRoof
    useEffect(() => {
        if (
            formData.roofType &&
            formData.ceiling &&
            formData.startTime &&
            formData.endTime &&
            formData.province &&
            formData.kRoofColor &&
            formData.width &&
            formData.depth
        ) {
            setFormData((prev) => {
                const ucltRoofData = findUCLTDRoofTimeRange(
                    roofData,
                    prev.roofType,
                    prev.ceiling,
                    prev.startTime,
                    prev.endTime
                );

                const climatedt = getClimateData(climateData, prev.province);
                const interpolated = interpolateLMByLat(lmWallAndRoofData, Number(climatedt?.Latitude));
                const interpolatedHOR = interpolated.filter((d) => d.Direction === "HOR");

                const uValueRoof = findUvalue(roofData, prev.roofType, prev.ceiling);
                const roofArea = prev.width * prev.depth;

                const qRoofByMonth = interpolatedHOR.map((lmRow) => ({
                    Month: lmRow.Month,
                    CLTDTime: ucltRoofData.map((ucltRow) => {
                        const CLTDs =
                            prev.kRoofColor * (Number(ucltRow.CLTDRoof) + Number(lmRow.LM)) +
                            (25.5 - Number(climatedt?.DB_In)) +
                            (Number(climatedt?.T_o) - 29.4);
                        return { Hour: ucltRow.Hour, qRoof: CLTDs * Number(uValueRoof) * roofArea };
                    }),
                }));

                return {
                    ...prev,
                    roofValue: { qRoofByMonth },
                };
            });
        }
    }, [
        formData.startTime,
        formData.endTime,
        formData.roofType,
        formData.ceiling,
        formData.province,
        formData.kRoofColor,
        formData.width,
        formData.depth,
    ]);

    // qWall
    useEffect(() => {
        if (
            formData.windowValue &&
            formData.doorValue &&
            formData.wallValue &&
            formData.startTime &&
            formData.endTime &&
            formData.province &&
            formData.width &&
            formData.depth
        ) {
            setFormData((prev) => {
                const climatedt = getClimateData(climateData, prev.province);
                const interpolated = interpolateLMByLat(lmWallAndRoofData, Number(climatedt?.Latitude));

                const updatedWallValue = prev.wallValue.map((item) => {
                    if (item.material === "Glass") return item; // ข้าม wall กระจก

                    const ucltWallData = findUCLTDWallTimeRange(
                        UCLTDWallData,
                        item.material,
                        item.directionName,
                        prev.startTime,
                        prev.endTime
                    );

                    const interpolatedDirection = interpolated.filter((d) => d.Direction === item.directionName);
                    const uValueWall = findUvalueWall(ucltWallData, item.material);
                    const wallArea = item.wallArea;

                    const qWallByMonth = interpolatedDirection.map((lmRow) => ({
                        Month: lmRow.Month,
                        CLTDTime: ucltWallData.map((ucltRow) => {
                            const CLTDs =
                                item.kWallColor * (Number(ucltRow.CLTDWall) + Number(lmRow.LM)) +
                                (25.5 - Number(climatedt?.DB_In)) +
                                (Number(climatedt?.T_o) - 29.4);

                            return {
                                Hour: ucltRow.Hour,
                                qWall: CLTDs * Number(uValueWall) * wallArea,
                            };
                        }),
                    }));

                    if (JSON.stringify(item.qWallByMonth) === JSON.stringify(qWallByMonth)) return item;

                    return { ...item, qWallByMonth };
                });

                if (JSON.stringify(updatedWallValue) === JSON.stringify(prev.wallValue)) return prev;

                return { ...prev, wallValue: updatedWallValue };
            });
        }
    }, [
        formData.windowValue,
        formData.doorValue,
        formData.wallValue,
        formData.startTime,
        formData.endTime,
        formData.province,
        formData.width,
        formData.depth,
    ]);

    // qFloor
    useEffect(() => {
        if (
            formData.width !== 0 &&
            formData.depth !== 0 &&
            (formData.buildingType === "Single" ||
                (formData.buildingType === "Multi" && formData.roomPosition === "Bottom"))
        ) {
            const climatedt = getClimateData(climateData, formData.province);

            if (!climatedt) return;

            const qFloor =
                formData.width *
                formData.depth *
                formData.floorValue.uFloor *
                (Number(climatedt.DB_OutMax) - 2.78 - Number(climatedt.DB_In));

            // console.log("qFloor: ", qFloor)

            setFormData((prev) => {
                if (prev.floorValue.qFloor === qFloor) {
                    return prev;
                }
                return {
                    ...prev,
                    floorValue: {
                        ...prev.floorValue,
                        qFloor,
                    },
                };
            });
        }
    }, [
        formData.width,
        formData.depth,
        formData.buildingType,
        formData.roomPosition,
        formData.floorValue.uFloor,
        formData.province,
        climateData,
    ]);

    // qWallGlass
    useEffect(() => {
        if (
            !formData.wallValue ||
            !formData.province ||
            !formData.startTime ||
            !formData.endTime ||
            formData.width === 0 ||
            formData.depth === 0
        )
            return;

        const climatedt = getClimateData(climateData, formData.province);
        if (!climatedt) return;

        const interpolated = interpolateLMByLat(lmWallAndRoofData, Number(climatedt.Latitude));

        const updatedWallValue = formData.wallValue.map((wall) => {
            if (wall.material !== "Glass") return wall; // skip non-glass walls

            const cltdGlassData = findCLTDGlassTimeRange(CLTDGlassData, formData.startTime, formData.endTime);

            const interpolatedDirection = interpolated.filter((d) => d.Direction === wall.directionName);

            const uValueGlass = findU_SCglass(U_SCglassData, wall.glassType);

            const wallArea = wall.wallArea;

            const qWallGlassByMonth = interpolatedDirection.map((lmRow) => {
                const month = lmRow.Month;

                const CLTDTime = cltdGlassData.map((ucltRow) => {
                    const CLTDs =
                        Number(ucltRow.CLTD) + (25.5 - Number(climatedt.DB_In)) + (Number(climatedt.T_o) - 29.4);

                    const qWallGlass = CLTDs * Number(uValueGlass?.Uglass) * wallArea;

                    return {
                        Hour: ucltRow.Hour,
                        qWallGlass,
                    };
                });

                return { Month: month, CLTDTime };
            });

            return {
                ...wall,
                qWallGlassByMonth,
            };
        });

        const isChanged = JSON.stringify(updatedWallValue) !== JSON.stringify(formData.wallValue);
        if (isChanged) {
            setFormData((prev) => ({
                ...prev,
                wallValue: updatedWallValue,
            }));
        }
    }, [
        formData.wallValue,
        formData.startTime,
        formData.endTime,
        formData.province,
        formData.width,
        formData.depth,
        climateData,
        lmWallAndRoofData,
        U_SCglassData,
        CLTDGlassData,
    ]);

    // qDoorGlass
    useEffect(() => {
        if (!formData.doorValue || !formData.startTime || !formData.endTime || !formData.province) return;

        const climatedt = getClimateData(climateData, formData.province);
        if (!climatedt) return;

        const interpolated = interpolateLMByLat(lmWallAndRoofData, Number(climatedt.Latitude));

        const updatedDoorValue = formData.doorValue.map((door) => {
            if (door.material !== "Glass") return door;

            const cltdGlassData = findCLTDGlassTimeRange(CLTDGlassData, formData.startTime, formData.endTime);
            const interpolatedDirection = interpolated.filter((d) => d.Direction === door.directionName);
            const uValueGlass = findU_SCglass(U_SCglassData, door.glassType);
            const doorArea = door.doorArea;

            const qDoorGlassByMonth = interpolatedDirection.map((lmRow) => {
                const month = lmRow.Month;
                const CLTDTime = cltdGlassData.map((ucltRow) => {
                    const CLTDs =
                        Number(ucltRow.CLTD) + (25.5 - Number(climatedt.DB_In)) + (Number(climatedt.T_o) - 29.4);

                    return {
                        Hour: ucltRow.Hour,
                        qDoorGlass: CLTDs * Number(uValueGlass?.Uglass) * doorArea,
                    };
                });
                return { Month: month, CLTDTime };
            });

            return {
                ...door,
                qDoorGlassByMonth,
            };
        });

        // update state เฉพาะถ้ามีการเปลี่ยนแปลงจริง
        if (JSON.stringify(updatedDoorValue) !== JSON.stringify(formData.doorValue)) {
            setFormData((prev) => ({
                ...prev,
                doorValue: updatedDoorValue,
            }));
        }
    }, [
        formData.doorValue,
        formData.startTime,
        formData.endTime,
        formData.province,
        CLTDGlassData,
        climateData,
        lmWallAndRoofData,
        U_SCglassData,
    ]);

    // qWindowGlass
    useEffect(() => {
        if (!formData.windowValue || !formData.startTime || !formData.endTime || !formData.province) return;

        const climatedt = getClimateData(climateData, formData.province);
        if (!climatedt) return;

        const interpolated = interpolateLMByLat(lmWallAndRoofData, Number(climatedt.Latitude));

        const updatedWindowValue = formData.windowValue.map((window) => {
            if (window.material !== "Glass") return window;

            const cltdGlassData = findCLTDGlassTimeRange(CLTDGlassData, formData.startTime, formData.endTime);
            const interpolatedDirection = interpolated.filter((d) => d.Direction === window.directionName);
            const uValueGlass = findU_SCglass(U_SCglassData, window.glassType);
            const windowArea = window.windowArea;

            const qWindowGlassByMonth = interpolatedDirection.map((lmRow) => {
                const month = lmRow.Month;
                const CLTDTime = cltdGlassData.map((ucltRow) => {
                    const CLTDs =
                        Number(ucltRow.CLTD) + (25.5 - Number(climatedt.DB_In)) + (Number(climatedt.T_o) - 29.4);

                    return {
                        Hour: ucltRow.Hour,
                        qWindowGlass: CLTDs * Number(uValueGlass?.Uglass) * windowArea,
                    };
                });
                return { Month: month, CLTDTime };
            });

            return {
                ...window,
                qWindowGlassByMonth,
            };
        });

        if (JSON.stringify(updatedWindowValue) !== JSON.stringify(formData.windowValue)) {
            setFormData((prev) => ({
                ...prev,
                windowValue: updatedWindowValue,
            }));
        }
    }, [
        formData.windowValue,
        formData.startTime,
        formData.endTime,
        formData.province,
        CLTDGlassData,
        climateData,
        lmWallAndRoofData,
        U_SCglassData,
    ]);

    // qSolarWallGlass
    useEffect(() => {
        if (
            !formData.windowValue ||
            !formData.wallValue ||
            !formData.doorValue ||
            !formData.startTime ||
            !formData.endTime ||
            !formData.province ||
            formData.width === 0 ||
            formData.depth === 0
        )
            return;

        const climatedt = getClimateData(climateData, formData.province);
        if (!climatedt) return;

        const updatedWallValue = formData.wallValue.map((wall) => {
            if (wall.material !== "Glass") return wall;

            let CLFGlassData = [];
            let SHGFGlassDataAllMonth = [];

            if (wall.haveShade) {
                SHGFGlassDataAllMonth = findSHGFtoShade(SHGFtoShadeData, wall.directionName);
            } else {
                SHGFGlassDataAllMonth = interpolateSHGFNoShadeByLat(
                    SHGFNoShadeData,
                    Number(climatedt.Latitude),
                    wall.directionName
                );
            }

            const monthsInRange = ["Apr", "May", "Jun", "Jul", "Aug"];
            const filteredSHGFGlassData = SHGFGlassDataAllMonth.filter((d) => monthsInRange.includes(d.Month));

            if (wall.haveCurtain) {
                CLFGlassData = findGlassCLFwithShadingTimeRange(
                    glassCLFwithShadingData,
                    wall.directionName,
                    formData.startTime,
                    formData.endTime
                );
            } else {
                CLFGlassData = findGlassCLFnoShadingTimeRange(
                    glassCLFnoShadingData,
                    wall.directionName,
                    formData.startTime,
                    formData.endTime
                );
            }

            const uValueGlass = findU_SCglass(U_SCglassData, wall.glassType);
            const wallArea = wall.wallArea;

            const qSolarWallGlassByMonth = filteredSHGFGlassData.map((shgfRow) => {
                const QSolarTime = CLFGlassData.map((clfgRow) => ({
                    Hour: clfgRow.Hour,
                    qSolarWallGlass: Number(clfgRow.CLF) * wallArea * Number(shgfRow.SHGF) * Number(uValueGlass?.SC),
                }));

                return {
                    Month: shgfRow.Month,
                    QSolarTime,
                };
            });

            return {
                ...wall,
                qSolarWallGlassByMonth,
            };
        });

        if (JSON.stringify(updatedWallValue) !== JSON.stringify(formData.wallValue)) {
            setFormData((prev) => ({ ...prev, wallValue: updatedWallValue }));
        }
    }, [
        formData.windowValue,
        formData.wallValue,
        formData.doorValue,
        formData.startTime,
        formData.endTime,
        formData.province,
        formData.width,
        formData.depth,
        SHGFtoShadeData,
        SHGFNoShadeData,
        glassCLFwithShadingData,
        glassCLFnoShadingData,
        U_SCglassData,
        climateData,
    ]);

    // qSolarDoorGlass
    useEffect(() => {
        if (!formData.doorValue || !formData.startTime || !formData.endTime || !formData.province) return;

        const climatedt = getClimateData(climateData, formData.province);
        if (!climatedt) return;

        const updatedDoorValue = formData.doorValue.map((door) => {
            if (door.material !== "Glass") return door;

            let CLFGlassData = [];
            let SHGFGlassDataAllMonth = [];

            if (door.haveShade) {
                SHGFGlassDataAllMonth = findSHGFtoShade(SHGFtoShadeData, door.directionName);
            } else {
                SHGFGlassDataAllMonth = interpolateSHGFNoShadeByLat(
                    SHGFNoShadeData,
                    Number(climatedt.Latitude),
                    door.directionName
                );
            }

            const monthsInRange = ["Apr", "May", "Jun", "Jul", "Aug"];
            const filteredSHGFGlassData = SHGFGlassDataAllMonth.filter((d) => monthsInRange.includes(d.Month));

            if (door.haveCurtain) {
                CLFGlassData = findGlassCLFwithShadingTimeRange(
                    glassCLFwithShadingData,
                    door.directionName,
                    formData.startTime,
                    formData.endTime
                );
            } else {
                CLFGlassData = findGlassCLFnoShadingTimeRange(
                    glassCLFnoShadingData,
                    door.directionName,
                    formData.startTime,
                    formData.endTime
                );
            }

            const uValueGlass = findU_SCglass(U_SCglassData, door.glassType);
            const doorArea = door.doorArea;

            const qSolarDoorGlassByMonth = filteredSHGFGlassData.map((shgfRow) => ({
                Month: shgfRow.Month,
                QSolarTime: CLFGlassData.map((clfgRow) => ({
                    Hour: clfgRow.Hour,
                    qSolarDoorGlass: Number(clfgRow.CLF) * doorArea * Number(shgfRow.SHGF) * Number(uValueGlass?.SC),
                })),
            }));

            return {
                ...door,
                qSolarDoorGlassByMonth,
            };
        });

        if (JSON.stringify(updatedDoorValue) !== JSON.stringify(formData.doorValue)) {
            setFormData((prev) => ({ ...prev, doorValue: updatedDoorValue }));
        }
    }, [
        formData.doorValue,
        formData.startTime,
        formData.endTime,
        formData.province,
        SHGFtoShadeData,
        SHGFNoShadeData,
        glassCLFwithShadingData,
        glassCLFnoShadingData,
        U_SCglassData,
        climateData,
    ]);

    // qSolarWindowGlass
    useEffect(() => {
        if (!formData.windowValue || !formData.startTime || !formData.endTime || !formData.province) return;

        const climatedt = getClimateData(climateData, formData.province);
        if (!climatedt) return;

        const updatedWindowValue = formData.windowValue.map((window) => {
            if (window.material !== "Glass") return window;

            let CLFGlassData = [];
            let SHGFGlassDataAllMonth = [];

            if (window.haveShade) {
                SHGFGlassDataAllMonth = findSHGFtoShade(SHGFtoShadeData, window.directionName);
            } else {
                SHGFGlassDataAllMonth = interpolateSHGFNoShadeByLat(
                    SHGFNoShadeData,
                    Number(climatedt.Latitude),
                    window.directionName
                );
            }

            const monthsInRange = ["Apr", "May", "Jun", "Jul", "Aug"];
            const filteredSHGFGlassData = SHGFGlassDataAllMonth.filter((d) => monthsInRange.includes(d.Month));

            if (window.haveCurtain) {
                CLFGlassData = findGlassCLFwithShadingTimeRange(
                    glassCLFwithShadingData,
                    window.directionName,
                    formData.startTime,
                    formData.endTime
                );
            } else {
                CLFGlassData = findGlassCLFnoShadingTimeRange(
                    glassCLFnoShadingData,
                    window.directionName,
                    formData.startTime,
                    formData.endTime
                );
            }

            const uValueGlass = findU_SCglass(U_SCglassData, window.glassType);
            const windowArea = window.windowArea;

            const qSolarWindowGlassByMonth = filteredSHGFGlassData.map((shgfRow) => ({
                Month: shgfRow.Month,
                QSolarTime: CLFGlassData.map((clfgRow) => ({
                    Hour: clfgRow.Hour,
                    qSolarWindowGlass:
                        Number(clfgRow.CLF) * windowArea * Number(shgfRow.SHGF) * Number(uValueGlass?.SC),
                })),
            }));

            return {
                ...window,
                qSolarWindowGlassByMonth,
            };
        });

        if (JSON.stringify(updatedWindowValue) !== JSON.stringify(formData.windowValue)) {
            setFormData((prev) => ({ ...prev, windowValue: updatedWindowValue }));
        }
    }, [
        formData.windowValue,
        formData.startTime,
        formData.endTime,
        formData.province,
        SHGFtoShadeData,
        SHGFNoShadeData,
        glassCLFwithShadingData,
        glassCLFnoShadingData,
        U_SCglassData,
        climateData,
    ]);

    // qIn
    useEffect(() => {
        if (true) {
            const climatedt = getClimateData(climateData, formData.province);

            const updatedNoAirDirectionValue = formData.noAirDirectionValue.map((item) => {
                // หา U-value
                let uIn;

                if (item.directionName !== "Bottom" && item.directionName !== "Top") {
                    uIn = getUCLTDWallData(UCLTDWallData, item.material);
                } else {
                    uIn = findUfloorIn(
                        UfloorInData,
                        item.haveInsulation ? "WithInsulation" : "NoInsulation",
                        item.haveCeiling ? "WithCeiling" : "NoCeiling"
                    );
                }

                // คำนวณพื้นที่
                let area = 0;
                if (item.position === "Width" && item.directionName !== "Top" && item.directionName !== "Bottom") {
                    area = formData.width * formData.height;
                } else if (
                    item.position === "Depth" &&
                    item.directionName !== "Top" &&
                    item.directionName !== "Bottom"
                ) {
                    area = formData.depth * formData.height;
                } else {
                    area = formData.width * formData.depth;
                }

                // คำนวณ qIn
                const qIn =
                    Number(uIn?.Uvalue) * area * (Number(climatedt?.DB_OutMax) - 2.78 - Number(climatedt?.DB_In));

                return {
                    ...item,
                    qIn,
                };
            });

            setFormData((prev) => {
                if (JSON.stringify(prev.noAirDirectionValue) === JSON.stringify(updatedNoAirDirectionValue)) {
                    return prev;
                }

                return {
                    ...prev,
                    noAirDirectionValue: updatedNoAirDirectionValue,
                };
            });
        }
    }, [
        formData.noAirDirectionValue,
        formData.width,
        formData.depth,
        formData.height,
        formData.province,
        UCLTDWallData,
        UfloorInData,
        climateData,
    ]);

    useEffect(() => {
        if (formData.doorValue.length > 0 && formData.windowValue.length > 0 && formData.wallValue.length > 0) {
            const combinedWall = combineGlassData(formData.wallValue, formData.doorValue, formData.windowValue);

            if (JSON.stringify(combinedWall) !== JSON.stringify(formData.wallValue)) {
                setFormData((prev) => ({
                    ...prev,
                    wallValue: combinedWall,
                }));
            }
        }
    }, [formData.doorValue, formData.windowValue, formData.wallValue]);

    function combineGlassData(wallValue: WallValue[], doorValue: DoorValue[], windowValue: WindowValue[]) {
        return wallValue.map((wall) => {
            const direction = wall.directionName;
            const door = doorValue.find((d) => d.directionName === direction);
            const window = windowValue.find((w) => w.directionName === direction);

            // สร้าง union ของเดือนทั้งหมด
            const monthsSet = new Set<string>();
            (wall.qWallGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));
            (door?.qDoorGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));
            (window?.qWindowGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));
            (wall.qSolarWallGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));
            (door?.qSolarDoorGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));
            (window?.qSolarWindowGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));

            const months = Array.from(monthsSet);

            // รวม qGlassByMonth
            const qGlassByMonth = months.map((month) => {
                const wallMonth = (wall.qWallGlassByMonth || []).find((m) => m.Month === month);
                const doorMonth = (door?.qDoorGlassByMonth || []).find((m) => m.Month === month);
                const windowMonth = (window?.qWindowGlassByMonth || []).find((m) => m.Month === month);

                // หา max length ของ Hour array
                const length = Math.max(
                    wallMonth?.CLTDTime?.length || 0,
                    doorMonth?.CLTDTime?.length || 0,
                    windowMonth?.CLTDTime?.length || 0
                );

                const combinedCLTDTime: HourData[] = Array.from({ length }, (_, idx) => ({
                    Hour:
                        wallMonth?.CLTDTime[idx]?.Hour ??
                        doorMonth?.CLTDTime[idx]?.Hour ??
                        windowMonth?.CLTDTime[idx]?.Hour ??
                        String(idx + 1), // fallback hour
                    qGlass:
                        (wallMonth?.CLTDTime[idx]?.qWallGlass || 0) +
                        (doorMonth?.CLTDTime[idx]?.qDoorGlass || 0) +
                        (windowMonth?.CLTDTime[idx]?.qWindowGlass || 0),
                }));

                return { Month: month, CLTDTime: combinedCLTDTime };
            });

            // รวม qSolarGlassByMonth
            const qSolarGlassByMonth = months.map((month) => {
                const wallMonth = (wall.qSolarWallGlassByMonth || []).find((m) => m.Month === month);
                const doorMonth = (door?.qSolarDoorGlassByMonth || []).find((m) => m.Month === month);
                const windowMonth = (window?.qSolarWindowGlassByMonth || []).find((m) => m.Month === month);

                const length = Math.max(
                    wallMonth?.QSolarTime?.length || 0,
                    doorMonth?.QSolarTime?.length || 0,
                    windowMonth?.QSolarTime?.length || 0
                );

                const combinedQSolarTime: HourData[] = Array.from({ length }, (_, idx) => ({
                    Hour:
                        wallMonth?.QSolarTime[idx]?.Hour ??
                        doorMonth?.QSolarTime[idx]?.Hour ??
                        windowMonth?.QSolarTime[idx]?.Hour ??
                        String(idx + 1),
                    qSolarGlass:
                        (wallMonth?.QSolarTime[idx]?.qSolarWallGlass || 0) +
                        (doorMonth?.QSolarTime[idx]?.qSolarDoorGlass || 0) +
                        (windowMonth?.QSolarTime[idx]?.qSolarWindowGlass || 0),
                }));

                return { Month: month, QSolarTime: combinedQSolarTime };
            });

            return { ...wall, qGlassByMonth, qSolarGlassByMonth };
        });
    }

    function calculateTotalGlass(formData: FormDataProps) {
        const wallValues = formData.wallValue;

        // union ของทุกเดือน
        const monthsSet = new Set<string>();
        wallValues.forEach((wall) => {
            (wall.qGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));
        });
        const months = Array.from(monthsSet);

        // รวมทุก directionName
        const totalQGlassByMonth = months.map((month) => {
            // หา max length ของ Hour array
            const maxHourLength = Math.max(
                ...wallValues.map((wall) => {
                    const monthData = (wall.qGlassByMonth || []).find((m) => m.Month === month);
                    return monthData?.CLTDTime?.length || 0;
                }),
                0
            );

            const CLTDTime = Array.from({ length: maxHourLength }, (_, idx) => {
                const Hour =
                    wallValues
                        .map((wall) => {
                            const monthData = (wall.qGlassByMonth || []).find((m) => m.Month === month);
                            return monthData?.CLTDTime[idx]?.Hour;
                        })
                        .find(Boolean) || String(idx + 1);

                const qGlass = wallValues.reduce((sum, wall) => {
                    const monthData = (wall.qGlassByMonth || []).find((m) => m.Month === month);
                    const hourVal = monthData?.CLTDTime[idx]?.qGlass || 0;
                    return sum + hourVal;
                }, 0);

                return { Hour, qGlass };
            });

            return { Month: month, CLTDTime };
        });

        const totalQSolarByMonth = months.map((month) => {
            const maxHourLength = Math.max(
                ...wallValues.map((wall) => {
                    const monthData = (wall.qSolarGlassByMonth || []).find((m) => m.Month === month);
                    return monthData?.QSolarTime?.length || 0;
                }),
                0
            );

            const QSolarTime = Array.from({ length: maxHourLength }, (_, idx) => {
                const Hour =
                    wallValues
                        .map((wall) => {
                            const monthData = (wall.qSolarGlassByMonth || []).find((m) => m.Month === month);
                            return monthData?.QSolarTime[idx]?.Hour;
                        })
                        .find(Boolean) || String(idx + 1);

                const qSolarGlass = wallValues.reduce((sum, wall) => {
                    const monthData = (wall.qSolarGlassByMonth || []).find((m) => m.Month === month);
                    const hourVal = monthData?.QSolarTime[idx]?.qSolarGlass || 0;
                    return sum + hourVal;
                }, 0);

                return { Hour, qSolarGlass };
            });

            return { Month: month, QSolarTime };
        });

        return { totalQGlassByMonth, totalQSolarByMonth };
    }

    function calculateTotalWall(formData: FormDataProps) {
        const wallValues = formData.wallValue;

        // union ของทุกเดือนจาก qWallByMonth
        const monthsSet = new Set<string>();
        wallValues.forEach((wall) => {
            (wall.qWallByMonth || []).forEach((m) => monthsSet.add(m.Month));
        });
        const months = Array.from(monthsSet);

        // รวม qWall
        const totalQWallByMonth = months.map((month) => {
            const maxHourLength = Math.max(
                ...wallValues.map((wall) => {
                    const monthData = (wall.qWallByMonth || []).find((m) => m.Month === month);
                    return monthData?.CLTDTime?.length || 0;
                }),
                0
            );

            const CLTDTime = Array.from({ length: maxHourLength }, (_, idx) => {
                const Hour =
                    wallValues
                        .map((wall) => {
                            const monthData = (wall.qWallByMonth || []).find((m) => m.Month === month);
                            return monthData?.CLTDTime[idx]?.Hour;
                        })
                        .find(Boolean) || String(idx + 1);

                const qWall = wallValues.reduce((sum, wall) => {
                    const monthData = (wall.qWallByMonth || []).find((m) => m.Month === month);
                    const hourVal = monthData?.CLTDTime[idx]?.qWall || 0;
                    return sum + hourVal;
                }, 0);

                return { Hour, qWall };
            });

            return { Month: month, CLTDTime };
        });

        return { totalQWallByMonth };
    }

    function calculateTotalLoad(
        roofValue: { qRoofByMonth: any[] },
        totalQWallByMonth: any[],
        totalQGlassByMonth: any[],
        totalQSolarByMonth: any[]
    ) {
        // รวมเดือนจากทุกค่า
        const monthsSet = new Set<string>();
        (roofValue.qRoofByMonth || []).forEach((m) => monthsSet.add(m.Month));
        (totalQWallByMonth || []).forEach((m) => monthsSet.add(m.Month));
        (totalQGlassByMonth || []).forEach((m) => monthsSet.add(m.Month));
        (totalQSolarByMonth || []).forEach((m) => monthsSet.add(m.Month));
        const months = Array.from(monthsSet);

        let maxRecord: {
            Month: string;
            Hour: string;
            qTotal: number;
            qRoof: number;
            qWall: number;
            qGlass: number;
            qSolarGlass: number;
        } | null = null;

        const totalQLoadByMonth = months.map((month) => {
            // หา maxHourLength ของทุก source
            const maxHourLength = Math.max(
                roofValue.qRoofByMonth.find((m) => m.Month === month)?.CLTDTime?.length || 0,
                totalQWallByMonth.find((m) => m.Month === month)?.CLTDTime?.length || 0,
                totalQGlassByMonth.find((m) => m.Month === month)?.CLTDTime?.length || 0,
                totalQSolarByMonth.find((m) => m.Month === month)?.QSolarTime?.length || 0
            );

            const CLTDTime = Array.from({ length: maxHourLength }, (_, idx) => {
                const Hour =
                    roofValue.qRoofByMonth.find((m) => m.Month === month)?.CLTDTime[idx]?.Hour ||
                    totalQWallByMonth.find((m) => m.Month === month)?.CLTDTime[idx]?.Hour ||
                    totalQGlassByMonth.find((m) => m.Month === month)?.CLTDTime[idx]?.Hour ||
                    totalQSolarByMonth.find((m) => m.Month === month)?.QSolarTime[idx]?.Hour ||
                    String(idx + 1);

                const qRoof = roofValue.qRoofByMonth.find((m) => m.Month === month)?.CLTDTime[idx]?.qRoof || 0;
                const qWall = totalQWallByMonth.find((m) => m.Month === month)?.CLTDTime[idx]?.qWall || 0;
                const qGlass = totalQGlassByMonth.find((m) => m.Month === month)?.CLTDTime[idx]?.qGlass || 0;
                const qSolarGlass =
                    totalQSolarByMonth.find((m) => m.Month === month)?.QSolarTime[idx]?.qSolarGlass || 0;

                const qTotal = qRoof + qWall + qGlass + qSolarGlass;

                // อัปเดต maxRecord
                if (!maxRecord || qTotal > maxRecord.qTotal) {
                    maxRecord = { Month: month, Hour, qTotal, qRoof, qWall, qGlass, qSolarGlass };
                }

                return { Hour, qRoof, qWall, qGlass, qSolarGlass, qTotal };
            });

            return { Month: month, CLTDTime };
        });

        return { totalQLoadByMonth, maxRecord };
    }

    function calculateTotalQIn(formData: FormDataProps) {
        const noAirDirectionValue = formData.noAirDirectionValue;

        const totalQIn = noAirDirectionValue.reduce((sum, item) => {
            return sum + (item.qIn ?? 0);
        }, 0);

        return { totalQIn };
    }

    const handleClickCalculateAll = async () => {
        const { totalQGlassByMonth, totalQSolarByMonth } = calculateTotalGlass(formData);
        const { totalQWallByMonth } = calculateTotalWall(formData);
        const { totalQLoadByMonth, maxRecord } = calculateTotalLoad(
            formData.roofValue,
            totalQWallByMonth,
            totalQGlassByMonth,
            totalQSolarByMonth
        );
        const { totalQIn } = calculateTotalQIn(formData);

        // console.log("totalQGlassByMonth: ", totalQGlassByMonth);
        // console.log("totalQSolarByMonth: ", totalQSolarByMonth);
        // console.log("totalQWallByMonth: ", totalQWallByMonth);
        // console.log("totalQLoadByMonth: ", totalQLoadByMonth);
        console.log("maxRecord: ", maxRecord);
        // console.log("totalQIn: ", totalQIn);

        setCalculateVariable((prev) => ({
            ...prev,
            totalQGlassByMonth,
            totalQSolarByMonth,
            totalQWallByMonth,
            totalQLoadByMonth,
            maxRecord: maxRecord ?? [],
            totalQIn,
        }));
    };

    const handleClickCalculateQTotalAll = async () => {
        // console.log("qLight:", calculateVariable.qLight);
        // console.log("qPeople:", calculateVariable.qPeople);
        // console.log("qEquipmentSum:", calculateVariable.qEquipmentSum);
        // console.log("qInfiltration:", calculateVariable.qInfiltration);
        // console.log("maxRecord.qTotal:", calculateVariable.maxRecord?.qTotal);
        // console.log("totalQIn:", calculateVariable.totalQIn);

        const sum =
            calculateVariable.qLight +
            calculateVariable.qPeople +
            calculateVariable.qEquipmentSum +
            calculateVariable.qInfiltration +
            (calculateVariable.maxRecord.qTotal || 0) +
            calculateVariable.totalQIn;

        console.log("qTotalAll:", sum);

        setCalculateVariable((prev) => ({
            ...prev,
            qTotalAll: sum,
        }));

        calculateVariable.wallScoreAll.map((wallScore) => {
            console.log(`Direction: ${wallScore.directionName}, totalScore: ${wallScore.wallScore?.totalScore}`)
        })
    };

    // คำนวณค่าไฟฟ้า สำหรับที่พักอาศัย (user_type = 1)
    function calcEnergyChargeResidential(E_kWh_month: number): number {
        let cost = 0.0;

        if (E_kWh_month <= 150) {
            let remaining = E_kWh_month;
            const tiers: [number, number][] = [
                [15, 2.3488],
                [10, 2.9882],
                [10, 3.2405],
                [65, 3.6237],
                [50, 3.7171],
            ];

            for (const [units, rate] of tiers) {
                const use = Math.min(remaining, units);
                cost += use * rate;
                remaining -= use;
                if (remaining <= 0) break;
            }
        } else {
            let remaining = E_kWh_month;
            const tiers: [number, number][] = [
                [150, 3.2484],
                [250, 4.2218],
            ];

            for (const [units, rate] of tiers) {
                const use = Math.min(remaining, units);
                cost += use * rate;
                remaining -= use;
            }

            if (remaining > 0) {
                cost += remaining * 4.4217;
            }
        }

        return cost;
    }

    // คำนวณค่าไฟฟ้า สำหรับกิจการขนาดเล็ก (user_type = 2)
    function calcEnergyChargeSmallBusiness(E_kWh_month: number): number {
        let cost = 0.0;

        if (E_kWh_month <= 150) {
            let remaining = E_kWh_month;
            const tiers: [number, number][] = [
                [15, 3.2484],
                [10, 3.5984],
                [10, 3.7505],
                [65, 4.0237],
                [50, 4.1171],
            ];

            for (const [units, rate] of tiers) {
                const use = Math.min(remaining, units);
                cost += use * rate;
                remaining -= use;
                if (remaining <= 0) break;
            }
        } else {
            let remaining = E_kWh_month;

            cost += Math.min(remaining, 150) * 3.2484;
            remaining -= 150;

            cost += Math.min(remaining, 250) * 4.2218;
            remaining -= 250;

            if (remaining > 0) {
                cost += remaining * 4.4217;
            }
        }

        return cost;
    }

    const calculateElectricityCost = (btu_per_hr: number) => {
        // แปลง Watt → BTU/h
        // const btu_per_hr = calculateVariable.recommendedBTU;

        console.log("btu_per_hr: ", btu_per_hr);

        // แปลง BTU → kW ตาม SEER
        const seer = 13;
        const P_kW = btu_per_hr / (seer * 1000);

        console.log("P_kW: ", P_kW);

        // หน่วยไฟฟ้าต่อวัน
        const E_kWh_day = P_kW * (Number(formData.endTime) - Number(formData.startTime));

        // หน่วยไฟฟ้าต่อเดือน
        let work_days_per_year: number = 0;
        if (
            selectedOption.buildingType === "Home" ||
            (selectedOption.buildingType === "Commercial" && selectedOption.subRoom !== "Office")
        ) {
            work_days_per_year = 365;
        } else {
            work_days_per_year = 250;
        }
        const E_kWh_month = E_kWh_day * (work_days_per_year / 12);

        let user_type: number = 0;
        if (selectedOption.buildingType === "Home") {
            user_type = 1;
        } else if (selectedOption.businessSize === "Small") {
            user_type = 2;
        } else if (selectedOption.businessSize === "Large") {
            user_type = 3;
        }

        console.log("user_type: ", user_type)
        let base_cost: number = 0;
        if (user_type === 1) {
            console.log("use calculate type 1")
            base_cost = calcEnergyChargeResidential(E_kWh_month);
        } else if (user_type === 2) {
            console.log("use calculate type 1")
            base_cost = calcEnergyChargeSmallBusiness(E_kWh_month);
        } else if (user_type === 3) {
            console.log("use calculate type 1")
            // กิจการขนาดกลาง: ค่าไฟพื้นฐาน + Demand Charge
            base_cost = E_kWh_month * 3.1097;
            // const demand_charge = P_kW * 221.5; // บาทต่อกิโลวัตต์
            // base_cost += demand_charge;
        }

        // Ft 20%
        const Ft_total = 0.2 * E_kWh_month;

        // VAT 7%
        const vat = 0.07 * (base_cost + Ft_total);

        // รวมทั้งหมด
        const monthly_cost = base_cost + Ft_total + vat;
        const yearly_cost = monthly_cost * 12;

        return {
            E_kWh_day,
            E_kWh_month,
            monthly_cost,
            yearly_cost,
            base_cost,
            vat,
            Ft_total
        };
    };

    useEffect(() => {
        if (tabValue === "five") {
            handleClickCalculateAll()
        }
    }, [tabValue])

    useEffect(() => {
        handleClickCalculateQTotalAll()
    }, [calculateVariable.maxRecord])

    // Recommended BTU
    useEffect(() => {
        const targetBTU = calculateVariable.qTotalAll * 3.412;
        const result = getClosestBTUAirData(BTUAirData, selectedOption.selectedAirConditionerType || "", targetBTU);
        setCalculateVariable((prev) => ({
            ...prev,
            recommendedBTU: Number(result?.BTU),
        }));

        console.log("targetBTU: ", targetBTU)
        console.log("result: ", result)
    }, [BTUAirData, calculateVariable.qTotalAll]);

    // Cost
    useEffect(() => {
        const electricityCost = calculateElectricityCost(calculateVariable.recommendedBTU);
        console.log("Cost: ", electricityCost);

        setCalculateVariable((prev) => ({
            ...prev,
            electricityCost: electricityCost,
        }));
    }, [calculateVariable.recommendedBTU, selectedOption.businessSize])

    // const steps = ["one", "two", "three", "four", "five"];

    // const handleClickNext = () => {
    //     const currentIndex = steps.indexOf(tabValue);
    //     const value = steps[currentIndex + (selectedOption.selectedAirConditionerType !== "Cassette Type" ? 1 : 2)]
    //     if (currentIndex < steps.length - 1) {
    //         setTabValue(value);
    //     }
    // };

    // const handleClickPrev = () => {
    //     const currentIndex = steps.indexOf(tabValue);
    //     const value = steps[currentIndex - (selectedOption.selectedAirConditionerType !== "Cassette Type" ? 1 : 2)]
    //     if (currentIndex > 0) {
    //         setTabValue(value);
    //     }
    // };

    const airConditionerTypes = [
        {
            id: 1,
            title: "Wall Type",
            image: "/images/option/wall_type.png",
            description: "หลีกเลี่ยงการติดตั้งเหนือบานประตูและฝั่งตรงข้ามประตู หลีกเลี่ยงการติดใกล้หน้าต่างที่รับแสงแดดโดยตรง ควรติดตั้งห่างจากฝ้าเพดานและผนังด้านข้างผนังอย่างน้อย 10 ซม. ด้านหน้าตัวเครื่องควรโล่งอย่างน้อย 1.5–2 ม."
        },
        {
            id: 2,
            title: "Ceiling Suspended Type",
            image: "/images/option/ceiling_suspended_type.png",
            description: "หลีกเลี่ยงการติดตั้งเหนือบานประตูและฝั่งตรงข้ามประตู หลีกเลี่ยงติดใกล้หน้าต่างที่รับแสงแดดโดยตรง ควรติดตั้งห่างจากฝ้าเพดานอย่างน้อย 10 ซม. ควรเว้นห่างจากผนังด้านข้างอย่างน้อย 30 ซม. ด้านหน้าตัวเครื่องควรโล่งอย่างน้อย 1.5–2 ม."
        },
        {
            id: 3,
            title: "Cassette Type",
            image: "/images/option/cassette_type.png",
            description: "Cassette Type	ด้านข้างควรห่างจากผนังหรือสิ่งกีดขวางอย่างน้อย 0.5 ม. [หลีกเลี่ยงการติดตั้งใกล้คานหรือจุดที่บังทิศทางลม]"
        },
    ];

    const airConditionerTypeImageShow = [
        { id: 1, title: "Wall Type", image: "./images/option/wall_type_show.png" },
        {
            id: 2,
            title: "Ceiling Suspended Type",
            image: "/images/option/ceiling_suspended_type_show.png",
        },
        { id: 3, title: "Cassette Type", image: "/images/option/cassette_type_show.png" },
    ];

    const directions = [
        { label: "ทิศเหนือ (N)", value: "N" },
        { label: "ทิศตะวันออกเฉียงเหนือ (NE)", value: "NE" },
        { label: "ทิศตะวันออก (E)", value: "E" },
        { label: "ทิศตะวันออกเฉียงใต้ (SE)", value: "SE" },
        { label: "ทิศใต้ (S)", value: "S" },
        { label: "ทิศตะวันตกเฉียงใต้ (SW)", value: "SW" },
        { label: "ทิศตะวันตก (W)", value: "W" },
        { label: "ทิศตะวันตกเฉียงเหนือ (NW)", value: "NW" },
        { label: "ไม่มี", value: "None" },
    ];

    const roomSides = [
        { label: "ทิศเหนือ (N)", value: "N" },
        { label: "ทิศตะวันออกเฉียงเหนือ (NE)", value: "NE" },
        { label: "ทิศตะวันออก (E)", value: "E" },
        { label: "ทิศตะวันออกเฉียงใต้ (SE)", value: "SE" },
        { label: "ทิศใต้ (S)", value: "S" },
        { label: "ทิศตะวันตกเฉียงใต้ (SW)", value: "SW" },
        { label: "ทิศตะวันตก (W)", value: "W" },
        { label: "ทิศตะวันตกเฉียงเหนือ (NW)", value: "NW" },
        { label: "ด้านบน (เพดาน)", value: "Top" },
        { label: "ด้านล่าง (พื้น)", value: "Bottom" },
        { label: "ไม่มี", value: "None" },
    ];

    const hourOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = (i + 1).toString();
        return {
            value: hour,
            label: `${hour.padStart(2, "0")}:00 น.`,
        };
    });

    const filterAirConditionerTypes = airConditionerTypes.filter((ac) => {
        let ceilingHeight = ""; // "Low", "Middle", "High", "OverHigh"

        if (formData.height >= 4) {
            ceilingHeight = "OverHigh"
        } else if (formData.height > 3) {
            ceilingHeight = "High"
        } else if (formData.height > 2.5) {
            ceilingHeight = "Middle"
        } else {
            ceilingHeight = "Low"
        }

        const ceilingSlot = formData.ceiling; // "HaveCeilinggreaterthan", "HaveCeilinglessthan", "NoCeiling"

        switch (ac.title) {
            case "Wall Type":
                // Wall Type: เพดาน ต่ำ หรือ กลาง
                return ceilingHeight === "Low" || ceilingHeight === "Middle";

            case "Ceiling Suspended Type":
                // Ceiling Suspended: เพดาน กลาง, สูง, สูงมาก
                return ceilingHeight === "Middle" || ceilingHeight === "High" || ceilingHeight === "OverHigh";

            case "Cassette Type":
                // Cassette: เพดาน กลาง หรือ สูง และช่องฝ้า >30 cm
                const hasEnoughSlot = ceilingSlot === "HaveCeilinggreaterthan";
                return (ceilingHeight === "Middle" || ceilingHeight === "High") && hasEnoughSlot;

            default:
                return false;
        }
    });

    const sortedTotalScore = [...calculateVariable.wallScoreAll].sort(
        (a, b) => (b?.wallScore?.totalScore ?? 0) - (a?.wallScore?.totalScore ?? 0)
    );

    const onSubmit = (data: FormDataErrorProps) => {
        console.log("Form Data:", data);
    };

    return (
        <Box className="main-page-container">
            {/* <Button onClick={handleClickCalculateAll}>Calculate</Button>
            <Button onClick={handleClickCalculateQTotalAll}>Calculate All</Button> */}
            <Box
                width={"100%"}
                padding={"5rem 2rem"}
                spaceY={4}
                backgroundImage={`url('${BASE_URL}/images/background/main_title.png')`}
                textAlign={"center"}
                color={"#FFF"}
            >
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
                        {
                            selectedOption.selectedAirConditionerType !== "Cassette Type" &&
                            <Tabs.Trigger value="four" transition={"all ease 0.5s"}>
                                <MapPin />
                                ตำแหน่งติดตั้ง
                            </Tabs.Trigger>
                        }
                        <Tabs.Trigger value="five" transition={"all ease 0.5s"}>
                            <FileText />
                            แสดงผล
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value={"one"}>
                        <BuildingSelector onChange={setSelectedOption} />
                        <Collapse in={!(selectedOption.buildingType === null || selectedOption.subRoom === null)} timeout={400} unmountOnExit>
                            <Flex width={"100%"} justifyContent={"end"}>
                                <Button type="submit" width={100} backgroundColor={"#003475"} fontSize={20} onClick={() => setTabValue("two")}>
                                    Next
                                </Button>
                            </Flex>
                        </Collapse>
                    </Tabs.Content>
                    <Tabs.Content value={"two"}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box>
                                <Heading size={"2xl"} color={"#003475"}>
                                    กรอกข้อมูลอาคาร
                                </Heading>

                                <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={10} padding={"1.4rem 2rem "}>
                                    <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} colSpan={2}>
                                        <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={5}>
                                            <GridItem colSpan={2}>
                                                <Field.Root>
                                                    <Field.Label>จังหวัด (Province)</Field.Label>
                                                    <Controller
                                                        name="province"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกจังหวัด" }}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth error={!!errors.province}>
                                                                <Select
                                                                    {...field}
                                                                    displayEmpty
                                                                    onChange={(e) => {
                                                                        field.onChange(e); // อัปเดต react-hook-form
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            province: e.target.value, // อัปเดต state เดิมด้วย
                                                                        }));
                                                                    }}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>เลือกจังหวัด</em>
                                                                    </MenuItem>
                                                                    {climateData.map((item, index) => (
                                                                        <MenuItem key={index} value={item.Province}>
                                                                            {provinceLabelMap[item.Province]}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {errors.province && (
                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                        {errors.province.message}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Field.Root>
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
                                                                    <Controller
                                                                        name="width"
                                                                        control={control}
                                                                        rules={{
                                                                            required: "กรุณากรอกความกว้างของห้อง",
                                                                            min: { value: 0, message: "ต้องมากกว่า 0" },
                                                                        }}
                                                                        render={({ field, fieldState }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                fullWidth
                                                                                type="number"
                                                                                value={field.value ?? ""}
                                                                                onChange={(e) => {
                                                                                    const newValue = Number(e.target.value);
                                                                                    field.onChange(newValue); // อัปเดต react-hook-form
                                                                                    setFormData((prev) => ({ ...prev, width: newValue })); // อัปเดต state เดิม
                                                                                }}
                                                                                error={!!fieldState.error}
                                                                                helperText={fieldState.error?.message}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <Controller
                                                                        name="depth"
                                                                        control={control}
                                                                        rules={{
                                                                            required: "กรุณากรอกความยาวของห้อง",
                                                                            min: { value: 0, message: "ต้องมากกว่า 0" },
                                                                            validate: (value) => {
                                                                                if (value < formData.width) {
                                                                                    return "ความลึกต้องไม่น้อยกว่าความกว้าง";
                                                                                }
                                                                                return true;
                                                                            },
                                                                        }}
                                                                        render={({ field, fieldState }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                fullWidth
                                                                                type="number"
                                                                                value={field.value ?? ""}
                                                                                onChange={(e) => {
                                                                                    const newValue = Number(e.target.value);
                                                                                    field.onChange(newValue);
                                                                                    setFormData((prev) => ({ ...prev, depth: newValue }));
                                                                                }}
                                                                                error={!!fieldState.error}
                                                                                helperText={fieldState.error?.message}
                                                                            />
                                                                        )}
                                                                    />
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <Controller
                                                                        name="height"
                                                                        control={control}
                                                                        rules={{
                                                                            required: "กรุณากรอกความสูงของห้อง",
                                                                            min: { value: 0, message: "ต้องมากกว่า 0" },
                                                                        }}
                                                                        render={({ field, fieldState }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                fullWidth
                                                                                type="number"
                                                                                value={field.value ?? ""}
                                                                                onChange={(e) => {
                                                                                    const newValue = Number(e.target.value);
                                                                                    field.onChange(newValue);
                                                                                    setFormData((prev) => ({ ...prev, height: newValue }));
                                                                                }}
                                                                                error={!!fieldState.error}
                                                                                helperText={fieldState.error?.message}
                                                                            />
                                                                        )}
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
                                                            <Controller
                                                                name="startTime"
                                                                control={control}
                                                                rules={{ required: "กรุณาเลือกเวลาเริ่มต้น" }}
                                                                render={({ field }) => (
                                                                    <FormControl fullWidth error={!!errors.startTime}>
                                                                        <Select
                                                                            {...field}
                                                                            displayEmpty
                                                                            onChange={(e) => {
                                                                                field.onChange(e); // อัปเดต react-hook-form
                                                                                setFormData((prev) => ({
                                                                                    ...prev,
                                                                                    startTime: e.target.value, // อัปเดต state เก่าด้วย
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <MenuItem value="">
                                                                                <em>เลือกเวลาเริ่มต้น</em>
                                                                            </MenuItem>
                                                                            {hourOptions.map((item, index) => (
                                                                                <MenuItem key={index} value={item.value}>
                                                                                    {item.label}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                        {errors.startTime && (
                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                {errors.startTime.message}
                                                                            </p>
                                                                        )}
                                                                    </FormControl>
                                                                )}
                                                            />
                                                        </GridItem>

                                                        {/* เวลาสิ้นสุด */}
                                                        <GridItem colSpan={1}>
                                                            <Controller
                                                                name="endTime"
                                                                control={control}
                                                                rules={{ required: "กรุณาเลือกเวลาสิ้นสุด" }}
                                                                render={({ field }) => (
                                                                    <FormControl fullWidth error={!!errors.endTime}>
                                                                        <Select
                                                                            {...field}
                                                                            displayEmpty
                                                                            onChange={(e) => {
                                                                                field.onChange(e); // อัปเดต react-hook-form
                                                                                setFormData((prev) => ({
                                                                                    ...prev,
                                                                                    endTime: e.target.value, // อัปเดต state เดิม
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <MenuItem value="">
                                                                                <em>เลือกเวลาสิ้นสุด</em>
                                                                            </MenuItem>
                                                                            {hourOptions.map((item, index) => (
                                                                                <MenuItem key={index} value={item.value}>
                                                                                    {item.label}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                        {errors.endTime && (
                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                {errors.endTime.message}
                                                                            </p>
                                                                        )}
                                                                    </FormControl>
                                                                )}
                                                            />
                                                        </GridItem>
                                                    </Grid>
                                                </Field.Root>
                                            </GridItem>

                                            <GridItem colSpan={1}>
                                                <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={5}>
                                                    <GridItem colSpan={1}>
                                                        <Field.Root>
                                                            <Field.Label>ระยะฝ้าถึงหลังคา/คาน</Field.Label>
                                                            <Controller
                                                                name="ceiling"
                                                                control={control}
                                                                rules={{ required: "กรุณาเลือกระยะฝ้าถึงหลังคา" }}
                                                                render={({ field }) => (
                                                                    <FormControl fullWidth error={!!errors.ceiling}>
                                                                        <Select
                                                                            {...field}
                                                                            displayEmpty
                                                                            onChange={(e) => {
                                                                                field.onChange(e); // อัปเดต react-hook-form
                                                                                setFormData((prev) => ({
                                                                                    ...prev,
                                                                                    ceiling: e.target.value, // อัปเดต state เดิมด้วย
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <MenuItem value="">
                                                                                <em>เลือกช่องว่างระหว่างฝ้าเพดานถึงหลังคาหรือคาน เพื่อใช้ตรวจสอบการติดตั้งแอร์แบบฝังฝ้า</em>
                                                                            </MenuItem>
                                                                            <MenuItem value="HaveCeilinglessthan">มีน้อยกว่า 30 cm</MenuItem>
                                                                            <MenuItem value="HaveCeilinggreaterthan">มีมากกว่า 30 cm</MenuItem>
                                                                            <MenuItem value="NoCeiling">ไม่มีฝ้า</MenuItem>
                                                                        </Select>
                                                                        {errors.ceiling && (
                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                {errors.ceiling.message}
                                                                            </p>
                                                                        )}
                                                                    </FormControl>
                                                                )}
                                                            />
                                                        </Field.Root>
                                                    </GridItem>
                                                    {/* <GridItem colSpan={1}>
                                                        <Field.Root>
                                                            <Field.Label>ความสูงเพดาน (จากพื้นถึงฝ้าเพดาน)</Field.Label>
                                                            <Controller
                                                                name="ceilingHeight"
                                                                control={control}
                                                                rules={{ required: "กรุณาเลือกความสูงฝ้า" }}
                                                                render={({ field }) => (
                                                                    <FormControl fullWidth error={!!errors.ceilingHeight}>
                                                                        <Select
                                                                            {...field}
                                                                            displayEmpty
                                                                            onChange={(e) => {
                                                                                field.onChange(e); // อัปเดต react-hook-form
                                                                                setFormData((prev) => ({
                                                                                    ...prev,
                                                                                    ceilingHeight: e.target.value, // อัปเดต state เก่าด้วย
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <MenuItem value="">
                                                                                <em>เลือกความสูงฝ้า</em>
                                                                            </MenuItem>
                                                                            <MenuItem value="Low">ต่ำ (2-2.5)</MenuItem>
                                                                            <MenuItem value="Middle">กลาง (2.5-3)</MenuItem>
                                                                            <MenuItem value="High">สูง (&gt;3)</MenuItem>
                                                                            <MenuItem value="OverHigh">สูงมาก (&gt;4)</MenuItem>
                                                                        </Select>
                                                                        {errors.ceilingHeight && (
                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                {errors.ceilingHeight.message}
                                                                            </p>
                                                                        )}
                                                                    </FormControl>
                                                                )}
                                                            />
                                                        </Field.Root>
                                                    </GridItem> */}
                                                </Grid>
                                            </GridItem>

                                            <GridItem colSpan={1}>
                                                <Field.Root>
                                                    <Field.Label>ลักษณะอาคาร</Field.Label>
                                                    <Controller
                                                        name="buildingType"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกลักษณะอาคาร" }}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth error={!!errors.buildingType}>
                                                                <Select
                                                                    {...field}
                                                                    displayEmpty
                                                                    onChange={(e) => {
                                                                        field.onChange(e); // อัปเดต react-hook-form
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            buildingType: e.target.value, // อัปเดต state เก่าด้วย
                                                                        }));
                                                                    }}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>เลือกประเภทอาคาร</em>
                                                                    </MenuItem>
                                                                    <MenuItem value="Single">อาคารชั้นเดียว</MenuItem>
                                                                    <MenuItem value="Multi">อาคารหลายชั้น</MenuItem>
                                                                </Select>
                                                                {errors.buildingType && (
                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                        {errors.buildingType.message}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Field.Root>
                                            </GridItem>

                                            <Collapse in={formData.buildingType === "Multi"} timeout={400} unmountOnExit>
                                                <GridItem colSpan={1}>
                                                    <Field.Root>
                                                        <Field.Label>ตำแหน่งห้อง</Field.Label>
                                                        <Controller
                                                            name="roomPosition"
                                                            control={control}
                                                            rules={{ required: "กรุณาเลือกตำแหน่งห้อง" }}
                                                            render={({ field }) => (
                                                                <FormControl fullWidth error={!!errors.roomPosition}>
                                                                    <Select
                                                                        {...field}
                                                                        displayEmpty
                                                                        onChange={(e) => {
                                                                            field.onChange(e); // อัปเดต react-hook-form
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                roomPosition: e.target.value, // อัปเดต state เดิม
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <MenuItem value="">
                                                                            <em>เลือกตำแหน่งห้อง</em>
                                                                        </MenuItem>
                                                                        <MenuItem value="Top">ชั้นบนสุด</MenuItem>
                                                                        <MenuItem value="Middle">ระหว่างชั้น</MenuItem>
                                                                        <MenuItem value="Bottom">ชั้นล่างสุด</MenuItem>
                                                                    </Select>
                                                                    {errors.roomPosition && (
                                                                        <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                            {errors.roomPosition.message}
                                                                        </p>
                                                                    )}
                                                                </FormControl>
                                                            )}
                                                        />
                                                    </Field.Root>
                                                </GridItem>
                                            </Collapse>
                                        </Grid>
                                    </GridItem>

                                    {/* Wall */}
                                    <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} colSpan={2}>
                                        <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                            <GridItem>
                                                <Field.Root>
                                                    <Field.Label>ผนัง (wall)</Field.Label>
                                                    <Field.Label>
                                                        ระบุทิศผนังภายนอกหรือผนังด้านที่ไม่อยู่ในอาคาร (เลือกได้มากกว่า1)
                                                    </Field.Label>
                                                    <Controller
                                                        name="wallValue"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกทิศผนังอย่างน้อย 1 ด้าน" }}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth error={!!errors.wallValue}>
                                                                <Select
                                                                    multiple
                                                                    displayEmpty
                                                                    input={<OutlinedInput />}
                                                                    value={formData.wallValue.map((d) => d.directionName)}
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
                                                                {errors.wallValue && (
                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                        {errors.wallValue.message}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Field.Root>
                                            </GridItem>

                                            <Collapse
                                                in={
                                                    formData.wallValue.length > 0 &&
                                                    formData.wallValue[0].directionName !== "None"
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
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        วัสดุ
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ชนิดกระจก
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        กันสาด
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ม่านบังแดด
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        สีภายนอก
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

                                                                        {/* Position */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`wallValue.${index}.position`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณาเลือกตำแหน่งที่อ้างจากขนาดห้อง" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.wallValue];
                                                                                                    updated[index] = { ...updated[index], position: e.target.value };
                                                                                                    return { ...prev, wallValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="">
                                                                                                <em>เลือกตำแหน่งที่อ้างจากขนาดห้อง</em>
                                                                                            </MenuItem>
                                                                                            <MenuItem value="Width">ด้านกว้าง</MenuItem>
                                                                                            <MenuItem value="Depth">ด้านยาว</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Material */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`wallValue.${index}.material`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณาเลือกวัสดุ" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.wallValue];
                                                                                                    updated[index] = { ...updated[index], material: e.target.value };
                                                                                                    return { ...prev, wallValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="BrickPlaster">ผนังอิฐฉาบปูน</MenuItem>
                                                                                            <MenuItem value="WallwithInsulation">ผนังมีฉนวนตรงกลาง</MenuItem>
                                                                                            <MenuItem value="Prefabricated">ผนังสำเร็จรูป</MenuItem>
                                                                                            <MenuItem value="Glass">กระจก</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Glass Type */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`wallValue.${index}.glassType`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกชนิดกระจก" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.wallValue];
                                                                                                    updated[index] = { ...updated[index], glassType: e.target.value };
                                                                                                    return { ...prev, wallValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="SingleGlazing">กระจกใสธรรมดา</MenuItem>
                                                                                            <MenuItem value="Tinted">กระจกสี</MenuItem>
                                                                                            <MenuItem value="Low-E">กระจก Low-E</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Shade */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`wallValue.${index}.haveShade`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกว่ามีกันแดดหรือไม่" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.wallValue];
                                                                                                    updated[index] = { ...updated[index], haveShade: newValue };
                                                                                                    return { ...prev, wallValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Curtain */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`wallValue.${index}.haveCurtain`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกว่ามีผ้าม่านหรือไม่" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.wallValue];
                                                                                                    updated[index] = { ...updated[index], haveCurtain: newValue };
                                                                                                    return { ...prev, wallValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* kWallColor */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`wallValue.${index}.kWallColor`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณาเลือกสีผนัง" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = Number(e.target.value);
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.wallValue];
                                                                                                    updated[index] = { ...updated[index], kWallColor: newValue };
                                                                                                    return { ...prev, wallValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value={0.65}>สีสว่าง</MenuItem>
                                                                                            <MenuItem value={1}>สีเข้ม</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
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

                                    {/* NoAirDirection */}
                                    <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} colSpan={2}>
                                        <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                            <GridItem>
                                                <Field.Root>
                                                    <Field.Label>สภาพแวดล้อมภายในอาคาร</Field.Label>
                                                    <Field.Label>
                                                        ระบุผนังด้านที่ติดกับห้องอื่นหรือโถงทางเดิน โดยผนังที่เชื่อมกับอีกห้องต้องไม่ติดตั้งเครื่องปรับอากาศ
                                                        (เลือกได้มากกว่า1)
                                                    </Field.Label>
                                                    <Controller
                                                        name="noAirDirectionValue"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกทิศทางเครื่องปรับอากาศอย่างน้อย 1 ด้าน" }}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth error={!!errors.noAirDirectionValue}>
                                                                <Select
                                                                    multiple
                                                                    displayEmpty
                                                                    input={<OutlinedInput />}
                                                                    value={formData.noAirDirectionValue.map((d) => d.directionName)}
                                                                    onChange={(e) => handleNoAirDirectionChange(e, field)}
                                                                    renderValue={(selected) => (
                                                                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                                            {selected?.map((value) => (
                                                                                <Chip key={value} label={value} />
                                                                            ))}
                                                                        </Box>
                                                                    )}
                                                                >
                                                                    {(formData.buildingType === "Multi" ? roomSides : directions).map((item, index) => (
                                                                        <MenuItem key={index} value={item.value}>
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {errors.noAirDirectionValue && (
                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                        {errors.noAirDirectionValue.message}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Field.Root>
                                            </GridItem>

                                            <Collapse
                                                in={
                                                    formData.noAirDirectionValue.length > 0 &&
                                                    formData.noAirDirectionValue[0].directionName !== "None"
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
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        วัสดุ
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ชนิดกระจก
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ฉนวนกันความร้อน
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ฝ้าเพดาน
                                                                    </Table.ColumnHeader>
                                                                </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {formData.noAirDirectionValue.map((item, index) => (
                                                                    <Table.Row key={index}>
                                                                        {/* ชื่อทิศ */}
                                                                        <Table.Cell textAlign="center">
                                                                            {roomSides.find((d) => d.value === item.directionName)?.label}
                                                                        </Table.Cell>

                                                                        {/* Position */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`noAirDirectionValue.${index}.position`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required:
                                                                                        item.directionName === "Top" || item.directionName === "Bottom"
                                                                                            ? false
                                                                                            : "กรุณาเลือกตำแหน่งที่อ้างจากขนาดห้อง",
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            disabled={item.directionName === "Top" || item.directionName === "Bottom"}
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.noAirDirectionValue];
                                                                                                    updated[index] = { ...updated[index], position: e.target.value };
                                                                                                    return { ...prev, noAirDirectionValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="">
                                                                                                <em>เลือกตำแหน่งที่อ้างจากขนาดห้อง</em>
                                                                                            </MenuItem>
                                                                                            <MenuItem value="Width">ด้านกว้าง</MenuItem>
                                                                                            <MenuItem value="Depth">ด้านยาว</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Material */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`noAirDirectionValue.${index}.material`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required:
                                                                                        item.directionName === "Top" || item.directionName === "Bottom"
                                                                                            ? false
                                                                                            : "กรุณาเลือกวัสดุ",
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            disabled={item.directionName === "Top" || item.directionName === "Bottom"}
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.noAirDirectionValue];
                                                                                                    updated[index] = { ...updated[index], material: e.target.value };
                                                                                                    return { ...prev, noAirDirectionValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="BrickPlaster">ผนังอิฐฉาบปูน</MenuItem>
                                                                                            <MenuItem value="WallwithInsulation">ผนังมีฉนวนตรงกลาง</MenuItem>
                                                                                            <MenuItem value="Prefabricated">ผนังสำเร็จรูป</MenuItem>
                                                                                            <MenuItem value="Glass">กระจก</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Glass Type */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`noAirDirectionValue.${index}.glassType`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกชนิดกระจก" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.noAirDirectionValue];
                                                                                                    updated[index] = { ...updated[index], glassType: e.target.value };
                                                                                                    return { ...prev, noAirDirectionValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="SingleGlazing">กระจกใสธรรมดา</MenuItem>
                                                                                            <MenuItem value="Tinted">กระจกสี</MenuItem>
                                                                                            <MenuItem value="Low-E">กระจก Low-E</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Insulation */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`noAirDirectionValue.${index}.haveInsulation`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required:
                                                                                        item.directionName === "Top" || item.directionName === "Bottom"
                                                                                            ? "กรุณาเลือกว่ามีฉนวนหรือไม่"
                                                                                            : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl
                                                                                        fullWidth
                                                                                        error={!!fieldState.error}
                                                                                        disabled={!(item.directionName === "Top" || item.directionName === "Bottom")}
                                                                                    >
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.noAirDirectionValue];
                                                                                                    updated[index] = { ...updated[index], haveInsulation: newValue };
                                                                                                    return { ...prev, noAirDirectionValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Ceiling */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`noAirDirectionValue.${index}.haveCeiling`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required:
                                                                                        item.directionName === "Top" || item.directionName === "Bottom"
                                                                                            ? "กรุณาเลือกว่ามีฝ้าเพดานหรือไม่"
                                                                                            : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl
                                                                                        fullWidth
                                                                                        error={!!fieldState.error}
                                                                                        disabled={!(item.directionName === "Top" || item.directionName === "Bottom")}
                                                                                    >
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.noAirDirectionValue];
                                                                                                    updated[index] = { ...updated[index], haveCeiling: newValue };
                                                                                                    return { ...prev, noAirDirectionValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
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

                                    {/* Roof */}
                                    <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                        <Grid gap={5}>
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
                                                                    สีภายนอก
                                                                </Table.ColumnHeader>
                                                            </Table.Row>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            <Table.Row>
                                                                {/* Roof Type */}
                                                                <Table.Cell>
                                                                    <Controller
                                                                        name="roofType"
                                                                        control={control}
                                                                        rules={{ required: "กรุณาเลือกประเภทหลังคา" }}
                                                                        render={({ field, fieldState }) => (
                                                                            <FormControl fullWidth error={!!fieldState.error}>
                                                                                <Select
                                                                                    {...field}
                                                                                    displayEmpty
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e.target.value); // อัปเดต react-hook-form
                                                                                        setFormData((prev) => ({
                                                                                            ...prev,
                                                                                            roofType: e.target.value, // อัปเดต state
                                                                                        }));
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="Concrete">หลังคาคอนกรีต</MenuItem>
                                                                                    <MenuItem value="ConcreteTile">หลังคากระเบื้องคอนกรีต</MenuItem>
                                                                                    <MenuItem value="MetalSheet">หลังคาเมทัลชีท</MenuItem>
                                                                                </Select>
                                                                                {fieldState.error && (
                                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                        {fieldState.error.message}
                                                                                    </p>
                                                                                )}
                                                                            </FormControl>
                                                                        )}
                                                                    />
                                                                </Table.Cell>

                                                                {/* Roof Color */}
                                                                <Table.Cell>
                                                                    <Controller
                                                                        name="kRoofColor"
                                                                        control={control}
                                                                        rules={{ required: "กรุณาเลือกสีหลังคา" }}
                                                                        render={({ field, fieldState }) => (
                                                                            <FormControl fullWidth error={!!fieldState.error}>
                                                                                <Select
                                                                                    {...field}
                                                                                    displayEmpty
                                                                                    onChange={(e) => {
                                                                                        const newValue = Number(e.target.value);
                                                                                        field.onChange(newValue); // อัปเดต react-hook-form
                                                                                        setFormData((prev) => ({
                                                                                            ...prev,
                                                                                            kRoofColor: newValue, // อัปเดต state
                                                                                        }));
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value={0.5}>สีสว่าง</MenuItem>
                                                                                    <MenuItem value={1}>สีเข้ม</MenuItem>
                                                                                </Select>
                                                                                {fieldState.error && (
                                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                        {fieldState.error.message}
                                                                                    </p>
                                                                                )}
                                                                            </FormControl>
                                                                        )}
                                                                    />
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        </Table.Body>
                                                    </Table.Root>
                                                </Field.Root>
                                            </GridItem>
                                        </Grid>
                                    </GridItem>

                                    {/* Floor */}
                                    <Collapse
                                        in={
                                            formData.buildingType === "Single" ||
                                            (formData.buildingType === "Multi" && formData.roomPosition === "Bottom")
                                        }
                                        timeout={400}
                                        unmountOnExit
                                        sx={{ width: "100%" }}
                                    >
                                        <GridItem
                                            border={"1px solid #c5c5c6"}
                                            borderRadius={10}
                                            padding={5}
                                            height={"100%"}
                                            colSpan={2}
                                        >
                                            <Grid gap={5}>
                                                <GridItem>
                                                    <Field.Root>
                                                        <Field.Label>พื้น (Floor)</Field.Label>
                                                        <Field.Label>ระบุข้อมูลพื้น</Field.Label>
                                                        <Table.Root size="sm" variant={"outline"}>
                                                            <Table.Header>
                                                                <Table.Row>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        มีฉนวนหรือไม่
                                                                    </Table.ColumnHeader>
                                                                </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                <Table.Row>
                                                                    <Table.Cell>
                                                                        <Controller
                                                                            name="floorValue.uFloor"
                                                                            control={control}
                                                                            rules={{ required: "กรุณาเลือกประเภทพื้น" }}
                                                                            render={({ field, fieldState }) => (
                                                                                <FormControl fullWidth error={!!fieldState.error}>
                                                                                    <Select
                                                                                        {...field}
                                                                                        displayEmpty
                                                                                        sx={{ width: "100%" }}
                                                                                        onChange={(e) => {
                                                                                            const newValue = Number(e.target.value);
                                                                                            field.onChange(newValue); // อัปเดต react-hook-form
                                                                                            setFormData((prev) => ({
                                                                                                ...prev,
                                                                                                floorValue: {
                                                                                                    ...prev.floorValue,
                                                                                                    uFloor: newValue, // อัปเดต state
                                                                                                },
                                                                                            }));
                                                                                        }}
                                                                                    >
                                                                                        <MenuItem value={0.92}>มี</MenuItem>
                                                                                        <MenuItem value={3.8}>ไม่มี</MenuItem>
                                                                                    </Select>
                                                                                    {fieldState.error && (
                                                                                        <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                            {fieldState.error.message}
                                                                                        </p>
                                                                                    )}
                                                                                </FormControl>
                                                                            )}
                                                                        />
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            </Table.Body>
                                                        </Table.Root>
                                                    </Field.Root>
                                                </GridItem>
                                            </Grid>
                                        </GridItem>
                                    </Collapse>

                                    {/* Door Direction */}
                                    <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} colSpan={2}>
                                        <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                            <GridItem>
                                                <Field.Root>
                                                    <Field.Label>ประตู (Door)</Field.Label>
                                                    <Field.Label>ระบุทิศติดผนังด้านใด (เลือกได้มากกว่า1)</Field.Label>
                                                    <Controller
                                                        name="doorValue"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกทิศประตูอย่างน้อย 1 ด้าน" }}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth error={!!errors.doorValue}>
                                                                <Select
                                                                    multiple
                                                                    displayEmpty
                                                                    input={<OutlinedInput />}
                                                                    value={formData.doorValue.map((d) => d.directionName)}
                                                                    onChange={(e) => handleDoorDirectionChange(e, field)}
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
                                                                {errors.doorValue && (
                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                        {errors.doorValue.message}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Field.Root>
                                            </GridItem>

                                            <Collapse
                                                in={
                                                    formData.doorValue.length > 0 &&
                                                    formData.doorValue[0].directionName !== "None"
                                                }
                                                timeout={400}
                                                unmountOnExit
                                            >
                                                <GridItem>
                                                    <Field.Root>
                                                        <Field.Label>ระบุข้อมูลประตู</Field.Label>
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
                                                                        ประเภท
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        วัสดุ
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ชนิดกระจก
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        กันสาด
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ม่านบังแดด
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        จำนวน
                                                                    </Table.ColumnHeader>
                                                                </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {formData.doorValue.map((item, index) => (
                                                                    <Table.Row key={index}>
                                                                        {/* Direction */}
                                                                        <Table.Cell textAlign="center">
                                                                            {directions.find((d) => d.value === item.directionName)?.label}
                                                                        </Table.Cell>

                                                                        {/* Door Type */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`doorValue.${index}.doorType`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณาเลือกประเภทประตู" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.doorValue];
                                                                                                    updated[index] = { ...updated[index], doorType: e.target.value };
                                                                                                    return { ...prev, doorValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            {doorTypeData.map((doortype, idx) => (
                                                                                                <MenuItem key={idx} value={doortype.DoorType}>
                                                                                                    {doorTypeLabelMap[doortype.DoorType]}
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Material */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`doorValue.${index}.material`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณาเลือกวัสดุประตู" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.doorValue];
                                                                                                    updated[index] = { ...updated[index], material: e.target.value };
                                                                                                    return { ...prev, doorValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="Glass">กระจก</MenuItem>
                                                                                            <MenuItem value="Other">อื่น ๆ</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Glass Type */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`doorValue.${index}.glassType`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกชนิดกระจก" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.doorValue];
                                                                                                    updated[index] = { ...updated[index], glassType: e.target.value };
                                                                                                    return { ...prev, doorValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="SingleGlazing">กระจกใสธรรมดา</MenuItem>
                                                                                            <MenuItem value="Tinted">กระจกสี</MenuItem>
                                                                                            <MenuItem value="Low-E">กระจก Low-E</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Shade */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`doorValue.${index}.haveShade`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกว่ามีกันแดดหรือไม่" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.doorValue];
                                                                                                    updated[index] = { ...updated[index], haveShade: newValue };
                                                                                                    return { ...prev, doorValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Curtain */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`doorValue.${index}.haveCurtain`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกว่ามีผ้าม่านหรือไม่" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.doorValue];
                                                                                                    updated[index] = { ...updated[index], haveCurtain: newValue };
                                                                                                    return { ...prev, doorValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Quantity */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`doorValue.${index}.quantity`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณากรอกจำนวนประตู" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <TextField
                                                                                        type="number"
                                                                                        fullWidth
                                                                                        {...field}
                                                                                        onChange={(e) => {
                                                                                            const newValue = Number(e.target.value);
                                                                                            field.onChange(newValue);
                                                                                            setFormData((prev) => {
                                                                                                const updated = [...prev.doorValue];
                                                                                                updated[index] = { ...updated[index], quantity: newValue };
                                                                                                return { ...prev, doorValue: updated };
                                                                                            });
                                                                                        }}
                                                                                        error={!!fieldState.error}
                                                                                        helperText={fieldState.error?.message}
                                                                                    />
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

                                    {/* Window Direction */}
                                    <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} colSpan={2}>
                                        <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                            <GridItem>
                                                <Field.Root>
                                                    <Field.Label>หน้าต่าง (Window)</Field.Label>
                                                    <Field.Label>ระบุทิศติดผนังด้านใด (เลือกได้มากกว่า1)</Field.Label>
                                                    <Controller
                                                        name="windowValue"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกทิศหน้าต่างอย่างน้อย 1 ด้าน" }}
                                                        render={({ field }) => (
                                                            <FormControl fullWidth error={!!errors.windowValue}>
                                                                <Select
                                                                    multiple
                                                                    displayEmpty
                                                                    input={<OutlinedInput />}
                                                                    value={formData.windowValue.map((d) => d.directionName)}
                                                                    onChange={(e) => handleWindowDirectionChange(e, field)}
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
                                                                {errors.windowValue && (
                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                        {errors.windowValue.message}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Field.Root>
                                            </GridItem>

                                            <Collapse
                                                in={
                                                    formData.windowValue.length > 0 &&
                                                    formData.windowValue[0].directionName !== "None"
                                                }
                                                timeout={400}
                                                unmountOnExit
                                            >
                                                <GridItem>
                                                    <Field.Root>
                                                        <Field.Label>ระบุข้อมูลหน้าต่าง</Field.Label>
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
                                                                        ประเภท
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        วัสดุ
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ชนิดกระจก
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        กันสาด
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        ม่านบังแดด
                                                                    </Table.ColumnHeader>
                                                                    <Table.ColumnHeader
                                                                        fontWeight={600}
                                                                        textAlign={"center"}
                                                                    >
                                                                        จำนวน
                                                                    </Table.ColumnHeader>
                                                                </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {formData.windowValue.map((item, index) => (
                                                                    <Table.Row key={index}>
                                                                        {/* Direction */}
                                                                        <Table.Cell textAlign="center">
                                                                            {directions.find((d) => d.value === item.directionName)?.label}
                                                                        </Table.Cell>

                                                                        {/* Window Type */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`windowValue.${index}.windowType`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณาเลือกประเภทหน้าต่าง" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.windowValue];
                                                                                                    updated[index] = { ...updated[index], windowType: e.target.value };
                                                                                                    return { ...prev, windowValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            {windowTypeData.map((windowtype, idx) => (
                                                                                                <MenuItem key={idx} value={windowtype.WindowType}>
                                                                                                    {windowTypeLabelMap[windowtype.WindowType]}
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Material */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`windowValue.${index}.material`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณาเลือกวัสดุหน้าต่าง" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.windowValue];
                                                                                                    updated[index] = { ...updated[index], material: e.target.value };
                                                                                                    return { ...prev, windowValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="Glass">กระจก</MenuItem>
                                                                                            <MenuItem value="Other">อื่น ๆ</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Glass Type */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`windowValue.${index}.glassType`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกชนิดกระจก" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.windowValue];
                                                                                                    updated[index] = { ...updated[index], glassType: e.target.value };
                                                                                                    return { ...prev, windowValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="SingleGlazing">กระจกใสธรรมดา</MenuItem>
                                                                                            <MenuItem value="Tinted">กระจกสี</MenuItem>
                                                                                            <MenuItem value="Low-E">กระจก Low-E</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Shade */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`windowValue.${index}.haveShade`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกว่ามีกันแดดหรือไม่" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.windowValue];
                                                                                                    updated[index] = { ...updated[index], haveShade: newValue };
                                                                                                    return { ...prev, windowValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Have Curtain */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`windowValue.${index}.haveCurtain`}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: item.material === "Glass" ? "กรุณาเลือกว่ามีผ้าม่านหรือไม่" : false,
                                                                                }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <FormControl fullWidth error={!!fieldState.error} disabled={item.material !== "Glass"}>
                                                                                        <Select
                                                                                            {...field}
                                                                                            displayEmpty
                                                                                            onChange={(e) => {
                                                                                                const newValue = e.target.value === "true";
                                                                                                field.onChange(e.target.value);
                                                                                                setFormData((prev) => {
                                                                                                    const updated = [...prev.windowValue];
                                                                                                    updated[index] = { ...updated[index], haveCurtain: newValue };
                                                                                                    return { ...prev, windowValue: updated };
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem value="true">มี</MenuItem>
                                                                                            <MenuItem value="false">ไม่มี</MenuItem>
                                                                                        </Select>
                                                                                        {fieldState.error && (
                                                                                            <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                                                {fieldState.error.message}
                                                                                            </p>
                                                                                        )}
                                                                                    </FormControl>
                                                                                )}
                                                                            />
                                                                        </Table.Cell>

                                                                        {/* Quantity */}
                                                                        <Table.Cell>
                                                                            <Controller
                                                                                name={`windowValue.${index}.quantity`}
                                                                                control={control}
                                                                                rules={{ required: "กรุณากรอกจำนวนหน้าต่าง" }}
                                                                                render={({ field, fieldState }) => (
                                                                                    <TextField
                                                                                        type="number"
                                                                                        fullWidth
                                                                                        {...field}
                                                                                        onChange={(e) => {
                                                                                            const newValue = Number(e.target.value);
                                                                                            field.onChange(newValue);
                                                                                            setFormData((prev) => {
                                                                                                const updated = [...prev.windowValue];
                                                                                                updated[index] = { ...updated[index], quantity: newValue };
                                                                                                return { ...prev, windowValue: updated };
                                                                                            });
                                                                                        }}
                                                                                        error={!!fieldState.error}
                                                                                        helperText={fieldState.error?.message}
                                                                                    />
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
                                                    <Controller
                                                        name="ballastFactor"
                                                        control={control}
                                                        rules={{ required: "กรุณาเลือกค่า Ballast Factor" }}
                                                        render={({ field, fieldState }) => (
                                                            <FormControl fullWidth error={!!fieldState.error}>
                                                                <Select
                                                                    {...field}
                                                                    displayEmpty
                                                                    value={field.value ?? ""}
                                                                    onChange={(e) => {
                                                                        const newValue = Number(e.target.value);
                                                                        field.onChange(newValue); // อัปเดต react-hook-form
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            ballastFactor: newValue, // อัปเดต state เดิม
                                                                        }));
                                                                    }}
                                                                >
                                                                    <MenuItem value={1}>
                                                                        ไม่มีบัลลาสต์/ไม่ทราบ (เช่น หลอด LED, หลอดไส้)
                                                                    </MenuItem>
                                                                    <MenuItem value={1.15}>
                                                                        มีบัลลาสต์ (เช่น ฟลูออเรสเซนต์, HID)
                                                                    </MenuItem>
                                                                </Select>
                                                                {fieldState.error && (
                                                                    <p style={{ color: "red", fontSize: "0.8rem" }}>
                                                                        {fieldState.error.message}
                                                                    </p>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Field.Root>
                                            </GridItem>

                                            {/* People */}
                                            <GridItem>
                                                <Field.Root>
                                                    <Field.Label>ผู้อยู่อาศัย (People)</Field.Label>
                                                    <Box display={"flex"} alignItems={"center"} gap={2}>
                                                        <Text fontSize={16} marginBottom={2}>
                                                            จำนวนผู้อยู่อาศัยในห้องหรืออาคารที่พิจารณา
                                                        </Text>
                                                        <Controller
                                                            name="people"
                                                            control={control}
                                                            rules={{
                                                                required: "กรุณากรอกจำนวนผู้อยู่อาศัย",
                                                                min: { value: 1, message: "จำนวนผู้อยู่อาศัยต้องไม่น้อยกว่า 1" },
                                                            }}
                                                            render={({ field, fieldState }) => (
                                                                <TextField
                                                                    {...field}
                                                                    type="number"
                                                                    value={field.value ?? ""}
                                                                    onChange={(e) => {
                                                                        const newValue = Number(e.target.value);
                                                                        field.onChange(newValue); // อัปเดต react-hook-form
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            people: newValue, // อัปเดต state เดิม
                                                                        }));
                                                                    }}
                                                                    error={!!fieldState.error}
                                                                    helperText={fieldState.error?.message}
                                                                />
                                                            )}
                                                        />
                                                        <Text fontSize={16} marginBottom={2}>
                                                            คน
                                                        </Text>
                                                    </Box>
                                                </Field.Root>
                                            </GridItem>
                                        </Grid>
                                    </GridItem>

                                    {/* Equipment */}
                                    <GridItem border={"1px solid #c5c5c6"} borderRadius={10} padding={5} height={"100%"}>
                                        <Grid gap={5}>
                                            <GridItem>
                                                <Field.Root>
                                                    <Field.Label>อุปกรณ์ (Equipment)</Field.Label>
                                                    <Table.Root size="sm" variant={"outline"}>
                                                        <Table.Header>
                                                            <Table.Row>
                                                                <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                    ประเภท
                                                                </Table.ColumnHeader>
                                                                <Table.ColumnHeader fontWeight={600} textAlign={"center"}>
                                                                    จำนวน
                                                                </Table.ColumnHeader>
                                                            </Table.Row>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {formData.equipmentValue.map((item, index) => (
                                                                <Table.Row key={index}>
                                                                    <Table.Cell>{item.label}</Table.Cell>
                                                                    <Table.Cell>
                                                                        <Controller
                                                                            name={`equipmentValue.${index}.quantity`}
                                                                            control={control}
                                                                            rules={{
                                                                                required: "กรุณากรอกจำนวนอุปกรณ์",
                                                                                min: { value: 0, message: "จำนวนต้องไม่น้อยกว่า 0" },
                                                                            }}
                                                                            render={({ field, fieldState }) => (
                                                                                <TextField
                                                                                    {...field}
                                                                                    type="number"
                                                                                    value={field.value ?? ""}
                                                                                    onChange={(e) => {
                                                                                        const newValue = Number(e.target.value);
                                                                                        field.onChange(newValue); // อัปเดต react-hook-form
                                                                                        setFormData((prev) => {
                                                                                            const updated = [...prev.equipmentValue];
                                                                                            updated[index] = {
                                                                                                ...updated[index],
                                                                                                quantity: newValue,
                                                                                                qEquipment: updated[index].powerW * updated[index].clf * newValue,
                                                                                            };
                                                                                            return { ...prev, equipmentValue: updated };
                                                                                        });
                                                                                    }}
                                                                                    error={!!fieldState.error}
                                                                                    helperText={fieldState.error?.message}
                                                                                />
                                                                            )}
                                                                        />
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
                            <Collapse in={!(selectedOption.buildingType === null || selectedOption.subRoom === null)} timeout={400} unmountOnExit>
                                <Flex width={"100%"} justifyContent={"space-between"}>
                                    <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={() => setTabValue("one")}>
                                        Previous
                                    </Button>
                                    <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={handleSubmit(
                                        () => {
                                            setTabValue("three");
                                        },
                                        (formErrors) => {
                                            console.log("Form errors:", formErrors);
                                        }
                                    )}
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            </Collapse>
                        </form>
                    </Tabs.Content>
                    <Tabs.Content value={"three"}>
                        <AirConditionerSelector
                            filterAirConditionerTypes={filterAirConditionerTypes}
                            onChange={setSelectedOption}
                        />
                        <Flex width={"100%"} justifyContent={"space-between"}>
                            <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={() => setTabValue("two")}>
                                Previous
                            </Button>
                            <Collapse in={!(selectedOption.selectedAirConditionerType === null)} timeout={400} unmountOnExit>
                                <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={() => setTabValue(selectedOption.selectedAirConditionerType !== "Cassette Type" ? "four" : "five")}>
                                    Next
                                </Button>
                            </Collapse>
                        </Flex>
                    </Tabs.Content>
                    <Tabs.Content value={"four"}>
                        <InstallationPositionSelector
                            formData={formData}
                            setFormData={setFormData}
                            setTabValue={setTabValue}
                            setCalculateVariable={setCalculateVariable}
                            directions={directions}
                        />
                    </Tabs.Content>
                    <Tabs.Content value={"five"}>
                        <Box>
                            <Heading size={"2xl"} color={"#003475"} marginBottom={4}>
                                แสดงผลข้อมูล
                            </Heading>
                            <Grid gridTemplateColumns={"repeat(3, 1fr)"} gap={10} padding={"1.4rem 2rem "}>
                                <GridItem colSpan={1} rowSpan={2}>
                                    <Grid>
                                        <GridItem>
                                            <Table.Root size="sm" border={0} fontSize={16}>
                                                <Table.Body>
                                                    <Table.Row border={0}>
                                                        <Table.Cell className="strong-text-blue">
                                                            ผลการคำนวณได้เท่ากับ
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {(calculateVariable.qTotalAll * 3.412).toLocaleString(
                                                                "en-US",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">BTU</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            แนะนำติดตั้งขนาด
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {calculateVariable.recommendedBTU.toLocaleString("en-US", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">BTU</Table.Cell>
                                                    </Table.Row>

                                                    {selectedOption.buildingType !== "Home" && (
                                                        <Table.Row>
                                                            <Table.Cell colSpan={3} className="strong-text-blue">
                                                                <Field.Root>
                                                                    <Field.Label marginTop={2}>ขนาดกิจการ</Field.Label>
                                                                    <Select
                                                                        displayEmpty
                                                                        fullWidth
                                                                        value={selectedOption.businessSize || ""}
                                                                        onChange={(e) =>
                                                                            setSelectedOption((prev) => ({
                                                                                ...prev,
                                                                                businessSize: e.target.value,
                                                                            }))
                                                                        }
                                                                        sx={{ marginBottom: 1.2 }}
                                                                    >
                                                                        <MenuItem value={"Small"}>Small</MenuItem>
                                                                        <MenuItem value={"Large"}>Large</MenuItem>
                                                                    </Select>
                                                                </Field.Root>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    )}

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            จำนวนหน่วยที่ใช้ต่อเดือน
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {
                                                                selectedOption.businessSize || selectedOption.buildingType === "Home" ?
                                                                    (
                                                                        calculateVariable.electricityCost?.E_kWh_month?.toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )
                                                                    ) : ("0.00")
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">kWh</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            ค่าไฟพื้นฐาน
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {
                                                                selectedOption.businessSize || selectedOption.buildingType === "Home" ?
                                                                    (
                                                                        calculateVariable.electricityCost?.base_cost?.toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )
                                                                    ) : ("0.00")
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">บาท/เดือน</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            ค่าไฟฟ้าแปรผัน
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {
                                                                selectedOption.businessSize || selectedOption.buildingType === "Home" ?
                                                                    (
                                                                        calculateVariable.electricityCost?.Ft_total?.toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )
                                                                    ) : ("0.00")
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">บาท/เดือน</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            ค่าภาษีมูลค่าเพิ่ม
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {
                                                                selectedOption.businessSize || selectedOption.buildingType === "Home" ?
                                                                    (
                                                                        calculateVariable.electricityCost?.vat?.toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )
                                                                    ) : ("0.00")
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">บาท/เดือน</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue" >
                                                        </Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue" >
                                                            ค่าไฟฟ้ารายเดือนทั้งหมด
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {
                                                                selectedOption.businessSize || selectedOption.buildingType === "Home" ?
                                                                    (
                                                                        calculateVariable.electricityCost?.monthly_cost?.toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )
                                                                    ) : ("0.00")
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">บาท/เดือน</Table.Cell>
                                                    </Table.Row>

                                                    <Table.Row>
                                                        <Table.Cell className="strong-text-blue">
                                                            ค่าไฟฟ้ารายปีทั้งหมด
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text">
                                                            {
                                                                selectedOption.businessSize || selectedOption.buildingType === "Home" ?
                                                                    (
                                                                        calculateVariable.electricityCost?.yearly_cost?.toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )
                                                                    ) : ("0.00")
                                                            }
                                                        </Table.Cell>
                                                        <Table.Cell className="strong-text-blue">บาท/ปี</Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table.Root>

                                            <Box display={"flex"} gap={2} marginY={4}>
                                                <Text className="strong-text-blue">ประเภทแอร์ที่เลือก :</Text>
                                                <Text className="strong-text">
                                                    {
                                                        airConditionerTypeImageShow.find(
                                                            (item) =>
                                                                item.title === selectedOption.selectedAirConditionerType
                                                        )?.title
                                                    }
                                                </Text>
                                            </Box>
                                            <Image
                                                width="100%"
                                                src={`${BASE_URL}${airConditionerTypeImageShow.find(
                                                    (item) =>
                                                        item.title === selectedOption.selectedAirConditionerType
                                                )?.image
                                                    }`}
                                                borderRadius={10}
                                            />
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                                <GridItem colSpan={2} display="flex" gap={2} flexDirection={"column"}>
                                    <Text className="strong-text-blue">
                                        แนะนำตำแหน่งติดตั้งเครื่องปรับอากาศ (indoor) :
                                    </Text>
                                    {
                                        selectedOption.selectedAirConditionerType === "Cassette Type" ?
                                            (
                                                <Box >
                                                    <Box display={'flex'} gap={4} border={"1px solid #c5c5c6"} borderRadius={10} paddingY={4} paddingX={6}>
                                                        <Text>
                                                            ติดตั้งใกล้ตำแหน่งกลางห้อง
                                                        </Text>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                sortedTotalScore.map((wallScore, index) => {
                                                    return (
                                                        <Box key={index}>
                                                            <Box>
                                                                <Text marginBottom={1}>ตำแหน่งที่ {index + 1}</Text>
                                                            </Box>
                                                            <Box
                                                                display={'flex'}
                                                                gap={4}
                                                                border={"1px solid #c5c5c6"}
                                                                borderRadius={10}
                                                                paddingY={4}
                                                                paddingX={6}
                                                            >
                                                                <Text
                                                                    marginBottom={1}
                                                                    fontWeight={500}
                                                                    bgColor={
                                                                        wallScore.wallScore?.totalScore
                                                                            ? wallScore.wallScore?.totalScore >= 90
                                                                                ? "#00E200"
                                                                                : wallScore.wallScore?.totalScore >= 70
                                                                                    ? "#64D9FF"
                                                                                    : wallScore.wallScore?.totalScore >= 50
                                                                                        ? "#F9D800"
                                                                                        : "#FF2A04"
                                                                            : ""
                                                                    }
                                                                    borderRadius={15}
                                                                    minWidth={74}
                                                                    textAlign={'center'}
                                                                    color={'#FFF'}
                                                                >
                                                                    {wallScore.wallScore?.totalScore
                                                                        ? wallScore.wallScore?.totalScore >= 90
                                                                            ? "ดีมาก"
                                                                            : wallScore.wallScore?.totalScore >= 70
                                                                                ? "ดี"
                                                                                : wallScore.wallScore?.totalScore >= 50
                                                                                    ? "พอใช้"
                                                                                    : "ไม่แนะนำ"
                                                                        : ""}
                                                                </Text>
                                                                <Text>
                                                                    ผนังด้าน
                                                                    {directions.find((d) => d.value === wallScore.directionName)?.label}
                                                                </Text>
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            )
                                    }
                                </GridItem>

                                <GridItem colSpan={2} display="flex" gap={2} flexDirection={"column"}>
                                    <Text className="strong-text-blue" marginBottom={1}>คำแนะนำ</Text>
                                    <Text>
                                        {
                                            airConditionerTypes.find((air) => air.title === selectedOption.selectedAirConditionerType)?.description
                                        }
                                    </Text>
                                </GridItem>
                            </Grid>
                        </Box>
                        <Collapse in={!(selectedOption.buildingType === null || selectedOption.subRoom === null)} timeout={400} unmountOnExit>
                            <Flex width={"100%"} justifyContent={"space-between"}>
                                <Button width={100} backgroundColor={"#003475"} fontSize={20} onClick={() => setTabValue(selectedOption.selectedAirConditionerType !== "Cassette Type" ? "four" : "three")}>
                                    Previous
                                </Button>
                            </Flex>
                        </Collapse>
                    </Tabs.Content>
                </Tabs.Root>
            </Container>
        </Box>
    );
}

export default MainPage;
