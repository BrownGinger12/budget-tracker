// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import {
  PiggyBank,
  TrendingUp,
  Flame,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { Expense } from "../types/types";
import { getBudget, getExpensesByMonth } from "../firebase/firebaseServices";

interface DashboardStats {
  totalBudget: number;
  totalExpenses: number;
  totalSavings: number;
  monthlyAverage: number;
}

interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
}

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBudget: 0,
    totalExpenses: 0,
    totalSavings: 0,
    monthlyAverage: 0,
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<
    SpendingByCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser, selectedMonth]);

  const fetchDashboardData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Fetch selected month's budget
      const budgetData = await getBudget(currentUser.uid, selectedMonth);
      const budget = budgetData?.amount || 0;

      // Filter expenses for the selected month
      const monthExpenses = await getExpensesByMonth(
        currentUser.uid,
        selectedMonth,
      );

      // Set recent 5 expenses for the selected month
      setExpenses(monthExpenses.slice(0, 5));

      const totalExpenses = monthExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0,
      );

      // Calculate savings
      const savings = budget - totalExpenses;

      // Calculate spending by category
      const categoryMap = new Map<string, number>();
      monthExpenses.forEach((expense) => {
        const current = categoryMap.get(expense.category) || 0;
        categoryMap.set(expense.category, current + expense.amount);
      });

      const categoryData: SpendingByCategory[] = [];
      categoryMap.forEach((amount, category) => {
        categoryData.push({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        });
      });
      categoryData.sort((a, b) => b.amount - a.amount);
      setSpendingByCategory(categoryData);

      setStats({
        totalBudget: budget,
        totalExpenses,
        totalSavings: savings,
        monthlyAverage: totalExpenses,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() - 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() + 1);
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (date.toISOString().slice(0, 7) <= currentMonth) {
      setSelectedMonth(date.toISOString().slice(0, 7));
    }
  };

  const formatMonthYear = (monthString: string) => {
    const date = new Date(monthString + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const isCurrentMonth = () => {
    return selectedMonth === new Date().toISOString().slice(0, 7);
  };

  const budgetUsagePercentage =
    stats.totalBudget > 0 ? (stats.totalExpenses / stats.totalBudget) * 100 : 0;

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "expense":
        return "💸";
      case "budget":
        return "💰";
      case "saving":
        return "🎯";
      default:
        return "📝";
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your financial overview
          </p>
        </div>

        {/* Month Navigation */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {formatMonthYear(selectedMonth)}
              </h2>
              {isCurrentMonth() && (
                <p className="text-sm text-blue-600 font-medium">
                  Current Month
                </p>
              )}
            </div>
            <button
              onClick={handleNextMonth}
              disabled={isCurrentMonth()}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isCurrentMonth()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium text-sm">
                Total Budget
              </h3>
              <PiggyBank className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₱{stats.totalBudget.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isCurrentMonth() ? "This month" : formatMonthYear(selectedMonth)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium text-sm">
                Total Expenses
              </h3>
              <TrendingUp className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₱{stats.totalExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {budgetUsagePercentage.toFixed(1)}% of budget
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium text-sm">
                Total Savings
              </h3>
              <Flame className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₱{stats.totalSavings.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isCurrentMonth() ? "This month" : formatMonthYear(selectedMonth)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 font-medium text-sm">
                Monthly Expenses
              </h3>
              <LayoutDashboard className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₱{stats.monthlyAverage.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isCurrentMonth() ? "Current month" : "Total"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Budget Overview
            </h2>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Budget Usage</span>
                <span className="text-sm font-semibold text-gray-800">
                  {budgetUsagePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetUsagePercentage > 90
                      ? "bg-red-500"
                      : budgetUsagePercentage > 70
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-xl font-bold text-blue-600">
                  ₱{(stats.totalBudget - stats.totalExpenses).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Saved</p>
                <p className="text-xl font-bold text-green-600">
                  ₱{stats.totalSavings.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Daily Avg</p>
                <p className="text-xl font-bold text-orange-600">
                  ₱
                  {stats.totalExpenses > 0
                    ? (
                        stats.totalExpenses /
                        new Date(selectedMonth + "-01").getDate()
                      ).toFixed(0)
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Spending by Category
            </h2>
            {spendingByCategory.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No expenses recorded yet
              </p>
            ) : (
              <div className="space-y-4">
                {spendingByCategory.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full ${getCategoryColor(item.category)}`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">
                          ₱{item.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${getCategoryColor(item.category)}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Activity
            </h2>
            {expenses.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No recent activity
              </p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getActivityIcon("expense")}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {expense.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(expense.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          <span className="ml-2 text-blue-600">
                            • {expense.category}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-red-600">
                      -₱{expense.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
