import Papa from "papaparse";

export async function loadCsv<T extends Record<string, unknown>>(path: string): Promise<T[]> {
    const res = await fetch(path);
    const text = await res.text();

    return new Promise((resolve) => {
        Papa.parse<T>(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data.filter((r) =>
                    Object.values(r).some((v) => v !== undefined && v !== "")
                ) as T[];
                resolve(rows);
            },
        });
    });
}