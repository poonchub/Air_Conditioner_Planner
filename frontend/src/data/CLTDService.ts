import type { GlassCLTDRow } from "@/types/GlassCLTDRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadCLTDGlassData(): Promise<GlassCLTDRow[]> {
    return loadCsv<GlassCLTDRow>(`${BASE_URL}/data/GlassCLTD.csv`);
}

export function findCLTDGlassTimeRange(
    data: GlassCLTDRow[],
    startTime: string,
    endTime: string
): GlassCLTDRow[] {
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    if (end >= start) {
        // กรณีปกติ
        return data.filter(
            (r) => Number(r.Hour) >= start && Number(r.Hour) <= end
        );
    } else {
        // กรณีข้ามวัน เช่น 22 → 2
        return data.filter(
            (r) => Number(r.Hour) >= start || Number(r.Hour) <= end
        );
    }
}