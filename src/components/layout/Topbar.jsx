import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  MapPin,
  UserPlus,
  DollarSign,
  X
} from 'lucide-react';
import { PlaceModal } from '../modals/PlaceModal';
import { PersonModal } from '../modals/PersonModal';
import { ExpenseModal } from '../modals/ExpenseModal';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ onOpenMobileSidebar, globalSearchQuery, setGlobalSearchQuery }) => {
  const { activities } = useWedding();
  const { userLabel, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-amber-200/40 dark:border-slate-800 px-4 sm:px-8 py-3 transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Global search places, guests, expenses..."
                className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-amber-200/60 dark:border-slate-700 bg-amber-50/30 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-400"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Action Buttons & Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Quick Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setShowPlaceModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 hover:bg-amber-200/80 dark:hover:bg-amber-900/80 rounded-xl transition-all"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Add Place</span>
              </button>

              <button
                onClick={() => setShowPersonModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/60 hover:bg-rose-200/80 dark:hover:bg-rose-900/80 rounded-xl transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Guest</span>
              </button>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-xs transition-all"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Add Expense</span>
              </button>
            </div>

            {/* Mobile Quick Action Dropdown Trigger */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setShowQuickMenu(prev => !prev)}
                className="p-2 rounded-xl bg-amber-500 text-white shadow-xs"
              >
                <Plus className="w-5 h-5" />
              </button>

              {showQuickMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-800 p-2 z-50">
                  <button
                    onClick={() => { setShowPlaceModal(true); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Add Place</span>
                  </button>
                  <button
                    onClick={() => { setShowPersonModal(true); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <UserPlus className="w-4 h-4 text-rose-500" />
                    <span>Add Guest</span>
                  </button>
                  <button
                    onClick={() => { setShowExpenseModal(true); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>Add Expense</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {activities.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-200/50 dark:border-slate-800 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h4 className="font-serif-heading font-semibold text-slate-800 dark:text-slate-100">
                      Recent Activity
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      {activities.length} items
                    </span>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {activities.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No recent activity</p>
                    ) : (
                      activities.map(act => (
                        <div key={act.id} className="flex gap-3 text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{act.text}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Couple Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {userLabel.slice(0, 1)}
              </div>
              <button onClick={logout} className="hidden md:block text-xs font-semibold text-slate-500 hover:text-rose-600">Sign out</button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <PlaceModal isOpen={showPlaceModal} onClose={() => setShowPlaceModal(false)} />
      <PersonModal isOpen={showPersonModal} onClose={() => setShowPersonModal(false)} />
      <ExpenseModal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} />
    </>
  );
};
