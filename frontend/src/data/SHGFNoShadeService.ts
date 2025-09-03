import type { SHGFNoShadeRow } from "@/types/SHGFNoShadeRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadSHGFNoShadeData(): Promise<SHGFNoShadeRow[]> {
    return loadCsv<SHGFNoShadeRow>(`${BASE_URL}/data/SHGFNoShade.csv`);
}

export function findSHGFNoShade(
    data: SHGFNoShadeRow[],
    direction: string,
    month: string
): SHGFNoShadeRow[] {
    return data.filter(
        (r) =>
            r.Direction.toLowerCase() === direction.toLowerCase() &&
            r.Month.toLowerCase() === month.toLowerCase()
    );
}

export function interpolateSHGFNoShadeByLat(
    data: SHGFNoShadeRow[],
    targetLat: number,
    direction: string
): SHGFNoShadeRow[] {
    // เช็คว่ามีข้อมูล targetLat และ direction อยู่แล้วหรือไม่
    const existingData = data.filter(
        (d) => Number(d.Lat) === targetLat && d.Direction === direction
    );
    if (existingData.length > 0) {
        return existingData;
    }

    // หา lat ทั้งหมดที่มีใน data ของทิศที่เลือก
    const uniqueLats = Array.from(
        new Set(data.filter((d) => d.Direction === direction).map((d) => Number(d.Lat)))
    ).sort((a, b) => a - b);

    // หา lat ที่อยู่ต่ำกว่าและสูงกว่า targetLat
    const lowerLat = Math.max(...uniqueLats.filter((lat) => lat < targetLat));
    const upperLat = Math.min(...uniqueLats.filter((lat) => lat > targetLat));

    if (!isFinite(lowerLat) || !isFinite(upperLat)) {
        console.warn(`ไม่พบ lat ที่สามารถ interpolate ได้สำหรับ ${targetLat} และทิศ ${direction}`);
        return [];
    }

    // กรองข้อมูลของ lat ที่จะใช้ในการ interpolate
    const lowerData = data.filter((d) => Number(d.Lat) === lowerLat && d.Direction === direction);
    const upperData = data.filter((d) => Number(d.Lat) === upperLat && d.Direction === direction);

    // สร้างข้อมูลใหม่ของ targetLat
    const interpolatedData: SHGFNoShadeRow[] = lowerData.map((ld) => {
        const matched = upperData.find((ud) => ud.Month === ld.Month);
        if (!matched) return null;

        // interpolation ตามระยะห่างระหว่าง lat
        const ratio = (targetLat - lowerLat) / (upperLat - lowerLat);
        const interpolatedSHGF =
            Number(ld.SHGF) + (Number(matched.SHGF) - Number(ld.SHGF)) * ratio;

        return {
            Lat: targetLat.toString(),
            Month: ld.Month,
            Direction: direction,
            SHGF: interpolatedSHGF.toFixed(2), // เก็บเป็น string
        };
    }).filter(Boolean) as SHGFNoShadeRow[];

    return interpolatedData;
}
