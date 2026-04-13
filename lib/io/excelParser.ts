import * as XLSX from "xlsx";
import type { DataRow, Variable } from "@/lib/types";
import { nanoid } from "nanoid";

export async function parseExcel(
  file: File
): Promise<{ rows: DataRow[]; variables: Variable[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("Failed to read file");

        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Get headers from first row
        const csvData = XLSX.utils.sheet_to_json(worksheet) as Record<
          string,
          unknown
        >[];

        if (csvData.length === 0) {
          resolve({ rows: [], variables: [] });
          return;
        }

        // Extract column names
        const columnNames = Object.keys(csvData[0] || {});

        // Infer types
        const variables: Variable[] = columnNames.map((name) => {
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
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
}
