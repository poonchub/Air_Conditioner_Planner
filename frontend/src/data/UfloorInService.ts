import type { UfloorInRow } from "@/types/UfloorInRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadUfloorInData(): Promise<UfloorInRow[]> {
    return loadCsv<UfloorInRow>(`${BASE_URL}/data/UfloorIn.csv`);
}

export function findUfloorIn(
    data: UfloorInRow[],
    insulation: string,
    ceiling: string
): UfloorInRow | undefined {
    return data.find(
        (r) =>
            r.Insulation.toLowerCase() === insulation.toLowerCase() &&
            r.Ceiling.toLowerCase() === ceiling.toLowerCase()
    );
}
