import type { ClimateDataRow } from "@/types/ClimateDataRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadClimateData(): Promise<ClimateDataRow[]> {
    return loadCsv<ClimateDataRow>(`${BASE_URL}/data/ClimateData.csv`);
}

export function getClimateData(
    data: ClimateDataRow[],
    province: string,
): ClimateDataRow | undefined {
    return data.find(
        (r) => r.Province.toLowerCase() === province.toLowerCase()
    );
}