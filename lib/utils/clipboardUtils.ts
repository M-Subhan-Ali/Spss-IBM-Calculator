/**
 * Parse clipboard TSV (tab-separated value) text from Excel/Google Sheets paste
 * Returns a 2D array where each inner array is a row of cell values
 */
export function parseClipboardText(text: string): string[][] {
  const lines = text.split("\n");
  const data: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = line.split("\t");
    data.push(cells);
  }

  return data;
}
