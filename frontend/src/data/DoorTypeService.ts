import { BASE_URL } from "@/pages/MainPage/MainPage";
import type { DoorTypeRow } from "@/types/DoorTypeRow";
import { loadCsv } from "./csvLoader";

export async function loadDoorTypeData(): Promise<DoorTypeRow[]> {
    return loadCsv<DoorTypeRow>(`${BASE_URL}/data/DoorType.csv`);
}

export function getDoorTypeData(
    data: DoorTypeRow[],
    doorType: string,
): DoorTypeRow | undefined {
    return data.find(
        (r) => r.DoorType.toLowerCase() === doorType.toLowerCase()
    );
}