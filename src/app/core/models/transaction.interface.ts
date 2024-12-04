import { Category } from "./category.interface";

export interface Transaction {
    name: string,
    amount: number,
    transactionType: TransactionType,
    category: Category,
    transactionDate: string,
    id: string
}

export enum TransactionType {
    INCOME = 'Income',
    EXPENSE = 'Expense',
}