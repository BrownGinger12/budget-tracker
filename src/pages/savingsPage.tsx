// src/pages/SavingsPage.tsx
import React, { useState, useEffect } from "react";
import { PiggyBank, TrendingUp, Flame } from "lucide-react";
import { useAuth } from "../context/authContext";
import { getExpensesByDate } from "../firebase/firebaseServices";

interface DailySavings {
  date: string;
  yesterdayExpenses: number;
  todayExpenses: number;
  saved: number;
  categoryBreakdown: {
    category: string;
    spent: number;
  }[];
}

const SavingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [savingsData, setSavingsData] = useState<DailySavings[]>([]);
  const [loading, setLoading] = useState(true);
  const [todaySavings, setTodaySavings] = useState(0);

  useEffect(() => {
    fetchSavingsData();
  }, [currentUser]);

  const fetchSavingsData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const dailyData: DailySavings[] = [];

      // Get data for the last 8 days (we need one extra day to calculate savings for the 7th day)
      const expensesByDay: {
        date: Date;
        expenses: number;
        categoryMap: Map<string, number>;
      }[] = [];

      for (let i = 0; i < 8; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];

        const expenses = await getExpensesByDate(currentUser.uid, dateString);
        const totalExpenses = expenses.reduce(
          (sum, exp) => sum + exp.amount,
          0,
        );

        // Group expenses by category
        const categoryMap = new Map<string, number>();
        expenses.forEach((expense) => {
          const current = categoryMap.get(expense.category) || 0;
          categoryMap.set(expense.category, current + expense.amount);
        });

        expensesByDay.push({
          date,
          expenses: totalExpenses,
          categoryMap,
        });
      }

      // Calculate savings for each day (comparing with previous day)
      for (let i = 0; i < 7; i++) {
        const currentDay = expensesByDay[i];
        const previousDay = expensesByDay[i + 1];

        // Only add data if current day has expenses
        if (currentDay.expenses > 0 || previousDay.expenses > 0) {
          const saved = previousDay.expenses - currentDay.expenses;

          const categoryBreakdown = Array.from(
            currentDay.categoryMap.entries(),
          ).map(([category, spent]) => ({
            category,
            spent,
          }));

          dailyData.push({
            date: currentDay.date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            yesterdayExpenses: previousDay.expenses,
            todayExpenses: currentDay.expenses,
            saved,
            categoryBreakdown,
          });

          // If this is today (i = 0), save the savings value
          if (i === 0) {
            setTodaySavings(saved);
          }
        }
      }

      setSavingsData(dailyData);
    } catch (error) {
      console.error("Error fetching savings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSaved = savingsData.reduce((sum, day) => sum + day.saved, 0);
  const averageDailySavings =
    savingsData.length > 0 ? totalSaved / savingsData.length : 0;
  const bestSavingDay =
    savingsData.length > 0 ? Math.max(...savingsData.map((d) => d.saved)) : 0;

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
        <div className="text-xl text-gray-600">Loading savings data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Savings Tracker
          </h1>
          <p className="text-gray-600">
            Track your daily savings compared to previous day's spending
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Today's Savings</h3>
              <PiggyBank className="w-6 h-6 text-green-500" />
            </div>
            <p
              className={`text-3xl font-bold ${todaySavings >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {todaySavings >= 0 ? "+" : ""}₱{todaySavings.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">vs. yesterday</p>
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
            <p className="text-sm text-gray-500 mt-1">
              Last {savingsData.length}{" "}
              {savingsData.length === 1 ? "day" : "days"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium">Best Saving Day</h3>
              <Flame className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              ₱{bestSavingDay.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {savingsData.find((d) => d.saved === bestSavingDay)?.date ||
                "N/A"}
            </p>
          </div>
        </div>

        {/* Daily Savings Breakdown */}
        <div className="space-y-6">
          {savingsData.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-400">
                No savings data available yet. Start tracking your expenses!
              </p>
            </div>
          ) : (
            savingsData.map((day, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {day.date}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Yesterday's Spending: ₱{day.yesterdayExpenses.toFixed(2)}{" "}
                      | Today's Spending: ₱{day.todayExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Saved vs Yesterday</p>
                    <p
                      className={`text-2xl font-bold ${day.saved >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {day.saved >= 0 ? "+" : ""}₱{day.saved.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Spending Comparison Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Spending Comparison
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {day.yesterdayExpenses > 0
                        ? `${((day.todayExpenses / day.yesterdayExpenses) * 100).toFixed(1)}% of yesterday`
                        : "No comparison"}
                    </span>
                  </div>
                  {day.yesterdayExpenses > 0 && (
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            day.saved >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min((day.todayExpenses / day.yesterdayExpenses) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Breakdown */}
                {day.categoryBreakdown.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Today's Category Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {day.categoryBreakdown.map((item, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full ${getCategoryColor(item.category)}`}
                              ></div>
                              <span className="font-medium text-gray-800">
                                {item.category}
                              </span>
                            </div>
                            <span className="font-bold text-red-600">
                              ₱{item.spent.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comparison with Previous Day's Savings */}
                {index < savingsData.length - 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Savings trend vs. {savingsData[index + 1].date}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsPage;
