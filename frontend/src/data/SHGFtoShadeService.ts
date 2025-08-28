import { BASE_URL } from "@/pages/MainPage/MainPage";
import type { SHGFtoShadeRow } from "@/types/SHGFtoShadeRow";
import { loadCsv } from "./csvLoader";

export async function loadSHGFtoShadeData(): Promise<SHGFtoShadeRow[]> {
    return loadCsv<SHGFtoShadeRow>(`${BASE_URL}/data/SHGFtoShade.csv`);
}

export function findSHGFtoShade(
    data: SHGFtoShadeRow[],
    direction: string,
): SHGFtoShadeRow[] {
    return data.filter(
        (r) =>
            r.Direction.toLowerCase() === direction.toLowerCase()
    );
}