import { Flame, PiggyBank, TrendingUp } from "lucide-react";
import { useState } from "react";

// Savings Page Component
interface DailySavings {
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

const SavingsPage: React.FC = () => {
  // Sample data for demonstration
  const [savingsData] = useState<DailySavings[]>([
    {
      date: "January 25, 2026",
      totalBudget: 1500,
      totalExpenses: 1200,
      saved: 300,
      categoryBreakdown: [
        { category: "Food", budgeted: 500, spent: 450, saved: 50 },
        { category: "Transportation", budgeted: 300, spent: 280, saved: 20 },
        { category: "Utilities", budgeted: 400, spent: 400, saved: 0 },
        { category: "Entertainment", budgeted: 200, spent: 70, saved: 130 },
        { category: "Others", budgeted: 100, spent: 0, saved: 100 },
      ],
    },
    {
      date: "January 24, 2026",
      totalBudget: 1500,
      totalExpenses: 1350,
      saved: 150,
      categoryBreakdown: [
        { category: "Food", budgeted: 500, spent: 520, saved: -20 },
        { category: "Transportation", budgeted: 300, spent: 300, saved: 0 },
        { category: "Utilities", budgeted: 400, spent: 380, saved: 20 },
        { category: "Entertainment", budgeted: 200, spent: 150, saved: 50 },
        { category: "Others", budgeted: 100, spent: 0, saved: 100 },
      ],
    },
    {
      date: "January 23, 2026",
      totalBudget: 1500,
      totalExpenses: 1100,
      saved: 400,
      categoryBreakdown: [
        { category: "Food", budgeted: 500, spent: 400, saved: 100 },
        { category: "Transportation", budgeted: 300, spent: 250, saved: 50 },
        { category: "Utilities", budgeted: 400, spent: 400, saved: 0 },
        { category: "Entertainment", budgeted: 200, spent: 50, saved: 150 },
        { category: "Others", budgeted: 100, spent: 0, saved: 100 },
      ],
    },
  ]);

  const totalSaved = savingsData.reduce((sum, day) => sum + day.saved, 0);
  const averageDailySavings = totalSaved / savingsData.length;

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
            Savings Tracker
          </h1>
          <p className="text-gray-600">
            Track your daily savings and spending patterns
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Total Saved</h3>
              <PiggyBank className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₱{totalSaved.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last {savingsData.length} days
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">
                Average Daily Savings
              </h3>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              ₱{averageDailySavings.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Per day</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Best Saving Day</h3>
              <Flame className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              ₱{Math.max(...savingsData.map((d) => d.saved)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {
                savingsData.find(
                  (d) =>
                    d.saved === Math.max(...savingsData.map((d) => d.saved)),
                )?.date
              }
            </p>
          </div>
        </div>

        {/* Daily Savings Breakdown */}
        <div className="space-y-6">
          {savingsData.map((day, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {day.date}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Budget: ₱{day.totalBudget.toFixed(2)} | Spent: ₱
                    {day.totalExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Saved</p>
                  <p
                    className={`text-2xl font-bold ${day.saved >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {day.saved >= 0 ? "+" : ""}₱{day.saved.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Category Breakdown
                </h3>
                {day.categoryBreakdown.map((item, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getCategoryColor(item.category)}`}
                        ></div>
                        <span className="font-medium text-gray-800">
                          {item.category}
                        </span>
                      </div>
                      <span
                        className={`font-bold ${item.saved >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {item.saved >= 0 ? "+" : ""}₱{item.saved.toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="text-xs text-gray-500">Budgeted:</span>
                        <p className="font-semibold">
                          ₱{item.budgeted.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Spent:</span>
                        <p className="font-semibold">
                          ₱{item.spent.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Saved:</span>
                        <p
                          className={`font-semibold ${item.saved >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          ₱{item.saved.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.spent > item.budgeted ? "bg-red-500" : "bg-green-500"}`}
                        style={{
                          width: `${Math.min((item.spent / item.budgeted) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison with Previous Day */}
              {index < savingsData.length - 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      vs. {savingsData[index + 1].date}
                    </span>
                    <span
                      className={`font-semibold ${
                        day.saved > savingsData[index + 1].saved
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {day.saved > savingsData[index + 1].saved ? "↑" : "↓"}₱
                      {Math.abs(
                        day.saved - savingsData[index + 1].saved,
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;
