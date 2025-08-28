import type { GlassCLFwithShadingRow } from "@/types/GlassCLFwithShadingRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadGlassCLFwithShadingData(): Promise<GlassCLFwithShadingRow[]> {
    return loadCsv<GlassCLFwithShadingRow>(`${BASE_URL}/data/GlassCLFwithShading.csv`);
}

export function findGlassCLFwithShadingTimeRange(
    data: GlassCLFwithShadingRow[],
    direction: string,
    startTime: string,
    endTime: string
): GlassCLFwithShadingRow[] {
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    return data.filter(
        (r) =>
            r.Direction.toLowerCase() === direction.toLowerCase() &&
            Number(r.Hour) >= start &&
            Number(r.Hour) <= end
    );
}