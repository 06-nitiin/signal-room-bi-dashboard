export type ChannelMixValue = {
  name: string;
  value: number;
  className: string;
};

export type DashboardSnapshot = {
  revenue: string;
  revenueChange: string;
  repeatRate: string;
  repeatChange: string;
  averageOrder: string;
  averageOrderChange: string;
  activeAccounts: string;
  accountsChange: string;
  monthlyRevenue: number[];
  channelMix: ChannelMixValue[];
};

export type DashboardRegion = {
  name: string;
  revenue: string;
  growth: string;
  repeat: string;
  signal: string;
};

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export const regions: DashboardRegion[] = [
  {
    name: "North",
    revenue: "$418k",
    growth: "+19.4%",
    repeat: "48.2%",
    signal: "Strong",
  },
  {
    name: "Central",
    revenue: "$356k",
    growth: "+12.1%",
    repeat: "41.7%",
    signal: "Stable",
  },
  {
    name: "West",
    revenue: "$291k",
    growth: "+8.8%",
    repeat: "39.4%",
    signal: "Watch",
  },
  {
    name: "South",
    revenue: "$224k",
    growth: "+5.6%",
    repeat: "34.9%",
    signal: "Watch",
  },
];

const mix = (
  organic: number,
  paid: number,
  partner: number,
  other: number
): ChannelMixValue[] => [
  {
    name: "Organic",
    value: organic,
    className: "mix-organic",
  },
  {
    name: "Paid",
    value: paid,
    className: "mix-paid",
  },
  {
    name: "Partner",
    value: partner,
    className: "mix-partner",
  },
  {
    name: "Other",
    value: other,
    className: "mix-other",
  },
];

export const dashboardByRegion: Record<string, DashboardSnapshot> = {
  "All regions": {
    revenue: "$1.29m",
    revenueChange: "+14.8%",
    repeatRate: "42.6%",
    repeatChange: "+6.4 pts",
    averageOrder: "$86.40",
    averageOrderChange: "+3.2%",
    activeAccounts: "14,820",
    accountsChange: "+11.9%",
    monthlyRevenue: [118, 132, 146, 141, 159, 174],
    channelMix: mix(42, 28, 18, 12),
  },

  North: {
    revenue: "$418k",
    revenueChange: "+19.4%",
    repeatRate: "48.2%",
    repeatChange: "+8.1 pts",
    averageOrder: "$92.10",
    averageOrderChange: "+5.4%",
    activeAccounts: "4,620",
    accountsChange: "+15.8%",
    monthlyRevenue: [34, 39, 43, 41, 48, 54],
    channelMix: mix(46, 24, 18, 12),
  },

  Central: {
    revenue: "$356k",
    revenueChange: "+12.1%",
    repeatRate: "41.7%",
    repeatChange: "+5.2 pts",
    averageOrder: "$84.70",
    averageOrderChange: "+2.8%",
    activeAccounts: "4,080",
    accountsChange: "+10.6%",
    monthlyRevenue: [31, 35, 39, 38, 43, 47],
    channelMix: mix(39, 31, 18, 12),
  },

  West: {
    revenue: "$291k",
    revenueChange: "+8.8%",
    repeatRate: "39.4%",
    repeatChange: "+3.6 pts",
    averageOrder: "$81.90",
    averageOrderChange: "+1.9%",
    activeAccounts: "3,410",
    accountsChange: "+7.4%",
    monthlyRevenue: [27, 30, 34, 32, 36, 39],
    channelMix: mix(36, 34, 18, 12),
  },

  South: {
    revenue: "$224k",
    revenueChange: "+5.6%",
    repeatRate: "34.9%",
    repeatChange: "+2.1 pts",
    averageOrder: "$77.30",
    averageOrderChange: "+0.8%",
    activeAccounts: "2,710",
    accountsChange: "+4.9%",
    monthlyRevenue: [20, 23, 26, 24, 27, 30],
    channelMix: mix(33, 35, 18, 14),
  },
};