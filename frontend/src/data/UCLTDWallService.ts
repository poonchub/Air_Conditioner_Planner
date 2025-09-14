import type { UCLTDWallRow } from "@/types/UCLTDWallRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadUCLTDWallData(): Promise<UCLTDWallRow[]> {
    return loadCsv<UCLTDWallRow>(`${BASE_URL}/data/UCLTDWall.csv`);
}

export function getUCLTDWallData(
    data: UCLTDWallRow[],
    wallType: string,
): UCLTDWallRow | undefined {
    return data.find(
        (r) => r.WallType.toLowerCase() === wallType.toLowerCase()
    );
}

export function findUCLTDWallTimeRange(
    data: UCLTDWallRow[],
    wallType: string,
    direction: string,
    startTime: string,
    endTime: string
): UCLTDWallRow[] {
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);
    const wall = wallType.toLowerCase();
    const dir = direction.toLowerCase();

    if (end >= start) {
        // ✅ ไม่ข้ามวัน เช่น 9 → 17
        return data.filter(
            (r) =>
                r.WallType.toLowerCase() === wall &&
                r.Direction.toLowerCase() === dir &&
                Number(r.Hour) >= start &&
                Number(r.Hour) <= end
        );
    } else {
        // ✅ ข้ามวัน เช่น 22 → 2
        return data.filter(
            (r) =>
                r.WallType.toLowerCase() === wall &&
                r.Direction.toLowerCase() === dir &&
                (Number(r.Hour) >= start || Number(r.Hour) <= end)
        );
    }
}

export function findUvalueWall(
    data: UCLTDWallRow[],
    wallType: string,
): string | null {
    const row = data.find(
        (r) =>
            r.WallType.toLowerCase() === wallType.toLowerCase()
    );
    return row ? row.Uvalue : null;
}