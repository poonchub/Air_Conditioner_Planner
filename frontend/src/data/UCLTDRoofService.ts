import type { UCLTDRoofRow } from "@/types/UCLTDRoofRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadUCLTDRoofData(): Promise<UCLTDRoofRow[]> {
    return loadCsv<UCLTDRoofRow>(`${BASE_URL}/data/UCLTDRoof.csv`);
}

export function getUCLTDRoofData(
    data: UCLTDRoofRow[],
    roofType: string,
): UCLTDRoofRow | undefined {
    return data.find(
        (r) => r.RoofType.toLowerCase() === roofType.toLowerCase()
    );
}

export function findUCLTDRoofTimeRange(
    data: UCLTDRoofRow[],
    roofType: string,
    ceiling: string,
    startTime: string,
    endTime: string
): UCLTDRoofRow[] {
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    return data.filter(
        (r) =>
            r.RoofType.toLowerCase() === roofType.toLowerCase() &&
            r.Ceiling.toLowerCase() === ceiling.toLowerCase() &&
            Number(r.Hour) >= start &&
            Number(r.Hour) <= end
    );
}

export function findUvalue(
    data: UCLTDRoofRow[],
    roofType: string,
    ceiling: string,
): string | null {
    const row = data.find(
        (r) =>
            r.RoofType.toLowerCase() === roofType.toLowerCase() &&
            r.Ceiling.toLowerCase() === ceiling.toLowerCase()
    );
    return row ? row.Uvalue : null;
}