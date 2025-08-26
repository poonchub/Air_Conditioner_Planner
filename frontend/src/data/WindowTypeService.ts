import { BASE_URL } from "@/pages/MainPage/MainPage";
import { loadCsv } from "./csvLoader";
import type { WindowTypeRow } from "@/types/WindowTypeRow";

export async function loadWindowTypeData(): Promise<WindowTypeRow[]> {
    return loadCsv<WindowTypeRow>(`${BASE_URL}/data/WindowType.csv`);
}

export function getWindowTypeData(
    data: WindowTypeRow[],
    windowType: string,
): WindowTypeRow | undefined {
    return data.find(
        (r) => r.WindowType.toLowerCase() === windowType.toLowerCase()
    );
}