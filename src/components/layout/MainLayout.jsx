import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Toast } from '../common/Toast';
import { useWedding } from '../../context/WeddingContext';
import { Search, MapPin, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MainLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const { places, people, expenses, settings } = useWedding();

  const query = globalSearchQuery.trim().toLowerCase();

  // Filter items for Global Search results view
  const matchingPlaces = query
    ? places.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.city.toLowerCase().includes(query))
    : [];

  const matchingPeople = query
    ? people.filter(p => p.fullName.toLowerCase().includes(query) || p.relationship.toLowerCase().includes(query) || (p.email && p.email.toLowerCase().includes(query)))
    : [];

  const matchingExpenses = query
    ? expenses.filter(e => e.title.toLowerCase().includes(query) || e.category.toLowerCase().includes(query) || (e.paidTo && e.paidTo.toLowerCase().includes(query)))
    : [];

  const hasGlobalResults = query && (matchingPlaces.length > 0 || matchingPeople.length > 0 || matchingExpenses.length > 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121118] text-slate-800 dark:text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {/* Global Search Overlay View if user types in Topbar */}
          {query ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-amber-200/50 pb-4">
                <div>
                  <h2 className="font-serif-heading text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Search className="w-6 h-6 text-amber-500" />
                    Global Search Results
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Showing matches for "{globalSearchQuery}" across Places, People, and Expenses.
                  </p>
                </div>
                <button
                  onClick={() => setGlobalSearchQuery('')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300"
                >
                  Clear Search
                </button>
              </div>

              {!hasGlobalResults ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-serif-heading text-lg font-semibold">No results found</h3>
                  <p className="text-xs text-slate-500">Try searching for a place name, guest name, category, or vendor.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Matching Places */}
                  {matchingPlaces.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Places ({matchingPlaces.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchingPlaces.map(place => (
                          <div key={place.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs">
                            <h4 className="font-serif-heading font-semibold text-slate-900 dark:text-slate-100">{place.name}</h4>
                            <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                              {place.category}
                            </span>
                            <p className="text-xs text-slate-500 mt-2">{place.address}, {place.city}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Matching People */}
                  {matchingPeople.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" /> People / Guests ({matchingPeople.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchingPeople.map(person => (
                          <div key={person.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 shadow-xs">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{person.fullName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-medium">
                                {person.relationship}
                              </span>
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                                person.rsvpStatus === 'Attending' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                RSVP: {person.rsvpStatus}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Mobile: {person.mobileNumber}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Matching Expenses */}
                  {matchingExpenses.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Expenses ({matchingExpenses.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchingExpenses.map(expense => (
                          <div key={expense.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{expense.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">{expense.category} • {formatDate(expense.date)}</p>
                            </div>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                              {formatCurrency(expense.amount, settings.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
};
