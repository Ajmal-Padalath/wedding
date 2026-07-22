import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
const SESSION_KEY = 'marryme_authenticated_user';

// Change these two passwords before publishing. A GitHub Pages site is static,
// so values in this file are visible to anyone who inspects the built site.
const ACCOUNTS = {
  bride: { label: 'Bride', password: 'bride2026' },
  groom: { label: 'Groom', password: 'groom2026' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => sessionStorage.getItem(SESSION_KEY));

  const login = (role, password) => {
    if (ACCOUNTS[role]?.password !== password) return false;
    sessionStorage.setItem(SESSION_KEY, role);
    setUser(role);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, userLabel: user ? ACCOUNTS[user].label : '', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
