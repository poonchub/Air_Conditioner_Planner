import type { CLTDWallsRoofsRow } from "@/types/CLTDWallsRoofsRow";
import { loadCsv } from "./csvLoader";

export async function loadCltdData(): Promise<CLTDWallsRoofsRow[]> {
    return loadCsv<CLTDWallsRoofsRow>("/data/CLTDWallsRoofs.csv");
}

export function findCltd(
    data: CLTDWallsRoofsRow[],
    lat: string,
    month: string,
    direction: string
): string | null {
    const row = data.find((r) => {
        const latMatch = Number(r.Lat) === Number(lat);
        const monthMatch = r.Month
            ? r.Month.split("/").some((m) => m.toLowerCase().startsWith(month.toLowerCase()))
            : false;
        const directionMatch = r.Direction
            ? r.Direction.split("/").some((d) => d.toLowerCase() === direction.toLowerCase())
            : false;
        return latMatch && monthMatch && directionMatch;
    });

    return row ? row.CLTD : null;
}
