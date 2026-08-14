import fs from "node:fs";

const inputPath = process.argv[2] ?? "data/processed/online-retail-cleaned.csv";

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

if (!fs.existsSync(inputPath)) {
  console.error(`Cleaned CSV not found: ${inputPath}`);
  process.exit(1);
}

const lines = fs.readFileSync(inputPath, "utf8").split(/\r?\n/).filter(Boolean);
const headers = parseCsvLine(lines[0]);
const rows = lines.slice(1).map((line) => {
  const values = parseCsvLine(line);
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
});

const revenue = rows.reduce((total, row) => total + Number(row.revenue), 0);
const orderIds = new Set(rows.map((row) => row.orderId));
const customers = new Map();
const regionCounts = {};
const monthlyRevenue = {};

for (const row of rows) {
  if (!customers.has(row.customerId)) customers.set(row.customerId, new Set());
  customers.get(row.customerId).add(row.orderId);
  regionCounts[row.region] = (regionCounts[row.region] ?? 0) + 1;

  const month = row.date.slice(0, 7);
  monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + Number(row.revenue);
}

const repeatCustomers = Array.from(customers.values()).filter((orders) => orders.size > 1).length;
const report = {
  metricGrain: {
    revenue: "completed line-item revenue",
    orders: "distinct orderId values",
    averageOrderValue: "totalRevenue / distinctOrders",
    activeAccounts: "distinct customerId values",
    repeatRate: "customers with more than one distinct order / distinct customers",
  },
  cleanedRows: rows.length,
  distinctOrders: orderIds.size,
  distinctCustomers: customers.size,
  totalRevenue: Number(revenue.toFixed(2)),
  averageOrderValue: orderIds.size === 0 ? 0 : Number((revenue / orderIds.size).toFixed(2)),
  repeatCustomers,
  repeatRate: customers.size === 0 ? 0 : Number(((repeatCustomers / customers.size) * 100).toFixed(2)),
  regionRowCounts: regionCounts,
  monthlyRevenue: Object.fromEntries(Object.entries(monthlyRevenue).sort(([left], [right]) => left.localeCompare(right)).map(([month, value]) => [month, Number(value.toFixed(2))])),
};

console.log(JSON.stringify(report, null, 2));
