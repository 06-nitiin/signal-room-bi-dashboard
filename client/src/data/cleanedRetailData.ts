export type CleanedRetailRow = {
  orderId: string;
  date: string;
  region: string;
  channel: string;
  customerId: string;
  quantity: number;
  revenue: number;
  status: "completed";
};

// This cleaning script writes the real rows to the csv file

export const cleanedRetailData: CleanedRetailRow[] = [];
