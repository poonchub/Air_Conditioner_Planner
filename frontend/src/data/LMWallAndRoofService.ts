import type { LMWallAndRoofRow } from "@/types/LMWallAndRoofRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadLMWallAndRoofData(): Promise<LMWallAndRoofRow[]> {
    return loadCsv<LMWallAndRoofRow>(`${BASE_URL}/data/LMWallAndRoof.csv`);
}

export function getLMWallAndRoofData(
    data: LMWallAndRoofRow[],
    lat: string,
    month: string
): LMWallAndRoofRow | undefined {
    return data.find(
        (r) =>
            r.Lat.toLowerCase() === lat.toLowerCase() &&
            r.month.toLowerCase() === month.toLowerCase()
    );
}

export function interpolateLMByLat(
    data: LMWallAndRoofRow[],
    targetLat: number
): LMWallAndRoofRow[] {
    // เช็คว่ามีข้อมูล targetLat อยู่แล้วหรือไม่
    const existingData = data.filter((d) => Number(d.Lat) === targetLat);
    if (existingData.length > 0) {
        return existingData;
    }

    // หา lat ทั้งหมดที่มีใน data
    const uniqueLats = Array.from(new Set(data.map((d) => Number(d.Lat)))).sort((a, b) => a - b);

    // หา lat ที่อยู่ต่ำกว่าและสูงกว่า targetLat
    const lowerLat = Math.max(...uniqueLats.filter((lat) => lat < targetLat));
    const upperLat = Math.min(...uniqueLats.filter((lat) => lat > targetLat));

    if (!lowerLat || !upperLat) {
        console.warn(`ไม่พบ lat ที่สามารถ interpolate ได้สำหรับ ${targetLat}`);
        return [];
    }

    // กรองข้อมูลของ lat ที่จะใช้ในการ interpolate
    const lowerData = data.filter((d) => Number(d.Lat) === lowerLat);
    const upperData = data.filter((d) => Number(d.Lat) === upperLat);

    // สร้างข้อมูลใหม่ของ targetLat
    const interpolatedData: LMWallAndRoofRow[] = lowerData
        .map((ld) => {
            const matched = upperData.find(
                (ud) => ud.Month === ld.Month && ud.Direction === ld.Direction
            );
            if (!matched) return null;

            const avgLM = (Number(ld.LM) + Number(matched.LM)) / 2;

            return {
                Lat: targetLat.toString(),
                Month: ld.Month,
                Direction: ld.Direction,
                LM: avgLM.toString(), // ถ้า LM เป็น string
            };
        })
        .filter(Boolean) as LMWallAndRoofRow[];

    return interpolatedData;
}
