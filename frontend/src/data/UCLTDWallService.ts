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