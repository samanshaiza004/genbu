export type ExpenseItem = {
  uid: string;
  id: string;
  title: string;
  amount: number;
  date: Date;
  tags?: string[];
};
