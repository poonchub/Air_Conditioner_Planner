import { BASE_URL } from "@/pages/MainPage/MainPage";
import type { BTUAirRow } from "@/types/BTUAirRow";
import { loadCsv } from "./csvLoader";

export async function loadBTUAirRowData(): Promise<BTUAirRow[]> {
    return loadCsv<BTUAirRow>(`${BASE_URL}/data/BTUAir.csv`);
}

export function getClosestBTUAirData(
    data: BTUAirRow[],
    airType: string,
    targetBTU: number
): BTUAirRow | undefined {
    // กรองแถวที่ตรงกับ airType
    const filtered = data.filter(
        (r) => r.AirType.trim().toLowerCase() === airType.trim().toLowerCase()
    );

    if (filtered.length === 0) return undefined;

    // หา BTU ที่มากกว่าและใกล้เคียงที่สุด
    let closest = filtered
        .filter((r) => Number(r.BTU) >= targetBTU)
        .sort((a, b) => Number(a.BTU) - Number(b.BTU))[0];

    // ถ้าไม่มี BTU ที่มากกว่าเท่ากับ target ให้เอามากที่สุดที่น้อยกว่า
    if (!closest) {
        closest = filtered
            .sort((a, b) => Number(b.BTU) - Number(a.BTU))[0];
    }

    return closest;
}