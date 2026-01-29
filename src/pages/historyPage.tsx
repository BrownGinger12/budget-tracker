// src/pages/HistoryPage.tsx
import React, { useState, useEffect } from "react";
import { PiggyBank, TrendingUp } from "lucide-react";
import { useAuth } from "../context/authContext";
import { Expense } from "../types/types";
import { getBudget, getExpensesByDate } from "../firebase/firebaseServices";

const HistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryData();
  }, [currentUser, selectedDate]);

  const fetchHistoryData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Get current month for budget
      const month = selectedDate.slice(0, 7);
      const budgetData = await getBudget(currentUser.uid, month);
      setBudget(budgetData?.amount || 0);

      // Get expenses for selected date
      const expensesData = await getExpensesByDate(
        currentUser.uid,
        selectedDate,
      );
      setExpenses(expensesData);

      // Generate last 7 days for date selection
      const dates: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalExpenses;
  const percentageUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "bg-orange-500",
      Transportation: "bg-blue-500",
      Utilities: "bg-purple-500",
      Entertainment: "bg-pink-500",
      Healthcare: "bg-red-500",
      Education: "bg-green-500",
      Housing: "bg-yellow-500",
      Others: "bg-gray-500",
    };
    return colors[category] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Expense History
          </h1>
          <p className="text-gray-600">View your past expenses by date</p>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Date
          </label>
          <div className="flex flex-wrap gap-3">
            {availableDates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedDate === date
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Monthly Budget</h3>
              <PiggyBank className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₱{budget.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Day's Expenses</h3>
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

        {/* Progress Bar */}
        {budget > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">
                Budget Usage (Month to Date)
              </h3>
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

        {/* Expenses List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Expenses for {formatDate(selectedDate)}
          </h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No expenses recorded for this date.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
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
                        <span
                          className={`px-3 py-1 text-white text-xs rounded-full ${getCategoryColor(expense.category)}`}
                        >
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(expense.date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-lg font-bold text-red-600">
                        -₱{expense.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Category Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from(new Set(expenses.map((e) => e.category))).map(
                    (category) => {
                      const categoryTotal = expenses
                        .filter((e) => e.category === category)
                        .reduce((sum, e) => sum + e.amount, 0);
                      return (
                        <div
                          key={category}
                          className="bg-blue-50 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}
                            ></div>
                            <span className="font-medium text-sm text-gray-700">
                              {category}
                            </span>
                          </div>
                          <p className="text-xl font-bold text-gray-800">
                            ₱{categoryTotal.toFixed(2)}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
