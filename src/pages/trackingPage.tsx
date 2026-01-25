import React, { useState } from "react";
import {
  PiggyBank,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const EXPENSE_CATEGORIES = [
  "Transportation",
  "Food",
  "Utilities",
  "Healthcare",
  "Education",
  "Entertainment",
  "Housing",
  "Others",
];

const TrackingPage: React.FC = () => {
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [budgetInput, setBudgetInput] = useState<string>("");
  const [expenseDescription, setExpenseDescription] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<string>("");
  const [expenseCategory, setExpenseCategory] = useState<string>("Food");

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const remaining = budget - totalExpenses;
  const percentageUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      setBudget(amount);
      setBudgetInput("");
      setShowBudgetModal(false);
    }
  };

  const handleAddBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      setBudget(budget + amount);
      setBudgetInput("");
      setShowBudgetModal(false);
    }
  };

  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (
      expenseDescription.trim() &&
      !isNaN(amount) &&
      amount > 0 &&
      expenseCategory
    ) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        description: expenseDescription,
        amount: amount,
        category: expenseCategory,
        date: new Date().toLocaleDateString(),
      };
      setExpenses([newExpense, ...expenses]);
      setExpenseDescription("");
      setExpenseAmount("");
      setExpenseCategory("Food");
      setShowExpenseModal(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Budget Tracking
          </h1>
          <p className="text-gray-600">
            Manage your budget and track your expenses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Total Budget</h3>
              <PiggyBank className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₱{budget.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Total Expenses</h3>
              <TrendingUp className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₱{totalExpenses.toFixed(2)}
            </p>
          </div>

          <div
            className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${remaining >= 0 ? "border-green-500" : "border-yellow-500"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Remaining</h3>
              <TrendingUp
                className={`w-6 h-6 ${remaining >= 0 ? "text-green-500" : "text-yellow-500"}`}
              />
            </div>
            <p
              className={`text-3xl font-bold ${remaining >= 0 ? "text-green-600" : "text-yellow-600"}`}
            >
              ₱{Math.abs(remaining).toFixed(2)}
            </p>
          </div>
        </div>

        {budget > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Budget Usage</h3>
              <span className="text-sm text-gray-600">
                {percentageUsed.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentageUsed > 90
                    ? "bg-red-500"
                    : percentageUsed > 70
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowBudgetModal(true)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Set/Add Budget</span>
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Add Expense</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Expenses
          </h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>
                No expenses yet. Start tracking by adding your first expense!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {expense.description}
                      </h4>
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        {expense.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{expense.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-bold text-red-600">
                      -₱{expense.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showBudgetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Manage Budget
              </h2>
              <input
                type="number"
                placeholder="Enter amount"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSetBudget}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Set Budget
                </button>
                <button
                  onClick={handleAddBudget}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Add to Budget
                </button>
              </div>
              <button
                onClick={() => {
                  setShowBudgetModal(false);
                  setBudgetInput("");
                }}
                className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Add Expense
              </h2>
              <input
                type="text"
                placeholder="Description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 mb-3"
              />
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 mb-3 text-gray-700"
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount (₱)"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              />
              <button
                onClick={handleAddExpense}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Add Expense
              </button>
              <button
                onClick={() => {
                  setShowExpenseModal(false);
                  setExpenseDescription("");
                  setExpenseAmount("");
                  setExpenseCategory("Food");
                }}
                className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
