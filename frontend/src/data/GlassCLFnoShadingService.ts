import type { GlassCLFnoShadingRow } from "@/types/GlassCLFnoShadingRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadGlassCLFnoShadingData(): Promise<GlassCLFnoShadingRow[]> {
    return loadCsv<GlassCLFnoShadingRow>(`${BASE_URL}/data/GlassCLFnoShading.csv`);
}

export function findGlassCLFnoShadingTimeRange(
    data: GlassCLFnoShadingRow[],
    direction: string,
    startTime: string,
    endTime: string
): GlassCLFnoShadingRow[] {
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    return data.filter(
        (r) =>
            r.Direction.toLowerCase() === direction.toLowerCase() &&
            Number(r.Hour) >= start &&
            Number(r.Hour) <= end
    );
}