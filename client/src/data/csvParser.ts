import type { OrderRow } from "./dataTransform";

const requiredColumns = ["orderId", "date", "region", "channel", "customerId", "revenue"];

export function parseOrdersCsv(csvText: string): OrderRow[] {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((header) => header.trim());
  const missingColumns = requiredColumns.filter((column) => !headers.includes(column));
  if (missingColumns.length > 0) {
    throw new Error(`CSV is missing required columns: ${missingColumns.join(", ")}`);
  }

  return lines.slice(1).map((line, lineIndex) => {
    const values = line.split(",").map((value) => value.trim());
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    const revenue = Number(row.revenue);

    if (!row.orderId || !row.date || !row.region || !row.channel || !row.customerId || Number.isNaN(revenue)) {
      throw new Error(`Invalid order row at CSV line ${lineIndex + 2}`);
    }

    return {
      orderId: row.orderId,
      date: row.date,
      region: row.region,
      channel: row.channel,
      customerId: row.customerId,
      revenue,
      status: row.status === "cancelled" ? "cancelled" : "completed",
    };
  });
}
