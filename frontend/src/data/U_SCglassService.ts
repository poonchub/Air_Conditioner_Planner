import type { U_SCglassRow } from "@/types/U_SCglassRow";
import { loadCsv } from "./csvLoader";
import { BASE_URL } from "@/pages/MainPage/MainPage";

export async function loadU_SCglassData(): Promise<U_SCglassRow[]> {
    return loadCsv<U_SCglassRow>(`${BASE_URL}/data/U_SCglass.csv`);
}

export function findU_SCglass(
    data: U_SCglassRow[],
    typeofglass: string,
): U_SCglassRow | undefined {
    return data.find(
        (r) => r.Typeofglass.toLowerCase() === typeofglass.toLowerCase()
    );
}