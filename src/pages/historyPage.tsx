import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

// History Page Component
interface HistoricalExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface HistoricalData {
  date: string;
  budget: number;
  expenses: HistoricalExpense[];
}

const HistoryPage: React.FC = () => {
  // Sample historical data
  const [historicalData] = useState<HistoricalData[]>([
    {
      date: "2026-01-26",
      budget: 1500,
      expenses: [
        {
          id: "1",
          description: "Grocery shopping",
          amount: 450,
          category: "Food",
          date: "2026-01-26",
        },
        {
          id: "2",
          description: "Jeepney fare",
          amount: 280,
          category: "Transportation",
          date: "2026-01-26",
        },
        {
          id: "3",
          description: "Electricity bill",
          amount: 400,
          category: "Utilities",
          date: "2026-01-26",
        },
      ],
    },
    {
      date: "2026-01-25",
      budget: 1500,
      expenses: [
        {
          id: "4",
          description: "Lunch buffet",
          amount: 520,
          category: "Food",
          date: "2026-01-25",
        },
        {
          id: "5",
          description: "Grab ride",
          amount: 300,
          category: "Transportation",
          date: "2026-01-25",
        },
        {
          id: "6",
          description: "Water bill",
          amount: 380,
          category: "Utilities",
          date: "2026-01-25",
        },
        {
          id: "7",
          description: "Movie tickets",
          amount: 150,
          category: "Entertainment",
          date: "2026-01-25",
        },
      ],
    },
    {
      date: "2026-01-24",
      budget: 1500,
      expenses: [
        {
          id: "8",
          description: "Breakfast and dinner",
          amount: 400,
          category: "Food",
          date: "2026-01-24",
        },
        {
          id: "9",
          description: "Bus fare",
          amount: 250,
          category: "Transportation",
          date: "2026-01-24",
        },
        {
          id: "10",
          description: "Internet bill",
          amount: 400,
          category: "Utilities",
          date: "2026-01-24",
        },
        {
          id: "11",
          description: "Coffee shop",
          amount: 50,
          category: "Entertainment",
          date: "2026-01-24",
        },
      ],
    },
    {
      date: "2026-01-23",
      budget: 1500,
      expenses: [
        {
          id: "12",
          description: "Weekly groceries",
          amount: 600,
          category: "Food",
          date: "2026-01-23",
        },
        {
          id: "13",
          description: "Tricycle fare",
          amount: 150,
          category: "Transportation",
          date: "2026-01-23",
        },
        {
          id: "14",
          description: "Medicine",
          amount: 350,
          category: "Healthcare",
          date: "2026-01-23",
        },
        {
          id: "15",
          description: "School supplies",
          amount: 200,
          category: "Education",
          date: "2026-01-23",
        },
      ],
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<string>("2026-01-26");

  const currentData = historicalData.find((d) => d.date === selectedDate);
  const totalExpenses =
    currentData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const remaining = (currentData?.budget || 0) - totalExpenses;
  const percentageUsed = currentData?.budget
    ? (totalExpenses / currentData.budget) * 100
    : 0;

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

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Expense History
          </h1>
          <p className="text-gray-600">
            View your past budgets and expenses by date
          </p>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Date
          </label>
          <div className="flex flex-wrap gap-3">
            {historicalData.map((data) => (
              <button
                key={data.date}
                onClick={() => setSelectedDate(data.date)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedDate === data.date
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {formatDate(data.date)}
              </button>
            ))}
          </div>
        </div>

        {currentData ? (
          <>
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Budget */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Budget</h3>
                  <PiggyBank className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  ₱{currentData.budget.toFixed(2)}
                </p>
              </div>

              {/* Total Expenses */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Expenses</h3>
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  ₱{totalExpenses.toFixed(2)}
                </p>
              </div>

              {/* Remaining */}
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
            {currentData.budget > 0 && (
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

            {/* Expenses List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Expenses for {formatDate(selectedDate)}
              </h2>
              {currentData.expenses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No expenses recorded for this date.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentData.expenses.map((expense) => (
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
              )}
            </div>

            {/* Category Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Category Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from(
                  new Set(currentData.expenses.map((e) => e.category)),
                ).map((category) => {
                  const categoryTotal = currentData.expenses
                    .filter((e) => e.category === category)
                    .reduce((sum, e) => sum + e.amount, 0);
                  return (
                    <div key={category} className="bg-blue-50 rounded-lg p-4">
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
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-400">
              No data available for the selected date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default HistoryPage;
