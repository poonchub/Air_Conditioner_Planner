import type { WattLightRow } from "@/types/WattLightRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadWattLightData(): Promise<WattLightRow[]> {
    return loadCsv<WattLightRow>(`${BASE_URL}/data/WattLight.csv`);
}

export function findMaximumLightingPowerDensity(
    data: WattLightRow[],
    buildingType: string,
    subType: string
): string | null {
    const row = data.find(
        (r) =>
            r.BuildingType.toLowerCase() === buildingType.toLowerCase() &&
            r.SubType.toLowerCase() === subType.toLowerCase()
    );
    return row ? row.MaximumLighting_Power_Density : null;
}
