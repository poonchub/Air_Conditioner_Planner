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
    const dir = direction.toLowerCase();

    if (end >= start) {
        // กรณีปกติ เช่น 9 → 17
        return data.filter(
            (r) =>
                r.Direction.toLowerCase() === dir &&
                Number(r.Hour) >= start &&
                Number(r.Hour) <= end
        );
    } else {
        // กรณีข้ามวัน เช่น 22 → 2
        return data.filter(
            (r) =>
                r.Direction.toLowerCase() === dir &&
                (Number(r.Hour) >= start || Number(r.Hour) <= end)
        );
    }
}