import type { EquipmentRow } from "@/types/EquipmentRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadEquipmentData(): Promise<EquipmentRow[]> {
    return loadCsv<EquipmentRow>(`${BASE_URL}/data/Equipment.csv`);
}

export function getEquipmentOptions(
    data: EquipmentRow[],
    buildingType: string,
    subType: string
): string[] {
    return data
        .filter(
            (r) =>
                r.BuildingType.toLowerCase() === buildingType.toLowerCase() &&
                r.SubType.toLowerCase() === subType.toLowerCase()
        )
        .map((r) => r.EquipmentName);
}

export function findPowerW(
    data: EquipmentRow[],
    buildingType: string,
    subType: string,
    EquipmentName: string
): string | null {
    const row = data.find(
        (r) =>
            r.BuildingType.toLowerCase() === buildingType.toLowerCase() &&
            r.SubType.toLowerCase() === subType.toLowerCase() &&
            r.EquipmentName.toLowerCase() === EquipmentName.toLowerCase()
    );
    return row ? row.PowerW : null;
}

export function findCLF(
    data: EquipmentRow[],
    buildingType: string,
    subType: string,
    EquipmentName: string
): string | null {
    const row = data.find(
        (r) =>
            r.BuildingType.toLowerCase() === buildingType.toLowerCase() &&
            r.SubType.toLowerCase() === subType.toLowerCase() &&
            r.EquipmentName.toLowerCase() === EquipmentName.toLowerCase()
    );
    return row ? row.CLF : null;
}
