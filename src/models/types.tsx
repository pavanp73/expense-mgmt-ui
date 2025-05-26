export interface CategoryExpense {
  category: string;
  totalAmount: number;
  transactionsCount: number;
}

export interface ChartData {
    total: number;
    categoryWiseData: CategoryExpense[];
    month: string;
    year: string;
}

export interface Transaction {
  id: number;
  category: string;
  amount: number;
  transactionDate: string;
  description: string;
}