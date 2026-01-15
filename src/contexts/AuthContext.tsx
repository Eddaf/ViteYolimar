import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_USERS = [
  { email: 'eddarosinaga@gmail.com', password: '1234', name: 'Administrador', role: 'admin' as const },
  { email: 'ventas@yolimar.com', password: 'ventas123', name: 'Ventas', role: 'editor' as const }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const login = useCallback((email: string, password: string): boolean => {
    const foundUser = ADMIN_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      setUser({ email: foundUser.email, name: foundUser.name, role: foundUser.role });
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
