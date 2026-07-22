import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { Settings as SettingsIcon, Save, RefreshCw, Heart, Calendar, DollarSign, MapPin } from 'lucide-react';

export const Settings = () => {
  const { settings, updateSettings, resetToDefaultData } = useWedding();

  const [formData, setFormData] = useState({
    brideName: settings.brideName || '',
    groomName: settings.groomName || '',
    weddingDate: settings.weddingDate || '',
    totalBudget: settings.totalBudget || 45000,
    currency: settings.currency || '$',
    venueLocation: settings.venueLocation || '',
    notes: settings.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleReset = async () => {
    if (window.confirm('Reload all settings, places, guests, expenses, and checklist items from Google Sheets?')) {
      await resetToDefaultData();
      setFormData(settings);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-amber-500" />
          Wedding Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure couple details, wedding date, target budget, currency symbol, and data options.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
            Couple Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bride Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Bride's Name *
            </label>
            <input
              type="text"
              name="brideName"
              value={formData.brideName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Groom Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Groom's Name *
            </label>
            <input
              type="text"
              name="groomName"
              value={formData.groomName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Wedding Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Wedding Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Venue Summary Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Main Venue Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="venueLocation"
                value={formData.venueLocation}
                onChange={handleChange}
                placeholder="e.g. Grand Chateaux, New York"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Total Budget */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Total Target Budget *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="number"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Currency Symbol */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Currency Symbol *
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="$">$ (USD)</option>
              <option value="₹">₹ (INR)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="A$">A$ (AUD)</option>
              <option value="C$">C$ (CAD)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Danger Zone / Reset */}
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif-heading font-bold text-rose-800 dark:text-rose-300 text-base">
            Reload Google Sheets Data
          </h4>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
            Reload all places, guests, expenses, checklist items, and settings from Google Sheets.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-all shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Google Sheets</span>
        </button>
      </div>
    </div>
  );
};
