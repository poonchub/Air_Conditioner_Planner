import type { OccupancyHeatGainRow } from "@/types/OccupancyHeatGainRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadOccupancyHeatGainData(): Promise<OccupancyHeatGainRow[]> {
    return loadCsv<OccupancyHeatGainRow>(`${BASE_URL}/data/OccupancyHeatGain.csv`)
}

export function findTotalHeat(
    data: OccupancyHeatGainRow[],
    buildingType: string,
    subType: string
): string | null {
    const row = data.find(
        (r) =>
            r.BuildingType.toLowerCase() === buildingType.toLowerCase() &&
            r.SubType.toLowerCase() === subType.toLowerCase()
    );
    return row ? row.TotalHeat : null;
}

export function findSensibleHeat(
    data: OccupancyHeatGainRow[],
    buildingType: string,
    subType: string
): string | null {
    const row = data.find(
        (r) =>
            r.BuildingType.toLowerCase() === buildingType.toLowerCase() &&
            r.SubType.toLowerCase() === subType.toLowerCase()
    );
    return row ? row.SensibleHeat : null;
}

export function findLatentHeat(
    data: OccupancyHeatGainRow[],
    buildingType: string,
    subType: string
): string | null {
    const row = data.find(
        (r) =>
            r.BuildingType.toLowerCase() === buildingType.toLowerCase() &&
            r.SubType.toLowerCase() === subType.toLowerCase()
    );
    return row ? row.LatentHeat : null;
}