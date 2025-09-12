import { BASE_URL } from "@/pages/MainPage/MainPage";
import type { BTUAirRow } from "@/types/BTUAirRow";
import { loadCsv } from "./csvLoader";

export interface ClosestBTUResult {
    data: BTUAirRow;
    recommendedUnits: number;
}

export async function loadBTUAirRowData(): Promise<BTUAirRow[]> {
    return loadCsv<BTUAirRow>(`${BASE_URL}/data/BTUAir.csv`);
}

export function getClosestBTUAirData(
    data: BTUAirRow[],
    airType: string,
    targetBTU: number,
    maxUnits = 10
): ClosestBTUResult | undefined {
    // กรองแถวที่ตรงกับ airType
    const filtered = data.filter(
        (r) => r.AirType.trim().toLowerCase() === airType.trim().toLowerCase()
    );

    if (filtered.length === 0) return undefined;

    // หา BTU ที่มากกว่าและใกล้เคียงที่สุด
    let recommendedUnits = 1;

    while (recommendedUnits <= maxUnits) {
        const adjustedTarget = targetBTU / recommendedUnits;

        // หา BTU ที่มากกว่าเท่ากับ adjustedTarget
        let closest = filtered
            .filter((r) => Number(r.BTU) >= adjustedTarget)
            .sort((a, b) => Number(a.BTU) - Number(b.BTU))[0];

        if (closest) {
            return {
                data: closest,
                recommendedUnits,
            };
        }

        recommendedUnits += 1; // เพิ่มจำนวนเครื่องและลองใหม่
    }

    // ถ้าไม่เจอ BTU ที่มากกว่าแม้กระทั่ง 1 unit ก็เอามากที่สุด
    const maxBTU = filtered.sort((a, b) => Number(b.BTU) - Number(a.BTU))[0];
    return {
        data: maxBTU,
        recommendedUnits: 1,
    };
}