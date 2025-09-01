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

    return data.filter(
        (r) =>
            r.WallType.toLowerCase() === wallType.toLowerCase() &&
            r.Direction.toLowerCase() === direction.toLowerCase() &&
            Number(r.Hour) >= start &&
            Number(r.Hour) <= end
    );
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