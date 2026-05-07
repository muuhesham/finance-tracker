import { createContext, useEffect, useState } from 'react';
import { client, setAuthToken } from '../../api/client.js';

const storageKey = 'finance-flow-auth';
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : { token: '', user: null };
  });

  useEffect(() => {
    setAuthToken(session.token);
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  }, [session]);

  async function login(credentials, endpoint = 'login') {
    const { data } = await client.post(`/auth/${endpoint}`, credentials);
    setSession(data);
    return data;
  }

  function logout() {
    setSession({ token: '', user: null });
  }

  return (
    <AuthContext.Provider
      value={{
        token: session.token,
        user: session.user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
