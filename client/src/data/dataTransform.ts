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
  monthlyRevenue: number[];
  channelMix: Record<string, number>;
};

const monthIndex = (date: string) => new Date(`${date}T00:00:00`).getMonth();

export function transformOrders(rows: OrderRow[], selectedRegion = "All regions"): AnalyticsSummary {
  const completedRows = rows.filter((row) => row.status !== "cancelled");
  const filteredRows = selectedRegion === "All regions"
    ? completedRows
    : completedRows.filter((row) => row.region === selectedRegion);

  const revenue = filteredRows.reduce((total, row) => total + row.revenue, 0);
  const customers = new Map<string, number>();
  const monthlyRevenue = Array.from({ length: 6 }, () => 0);
  const channelRevenue: Record<string, number> = {};

  filteredRows.forEach((row) => {
    customers.set(row.customerId, (customers.get(row.customerId) ?? 0) + 1);

    const month = monthIndex(row.date);
    if (month >= 0 && month < 6) {
      monthlyRevenue[month] += row.revenue;
    }

    channelRevenue[row.channel] = (channelRevenue[row.channel] ?? 0) + row.revenue;
  });

  const repeatCustomers = Array.from(customers.values()).filter((orderCount) => orderCount > 1).length;
  const activeAccounts = customers.size;
  const channelMix = Object.fromEntries(
    Object.entries(channelRevenue).map(([channel, channelValue]) => [
      channel,
      revenue === 0 ? 0 : Math.round((channelValue / revenue) * 100),
    ]),
  );

  return {
    revenue,
    repeatRate: activeAccounts === 0 ? 0 : (repeatCustomers / activeAccounts) * 100,
    averageOrderValue: filteredRows.length === 0 ? 0 : revenue / filteredRows.length,
    activeAccounts,
    monthlyRevenue,
    channelMix,
  };
}
