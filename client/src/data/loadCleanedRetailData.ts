import { parseOrdersCsv } from "./csvParser";
import { transformOrders, type AnalyticsSummary, type OrderRow } from "./dataTransform";

export const cleanedRetailCsvPath = "/data/online-retail-cleaned.csv";

export async function loadCleanedRetailData(
  csvPath = cleanedRetailCsvPath,
): Promise<OrderRow[]> {
  const response = await fetch(csvPath);

  if (!response.ok) {
    throw new Error(`Could not load cleaned retail data: ${response.status} ${response.statusText}`);
  }

  return parseOrdersCsv(await response.text());
}

export async function loadCleanedRetailSummary(
  selectedRegion = "All regions",
  csvPath = cleanedRetailCsvPath,
): Promise<AnalyticsSummary> {
  const rows = await loadCleanedRetailData(csvPath);
  return transformOrders(rows, selectedRegion);
}

export function getRegionsFromRows(rows: OrderRow[]): string[] {
  return ["All regions", ...Array.from(new Set(rows.map((row) => row.region))).sort()];
}
