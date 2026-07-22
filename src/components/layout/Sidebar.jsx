import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWedding } from '../../context/WeddingContext';
import { getDaysRemaining } from '../../utils/formatters';
import {
  LayoutDashboard,
  MapPin,
  Users,
  CreditCard,
  BarChart3,
  CheckSquare,
  Settings,
  Heart,
  Moon,
  Sun,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { settings, darkMode, toggleDarkMode } = useWedding();
  const daysLeft = getDaysRemaining(settings.weddingDate);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Places', path: '/places', icon: MapPin },
    { name: 'People / Guests', path: '/people', icon: Users },
    { name: 'Expenses', path: '/expenses', icon: CreditCard },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Checklist', path: '/checklist', icon: CheckSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-amber-200/40 dark:border-slate-800 transition-transform duration-300 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-amber-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h1 className="font-serif-heading text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  MarryMe
                </h1>
                <p className="text-[10px] tracking-widest text-amber-700 dark:text-amber-400 font-semibold uppercase">
                  Luxury Wedding Planner
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Couple Banner */}
          <div className="mx-4 my-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-200/50 dark:border-slate-700/50 text-center">
            <p className="font-serif-heading text-sm font-semibold text-slate-800 dark:text-amber-200">
              {settings.brideName} & {settings.groomName}
            </p>
            <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-xs">
              <Heart className="w-3 h-3 fill-white" />
              <span>{daysLeft > 0 ? `${daysLeft} Days to go!` : 'Wedding Day!'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50/80 dark:hover:bg-slate-800/60 hover:text-amber-800 dark:hover:text-amber-300'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-amber-100 dark:border-slate-800">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
              {darkMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
