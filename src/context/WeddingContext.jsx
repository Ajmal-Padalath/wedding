import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadWeddingDataFromGoogleSheets } from '../services/googleSheets';

const WeddingContext = createContext();

const STORAGE_KEYS = {
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

  const [settings, setSettings] = useState({});
  const [places, setPlaces] = useState([]);
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [activities, setActivities] = useState(() => loadInitial(STORAGE_KEYS.ACTIVITIES, []));

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataSourceError, setDataSourceError] = useState('');

  const refreshFromGoogleSheets = async () => {
    setIsDataLoading(true);
    setDataSourceError('');
    try {
      const data = await loadWeddingDataFromGoogleSheets();
      setSettings(data.settings);
      setPlaces(data.places);
      setPeople(data.people);
      setExpenses(data.expenses);
      setChecklist(data.checklist);
      return true;
    } catch (error) {
      console.error('Unable to load Google Sheets data:', error);
      setDataSourceError(error.message);
      return false;
    } finally {
      setIsDataLoading(false);
    }
  };

  // Google Sheets is the sole source of listed wedding data.
  useEffect(() => {
    refreshFromGoogleSheets();
  }, []);

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

  const resetToDefaultData = async () => {
    const refreshed = await refreshFromGoogleSheets();
    showToast(refreshed ? 'Reloaded data from Google Sheets.' : 'Could not reload Google Sheets data.', refreshed ? 'success' : 'error');
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
      isDataLoading,
      dataSourceError,

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
      refreshFromGoogleSheets,
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
