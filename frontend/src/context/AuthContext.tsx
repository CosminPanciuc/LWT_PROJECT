import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { LOGIN_MUTATION, REGISTER_MUTATION, GET_ME } from '../graphql/queries';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const { data, loading } = useQuery<{ me: User }>(GET_ME, {
    skip: !token,
  });

  const [loginMutation] = useMutation<{ login: { token: string; user: User } }>(LOGIN_MUTATION);
  const [registerMutation] = useMutation<{ register: { token: string; user: User } }>(REGISTER_MUTATION);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { email, password } });
    if (!data) return;
    const { token, user } = data.login;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    const { data } = await registerMutation({ 
      variables: { email, password, name, role } 
    });
    if (!data) return;
    const { token, user } = data.register;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
