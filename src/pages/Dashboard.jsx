import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { formatCurrency, formatDate, getDaysRemaining } from '../utils/formatters';
import {
  MapPin,
  Users,
  DollarSign,
  PieChart as PieIcon,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Heart,
  UserPlus
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
  CartesianGrid
} from 'recharts';
import { PlaceModal } from '../components/modals/PlaceModal';
import { PersonModal } from '../components/modals/PersonModal';
import { ExpenseModal } from '../components/modals/ExpenseModal';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Venue: '#D4AF37',
  Catering: '#E8A0BF',
  Decoration: '#B89228',
  Photography: '#6C5CE7',
  Dress: '#FF7675',
  Jewelry: '#FDCB6E',
  Makeup: '#E17055',
  Travel: '#00CEC9',
  Gifts: '#0984E3',
  Entertainment: '#A29BFE',
  Miscellaneous: '#B2BEC3'
};

export const Dashboard = () => {
  const {
    settings,
    places,
    people,
    expenses,
    checklist,
    activities,
    totalExpenses,
    remainingBudget,
    totalPlaces,
    totalPeople,
    attendingPeople
  } = useWedding();

  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const daysRemaining = getDaysRemaining(settings.weddingDate);

  // Chart Data Preparation: Expenses by Category
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const categoryPieData = Object.keys(expensesByCategory).map(cat => ({
    name: cat,
    value: expensesByCategory[cat]
  }));

  // Chart Data Preparation: Monthly Expenses
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

  const upcomingChecklist = checklist.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-rose-400 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Wedding Countdown</span>
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold">
              {settings.brideName} & {settings.groomName}
            </h1>
            <p className="text-amber-100 text-sm mt-1">
              {settings.venueLocation} • {formatDate(settings.weddingDate)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
            <span className="text-3xl font-extrabold block font-serif-heading">{daysRemaining}</span>
            <span className="text-xs uppercase tracking-widest text-amber-100 font-semibold">Days Remaining</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Places Card */}
        <Link to="/places" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Place</span>
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif-heading text-slate-900 dark:text-slate-100">{totalPlaces}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Venues & Shops</span>
          </div>
        </Link>

        {/* People Card */}
        <Link to="/people" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Guests</span>
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-serif-heading text-slate-900 dark:text-slate-100">{totalPeople}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{attendingPeople} Confirmed RSVP</span>
          </div>
        </Link>

        {/* Total Expenses Card */}
        <Link to="/expenses" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Expenses</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-serif-heading text-slate-900 dark:text-slate-100">
              {formatCurrency(totalExpenses, settings.currency)}
            </span>
            <span className="text-xs text-slate-500">Spent</span>
          </div>
        </Link>

        {/* Remaining Budget Card */}
        <Link to="/reports" className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Remaining Budget</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className={`text-2xl sm:text-3xl font-bold font-serif-heading ${
              remainingBudget < 0 ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'
            }`}>
              {formatCurrency(remainingBudget, settings.currency)}
            </span>
            <span className="text-xs text-slate-500">Target {formatCurrency(settings.totalBudget, settings.currency)}</span>
          </div>
        </Link>
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pr-2 border-r border-slate-200 dark:border-slate-800">
          Quick Actions
        </span>
        <button
          onClick={() => setShowPlaceModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 rounded-xl transition-all"
        >
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Add New Place</span>
        </button>
        <button
          onClick={() => setShowPersonModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 rounded-xl transition-all"
        >
          <UserPlus className="w-4 h-4 text-rose-500" />
          <span>Add Guest / Contact</span>
        </button>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 rounded-xl transition-all"
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Expenses Pie Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-500" />
              Expenses by Category
            </h3>
            <Link to="/reports" className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1">
              View Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#D4AF37'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => formatCurrency(val, settings.currency)}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {categoryPieData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#D4AF37' }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Expense Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Monthly Spending Trend
            </h3>
            <span className="text-xs text-slate-400">Total: {expenses.length} records</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBarData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${settings.currency}${v}`} />
                <Tooltip
                  formatter={(val) => formatCurrency(val, settings.currency)}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="amount" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
            Financial allocation per month leading up to wedding day.
          </p>
        </div>
      </div>

      {/* Bottom Widgets: Upcoming Checklist & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks Widget */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Upcoming Checklist Items
            </h3>
            <Link to="/checklist" className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline">
              View All Tasks
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingChecklist.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">All checklist tasks completed! Great job!</p>
            ) : (
              upcomingChecklist.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">{task.task}</h4>
                      <span className="text-[11px] text-slate-400">{task.category} • Due {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
          <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-rose-500" />
            Recent Activity Log
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {activities.slice(0, 5).map(act => (
              <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{act.text}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PlaceModal isOpen={showPlaceModal} onClose={() => setShowPlaceModal(false)} />
      <PersonModal isOpen={showPersonModal} onClose={() => setShowPersonModal(false)} />
      <ExpenseModal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} />
    </div>
  );
};
