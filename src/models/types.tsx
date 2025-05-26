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

export const years = [2023, 2024, 2025, 2026];

export const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];