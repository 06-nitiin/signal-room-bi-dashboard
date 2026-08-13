import type { OrderRow } from "./dataTransform";

export type uciOnlineRetailRow = {
    InvoiceNo: string;
    StockCode: string;
    Description: string;
    Quantity: number;
    InvoiceDate: string;
    UnitPrice: number;
    CustomerID: string;
    Country: string;
};

const countryToRegion: Record<string, string> = {
    "United Kingdom": "UK",
    Ireland: "Ireland",
    Germany: "Europe",
    France: "Europe",
    Spain: "Europe",
    Netherlands: "Europe",
    Belgium: "Europe",
    Switzerland: "Europe",
    Portugal: "Europe",
    Norway: "Europe",
    Italy: "Europe",
    Australia: "APAC",
    Japan: "APAC",
    Singapore: "APAC",
    "United Arab Emirates": "Middle East",
    Canada: "North America",
    "United States": "North America",
    Brazil: "Latin America",
};

export function deriveRegion(country: string): string {
    return countryToRegion[country] ?? "Other";
}

export function mapUciRow(row: uciOnlineRetailRow): OrderRow {
    const isCancellation = row.InvoiceNo.trim().toUpperCase().startsWith("C");

    return {
        orderId: row.InvoiceNo,
        date: row.InvoiceDate,
        region: deriveRegion(row.Country),
        channel: "Unknown",
        customerId: row.CustomerID,
        revenue: row.Quantity * row.UnitPrice,
        status: isCancellation ? "cancelled" : "completed",
    };
}

export function mapUciRows(rows: uciOnlineRetailRow[]): OrderRow[] {
    return rows.map(mapUciRow);
}