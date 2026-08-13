import { parseOrdersCsv } from "./csvParser";
import { transformOrders, type AnalyticsSummary } from "./dataTransform";

export function summaryFromCsv(csvText: string, selectedRegion = "All regions"): 
AnalyticsSummary {
  const orders = parseOrdersCsv(csvText);
  return transformOrders(orders, selectedRegion);
}
