"use client";

interface StatTableProps {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

export function StatTable({ headers, rows, title }: StatTableProps) {
  return (
    <div className="overflow-x-auto">
      {title && <h3 className="font-semibold text-sm mb-2">{title}</h3>}
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-spss-header border border-spss-border">
            {headers.map((header, i) => (
              <th
                key={i}
                className="border border-spss-border px-2 py-1 text-left font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {row.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  className="border border-spss-border px-2 py-1"
                >
                  {typeof cell === "number" ? cell.toFixed(4) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
