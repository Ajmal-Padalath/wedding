import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { ExpenseModal } from '../components/modals/ExpenseModal';
import { formatCurrency, formatDate, downloadCSV } from '../utils/formatters';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Venue',
  'Catering',
  'Decoration',
  'Photography',
  'Dress',
  'Jewelry',
  'Makeup',
  'Travel',
  'Gifts',
  'Entertainment',
  'Miscellaneous'
];

const PAYMENT_STATUSES = ['All Statuses', 'Paid', 'Pending'];

export const Expenses = () => {
  const { expenses, places, settings, totalExpenses, remainingBudget, deleteExpense } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'
  const [showModal, setShowModal] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const getPlaceName = (placeId) => {
    if (!placeId) return 'General Expense';
    const p = places.find(item => item.id === placeId);
    return p ? p.name : 'General Expense';
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.paidTo && exp.paidTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || exp.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All Statuses' || exp.paymentStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sorting
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
    if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
    return 0;
  });

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setExpenseToEdit(null);
    setShowModal(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete expense "${title}"?`)) {
      deleteExpense(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Expense Title', 'Category', 'Amount', 'Date', 'Paid To', 'Payment Method', 'Payment Status', 'Related Place', 'Notes'];
    const rows = sortedExpenses.map(e => [
      e.title,
      e.category,
      e.amount,
      e.date,
      e.paidTo || '',
      e.paymentMethod,
      e.paymentStatus,
      getPlaceName(e.placeId),
      e.notes || ''
    ]);
    downloadCSV('Wedding_Expenses_Report', headers, rows);
  };

  const budgetUsedPercentage = Math.min(100, Math.round((totalExpenses / (settings.totalBudget || 1)) * 100));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-emerald-600" />
            Expense Management & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor vendor payments, venue bookings, catering contracts, and remaining budget allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Budget Overview Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Wedding Budget</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-extrabold font-serif-heading text-slate-900 dark:text-slate-100">
                {formatCurrency(totalExpenses, settings.currency)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                spent of {formatCurrency(settings.totalBudget, settings.currency)} budget
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Remaining</span>
              <span className={`text-xl font-bold font-serif-heading ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {formatCurrency(remainingBudget, settings.currency)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Budget Utilized</span>
              <span className="text-xl font-bold font-serif-heading text-amber-600">
                {budgetUsedPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetUsedPercentage > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
            }`}
            style={{ width: `${budgetUsedPercentage}%` }}
          />
        </div>
      </div>

      {/* Filters and Sorting Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, vendor, category..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {PAYMENT_STATUSES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="date-desc">Sort Date: Newest First</option>
            <option value="date-asc">Sort Date: Oldest First</option>
            <option value="amount-desc">Sort Amount: Highest First</option>
            <option value="amount-asc">Sort Amount: Lowest First</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200/50 dark:border-slate-800 shadow-xs overflow-hidden">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-16">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif-heading text-lg font-semibold text-slate-700 dark:text-slate-300">
              No expenses recorded
            </h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or record a new expense.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-amber-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Expense Title & Category</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Paid To / Vendor</th>
                  <th className="px-4 py-4">Payment Method</th>
                  <th className="px-4 py-4">Related Place</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 font-bold text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {sortedExpenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-amber-50/30 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Title & Category */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {expense.title}
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {expense.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-medium">
                      {formatDate(expense.date)}
                    </td>

                    {/* Vendor */}
                    <td className="px-4 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {expense.paidTo || 'N/A'}
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                        {expense.paymentMethod}
                      </span>
                    </td>

                    {/* Related Place */}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[140px]">{getPlaceName(expense.placeId)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        expense.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {expense.paymentStatus === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{expense.paymentStatus}</span>
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 font-bold text-base text-right text-slate-900 dark:text-slate-100 font-serif-heading">
                      {formatCurrency(expense.amount, settings.currency)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Expense"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id, expense.title)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
};
