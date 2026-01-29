// src/services/firebaseService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
  setDoc,
  limit,
} from "firebase/firestore";
import { Budget, Expense } from "../types/types";
import { db } from "./firebaseConfig";

// Expense Services
export const addExpense = async (
  userId: string,
  expense: Omit<Expense, "id" | "userId" | "createdAt">,
) => {
  const expenseData = {
    ...expense,
    userId,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "expenses"), expenseData);
  return docRef.id;
};

export const getExpenses = async (userId: string): Promise<Expense[]> => {
  const q = query(collection(db, "expenses"), where("userId", "==", userId));

  const querySnapshot = await getDocs(q);
  const expenses = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Expense[];

  // Sort in memory instead of using orderBy to avoid index requirement
  return expenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getExpensesByDate = async (
  userId: string,
  date: string,
): Promise<Expense[]> => {
  const q = query(
    collection(db, "expenses"),
    where("userId", "==", userId),
    where("date", "==", date),
  );

  const querySnapshot = await getDocs(q);
  const expenses = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Expense[];

  // Sort in memory
  return expenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const deleteExpense = async (expenseId: string) => {
  await deleteDoc(doc(db, "expenses", expenseId));
};

// Budget Services
export const setBudget = async (
  userId: string,
  amount: number,
  month: string,
) => {
  // Use month as document ID to ensure one budget per month
  const budgetRef = doc(db, "budgets", `${userId}_${month}`);

  const budgetData = {
    userId,
    amount,
    month,
    createdAt: Timestamp.now(),
  };

  await setDoc(budgetRef, budgetData);
  return budgetRef.id;
};

export const getBudget = async (
  userId: string,
  month: string,
): Promise<Budget | null> => {
  const q = query(
    collection(db, "budgets"),
    where("userId", "==", userId),
    where("month", "==", month),
    limit(1),
  );

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    } as Budget;
  } catch (error) {
    console.error("Error fetching budget:", error);
    return null;
  }
};

export const updateBudget = async (budgetId: string, amount: number) => {
  await updateDoc(doc(db, "budgets", budgetId), { amount });
};

// Get expenses by month
export const getExpensesByMonth = async (
  userId: string,
  month: string,
): Promise<Expense[]> => {
  const q = query(collection(db, "expenses"), where("userId", "==", userId));

  const querySnapshot = await getDocs(q);
  const expenses = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Expense[];

  // Filter by month (format: YYYY-MM) and sort in memory
  return expenses
    .filter((expense) => expense.date.startsWith(month))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
