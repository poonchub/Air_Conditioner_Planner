import {
    Box,
    Button,
    Collapsible,
    Container,
    createListCollection,
    Field,
    Flex,
    Grid,
    GridItem,
    Heading,
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
import {
    findCLF,
    findPowerW,
    getEquipmentOptions,
    loadEquipmentData,
} from "@/data/EquipmentService";
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
import {
    findGlassCLFwithShadingTimeRange,
    loadGlassCLFwithShadingData,
} from "@/data/GlassCLFwithShadingService";
import {
    findGlassCLFnoShadingTimeRange,
    loadGlassCLFnoShadingData,
} from "@/data/GlassCLFnoShadingService";
import type { SHGFtoShadeRow } from "@/types/SHGFtoShadeRow";
import type { SHGFNoShadeRow } from "@/types/SHGFNoShadeRow";
// @ts-ignore
import {
    interpolateSHGFNoShadeByLat,
    loadSHGFNoShadeData,
} from "@/data/SHGFNoShadeService";
import { findSHGFtoShade, loadSHGFtoShadeData } from "@/data/SHGFtoShadeService";
import { findUCLTDWallTimeRange, findUvalueWall, loadUCLTDWallData } from "@/data/UCLTDWallService";
import type { UCLTDWallRow } from "@/types/UCLTDWallRow";
import type { GlassCLTDRow } from "@/types/GlassCLTDRow";
import { findCLTDGlassTimeRange, loadCLTDGlassData } from "@/data/CLTDService";
import { findU_SCglass, loadU_SCglassData } from "@/data/U_SCglassService";
import type { U_SCglassRow } from "@/types/U_SCglassRow";
import type { UfloorInRow } from "@/types/UfloorInRow";
import { findUfloorIn, loadUfloorInData } from "@/data/UfloorInService";

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

type WallValue = {
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
    qWallGlassByMonth: any[];
    qSolarWallGlassByMonth: any[];
    qSolarGlassByMonth?: any[];
    qGlassByMonth?: any[];
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

type floorValue = {
    uFloor: number;
    qFloor: number;
};

type FormDataProps = {
    province: string;
    people: number;
    width: number;
    depth: number;
    height: number;
    startTime: string;
    endTime: string;
    ceiling: string;
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
    floorValue: floorValue;
};

type CalculateVariableProps = {
    qLight: number;
    qPeople: number;
    qEquipmentSum: number;
    qInfiltration: number;
    qDoorCfmSum: number;
    qWindowCfmSum: number;
    areaValue: [];
    cltdW: number;
};

type HourData = {
    Hour: string;
    qGlass?: number;
    qSolarGlass?: number;
};

function MainPage() {
    const [selectedOption, setSelectedOption] = useState<{
        buildingType?: string | null;
        subRoom?: string | null;
    }>({
        buildingType: null,
        subRoom: null,
    });

    const [formData, setFormData] = useState<FormDataProps>({
        province: "",
        people: 1,
        width: 3,
        depth: 3,
        height: 3,
        startTime: "",
        endTime: "",
        ceiling: "",
        buildingType: "",
        roomPosition: "",
        roofType: "",
        kRoofColor: 0,
        ballastFactor: 1,
        noAirDirectionValue: [],
        equipmentValue: [],
        doorValue: [],
        windowValue: [],
        wallValue: [],
        floorValue: { uFloor: 0, qFloor: 0 },
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
    });

    const [dataFind, setDataFind] = useState<DataFindProps>({
        lightPowerDensity: null,
        totalHeat: null,
        equipment: null,
    });

    const [tabValue, setTabValue] = useState("two");

    const [wattLightData, setWattLightData] = useState<WattLightRow[]>([]);
    const [occupancyHeatGainData, setOccupancyHeatGainData] = useState<OccupancyHeatGainRow[]>([]);
    const [equipmentData, setEquipmentData] = useState<EquipmentRow[]>([]);
    const [doorTypeData, setDoorTypeData] = useState<DoorTypeRow[]>([]);
    const [windowTypeData, setWindowTypeData] = useState<WindowTypeRow[]>([]);
    const [climateData, setClimateData] = useState<ClimateDataRow[]>([]);
    const [roofData, setRoofData] = useState<UCLTDRoofRow[]>([]);
    const [lmWallAndRoofData, setLMWallAndRoofData] = useState<LMWallAndRoofRow[]>([]);
    const [glassCLFwithShadingData, setGlassCLFwithShadingData] = useState<
        GlassCLFwithShadingRow[]
    >([]);
    const [glassCLFnoShadingData, setGlassCLFnoShading] = useState<GlassCLFnoShadingRow[]>([]);
    const [SHGFtoShadeData, setSHGFtoShadeData] = useState<SHGFtoShadeRow[]>([]);
    const [SHGFNoShadeData, setSHGFNoShadeData] = useState<SHGFNoShadeRow[]>([]);
    const [UCLTDWallData, setUCLTDWallData] = useState<UCLTDWallRow[]>([]);
    const [CLTDGlassData, setCLTDGlassData] = useState<GlassCLTDRow[]>([]);
    const [U_SCglassData, setU_SCglassData] = useState<U_SCglassRow[]>([]);
    const [UfloorInData, setUfloorInData] = useState<UfloorInRow[]>([]);

    const handleDoorDirectionChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        setFormData((prev) => {
            const directionArr = typeof value === "string" ? value.split(",") : value;
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

            directionArr?.forEach((dir) => {
                const exists = newDoors.find((d) => d.directionName === dir);
                if (!exists) {
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

            const filteredDoors = newDoors.filter((d) => directionArr?.includes(d.directionName));

            return {
                ...prev,
                doorValue: filteredDoors,
            };
        });
    };

    const handleWindowDirectionChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        setFormData((prev) => {
            const directionArr = typeof value === "string" ? value.split(",") : value;

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

            directionArr?.forEach((dir) => {
                const exists = newWindows.find((d) => d.directionName === dir);
                if (!exists) {
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
                directionArr?.includes(d.directionName)
            );

            return {
                ...prev,
                windowValue: filteredWindows,
            };
        });
    };

    const handleWallDirectionChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        setFormData((prev) => {
            const directionArr = typeof value === "string" ? value.split(",") : value;

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
                            qWallGlassByMonth: [],
                            qSolarWallGlassByMonth: [],
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
                        qWallGlassByMonth: [],
                        qSolarWallGlassByMonth: [],
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

    const handleNoAirDirectionChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        setFormData((prev) => {
            const directionArr = typeof value === "string" ? value.split(",") : value;

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

            directionArr?.forEach((dir) => {
                const exists = newDirections.find((d) => d.directionName === dir);
                if (!exists) {
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
                directionArr?.includes(d.directionName)
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

            const totalHeat = findTotalHeat(
                occupancyHeatGainData,
                selectedOption.buildingType,
                selectedOption.subRoom
            );
            // console.log("totalHeat: ", totalHeat)
            setDataFind((prev) => ({ ...prev, totalHeat: totalHeat }));

            const equipment = getEquipmentOptions(
                equipmentData,
                selectedOption.buildingType,
                selectedOption.subRoom
            );
            // console.log("equipment: ", equipment)
            setDataFind((prev) => ({ ...prev, equipment: equipment }));

            const equipmentValue = equipment.map((eq) => ({
                equipmentName: eq,
                label: equipmentLabelMap[eq] || eq,
                quantity: 0,
                powerW: Number(
                    findPowerW(
                        equipmentData,
                        selectedOption.buildingType ?? "",
                        selectedOption.subRoom ?? "",
                        eq
                    )
                ),
                clf: Number(
                    findCLF(
                        equipmentData,
                        selectedOption.buildingType ?? "",
                        selectedOption.subRoom ?? "",
                        eq
                    )
                ),
                qEquipment: 0,
            }));
            setFormData((prev) => ({ ...prev, equipmentValue }));
        }
    }, [selectedOption]);

    useEffect(() => {
        if (formData.province && calculateVariable.qDoorCfmSum && calculateVariable.qWindowCfmSum) {
            const climatedt = getClimateData(climateData, formData.province);

            const qInfiltration =
                (calculateVariable.qDoorCfmSum + calculateVariable.qWindowCfmSum) *
                (1.085 * (Number(climatedt?.DB_OutMax) - Number(climatedt?.DB_In)) +
                    0.7 * (Number(climatedt?.W_Out) - Number(climatedt?.W_In)));
            console.log("qInfiltration: ", qInfiltration);
            setCalculateVariable((prev) => ({
                ...prev,
                qInfiltration: qInfiltration,
            }));
        }
    }, [formData.province, calculateVariable.qDoorCfmSum, calculateVariable.qWindowCfmSum]);

    useEffect(() => {
        if (formData.ballastFactor && dataFind.lightPowerDensity) {
            const qLight =
                formData.width *
                formData.depth *
                formData.ballastFactor *
                Number(dataFind.lightPowerDensity);
            console.log("qLight: ", qLight);
            setCalculateVariable((prev) => ({
                ...prev,
                qLight: qLight,
            }));
        }
    }, [formData.ballastFactor, dataFind.lightPowerDensity]);

    useEffect(() => {
        if (formData.people && dataFind.totalHeat) {
            const qPeople = formData.people * Number(dataFind.totalHeat);
            console.log("qPeople: ", qPeople);
            setCalculateVariable((prev) => ({
                ...prev,
                qPeople: qPeople,
            }));
        }
    }, [formData.people, dataFind.totalHeat]);

    // qEquipmentValue
    useEffect(() => {
        if (formData.equipmentValue) {
            let sum = 0;
            formData.equipmentValue.map((item) => {
                sum += item.qEquipment;
            });
            // console.log("qEquipmentSum: ", sum)
            setCalculateVariable((prev) => ({ ...prev, qEquipmentSum: sum }));
        }
    }, [formData.equipmentValue]);

    // DoorValue
    useEffect(() => {
        setFormData((prev) => {
            const updatedDoorValue = prev.doorValue.map((door) => {
                const doortypedt = getDoorTypeData(doorTypeData, door.doorType);

                const newCfm = Number(doortypedt?.cfm ?? 0) * door.quantity;

                if (door.cfm === newCfm) return door;

                return {
                    ...door,
                    cfm: newCfm,
                    doorArea: Number(doortypedt?.DoorArea) * door.quantity,
                };
            });

            const isChanged = updatedDoorValue.some((d, i) => d.cfm !== prev.doorValue[i].cfm);
            if (!isChanged) return prev;

            const sum = updatedDoorValue.reduce((acc, d) => acc + d.cfm, 0);
            setCalculateVariable((prevCalc) => ({
                ...prevCalc,
                qDoorCfmSum: sum,
            }));

            return {
                ...prev,
                doorValue: updatedDoorValue,
            };
        });
    }, [formData.doorValue, doorTypeData]);

    // WindowValue
    useEffect(() => {
        setFormData((prev) => {
            const updatedWindowValue = prev.windowValue.map((window) => {
                const windowtypedt = getWindowTypeData(windowTypeData, window.windowType);

                const newCfm = Number(windowtypedt?.cfm ?? 0) * window.quantity;

                if (window.cfm === newCfm) return window;

                return {
                    ...window,
                    cfm: newCfm,
                    windowArea: Number(windowtypedt?.WindowArea) * window.quantity,
                };
            });

            const isChanged = updatedWindowValue.some((w, i) => w.cfm !== prev.windowValue[i].cfm);
            if (!isChanged) return prev;

            const sum = updatedWindowValue.reduce((acc, w) => acc + w.cfm, 0);
            setCalculateVariable((prevCalc) => ({
                ...prevCalc,
                qWindowCfmSum: sum,
            }));

            return {
                ...prev,
                windowValue: updatedWindowValue,
            };
        });
    }, [formData.windowValue, windowTypeData]);

    // WallValue
    useEffect(() => {
        // คำนวณใหม่ทุกครั้งที่มีการเปลี่ยนค่า
        setFormData((prev) => {
            const newWallValue = prev.wallValue.map((wall) => {
                // หาประตูและหน้าต่างที่ตรงกับ direction ของผนังนี้
                const matchedDoors = prev.doorValue.filter(
                    (d) => d.directionName === wall.directionName
                );
                const matchedWindows = prev.windowValue.filter(
                    (w) => w.directionName === wall.directionName
                );

                // พื้นที่ผนังทั้งหมด อ้างอิงจาก position (สมมติคุณมี wallAreaMap)
                let totalWallArea = 0;
                if (wall.position === "Width") {
                    totalWallArea = formData.width * formData.height;
                } else if (wall.position === "Depth") {
                    totalWallArea = formData.depth * formData.height;
                }

                // คำนวณพื้นที่ประตูที่เป็นกระจก
                let glassAreaDoor = 0;
                matchedDoors.forEach((door) => {
                    if (door.material === "Glass") {
                        const doorArea = getDoorTypeData(doorTypeData, door.doorType);
                        glassAreaDoor += Number(doorArea?.DoorArea) * door.quantity;
                    }
                });

                // คำนวณพื้นที่หน้าต่างที่เป็นกระจก
                let glassAreaWindow = 0;
                matchedWindows.forEach((win) => {
                    if (win.material === "Glass") {
                        const windowArea = getWindowTypeData(windowTypeData, win.windowType);
                        glassAreaWindow += Number(windowArea?.WindowArea) * win.quantity;
                    }
                });

                return {
                    ...wall,
                    wallArea: totalWallArea - (glassAreaDoor + glassAreaWindow),
                    glassAreaWindow,
                    glassAreaDoor,
                };
            });

            return { ...prev, wallValue: newWallValue };
        });
    }, [formData.doorValue, formData.windowValue, formData.width, formData.depth, formData.height]);

    // qRoof
    useEffect(() => {
        if (
            formData.roofType != "" &&
            formData.ceiling != "" &&
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != "" &&
            formData.kRoofColor != 0 &&
            formData.width != 0 &&
            formData.depth != 0
        ) {
            const ucltRoofData = findUCLTDRoofTimeRange(
                roofData,
                formData.roofType,
                formData.ceiling,
                formData.startTime,
                formData.endTime
            );
            console.log("ucltRoofData: ", ucltRoofData);

            const climatedt = getClimateData(climateData, formData.province);
            const interpolated = interpolateLMByLat(lmWallAndRoofData, Number(climatedt?.Latitude));
            const interpolatedHOR = interpolated.filter((d) => d.Direction === "HOR");
            console.log(`interpolated ${climatedt?.Latitude}: `, interpolated);
            console.log(`interpolatedHOR ${climatedt?.Latitude}: `, interpolatedHOR);

            const uValueRoof = findUvalue(roofData, formData.roofType, formData.ceiling);
            console.log("uValueRoof: ", uValueRoof);

            const roofArea = formData.width * formData.depth;

            const cltdByMonth = interpolatedHOR.map((lmRow) => {
                const month = lmRow.Month;

                // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                const CLTDTime = ucltRoofData.map((ucltRow) => {
                    const CLTDs =
                        formData.kRoofColor * (Number(ucltRow.CLTDRoof) + Number(lmRow.LM)) +
                        (25.5 - Number(climatedt?.DB_In)) +
                        (Number(climatedt?.T_o) - 29.4);

                    const qRoof = CLTDs * Number(uValueRoof) * roofArea;

                    return {
                        Hour: ucltRow.Hour,
                        qRoof: qRoof,
                    };
                });

                return {
                    Month: month,
                    CLTDTime,
                };
            });

            console.log("cltdByMonth: ", cltdByMonth);
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
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != "" &&
            formData.width != 0 &&
            formData.depth != 0
        ) {
            formData.wallValue.map((item) => {
                if (item.material !== "Glass") {
                    const ucltWallData = findUCLTDWallTimeRange(
                        UCLTDWallData,
                        item.material,
                        item.directionName,
                        formData.startTime,
                        formData.endTime
                    );

                    // console.log("ucltWallData: ", ucltWallData)

                    const climatedt = getClimateData(climateData, formData.province);
                    // console.log(`climatedt: `, climatedt)
                    const interpolated = interpolateLMByLat(
                        lmWallAndRoofData,
                        Number(climatedt?.Latitude)
                    );
                    const interpolatedDirection = interpolated.filter(
                        (d) => d.Direction === item.directionName
                    );
                    // console.log(`interpolated ${climatedt?.Latitude}: `, interpolated)
                    // console.log(`interpolatedDirection ${climatedt?.Latitude}: `, interpolatedDirection)

                    const uValueWall = findUvalueWall(ucltWallData, item.material);
                    // console.log("uValueWall: ", uValueWall)

                    const wallArea = item.wallArea;

                    const cltdByMonth = interpolatedDirection.map((lmRow) => {
                        const month = lmRow.Month;

                        // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                        const CLTDTime = ucltWallData.map((ucltRow) => {
                            const CLTDs =
                                item.kWallColor * (Number(ucltRow.CLTDWall) + Number(lmRow.LM)) +
                                (25.5 - Number(climatedt?.DB_In)) +
                                (Number(climatedt?.T_o) - 29.4);

                            const qWall = CLTDs * Number(uValueWall) * wallArea;

                            return {
                                Hour: ucltRow.Hour,
                                qWall: qWall,
                            };
                        });

                        return {
                            Month: month,
                            CLTDTime,
                        };
                    });

                    console.log("cltdByMonth: ", cltdByMonth);
                }
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
            formData.width != 0 &&
            formData.depth != 0 &&
            (formData.buildingType === "Single" ||
                (formData.buildingType === "Multi" && formData.roomPosition === "Bottom"))
        ) {
            const climatedt = getClimateData(climateData, formData.province);

            const qFloor =
                formData.width *
                formData.depth *
                formData.floorValue.uFloor *
                (Number(climatedt?.DB_OutMax) - Number(climatedt?.DB_In));

            setFormData((prev) => ({
                ...prev,
                floorValue: {
                    ...prev.floorValue,
                    qFloor: qFloor,
                },
            }));
        }
    }, [formData.floorValue, formData.width, formData.depth]);

    // qWallGlass
    useEffect(() => {
        if (
            formData.windowValue &&
            formData.doorValue &&
            formData.wallValue &&
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != "" &&
            formData.width != 0 &&
            formData.depth != 0
        ) {
            formData.wallValue.map((item) => {
                if (item.material === "Glass") {
                    const cltdGlassData = findCLTDGlassTimeRange(
                        CLTDGlassData,
                        formData.startTime,
                        formData.endTime
                    );

                    // console.log("cltdGlassData: ", cltdGlassData)

                    const climatedt = getClimateData(climateData, formData.province);
                    // console.log(`climatedt: `, climatedt)

                    const interpolated = interpolateLMByLat(
                        lmWallAndRoofData,
                        Number(climatedt?.Latitude)
                    );
                    const interpolatedDirection = interpolated.filter(
                        (d) => d.Direction === item.directionName
                    );
                    // console.log(`interpolated ${climatedt?.Latitude}: `, interpolated)
                    // console.log(`interpolatedDirection ${climatedt?.Latitude}: `, interpolatedDirection)

                    const uValueGlass = findU_SCglass(U_SCglassData, item.glassType);
                    // console.log(`uValueGlass: `, uValueGlass?.Uglass)

                    const wallArea = item.wallArea;

                    const qWallGlassByMonth = interpolatedDirection.map((lmRow) => {
                        const month = lmRow.Month;

                        // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                        const CLTDTime = cltdGlassData.map((ucltRow) => {
                            const CLTDs =
                                Number(ucltRow.CLTD) +
                                (25.5 - Number(climatedt?.DB_In)) +
                                (Number(climatedt?.T_o) - 29.4);

                            const qWallGlass = CLTDs * Number(uValueGlass?.Uglass) * wallArea;

                            return {
                                Hour: ucltRow.Hour,
                                qWallGlass: qWallGlass,
                            };
                        });

                        return {
                            Month: month,
                            CLTDTime,
                        };
                    });

                    // console.log("qWallGlassByMonth: ", qWallGlassByMonth);

                    setFormData((prev) => {
                        const updatedWallValue = prev.wallValue.map((wall) => {
                            if (wall.directionName === item.directionName) {
                                if (
                                    JSON.stringify(wall.qWallGlassByMonth) ===
                                    JSON.stringify(qWallGlassByMonth)
                                ) {
                                    return wall;
                                }
                                return {
                                    ...wall,
                                    qWallGlassByMonth: qWallGlassByMonth,
                                };
                            }
                            return wall;
                        });

                        if (JSON.stringify(updatedWallValue) === JSON.stringify(prev.wallValue)) {
                            return prev;
                        }

                        return {
                            ...prev,
                            wallValue: updatedWallValue,
                        };
                    });
                }
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

    // qDoorGlass
    useEffect(() => {
        if (
            formData.doorValue &&
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != ""
        ) {
            formData.doorValue.map((item) => {
                if (item.material === "Glass") {
                    const cltdGlassData = findCLTDGlassTimeRange(
                        CLTDGlassData,
                        formData.startTime,
                        formData.endTime
                    );

                    // console.log("cltdGlassData: ", cltdGlassData)

                    const climatedt = getClimateData(climateData, formData.province);
                    // console.log(`climatedt: `, climatedt)

                    const interpolated = interpolateLMByLat(
                        lmWallAndRoofData,
                        Number(climatedt?.Latitude)
                    );
                    const interpolatedDirection = interpolated.filter(
                        (d) => d.Direction === item.directionName
                    );
                    // console.log(`interpolated ${climatedt?.Latitude}: `, interpolated)
                    // console.log(`interpolatedDirection ${climatedt?.Latitude}: `, interpolatedDirection)

                    const uValueGlass = findU_SCglass(U_SCglassData, item.glassType);
                    // console.log(`uValueGlass: `, uValueGlass?.Uglass)

                    const doorArea = item.doorArea;

                    const qDoorGlassByMonth = interpolatedDirection.map((lmRow) => {
                        const month = lmRow.Month;

                        // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                        const CLTDTime = cltdGlassData.map((ucltRow) => {
                            const CLTDs =
                                Number(ucltRow.CLTD) +
                                (25.5 - Number(climatedt?.DB_In)) +
                                (Number(climatedt?.T_o) - 29.4);

                            const qDoorGlass = CLTDs * Number(uValueGlass?.Uglass) * doorArea;

                            return {
                                Hour: ucltRow.Hour,
                                qDoorGlass: qDoorGlass,
                            };
                        });

                        return {
                            Month: month,
                            CLTDTime,
                        };
                    });

                    // console.log("qDoorGlassByMonth: ", qDoorGlassByMonth);

                    setFormData((prev) => {
                        const updatedDoorValue = prev.doorValue.map((door) => {
                            if (door.directionName === item.directionName) {
                                if (
                                    JSON.stringify(door.qDoorGlassByMonth) ===
                                    JSON.stringify(qDoorGlassByMonth)
                                ) {
                                    return door;
                                }
                                return {
                                    ...door,
                                    qDoorGlassByMonth: qDoorGlassByMonth,
                                };
                            }
                            return door;
                        });

                        if (JSON.stringify(updatedDoorValue) === JSON.stringify(prev.doorValue)) {
                            return prev;
                        }

                        return {
                            ...prev,
                            doorValue: updatedDoorValue,
                        };
                    });
                }
            });
        }
    }, [formData.doorValue, formData.startTime, formData.endTime, formData.province]);

    // qWindowGlass
    useEffect(() => {
        if (
            formData.windowValue &&
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != ""
        ) {
            formData.windowValue.map((item) => {
                if (item.material === "Glass") {
                    const cltdGlassData = findCLTDGlassTimeRange(
                        CLTDGlassData,
                        formData.startTime,
                        formData.endTime
                    );

                    // console.log("cltdGlassData: ", cltdGlassData)

                    const climatedt = getClimateData(climateData, formData.province);
                    // console.log(`climatedt: `, climatedt)

                    const interpolated = interpolateLMByLat(
                        lmWallAndRoofData,
                        Number(climatedt?.Latitude)
                    );
                    const interpolatedDirection = interpolated.filter(
                        (d) => d.Direction === item.directionName
                    );
                    // console.log(`interpolated ${climatedt?.Latitude}: `, interpolated)
                    // console.log(`interpolatedDirection ${climatedt?.Latitude}: `, interpolatedDirection)

                    const uValueGlass = findU_SCglass(U_SCglassData, item.glassType);
                    // console.log(`uValueGlass: `, uValueGlass?.Uglass)

                    const windowArea = item.windowArea;

                    const qWindowGlassByMonth = interpolatedDirection.map((lmRow) => {
                        const month = lmRow.Month;

                        // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                        const CLTDTime = cltdGlassData.map((ucltRow) => {
                            const CLTDs =
                                Number(ucltRow.CLTD) +
                                (25.5 - Number(climatedt?.DB_In)) +
                                (Number(climatedt?.T_o) - 29.4);

                            const qWindowGlass = CLTDs * Number(uValueGlass?.Uglass) * windowArea;

                            return {
                                Hour: ucltRow.Hour,
                                qWindowGlass: qWindowGlass,
                            };
                        });

                        return {
                            Month: month,
                            CLTDTime,
                        };
                    });

                    // console.log("qWindowGlassByMonth: ", qWindowGlassByMonth);

                    setFormData((prev) => {
                        const updatedWindowValue = prev.windowValue.map((window) => {
                            if (window.directionName === item.directionName) {
                                if (
                                    JSON.stringify(window.qWindowGlassByMonth) ===
                                    JSON.stringify(qWindowGlassByMonth)
                                ) {
                                    return window;
                                }
                                return {
                                    ...window,
                                    qWindowGlassByMonth: qWindowGlassByMonth,
                                };
                            }
                            return window;
                        });

                        if (
                            JSON.stringify(updatedWindowValue) === JSON.stringify(prev.windowValue)
                        ) {
                            return prev;
                        }

                        return {
                            ...prev,
                            windowValue: updatedWindowValue,
                        };
                    });
                }
            });
        }
    }, [formData.windowValue, formData.startTime, formData.endTime, formData.province]);

    // qSolarWallGlass
    useEffect(() => {
        if (
            formData.windowValue &&
            formData.doorValue &&
            formData.wallValue &&
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != "" &&
            formData.width != 0 &&
            formData.depth != 0
        ) {
            formData.wallValue.map((item) => {
                if (item.material === "Glass") {
                    let CLFGlassData = [];
                    let SHGFGlassDataAllMonth = [];

                    const climatedt = getClimateData(climateData, formData.province);
                    if (item?.haveShade) {
                        SHGFGlassDataAllMonth = findSHGFtoShade(
                            SHGFtoShadeData,
                            item.directionName
                        );
                    } else {
                        SHGFGlassDataAllMonth = interpolateSHGFNoShadeByLat(
                            SHGFNoShadeData,
                            Number(climatedt?.Latitude),
                            item.directionName
                        );
                    }
                    // console.log("SHGFGlassDataAllMonth: ", SHGFGlassDataAllMonth)

                    const monthsInRange = ["Apr", "May", "Jun", "Jul", "Aug"];
                    const filteredSHGFGlassData = SHGFGlassDataAllMonth.filter((item) =>
                        monthsInRange.includes(item.Month)
                    );

                    // console.log("filteredSHGFGlassData: ", filteredSHGFGlassData)

                    if (item?.haveCurtain) {
                        CLFGlassData = findGlassCLFwithShadingTimeRange(
                            glassCLFwithShadingData,
                            item.directionName,
                            formData.startTime,
                            formData.endTime
                        );
                    } else {
                        CLFGlassData = findGlassCLFnoShadingTimeRange(
                            glassCLFnoShadingData,
                            item?.directionName ?? "",
                            formData.startTime,
                            formData.endTime
                        );
                    }
                    // console.log("CLFGlassData: ", CLFGlassData)

                    const wallArea = item.wallArea;
                    // console.log("wallArea: ", wallArea)

                    const uValueGlass = findU_SCglass(U_SCglassData, item.glassType);
                    // console.log(`SC: `, uValueGlass?.SC)

                    const qSolarWallGlassByMonth = filteredSHGFGlassData.map((shgfRow) => {
                        const month = shgfRow.Month;

                        // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                        const QSolarTime = CLFGlassData.map((clfgRow) => {
                            const qSolarWallGlass =
                                Number(clfgRow.CLF) *
                                wallArea *
                                Number(shgfRow.SHGF) *
                                Number(uValueGlass?.SC);

                            return {
                                Hour: clfgRow.Hour,
                                qSolarWallGlass: qSolarWallGlass,
                            };
                        });

                        return {
                            Month: month,
                            QSolarTime,
                        };
                    });

                    // console.log("qSolarWallGlassByMonth: ", qSolarWallGlassByMonth);

                    setFormData((prev) => {
                        const updatedWallValue = prev.wallValue.map((wall) => {
                            if (wall.directionName === item.directionName) {
                                if (
                                    JSON.stringify(wall.qSolarWallGlassByMonth) ===
                                    JSON.stringify(qSolarWallGlassByMonth)
                                ) {
                                    return wall;
                                }
                                return {
                                    ...wall,
                                    qSolarWallGlassByMonth: qSolarWallGlassByMonth,
                                };
                            }
                            return wall;
                        });

                        if (JSON.stringify(updatedWallValue) === JSON.stringify(prev.wallValue)) {
                            return prev;
                        }

                        return {
                            ...prev,
                            wallValue: updatedWallValue,
                        };
                    });
                }
            });
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
    ]);

    // qSolarDoorGlass
    useEffect(() => {
        if (
            formData.doorValue &&
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != ""
        ) {
            formData.doorValue.map((item) => {
                if (item.material === "Glass") {
                    let CLFGlassData = [];
                    let SHGFGlassDataAllMonth = [];

                    const climatedt = getClimateData(climateData, formData.province);
                    if (item?.haveShade) {
                        SHGFGlassDataAllMonth = findSHGFtoShade(
                            SHGFtoShadeData,
                            item.directionName
                        );
                    } else {
                        SHGFGlassDataAllMonth = interpolateSHGFNoShadeByLat(
                            SHGFNoShadeData,
                            Number(climatedt?.Latitude),
                            item.directionName
                        );
                    }
                    // console.log("SHGFGlassDataAllMonth: ", SHGFGlassDataAllMonth)

                    const monthsInRange = ["Apr", "May", "Jun", "Jul", "Aug"];
                    const filteredSHGFGlassData = SHGFGlassDataAllMonth.filter((item) =>
                        monthsInRange.includes(item.Month)
                    );

                    // console.log("filteredSHGFGlassData: ", filteredSHGFGlassData)

                    if (item?.haveCurtain) {
                        CLFGlassData = findGlassCLFwithShadingTimeRange(
                            glassCLFwithShadingData,
                            item.directionName,
                            formData.startTime,
                            formData.endTime
                        );
                    } else {
                        CLFGlassData = findGlassCLFnoShadingTimeRange(
                            glassCLFnoShadingData,
                            item?.directionName ?? "",
                            formData.startTime,
                            formData.endTime
                        );
                    }
                    // console.log("CLFGlassData: ", CLFGlassData)

                    const wallArea = item.doorArea;

                    const uValueGlass = findU_SCglass(U_SCglassData, item.glassType);
                    // console.log(`uValueGlass: `, uValueGlass?.SC)

                    const qSolarDoorGlassByMonth = filteredSHGFGlassData.map((shgfRow) => {
                        const month = shgfRow.Month;

                        // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                        const QSolarTime = CLFGlassData.map((clfgRow) => {
                            const qSolarDoorGlass =
                                Number(clfgRow.CLF) *
                                wallArea *
                                Number(shgfRow.SHGF) *
                                Number(uValueGlass?.SC);

                            return {
                                Hour: clfgRow.Hour,
                                qSolarDoorGlass: qSolarDoorGlass,
                            };
                        });

                        return {
                            Month: month,
                            QSolarTime,
                        };
                    });

                    // console.log("qSolarDoorGlassByMonth: ", qSolarDoorGlassByMonth);

                    setFormData((prev) => {
                        const updatedDoorValue = prev.doorValue.map((door) => {
                            if (door.directionName === item.directionName) {
                                if (
                                    JSON.stringify(door.qSolarDoorGlassByMonth) ===
                                    JSON.stringify(qSolarDoorGlassByMonth)
                                ) {
                                    return door;
                                }
                                return {
                                    ...door,
                                    qSolarDoorGlassByMonth: qSolarDoorGlassByMonth,
                                };
                            }
                            return door;
                        });

                        if (JSON.stringify(updatedDoorValue) === JSON.stringify(prev.doorValue)) {
                            return prev;
                        }

                        return {
                            ...prev,
                            doorValue: updatedDoorValue,
                        };
                    });
                }
            });
        }
    }, [formData.doorValue, formData.startTime, formData.endTime, formData.province]);

    // qSolarWindowGlass
    useEffect(() => {
        if (
            formData.windowValue &&
            formData.startTime != "" &&
            formData.endTime != "" &&
            formData.province != ""
        ) {
            formData.windowValue.map((item) => {
                if (item.material === "Glass") {
                    let CLFGlassData = [];
                    let SHGFGlassDataAllMonth = [];

                    const climatedt = getClimateData(climateData, formData.province);
                    if (item?.haveShade) {
                        SHGFGlassDataAllMonth = findSHGFtoShade(
                            SHGFtoShadeData,
                            item.directionName
                        );
                    } else {
                        SHGFGlassDataAllMonth = interpolateSHGFNoShadeByLat(
                            SHGFNoShadeData,
                            Number(climatedt?.Latitude),
                            item.directionName
                        );
                    }
                    // console.log("SHGFGlassDataAllMonth: ", SHGFGlassDataAllMonth)

                    const monthsInRange = ["Apr", "May", "Jun", "Jul", "Aug"];
                    const filteredSHGFGlassData = SHGFGlassDataAllMonth.filter((item) =>
                        monthsInRange.includes(item.Month)
                    );

                    // console.log("filteredSHGFGlassData: ", filteredSHGFGlassData)

                    if (item?.haveCurtain) {
                        CLFGlassData = findGlassCLFwithShadingTimeRange(
                            glassCLFwithShadingData,
                            item.directionName,
                            formData.startTime,
                            formData.endTime
                        );
                    } else {
                        CLFGlassData = findGlassCLFnoShadingTimeRange(
                            glassCLFnoShadingData,
                            item?.directionName ?? "",
                            formData.startTime,
                            formData.endTime
                        );
                    }
                    // console.log("CLFGlassData: ", CLFGlassData)

                    const wallArea = item.windowArea;

                    const uValueGlass = findU_SCglass(U_SCglassData, item.glassType);
                    // console.log(`SC: `, uValueGlass?.SC)

                    const qSolarWindowGlassByMonth = filteredSHGFGlassData.map((shgfRow) => {
                        const month = shgfRow.Month;

                        // สำหรับเดือนนี้ เอา ucltRoofData ทั้งหมดมา map
                        const QSolarTime = CLFGlassData.map((clfgRow) => {
                            const qSolarWindowGlass =
                                Number(clfgRow.CLF) *
                                wallArea *
                                Number(shgfRow.SHGF) *
                                Number(uValueGlass?.SC);

                            return {
                                Hour: clfgRow.Hour,
                                qSolarWindowGlass: qSolarWindowGlass,
                            };
                        });

                        return {
                            Month: month,
                            QSolarTime,
                        };
                    });

                    // console.log("qSolarWindowGlassByMonth: ", qSolarWindowGlassByMonth);

                    setFormData((prev) => {
                        const updatedWindowValue = prev.windowValue.map((window) => {
                            if (window.directionName === item.directionName) {
                                if (
                                    JSON.stringify(window.qSolarWindowGlassByMonth) ===
                                    JSON.stringify(qSolarWindowGlassByMonth)
                                ) {
                                    return window;
                                }
                                return {
                                    ...window,
                                    qSolarWindowGlassByMonth: qSolarWindowGlassByMonth,
                                };
                            }
                            return window;
                        });

                        if (
                            JSON.stringify(updatedWindowValue) === JSON.stringify(prev.windowValue)
                        ) {
                            return prev;
                        }

                        return {
                            ...prev,
                            windowValue: updatedWindowValue,
                        };
                    });
                }
            });
        }
    }, [formData.windowValue, formData.startTime, formData.endTime, formData.province]);

    // qIn
    useEffect(() => {
        if (true) {
            const climatedt = getClimateData(climateData, formData.province);

            const updatedNoAirDirectionValue = formData.noAirDirectionValue.map((item) => {
                // หา U-value
                const ufloorIn = findUfloorIn(
                    UfloorInData,
                    item.haveInsulation ? "WithInsulation" : "NoInsulation",
                    item.haveCeiling ? "WithCeiling" : "NoCeiling"
                );

                // คำนวณพื้นที่
                let area = 0;
                if (
                    item.position === "Width" &&
                    item.directionName !== "Top" &&
                    item.directionName !== "Bottom"
                ) {
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
                    Number(ufloorIn?.Uvalue) *
                    area *
                    (Number(climatedt?.DB_OutMax) - 2.78 - Number(climatedt?.DB_In));

                return {
                    ...item,
                    qIn,
                };
            });

            setFormData((prev) => {
                if (
                    JSON.stringify(prev.noAirDirectionValue) ===
                    JSON.stringify(updatedNoAirDirectionValue)
                ) {
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
    ]);

    function combineGlassData(
        wallValue: WallValue[],
        doorValue: DoorValue[],
        windowValue: WindowValue[]
    ) {
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
        wallValues.forEach(wall => {
            (wall.qGlassByMonth || []).forEach(m => monthsSet.add(m.Month));
        });
        const months = Array.from(monthsSet);

        // รวมทุก directionName
        const totalQGlassByMonth = months.map(month => {
            // หา max length ของ Hour array
            const maxHourLength = Math.max(
                ...wallValues.map(wall => {
                    const monthData = (wall.qGlassByMonth || []).find(m => m.Month === month);
                    return monthData?.CLTDTime?.length || 0;
                }),
                0
            );

            const CLTDTime = Array.from({ length: maxHourLength }, (_, idx) => {
                const Hour = wallValues
                    .map(wall => {
                        const monthData = (wall.qGlassByMonth || []).find(m => m.Month === month);
                        return monthData?.CLTDTime[idx]?.Hour;
                    })
                    .find(Boolean) || String(idx + 1);

                const qGlass = wallValues.reduce((sum, wall) => {
                    const monthData = (wall.qGlassByMonth || []).find(m => m.Month === month);
                    const hourVal = monthData?.CLTDTime[idx]?.qGlass || 0;
                    return sum + hourVal;
                }, 0);

                return { Hour, qGlass };
            });

            return { Month: month, CLTDTime };
        });

        const totalQSolarByMonth = months.map(month => {
            const maxHourLength = Math.max(
                ...wallValues.map(wall => {
                    const monthData = (wall.qSolarGlassByMonth || []).find(m => m.Month === month);
                    return monthData?.QSolarTime?.length || 0;
                }),
                0
            );

            const QSolarTime = Array.from({ length: maxHourLength }, (_, idx) => {
                const Hour = wallValues
                    .map(wall => {
                        const monthData = (wall.qSolarGlassByMonth || []).find(m => m.Month === month);
                        return monthData?.QSolarTime[idx]?.Hour;
                    })
                    .find(Boolean) || String(idx + 1);

                const qSolarGlass = wallValues.reduce((sum, wall) => {
                    const monthData = (wall.qSolarGlassByMonth || []).find(m => m.Month === month);
                    const hourVal = monthData?.QSolarTime[idx]?.qSolarGlass || 0;
                    return sum + hourVal;
                }, 0);

                return { Hour, qSolarGlass };
            });

            return { Month: month, QSolarTime };
        });

        return { totalQGlassByMonth, totalQSolarByMonth };
    }


    useEffect(() => {
        if (
            formData.doorValue.length > 0 &&
            formData.windowValue.length > 0 &&
            formData.wallValue.length > 0
        ) {
            const combinedWall = combineGlassData(
                formData.wallValue,
                formData.doorValue,
                formData.windowValue
            );

            // เช็คว่าเหมือนเดิมหรือไม่ ถ้าเหมือนไม่ต้องอัพเดต
            if (JSON.stringify(combinedWall) !== JSON.stringify(formData.wallValue)) {
                setFormData((prev) => ({
                    ...prev,
                    wallValue: combinedWall,
                }));
            }
        }
    }, [formData.doorValue, formData.windowValue, formData.wallValue]);

    console.log("doorValue: ", formData.doorValue);
    console.log("windowValue: ", formData.windowValue);
    console.log("wallValue: ", formData.wallValue);
    // console.log("calculateVariable: ", calculateVariable)

    const handleClickCalculate = () => {
        setFormData(prev => {
            const { totalQGlassByMonth, totalQSolarByMonth } = calculateTotalGlass(prev);

            console.log("totalQGlassByMonth: ", totalQGlassByMonth);
            console.log("totalQSolarByMonth: ", totalQSolarByMonth);

            return {
                ...prev,
                totalQGlassByMonth,
                totalQSolarByMonth,
            };
        });
    }

    const airConditionerTypes = [
        { id: 1, title: "Wall Type", image: "/images/option/wall_type.png" },
        {
            id: 2,
            title: "Ceiling Suspended Type",
            image: "/images/option/ceiling_suspended_type.png",
        },
        { id: 3, title: "Cassette Type", image: "/images/option/cassette_type.png" },
    ];

    // @ts-ignore
    const airConditionerTypeImageShow = [
        { id: 1, title: "Wall Type", image: "./images/option/wall_type_show.png" },
        {
            id: 2,
            title: "Ceiling Suspended Type",
            image: "/images/option/ceiling_suspended_type_show.png",
        },
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

    // @ts-ignore
    const hourOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = (i + 1).toString();
        return {
            value: hour,
            label: `${hour.padStart(2, "0")}:00 น.`,
        };
    });

    // @ts-ignore
    const roofShapes = createListCollection({
        items: [
            { label: "หลังคาทรงหน้าจั่ว", value: "1" },
            { label: "หลังคาทรงหมาแหงน", value: "2" },
            { label: "หลังคาปั้นหยา", value: "3" },
            { label: "หลังคาทรงแบน", value: "4" },
            { label: "อื่น ๆ", value: "5" },
        ],
    });

    // @ts-ignore
    const materials = createListCollection({
        items: [
            { label: "กระจก", value: "1" },
            { label: "ไม้อัด", value: "2" },
            { label: "อิฐ + ปูน", value: "3" },
        ],
    });

    // @ts-ignore
    const wallSides = createListCollection({
        items: [
            { label: "ผนังด้านสั้น", value: "1" },
            { label: "ผนังด้านยาว", value: "2" },
        ],
    });

    // @ts-ignore
    const colors = createListCollection({
        items: [
            { label: "สีเข้ม", value: "1" },
            { label: "สีสว่าง", value: "2" },
        ],
    });

    // @ts-ignore
    const buildingTypes = createListCollection({
        items: [
            { label: "อาคารชั้นเดียว", value: "1" },
            { label: "อาคารหลายชั้น", value: "2" },
        ],
    });

    // @ts-ignore
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
            <Button onClick={handleClickCalculate}>
                Calculate
            </Button>
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
                        <Tabs.Trigger value="four" transition={"all ease 0.5s"}>
                            <MapPin />
                            ตำแหน่งติดตั้ง
                        </Tabs.Trigger>
                        <Tabs.Trigger value="five" transition={"all ease 0.5s"}>
                            <FileText />
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

                            <Grid
                                gridTemplateColumns={"repeat(2, 1fr)"}
                                gap={10}
                                padding={"1.4rem 2rem "}
                            >
                                <GridItem
                                    border={"1px solid #c5c5c6"}
                                    borderRadius={10}
                                    padding={5}
                                    colSpan={2}
                                >
                                    <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={5}>
                                        <GridItem colSpan={2}>
                                            <Field.Root>
                                                <Field.Label>จังหวัด (Province)</Field.Label>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={formData.province}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                province: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        {climateData.map((item, index) => {
                                                            return (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={item.Province}
                                                                >
                                                                    {
                                                                        provinceLabelMap[
                                                                        item.Province
                                                                        ]
                                                                    }
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </Field.Root>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <Field.Root>
                                                <Field.Label>ขนาดห้อง</Field.Label>
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader
                                                                fontWeight={600}
                                                                textAlign={"center"}
                                                            >
                                                                กว้าง
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader
                                                                fontWeight={600}
                                                                textAlign={"center"}
                                                            >
                                                                ยาว
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader
                                                                fontWeight={600}
                                                                textAlign={"center"}
                                                            >
                                                                สูง
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        <Table.Row>
                                                            <Table.Cell>
                                                                <TextField
                                                                    fullWidth
                                                                    type="number"
                                                                    value={formData.width}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            width: Number(
                                                                                e.target.value
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <TextField
                                                                    fullWidth
                                                                    type="number"
                                                                    value={formData.depth}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            depth: Number(
                                                                                e.target.value
                                                                            ),
                                                                        }))
                                                                    }
                                                                />
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <TextField
                                                                    fullWidth
                                                                    type="number"
                                                                    value={formData.height}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            height: Number(
                                                                                e.target.value
                                                                            ),
                                                                        }))
                                                                    }
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
                                                <Grid
                                                    templateColumns="repeat(2, 1fr)"
                                                    width={"100%"}
                                                    gap={3}
                                                >
                                                    {/* เวลาเริ่มต้น */}
                                                    <GridItem colSpan={1}>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                value={formData.startTime}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        startTime: e.target.value,
                                                                    }))
                                                                }
                                                            >
                                                                {hourOptions.map((item, index) => {
                                                                    return (
                                                                        <MenuItem
                                                                            key={index}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                    </GridItem>

                                                    {/* เวลาสิ้นสุด */}
                                                    <GridItem colSpan={1}>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                value={formData.endTime}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        endTime: e.target.value,
                                                                    }))
                                                                }
                                                            >
                                                                {hourOptions.map((item, index) => {
                                                                    return (
                                                                        <MenuItem
                                                                            key={index}
                                                                            value={item.value}
                                                                        >
                                                                            {item.label}
                                                                        </MenuItem>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                    </GridItem>
                                                </Grid>
                                            </Field.Root>
                                        </GridItem>

                                        <GridItem colSpan={1}>
                                            <Field.Root>
                                                <Field.Label>มีพื้นที่ฝ้าเพดานหรือไม่</Field.Label>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={formData.ceiling}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                ceiling: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <MenuItem value={"HaveCeilinglessthan"}>
                                                            มีน้อยกว่า 30 cm
                                                        </MenuItem>
                                                        <MenuItem value={"HaveCeilinggreaterthan"}>
                                                            มีมากกว่า 30 cm
                                                        </MenuItem>
                                                        <MenuItem value={"NoCeiling"}>
                                                            ไม่มี
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Field.Root>
                                        </GridItem>

                                        <GridItem colSpan={1}>
                                            <Field.Root>
                                                <Field.Label>ประเภทอาคาร</Field.Label>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={formData.buildingType}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                buildingType: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <MenuItem value={"Single"}>
                                                            อาคารชั้นเดียว
                                                        </MenuItem>
                                                        <MenuItem value={"Multi"}>
                                                            อาคารหลายชั้น
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Field.Root>
                                        </GridItem>

                                        <Collapse
                                            in={formData.buildingType === "Multi"}
                                            timeout={400}
                                            unmountOnExit
                                        >
                                            <GridItem colSpan={1}>
                                                <Field.Root>
                                                    <Field.Label>ตำแหน่งห้อง</Field.Label>
                                                    <FormControl fullWidth>
                                                        <Select
                                                            value={formData.roomPosition}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    roomPosition: e.target.value,
                                                                }))
                                                            }
                                                        >
                                                            <MenuItem value="Top">
                                                                ชั้นบนสุด
                                                            </MenuItem>
                                                            <MenuItem value="Middle">
                                                                ระหว่างชั้น
                                                            </MenuItem>
                                                            <MenuItem value="Bottom">
                                                                ชั้นล่างสุด
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Field.Root>
                                            </GridItem>
                                        </Collapse>
                                    </Grid>
                                </GridItem>

                                {/* Wall */}
                                <GridItem
                                    border={"1px solid #c5c5c6"}
                                    borderRadius={10}
                                    padding={5}
                                    colSpan={2}
                                >
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ผนัง (wall)</Field.Label>
                                                <Field.Label>
                                                    ระบุทิศผนังที่โดนแดดและไม่ติดกับห้องอื่น
                                                    (เลือกได้มากกว่า1)
                                                </Field.Label>
                                                <FormControl sx={{ width: "100%" }}>
                                                    <Select
                                                        multiple
                                                        value={formData.wallValue.map(
                                                            (d) => d.directionName
                                                        )}
                                                        onChange={handleWallDirectionChange}
                                                        input={<OutlinedInput />}
                                                        renderValue={(selected) => (
                                                            <Box
                                                                display={"flex"}
                                                                flexWrap={"wrap"}
                                                                gap={0.5}
                                                            >
                                                                {selected?.map((value) => (
                                                                    <Chip
                                                                        key={value}
                                                                        label={value}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
                                                    >
                                                        {directions.map((item, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={item.value}
                                                            >
                                                                {item.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
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
                                                            {formData.wallValue.map(
                                                                (item, index) => {
                                                                    return (
                                                                        <Table.Row key={index}>
                                                                            <Table.Cell
                                                                                textAlign={"center"}
                                                                            >
                                                                                {
                                                                                    directions.find(
                                                                                        (d) =>
                                                                                            d.value ===
                                                                                            item.directionName
                                                                                    )?.label
                                                                                }
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.position ??
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.wallValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    position:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    wallValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="Width">
                                                                                        ด้านกว้าง
                                                                                    </MenuItem>
                                                                                    <MenuItem value="Depth">
                                                                                        ด้านยาว
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.material
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.wallValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    material:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    wallValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="BrickPlaster">
                                                                                        ผนังอิฐฉาบปูน
                                                                                    </MenuItem>
                                                                                    <MenuItem value="WallwithInsulation">
                                                                                        ผนังมีฉนวนตรงกลาง
                                                                                    </MenuItem>
                                                                                    <MenuItem value="Prefabricated">
                                                                                        ผนังสำเร็จรูป
                                                                                    </MenuItem>
                                                                                    <MenuItem value="Glass">
                                                                                        กระจก
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.glassType
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.wallValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    glassType:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    wallValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "SingleGlazing"
                                                                                        }
                                                                                    >
                                                                                        กระจกใสธรรมดา
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Tinted"
                                                                                        }
                                                                                    >
                                                                                        กระจกสี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Low-E"
                                                                                        }
                                                                                    >
                                                                                        กระจก Low-E
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.haveShade
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.wallValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveShade:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    wallValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.haveCurtain
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.wallValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveCurtain:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    wallValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.kWallColor
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            );
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.wallValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    kWallColor:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    wallValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={0.65}
                                                                                    >
                                                                                        สีสว่าง
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={1}
                                                                                    >
                                                                                        สีเข้ม
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>
                                                                        </Table.Row>
                                                                    );
                                                                }
                                                            )}
                                                        </Table.Body>
                                                    </Table.Root>
                                                </Field.Root>
                                            </GridItem>
                                        </Collapse>
                                    </Grid>
                                </GridItem>

                                {/* NoAirDirection */}
                                <GridItem
                                    border={"1px solid #c5c5c6"}
                                    borderRadius={10}
                                    padding={5}
                                    colSpan={2}
                                >
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>สภาพแวดล้อมภายในอาคาร</Field.Label>
                                                <Field.Label>
                                                    ระบุด้านของห้องที่ไม่ได้ติดตั้งเครื่องปรับอากาศ
                                                    (เฉพาะผนังที่ติดกับห้องอื่น และเลือกได้มากกว่า1)
                                                </Field.Label>
                                                <FormControl sx={{ width: "100%" }}>
                                                    <Select
                                                        multiple
                                                        value={formData.noAirDirectionValue.map(
                                                            (d) => d.directionName
                                                        )}
                                                        onChange={handleNoAirDirectionChange}
                                                        input={<OutlinedInput />}
                                                        renderValue={(selected) => (
                                                            <Box
                                                                display={"flex"}
                                                                flexWrap={"wrap"}
                                                                gap={0.5}
                                                            >
                                                                {selected?.map((value) => (
                                                                    <Chip
                                                                        key={value}
                                                                        label={value}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
                                                    >
                                                        {(formData.buildingType === "Multi"
                                                            ? roomSides
                                                            : directions
                                                        ).map((item, index) => {
                                                            return (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={item.value}
                                                                >
                                                                    {item.label}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </Field.Root>
                                        </GridItem>

                                        <Collapse
                                            in={
                                                formData.noAirDirectionValue.length > 0 &&
                                                formData.noAirDirectionValue[0].directionName !==
                                                "None"
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
                                                            {formData.noAirDirectionValue.map(
                                                                (item, index) => {
                                                                    return (
                                                                        <Table.Row key={index}>
                                                                            <Table.Cell
                                                                                textAlign={"center"}
                                                                            >
                                                                                {
                                                                                    roomSides.find(
                                                                                        (d) =>
                                                                                            d.value ===
                                                                                            item.directionName
                                                                                    )?.label
                                                                                }
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.position ??
                                                                                        ""
                                                                                    }
                                                                                    disabled={
                                                                                        item.directionName ===
                                                                                        "Top" ||
                                                                                        item.directionName ===
                                                                                        "Bottom"
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.noAirDirectionValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    position:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    noAirDirectionValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="Width">
                                                                                        ด้านกว้าง
                                                                                    </MenuItem>
                                                                                    <MenuItem value="Depth">
                                                                                        ด้านยาว
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.material
                                                                                    }
                                                                                    disabled={
                                                                                        item.directionName ===
                                                                                        "Top" ||
                                                                                        item.directionName ===
                                                                                        "Bottom"
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.noAirDirectionValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    material:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    noAirDirectionValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="BrickPlaster">
                                                                                        ผนังอิฐฉาบปูน
                                                                                    </MenuItem>
                                                                                    <MenuItem value="WallwithInsulation">
                                                                                        ผนังมีฉนวนตรงกลาง
                                                                                    </MenuItem>
                                                                                    <MenuItem value="Prefabricated">
                                                                                        ผนังสำเร็จรูป
                                                                                    </MenuItem>
                                                                                    <MenuItem value="Glass">
                                                                                        กระจก
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.glassType
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.noAirDirectionValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    glassType:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    noAirDirectionValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "SingleGlazing"
                                                                                        }
                                                                                    >
                                                                                        กระจกใสธรรมดา
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Tinted"
                                                                                        }
                                                                                    >
                                                                                        กระจกสี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Low-E"
                                                                                        }
                                                                                    >
                                                                                        กระจก Low-E
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        !(
                                                                                            item.directionName ===
                                                                                            "Top" ||
                                                                                            item.directionName ===
                                                                                            "Bottom"
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        item.haveInsulation
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.noAirDirectionValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveInsulation:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    noAirDirectionValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        !(
                                                                                            item.directionName ===
                                                                                            "Top" ||
                                                                                            item.directionName ===
                                                                                            "Bottom"
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        item.haveCeiling
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.noAirDirectionValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveCeiling:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    noAirDirectionValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>
                                                                        </Table.Row>
                                                                    );
                                                                }
                                                            )}
                                                        </Table.Body>
                                                    </Table.Root>
                                                </Field.Root>
                                            </GridItem>
                                        </Collapse>
                                    </Grid>
                                </GridItem>

                                {/* Roof */}
                                <Collapse
                                    in={formData.roomPosition === "Top"}
                                    timeout={400}
                                    unmountOnExit
                                >
                                    <GridItem
                                        border={"1px solid #c5c5c6"}
                                        borderRadius={10}
                                        padding={5}
                                        height={"100%"}
                                    >
                                        <Grid gap={5}>
                                            <GridItem>
                                                <Field.Root>
                                                    <Field.Label>หลังคา (Roof)</Field.Label>
                                                    <Field.Label>ระบุข้อมูลหลังคา</Field.Label>
                                                    <Table.Root size="sm" variant={"outline"}>
                                                        <Table.Header>
                                                            <Table.Row>
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
                                                                    สีภายนอก
                                                                </Table.ColumnHeader>
                                                            </Table.Row>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            <Table.Row>
                                                                <Table.Cell>
                                                                    <FormControl fullWidth>
                                                                        <Select
                                                                            value={
                                                                                formData.roofType
                                                                            }
                                                                            onChange={(e) =>
                                                                                setFormData(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        roofType:
                                                                                            e.target
                                                                                                .value,
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <MenuItem
                                                                                value={"Concrete"}
                                                                            >
                                                                                หลังคาคอนกรีต
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                value={
                                                                                    "ConcreteTile"
                                                                                }
                                                                            >
                                                                                หลังคากระเบื้องคอนกรีต
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                value={"MetalSheet"}
                                                                            >
                                                                                หลังคาเมทัลชีท
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <FormControl fullWidth>
                                                                        <Select
                                                                            value={
                                                                                formData.kRoofColor
                                                                            }
                                                                            onChange={(e) =>
                                                                                setFormData(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        kRoofColor:
                                                                                            Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            ),
                                                                                    })
                                                                                )
                                                                            }
                                                                        >
                                                                            <MenuItem value={0.5}>
                                                                                สีสว่าง
                                                                            </MenuItem>
                                                                            <MenuItem value={1}>
                                                                                สีเข้ม
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        </Table.Body>
                                                    </Table.Root>
                                                </Field.Root>
                                            </GridItem>
                                        </Grid>
                                    </GridItem>
                                </Collapse>

                                {/* Floor */}
                                <Collapse
                                    in={
                                        formData.buildingType === "Single" ||
                                        (formData.buildingType === "Multi" &&
                                            formData.roomPosition === "Bottom")
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
                                                                    <FormControl fullWidth>
                                                                        <Select
                                                                            sx={{ width: "100%" }}
                                                                            value={
                                                                                formData.floorValue
                                                                                    .uFloor
                                                                            }
                                                                            onChange={(e) => {
                                                                                const newValue =
                                                                                    Number(
                                                                                        e.target
                                                                                            .value
                                                                                    );
                                                                                setFormData(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        floorValue:
                                                                                        {
                                                                                            ...prev.floorValue,
                                                                                            ufloor: newValue,
                                                                                        },
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <MenuItem value={0.92}>
                                                                                มี
                                                                            </MenuItem>
                                                                            <MenuItem value={3.8}>
                                                                                ไม่มี
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
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
                                <GridItem
                                    border={"1px solid #c5c5c6"}
                                    borderRadius={10}
                                    padding={5}
                                    colSpan={2}
                                >
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ประตู (Door)</Field.Label>
                                                <Field.Label>
                                                    ระบุทิศทาง (เลือกได้มากกว่า1)
                                                </Field.Label>
                                                <FormControl sx={{ width: "100%" }}>
                                                    <Select
                                                        multiple
                                                        value={formData.doorValue.map(
                                                            (d) => d.directionName
                                                        )}
                                                        onChange={handleDoorDirectionChange}
                                                        input={<OutlinedInput />}
                                                        renderValue={(selected) => (
                                                            <Box
                                                                display={"flex"}
                                                                flexWrap={"wrap"}
                                                                gap={0.5}
                                                            >
                                                                {selected?.map((value) => (
                                                                    <Chip
                                                                        key={value}
                                                                        label={value}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
                                                    >
                                                        {directions.map((item, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={item.value}
                                                            >
                                                                {item.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
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
                                                            {formData.doorValue.map(
                                                                (item, index) => {
                                                                    return (
                                                                        <Table.Row key={index}>
                                                                            <Table.Cell
                                                                                textAlign={"center"}
                                                                            >
                                                                                {
                                                                                    directions.find(
                                                                                        (d) =>
                                                                                            d.value ===
                                                                                            item.directionName
                                                                                    )?.label
                                                                                }
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.doorType ??
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.doorValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    doorType:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    doorValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {doorTypeData.map(
                                                                                        (
                                                                                            doortype,
                                                                                            index
                                                                                        ) => {
                                                                                            return (
                                                                                                <MenuItem
                                                                                                    key={
                                                                                                        index
                                                                                                    }
                                                                                                    value={
                                                                                                        doortype.DoorType
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        doorTypeLabelMap[
                                                                                                        doortype
                                                                                                            .DoorType
                                                                                                        ]
                                                                                                    }
                                                                                                </MenuItem>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.material
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.doorValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    material:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    doorValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Glass"
                                                                                        }
                                                                                    >
                                                                                        กระจก
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Other"
                                                                                        }
                                                                                    >
                                                                                        อื่น ๆ
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.glassType
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.doorValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    glassType:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    doorValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "SingleGlazing"
                                                                                        }
                                                                                    >
                                                                                        กระจกใสธรรมดา
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Tinted"
                                                                                        }
                                                                                    >
                                                                                        กระจกสี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Low-E"
                                                                                        }
                                                                                    >
                                                                                        กระจก Low-E
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.haveShade
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.doorValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveShade:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    doorValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.haveCurtain
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.doorValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveCurtain:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    doorValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <TextField
                                                                                    type="number"
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.quantity
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            );
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.doorValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    quantity:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    doorValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </Table.Cell>
                                                                        </Table.Row>
                                                                    );
                                                                }
                                                            )}
                                                        </Table.Body>
                                                    </Table.Root>
                                                </Field.Root>
                                            </GridItem>
                                        </Collapse>
                                    </Grid>
                                </GridItem>

                                {/* Window Direction */}
                                <GridItem
                                    border={"1px solid #c5c5c6"}
                                    borderRadius={10}
                                    padding={5}
                                    colSpan={2}
                                >
                                    <Grid gridTemplateColumns={"repeat(1, 1fr)"} gap={5}>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>หน้าต่าง (Window)</Field.Label>
                                                <Field.Label>
                                                    ระบุทิศทาง (เลือกได้มากกว่า1)
                                                </Field.Label>
                                                <FormControl sx={{ width: "100%" }}>
                                                    <Select
                                                        multiple
                                                        value={formData.windowValue.map(
                                                            (d) => d.directionName
                                                        )}
                                                        onChange={handleWindowDirectionChange}
                                                        input={<OutlinedInput />}
                                                        renderValue={(selected) => (
                                                            <Box
                                                                display={"flex"}
                                                                flexWrap={"wrap"}
                                                                gap={0.5}
                                                            >
                                                                {selected?.map((value) => (
                                                                    <Chip
                                                                        key={value}
                                                                        label={value}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
                                                    >
                                                        {directions.map((item, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={item.value}
                                                            >
                                                                {item.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
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
                                                            {formData.windowValue.map(
                                                                (item, index) => {
                                                                    return (
                                                                        <Table.Row key={index}>
                                                                            <Table.Cell
                                                                                textAlign={"center"}
                                                                            >
                                                                                {
                                                                                    directions.find(
                                                                                        (d) =>
                                                                                            d.value ===
                                                                                            item.directionName
                                                                                    )?.label
                                                                                }
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.windowType ??
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.windowValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    windowType:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    windowValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    {windowTypeData.map(
                                                                                        (
                                                                                            windowtype,
                                                                                            index
                                                                                        ) => {
                                                                                            return (
                                                                                                <MenuItem
                                                                                                    key={
                                                                                                        index
                                                                                                    }
                                                                                                    value={
                                                                                                        windowtype.WindowType
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        windowTypeLabelMap[
                                                                                                        windowtype
                                                                                                            .WindowType
                                                                                                        ]
                                                                                                    }
                                                                                                </MenuItem>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.material
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.windowValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    material:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    windowValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Glass"
                                                                                        }
                                                                                    >
                                                                                        กระจก
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Other"
                                                                                        }
                                                                                    >
                                                                                        อื่น ๆ
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.glassType
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.windowValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    glassType:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    windowValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "SingleGlazing"
                                                                                        }
                                                                                    >
                                                                                        กระจกใสธรรมดา
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Tinted"
                                                                                        }
                                                                                    >
                                                                                        กระจกสี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "Low-E"
                                                                                        }
                                                                                    >
                                                                                        กระจก Low-E
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.haveShade
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.windowValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveShade:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    windowValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <Select
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    disabled={
                                                                                        item.material !==
                                                                                        "Glass"
                                                                                    }
                                                                                    value={
                                                                                        item.haveCurtain
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            e.target
                                                                                                .value ===
                                                                                            "true";
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.windowValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    haveCurtain:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    windowValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "true"
                                                                                        }
                                                                                    >
                                                                                        มี
                                                                                    </MenuItem>
                                                                                    <MenuItem
                                                                                        value={
                                                                                            "false"
                                                                                        }
                                                                                    >
                                                                                        ไม่มี
                                                                                    </MenuItem>
                                                                                </Select>
                                                                            </Table.Cell>

                                                                            <Table.Cell>
                                                                                <TextField
                                                                                    type="number"
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                    }}
                                                                                    value={
                                                                                        item.quantity
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newValue =
                                                                                            Number(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            );
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => {
                                                                                                const updated =
                                                                                                    [
                                                                                                        ...prev.windowValue,
                                                                                                    ];
                                                                                                updated[
                                                                                                    index
                                                                                                ] =
                                                                                                {
                                                                                                    ...updated[
                                                                                                    index
                                                                                                    ],
                                                                                                    quantity:
                                                                                                        newValue,
                                                                                                };
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    windowValue:
                                                                                                        updated,
                                                                                                };
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </Table.Cell>
                                                                        </Table.Row>
                                                                    );
                                                                }
                                                            )}
                                                        </Table.Body>
                                                    </Table.Root>
                                                </Field.Root>
                                            </GridItem>
                                        </Collapse>
                                    </Grid>
                                </GridItem>

                                <GridItem
                                    border={"1px solid #c5c5c6"}
                                    borderRadius={10}
                                    padding={5}
                                    height={"100%"}
                                >
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
                                                        value={formData.ballastFactor ?? ""}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                ballastFactor: Number(
                                                                    e.target.value
                                                                ),
                                                            }))
                                                        }
                                                    >
                                                        <MenuItem value={1}>
                                                            ไม่มีบัลลาสต์/ไม่ทราบ (เช่น หลอด LED,
                                                            หลอดไส้)
                                                        </MenuItem>
                                                        <MenuItem value={1.15}>
                                                            มีบัลลาสต์ (เช่น ฟลูออเรสเซนต์, HID){" "}
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Field.Root>
                                        </GridItem>

                                        {/* People */}
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>ผู้อยู่อาศัย (People)</Field.Label>
                                                <Box display={"flex"} alignItems={"center"} gap={2}>
                                                    <Text fontSize={16} marginBottom={2}>
                                                        จำนวนผู้อยู่อาศัยในอาคาร
                                                    </Text>
                                                    <TextField
                                                        type="number"
                                                        value={formData.people}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                people: Number(e.target.value),
                                                            }))
                                                        }
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
                                <GridItem
                                    border={"1px solid #c5c5c6"}
                                    borderRadius={10}
                                    padding={5}
                                    height={"100%"}
                                >
                                    <Grid gap={5}>
                                        <GridItem>
                                            <Field.Root>
                                                <Field.Label>อุปกรณ์ (Equipment)</Field.Label>
                                                {/* <Field.Label>ระบุข้อมูลหลังคา</Field.Label> */}
                                                <Table.Root size="sm" variant={"outline"}>
                                                    <Table.Header>
                                                        <Table.Row>
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
                                                                จำนวน
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {
                                                            // @ts-ignore
                                                            formData.equipmentValue.map(
                                                                (item, index) => (
                                                                    <Table.Row key={index}>
                                                                        <Table.Cell>
                                                                            {item.label}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            <TextField
                                                                                type="number"
                                                                                value={
                                                                                    item.quantity
                                                                                }
                                                                                onChange={(e) => {
                                                                                    const newValue =
                                                                                        Number(
                                                                                            e.target
                                                                                                .value
                                                                                        );
                                                                                    setFormData(
                                                                                        (prev) => {
                                                                                            const updated =
                                                                                                [
                                                                                                    ...prev.equipmentValue,
                                                                                                ];
                                                                                            updated[
                                                                                                index
                                                                                            ] = {
                                                                                                ...updated[
                                                                                                index
                                                                                                ],
                                                                                                quantity:
                                                                                                    newValue,
                                                                                                qEquipment:
                                                                                                    updated[
                                                                                                        index
                                                                                                    ]
                                                                                                        .powerW *
                                                                                                    updated[
                                                                                                        index
                                                                                                    ]
                                                                                                        .clf *
                                                                                                    newValue,
                                                                                            };
                                                                                            return {
                                                                                                ...prev,
                                                                                                equipmentValue:
                                                                                                    updated,
                                                                                            };
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                )
                                                            )
                                                        }
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
                        <AirConditionerSelector
                            filterAirConditionerTypes={filterAirConditionerTypes}
                        />
                    </Tabs.Content>
                    <Tabs.Content value={"four"}>
                        {/* <InstallationPositionSelector directions={directions} /> */}
                    </Tabs.Content>
                    <Tabs.Content value={"five"}>
                        <Box>
                            <Heading size={"2xl"} color={"#003475"} marginBottom={4}>
                                แสดงผลข้อมูล
                            </Heading>
                            <Grid
                                gridTemplateColumns={"repeat(3, 1fr)"}
                                gap={10}
                                padding={"1.4rem 2rem "}
                            >
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

                                            <Box display={"flex"} gap={2} marginY={4}>
                                                <Text className="strong-text-blue">
                                                    ประเภทแอร์ที่เลือก :
                                                </Text>
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
                                <GridItem
                                    colSpan={2}
                                    display="flex"
                                    gap={2}
                                    flexDirection={"column"}
                                >
                                    <Text className="strong-text-blue">
                                        แนะนำตำแหน่งติดตั้งเครื่องปรับอากาศ (indoor) :
                                    </Text>
                                    <Box>
                                        <Text marginBottom={1}>ตำแหน่งที่ 1</Text>
                                        <Box
                                            border={"1px solid #c5c5c6"}
                                            borderRadius={10}
                                            paddingY={4}
                                            paddingX={6}
                                        >
                                            <Text>
                                                ผนังด้านทิศเหนือ สูงจากพื้น 2.2 เมตรหรือลงจากเพดาน
                                                (อธิบายถึงความเหมาะสม)
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Text marginBottom={1}>ตำแหน่งที่ 2</Text>
                                        <Box
                                            border={"1px solid #c5c5c6"}
                                            borderRadius={10}
                                            paddingY={4}
                                            paddingX={6}
                                        >
                                            <Text>
                                                ผนังด้านทิศเหนือ สูงจากพื้น 2.2 เมตรหรือลงจากเพดาน
                                                (อธิบายถึงความเหมาะสม)
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Text marginBottom={1}>ตำแหน่งที่ 3</Text>
                                        <Box
                                            border={"1px solid #c5c5c6"}
                                            borderRadius={10}
                                            paddingY={4}
                                            paddingX={6}
                                        >
                                            <Text>
                                                ผนังด้านทิศเหนือ สูงจากพื้น 2.2 เมตรหรือลงจากเพดาน
                                                (อธิบายถึงความเหมาะสม)
                                            </Text>
                                        </Box>
                                    </Box>
                                </GridItem>
                            </Grid>
                        </Box>
                    </Tabs.Content>
                </Tabs.Root>
                <Collapsible.Root open={selectedOption.buildingType != ""}>
                    <Flex
                        width={"100%"}
                        justifyContent={tabValue === "one" ? "flex-end" : "space-between"}
                    >
                        {tabValue !== "one" && (
                            <Button
                                width={100}
                                backgroundColor={"#003475"}
                                fontSize={20}
                                onClick={handleClickPrev}
                            >
                                Previous
                            </Button>
                        )}
                        {tabValue !== "five" && (
                            <Button
                                width={100}
                                backgroundColor={"#003475"}
                                fontSize={20}
                                onClick={handleClickNext}
                            >
                                Next
                            </Button>
                        )}
                    </Flex>
                </Collapsible.Root>
            </Container>
        </Box>
    );
}

export default MainPage;