import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2] ?? "data/raw/online-retail.csv";
const outputPath = process.argv[3] ?? "data/processed/online-retail-cleaned.csv";

const requiredColumns = ["InvoiceNo", "InvoiceDate", "Quantity", "UnitPrice", "CustomerID", "Country"];

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }

  values.push(value.trim());
  return values;
}

function parseInvoiceDate(value) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})\s+(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const [, monthText, dayText, rawYearText, hourText, minuteText] = match;
  const month = Number(monthText);
  const day = Number(dayText);
  const rawYear = Number(rawYearText);
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  const parsed = new Date(Date.UTC(year, month - 1, day, Number(hourText), Number(minuteText)));

  if (Number.isNaN(parsed.getTime())) return null;
  const parsedYear = parsed.getUTCFullYear();
  if (parsedYear < 2010 || parsedYear > 2011) return null;
  return parsed.toISOString();
}

function regionFromCountry(country) {
  const regions = {
    "United Kingdom": "UK",
    Ireland: "Ireland",
    Germany: "Europe",
    France: "Europe",
    Spain: "Europe",
    Netherlands: "Europe",
    Belgium: "Europe",
    Portugal: "Europe",
    Switzerland: "Europe",
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

  return regions[country] ?? "Other";
}

function escapeCsv(value) {
  const stringValue = String(value ?? "");
  return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  console.error("Download the official UCI file, export the worksheet as CSV, and save it at data/raw/online-retail.csv.");
  process.exit(1);
}

const lines = fs.readFileSync(inputPath, "utf8").split(/\r?\n/).filter(Boolean);
const headers = parseCsvLine(lines[0]);
const missingColumns = requiredColumns.filter((column) => !headers.includes(column));

if (missingColumns.length > 0) {
  throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
}

const rows = [];
const report = { inputRows: lines.length - 1, outputRows: 0, removedCancellations: 0, removedMissingCustomers: 0, removedInvalidValues: 0, removedInvalidDates: 0 };

for (const line of lines.slice(1)) {
  const values = parseCsvLine(line);
  const raw = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  const invoiceNo = raw.InvoiceNo;
  const quantity = Number(raw.Quantity);
  const unitPrice = Number(raw.UnitPrice);
  const revenue = quantity * unitPrice;
  const date = parseInvoiceDate(raw.InvoiceDate);

  if (invoiceNo.toUpperCase().startsWith("C")) {
    report.removedCancellations += 1;
    continue;
  }
  if (!raw.CustomerID) {
    report.removedMissingCustomers += 1;
    continue;
  }
  if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice) || quantity <= 0 || unitPrice <= 0) {
    report.removedInvalidValues += 1;
    continue;
  }
  if (!date) {
    report.removedInvalidDates += 1;
    continue;
  }

  rows.push({
    orderId: invoiceNo,
    date,
    region: regionFromCountry(raw.Country),
    channel: "Unknown",
    customerId: raw.CustomerID,
    quantity,
    revenue: Number(revenue.toFixed(2)),
    status: "completed",
  });
}

report.outputRows = rows.length;
const outputHeaders = ["orderId", "date", "region", "channel", "customerId", "quantity", "revenue", "status"];
const outputCsv = [outputHeaders.join(","), ...rows.map((row) => outputHeaders.map((header) => escapeCsv(row[header])).join(","))].join("\n");
const reportPath = outputPath.replace(/\.csv$/i, "-quality-report.json");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${outputCsv}\n`);
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Cleaned ${report.outputRows} rows from ${report.inputRows} input rows.`);
console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${reportPath}`);
