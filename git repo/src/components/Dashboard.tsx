import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface DashboardProps {
  expenses: Expense[];
  onAddExpense: () => void;
}

export function Dashboard({ expenses, onAddExpense }: DashboardProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = expenses.filter(expense => expense.date.startsWith(thisMonth));
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Category breakdown
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const colors = ['#030213', '#717182', '#ececf0', '#e9ebef', '#cbced4'];

  // Daily spending for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyData = last7Days.map(date => ({
    date: date.split('-')[2],
    amount: expenses
      .filter(expense => expense.date === date)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Expense Tracker</h1>
          <p className="text-muted-foreground">Track your spending and stay within budget</p>
        </div>
        <Button onClick={onAddExpense} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Expenses</span>
          </div>
          <div className="text-2xl font-medium">${totalExpenses.toFixed(2)}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">This Month</span>
          </div>
          <div className="text-2xl font-medium">${monthlyTotal.toFixed(2)}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Categories</span>
          </div>
          <div className="text-2xl font-medium">{Object.keys(categoryData).length}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No expenses yet. Add your first expense to see the breakdown.
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Daily Spending (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line type="monotone" dataKey="amount" stroke="#030213" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}