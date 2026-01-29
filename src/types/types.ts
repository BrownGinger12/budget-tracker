// src/types/index.ts
import React from "react";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  contactNumber: string;
  streak: number;
  avatarUrl: string | null;
  createdAt: Date;
}

export interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  amount: number;
  month: string;
  createdAt: Date;
}

export interface HistoricalData {
  date: string;
  budget: number;
  expenses: Expense[];
}

export interface DailySavings {
  date: string;
  totalBudget: number;
  totalExpenses: number;
  saved: number;
  categoryBreakdown: {
    category: string;
    budgeted: number;
    spent: number;
    saved: number;
  }[];
}

export interface DashboardStats {
  totalBudget: number;
  totalExpenses: number;
  totalSavings: number;
  monthlyAverage: number;
}

export interface RecentActivity {
  id: string;
  type: "expense" | "budget" | "saving";
  description: string;
  amount: number;
  date: string;
  category?: string;
}

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export const EXPENSE_CATEGORIES = [
  "Transportation",
  "Food",
  "Utilities",
  "Healthcare",
  "Education",
  "Entertainment",
  "Housing",
  "Others",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
