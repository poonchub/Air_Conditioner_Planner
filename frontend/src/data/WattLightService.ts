import type { WattLightRow } from "@/types/WattLightRow";
import { loadCsv } from "./csvLoader";

export async function loadWattLightData(): Promise<WattLightRow[]> {
    return loadCsv<WattLightRow>("/data/WattLight.csv");
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
