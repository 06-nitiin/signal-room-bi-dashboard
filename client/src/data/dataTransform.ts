export type OrderRow = {
  orderId: string;
  date: string;
  region: string;
  channel: string;
  customerId: string;
  revenue: number;
  status?: "completed" | "cancelled";
};

export type AnalyticsSummary = {
  revenue: number;
  repeatRate: number;
  averageOrderValue: number;
  activeAccounts: number;
  monthlyLabels: string[];
  monthlyRevenue: number[];
  channelMix: Record<string, number>;
};

type InvoiceSummary = {
  customerId: string;
  date: string;
  channel: string;
  revenue: number;
};

export function transformOrders(rows: OrderRow[], selectedRegion = "All regions"): AnalyticsSummary {
  const completedRows = rows.filter((row) => row.status !== "cancelled");
  const filteredRows = selectedRegion === "All regions"
    ? completedRows
    : completedRows.filter((row) => row.region === selectedRegion);

  const invoices = new Map<string, InvoiceSummary>();
  const monthlyTotals: Record<string, number> = {};
  const channelRevenue: Record<string, number> = {};

  for (const row of filteredRows) {
    const existingInvoice = invoices.get(row.orderId);
    invoices.set(row.orderId, {
      customerId: existingInvoice?.customerId ?? row.customerId,
      date: existingInvoice?.date ?? row.date,
      channel: existingInvoice?.channel ?? row.channel,
      revenue: (existingInvoice?.revenue ?? 0) + row.revenue,
    });

    const month = row.date.slice(0, 7);
    monthlyTotals[month] = (monthlyTotals[month] ?? 0) + row.revenue;
    channelRevenue[row.channel] = (channelRevenue[row.channel] ?? 0) + row.revenue;
  }

  const customerOrders = new Map<string, Set<string>>();
  invoices.forEach((invoice, orderId) => {
    if (!customerOrders.has(invoice.customerId)) customerOrders.set(invoice.customerId, new Set());
    customerOrders.get(invoice.customerId)?.add(orderId);
  });

  const revenue = filteredRows.reduce((total, row) => total + row.revenue, 0);
  const activeAccounts = customerOrders.size;
  const repeatCustomers = Array.from(customerOrders.values()).filter((orders) => orders.size > 1).length;
  const monthlyEntries = Object.entries(monthlyTotals).sort(([left], [right]) => left.localeCompare(right));
  const channelMix = Object.fromEntries(
    Object.entries(channelRevenue).map(([channel, channelValue]) => [
      channel,
      revenue === 0 ? 0 : Math.round((channelValue / revenue) * 100),
    ]),
  );

  return {
    revenue,
    repeatRate: activeAccounts === 0 ? 0 : (repeatCustomers / activeAccounts) * 100,
    averageOrderValue: invoices.size === 0 ? 0 : revenue / invoices.size,
    activeAccounts,
    monthlyLabels: monthlyEntries.map(([month]) => month),
    monthlyRevenue: monthlyEntries.map(([, value]) => value),
    channelMix,
  };
}
