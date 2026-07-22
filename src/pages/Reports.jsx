import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { formatCurrency, downloadCSV } from '../utils/formatters';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Users,
  Download,
  Printer,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

const CATEGORY_COLORS = [
  '#D4AF37', '#E8A0BF', '#B89228', '#6C5CE7', '#FF7675',
  '#FDCB6E', '#E17055', '#00CEC9', '#0984E3', '#A29BFE'
];

export const Reports = () => {
  const {
    settings,
    expenses,
    people,
    places,
    totalExpenses,
    remainingBudget,
    updateSettings
  } = useWedding();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(settings.totalBudget);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    updateSettings({ totalBudget: Number(tempBudget) });
    setIsEditingBudget(false);
  };

  // Expenses by Category Data
  const expensesByCategoryMap = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const categoryPieData = Object.keys(expensesByCategoryMap).map(cat => ({
    name: cat,
    value: expensesByCategoryMap[cat]
  }));

  // Guest RSVP Breakdown Data
  const rsvpCounts = people.reduce((acc, p) => {
    acc[p.rsvpStatus] = (acc[p.rsvpStatus] || 0) + 1;
    return acc;
  }, {});

  const rsvpPieData = [
    { name: 'Attending', value: rsvpCounts['Attending'] || 0, color: '#10B981' },
    { name: 'Pending', value: rsvpCounts['Pending'] || 0, color: '#F59E0B' },
    { name: 'Declined', value: rsvpCounts['Declined'] || 0, color: '#EF4444' }
  ];

  // Monthly Spending Bar Data
  const monthlyExpensesMap = expenses.reduce((acc, exp) => {
    const month = exp.date ? exp.date.substring(0, 7) : 'Unspecified';
    acc[month] = (acc[month] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const monthlyBarData = Object.keys(monthlyExpensesMap)
    .sort()
    .map(month => ({
      month,
      amount: monthlyExpensesMap[month]
    }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-amber-500" />
            Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive financial breakdown, RSVP analytics, and expense allocation summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Budget Summary & Settings Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Total Wedding Budget Target</span>
            {isEditingBudget ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold font-serif-heading">{settings.currency}</span>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="px-3 py-1 rounded-xl text-slate-900 font-bold text-lg w-40 focus:outline-none"
                />
                <button type="submit" className="px-3 py-1 bg-white text-amber-700 font-bold text-xs rounded-xl shadow-xs">
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold font-serif-heading">
                  {formatCurrency(settings.totalBudget, settings.currency)}
                </span>
                <button
                  onClick={() => { setTempBudget(settings.totalBudget); setIsEditingBudget(true); }}
                  className="text-xs font-semibold underline text-amber-100 hover:text-white print:hidden"
                >
                  Edit Target Budget
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-xs text-amber-100 font-medium block">Total Spent</span>
              <span className="text-xl font-bold font-serif-heading">{formatCurrency(totalExpenses, settings.currency)}</span>
            </div>

            <div>
              <span className="text-xs text-amber-100 font-medium block">Remaining</span>
              <span className="text-xl font-bold font-serif-heading">{formatCurrency(remainingBudget, settings.currency)}</span>
            </div>

            <div>
              <span className="text-xs text-amber-100 font-medium block">Total Vendors/Places</span>
              <span className="text-xl font-bold font-serif-heading">{places.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category Donut Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
          <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-amber-500" />
            Category Allocation Breakdown
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v, settings.currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Guest RSVP Distribution Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
          <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            Guest RSVP Status Distribution
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rsvpPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {rsvpPieData.map((entry, index) => (
                    <Cell key={`cell-rsvp-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Spending Trend Bar Chart */}
        <div className="col-span-1 lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
          <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Monthly Cash Flow & Spending Bar Chart
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBarData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${settings.currency}${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v, settings.currency)} />
                <Bar dataKey="amount" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
