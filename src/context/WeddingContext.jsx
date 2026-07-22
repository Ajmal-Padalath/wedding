import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SETTINGS,
  INITIAL_PLACES,
  INITIAL_PEOPLE,
  INITIAL_EXPENSES,
  INITIAL_CHECKLIST
} from '../utils/seedData';

const WeddingContext = createContext();

const STORAGE_KEYS = {
  SETTINGS: 'marryme_settings',
  PLACES: 'marryme_places',
  PEOPLE: 'marryme_people',
  EXPENSES: 'marryme_expenses',
  CHECKLIST: 'marryme_checklist',
  ACTIVITIES: 'marryme_activities',
  DARK_MODE: 'marryme_darkmode'
};

export const WeddingProvider = ({ children }) => {
  // LocalStorage loader helper
  const loadInitial = (key, fallback) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error loading key ${key} from storage:`, e);
      return fallback;
    }
  };

  const [settings, setSettings] = useState(() => loadInitial(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
  const [places, setPlaces] = useState(() => loadInitial(STORAGE_KEYS.PLACES, INITIAL_PLACES));
  const [people, setPeople] = useState(() => loadInitial(STORAGE_KEYS.PEOPLE, INITIAL_PEOPLE));
  const [expenses, setExpenses] = useState(() => loadInitial(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES));
  const [checklist, setChecklist] = useState(() => loadInitial(STORAGE_KEYS.CHECKLIST, INITIAL_CHECKLIST));
  const [activities, setActivities] = useState(() => loadInitial(STORAGE_KEYS.ACTIVITIES, [
    { id: 'act-1', text: 'Venue deposit paid for Rosewood Ballroom', timestamp: '2 hours ago', type: 'expense' },
    { id: 'act-2', text: 'Added guest Beatrice Royal under Ritz Carlton Hotel', timestamp: '5 hours ago', type: 'person' },
    { id: 'act-3', text: 'Added new place St. Patrick Sanctuary', timestamp: '1 day ago', type: 'place' }
  ]));

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(places));
  }, [places]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const addActivity = (text, type = 'general') => {
    const newAct = {
      id: `act-${Date.now()}`,
      text,
      timestamp: 'Just now',
      type
    };
    setActivities(prev => [newAct, ...prev.slice(0, 15)]);
  };

  // --- PLACE OPERATIONS ---
  const addPlace = (placeData) => {
    const newPlace = {
      ...placeData,
      id: `place-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPlaces(prev => [newPlace, ...prev]);
    addActivity(`Added new venue/place: "${newPlace.name}"`, 'place');
    showToast(`Place "${newPlace.name}" added successfully!`);
    return { success: true };
  };

  const updatePlace = (id, placeData) => {
    setPlaces(prev => prev.map(p => p.id === id ? { ...p, ...placeData } : p));
    addActivity(`Updated place: "${placeData.name}"`, 'place');
    showToast(`Place details updated!`);
    return { success: true };
  };

  const deletePlace = (id) => {
    const placeToDelete = places.find(p => p.id === id);
    setPlaces(prev => prev.filter(p => p.id === id));
    // Clear associated place from people
    setPeople(prev => prev.map(person => person.placeId === id ? { ...person, placeId: '' } : person));
    if (placeToDelete) {
      addActivity(`Deleted place: "${placeToDelete.name}"`, 'place');
      showToast(`Place deleted. Linked guests unassigned.`, 'info');
    }
    return { success: true };
  };

  // --- PEOPLE / GUEST OPERATIONS ---
  const checkDuplicateContact = (email, phone, currentId = null) => {
    const normEmail = email?.trim().toLowerCase();
    const normPhone = phone?.trim().replace(/[\s\-\(\)]/g, '');

    for (const p of people) {
      if (currentId && p.id === currentId) continue;
      if (normEmail && p.email && p.email.trim().toLowerCase() === normEmail) {
        return { isDuplicate: true, field: 'Email', value: email };
      }
      const existingPhone = p.mobileNumber?.trim().replace(/[\s\-\(\)]/g, '');
      if (normPhone && existingPhone && existingPhone === normPhone) {
        return { isDuplicate: true, field: 'Mobile Number', value: phone };
      }
    }
    return { isDuplicate: false };
  };

  const addPerson = (personData) => {
    const dupCheck = checkDuplicateContact(personData.email, personData.mobileNumber);
    if (dupCheck.isDuplicate) {
      showToast(`Error: ${dupCheck.field} "${dupCheck.value}" already exists for another guest!`, 'error');
      return { success: false, error: `${dupCheck.field} already exists.` };
    }

    const newPerson = {
      ...personData,
      id: `guest-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPeople(prev => [newPerson, ...prev]);
    addActivity(`Added guest: "${newPerson.fullName}" (${newPerson.relationship})`, 'person');
    showToast(`Guest "${newPerson.fullName}" added successfully!`);
    return { success: true };
  };

  const updatePerson = (id, personData) => {
    const dupCheck = checkDuplicateContact(personData.email, personData.mobileNumber, id);
    if (dupCheck.isDuplicate) {
      showToast(`Error: ${dupCheck.field} "${dupCheck.value}" already exists for another guest!`, 'error');
      return { success: false, error: `${dupCheck.field} already exists.` };
    }

    setPeople(prev => prev.map(p => p.id === id ? { ...p, ...personData } : p));
    addActivity(`Updated guest: "${personData.fullName}"`, 'person');
    showToast(`Guest details updated!`);
    return { success: true };
  };

  const deletePerson = (id) => {
    const personToDelete = people.find(p => p.id === id);
    setPeople(prev => prev.filter(p => p.id !== id));
    if (personToDelete) {
      addActivity(`Removed guest: "${personToDelete.fullName}"`, 'person');
      showToast(`Guest removed from list.`, 'info');
    }
    return { success: true };
  };

  const toggleRSVP = (id) => {
    setPeople(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.rsvpStatus === 'Attending' ? 'Declined' : p.rsvpStatus === 'Declined' ? 'Pending' : 'Attending';
        showToast(`RSVP status for ${p.fullName} set to ${nextStatus}`);
        return { ...p, rsvpStatus: nextStatus };
      }
      return p;
    }));
  };

  const toggleInvitation = (id) => {
    setPeople(prev => prev.map(p => {
      if (p.id === id) {
        const nextSent = !p.invitationSent;
        showToast(`Invitation status updated for ${p.fullName}`);
        return { ...p, invitationSent: nextSent };
      }
      return p;
    }));
  };

  // --- EXPENSE OPERATIONS ---
  const addExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      amount: Number(expenseData.amount || 0),
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExpense, ...prev]);
    addActivity(`Recorded expense: "${newExpense.title}" (${settings.currency}${newExpense.amount})`, 'expense');
    showToast(`Expense "${newExpense.title}" added!`);
    return { success: true };
  };

  const updateExpense = (id, expenseData) => {
    const updatedAmount = Number(expenseData.amount || 0);
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...expenseData, amount: updatedAmount } : e));
    addActivity(`Updated expense: "${expenseData.title}"`, 'expense');
    showToast(`Expense updated!`);
    return { success: true };
  };

  const deleteExpense = (id) => {
    const expToDelete = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    if (expToDelete) {
      addActivity(`Deleted expense: "${expToDelete.title}"`, 'expense');
      showToast(`Expense deleted.`, 'info');
    }
    return { success: true };
  };

  // --- CHECKLIST OPERATIONS ---
  const toggleChecklistTask = (id) => {
    setChecklist(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addChecklistTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false
    };
    setChecklist(prev => [...prev, newTask]);
    showToast(`Task added to checklist!`);
  };

  const deleteChecklistTask = (id) => {
    setChecklist(prev => prev.filter(t => t.id !== id));
    showToast(`Task removed.`, 'info');
  };

  // --- SETTINGS & RESET ---
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast(`Wedding configuration updated!`);
  };

  const resetToDefaultData = () => {
    setSettings(INITIAL_SETTINGS);
    setPlaces(INITIAL_PLACES);
    setPeople(INITIAL_PEOPLE);
    setExpenses(INITIAL_EXPENSES);
    setChecklist(INITIAL_CHECKLIST);
    setActivities([
      { id: 'act-1', text: 'Reset application data to initial luxury demo state', timestamp: 'Just now', type: 'general' }
    ]);
    showToast('Reset all data to default demo state!');
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Derived Totals
  const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const remainingBudget = (Number(settings.totalBudget) || 0) - totalExpenses;
  const totalPlaces = places.length;
  const totalPeople = people.length;
  const attendingPeople = people.filter(p => p.rsvpStatus === 'Attending').length;

  return (
    <WeddingContext.Provider value={{
      settings,
      places,
      people,
      expenses,
      checklist,
      activities,
      darkMode,
      toast,

      // Calculated stats
      totalExpenses,
      remainingBudget,
      totalPlaces,
      totalPeople,
      attendingPeople,

      // Operations
      addPlace,
      updatePlace,
      deletePlace,

      addPerson,
      updatePerson,
      deletePerson,
      toggleRSVP,
      toggleInvitation,

      addExpense,
      updateExpense,
      deleteExpense,

      toggleChecklistTask,
      addChecklistTask,
      deleteChecklistTask,

      updateSettings,
      toggleDarkMode,
      showToast,
      resetToDefaultData
    }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
