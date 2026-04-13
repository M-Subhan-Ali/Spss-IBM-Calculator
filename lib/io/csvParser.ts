import Papa from "papaparse";
import type { DataRow, Variable } from "@/lib/types";
import { nanoid } from "nanoid";

export async function parseCSV(
  file: File
): Promise<{ rows: DataRow[]; variables: Variable[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      complete(results) {
        try {
          const csvData = results.data as Record<string, unknown>[];

          if (csvData.length === 0) {
            resolve({ rows: [], variables: [] });
            return;
          }

          // Extract column names from first row
          const columnNames = Object.keys(csvData[0] || {});

          // Infer variable types by checking first few values
          const variables: Variable[] = columnNames.map((name) => {
            // Check if all non-empty values in this column are numeric
            let isNumeric = true;
            for (let i = 0; i < Math.min(100, csvData.length); i++) {
              const value = csvData[i][name];
              if (value && !isFinite(Number(value))) {
                isNumeric = false;
                break;
              }
            }

            return {
              id: `col_${nanoid()}`,
              name: name,
              label: name,
              type: isNumeric ? "numeric" : "string",
              width: 100,
              decimals: isNumeric ? 2 : 0,
              missingValues: [],
              defaultValue: null,
              measureLevel: isNumeric ? "scale" : "nominal",
            };
          });

          // Convert rows
          const rows: DataRow[] = csvData.map((row) => {
            const dataRow: DataRow = { _id: nanoid() };
            variables.forEach((v) => {
              const val = row[v.name];
              dataRow[v.id] = val ? String(val) : null;
            });
            return dataRow;
          });

          resolve({ rows, variables });
        } catch (error) {
          reject(error);
        }
      },
      error(error) {
        reject(error);
      },
    });
  });
}
