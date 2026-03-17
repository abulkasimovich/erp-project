// // // import React, { createContext, useContext, useState, useEffect } from 'react';
// // // import { authAPI } from '../services/api';

// // // // 1. Create the context
// // // const AuthContext = createContext(null);

// // // // 2. Provider component — wraps the whole app
// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(null);         // logged-in user object
// // //   const [token, setToken] = useState(null);        // JWT token string
// // //   const [loading, setLoading] = useState(true);    // checking localStorage on start

// // //   // On first load: check if token exists in localStorage
// // //   useEffect(() => {
// // //     const savedToken = localStorage.getItem('token');
// // //     const savedUser  = localStorage.getItem('user');
// // //     if (savedToken && savedUser) {
// // //       setToken(savedToken);
// // //       setUser(JSON.parse(savedUser));
// // //     }
// // //     setLoading(false);
// // //   }, []);

// // //   // login: call backend, save token + user
// // //   const login = async (username, password) => {
// // //     const res = await login({ login: form.username, password: form.password });;
// // //     const { token: newToken, user: newUser } = res.data;
// // //     localStorage.setItem('token', newToken);
// // //     localStorage.setItem('user', JSON.stringify(newUser));
// // //     setToken(newToken);
// // //     setUser(newUser);
// // //     return newUser;
// // //   };

// // //   // logout: clear everything
// // //   const logout = () => {
// // //     localStorage.removeItem('token');
// // //     localStorage.removeItem('user');
// // //     setToken(null);
// // //     setUser(null);
// // //   };

// // //   // Value shared to all children
// // //   const value = { user, token, login, logout, isLoggedIn: !!token };

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center h-screen">
// // //         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
// // //       </div>
// // //     );
// // //   }

// // //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // // }

// // // // 3. Custom hook — use this in any component
// // // export function useAuth() {
// // //   return useContext(AuthContext);
// // // }


// // // src/context/AuthContext.js
// // // ============================================================
// // // This context stores the logged-in user and JWT token.
// // // Wrap your whole app with <AuthProvider> so any page can
// // // use useAuth() to get user info or logout.
// // // ============================================================

// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import { authAPI } from '../services/api';

// // // 1. Create the context
// // const AuthContext = createContext(null);

// // // 2. Provider component — wraps the whole app
// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);         // logged-in user object
// //   const [token, setToken] = useState(null);        // JWT token string
// //   const [loading, setLoading] = useState(true);    // checking localStorage on start

// //   // On first load: check if token exists in localStorage
// //   useEffect(() => {
// //     const savedToken = localStorage.getItem('token');
// //     const savedUser  = localStorage.getItem('user');
// //     if (savedToken && savedUser) {
// //       setToken(savedToken);
// //       setUser(JSON.parse(savedUser));
// //     }
// //     setLoading(false);
// //   }, []);

// //   // login: call backend, save token + user
// //   const login = async (loginEmail, password) => {
// //     const res = await authAPI.login({ login: loginEmail, password });
// //     const { token: newToken, user: newUser } = res.data;
// //     localStorage.setItem('token', newToken);
// //     localStorage.setItem('user', JSON.stringify(newUser));
// //     setToken(newToken);
// //     setUser(newUser);
// //     return newUser;
// //   };

// //   // logout: clear everything
// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     setToken(null);
// //     setUser(null);
// //   };

// //   // Value shared to all children
// //   const value = { user, token, login, logout, isLoggedIn: !!token };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
// //       </div>
// //     );
// //   }

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }

// // // 3. Custom hook — use this in any component
// // export function useAuth() {
// //   return useContext(AuthContext);
// // }

// // src/context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authAPI } from '../services/api';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser]       = useState(null);
//   const [token, setToken]     = useState(null);
//   const [loading, setLoading] = useState(true);

//   // App ochilganda localStorage ni tekshirish
//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     const savedUser  = localStorage.getItem('user');
//     if (savedToken && savedUser) {
//       try {
//         setToken(savedToken);
//         setUser(JSON.parse(savedUser));
//       } catch {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Login: backend ga POST /auth/login/admin
//   // Body: { login: "email", password: "..." }
//   const login = async (loginEmail, password) => {
//     const res = await authAPI.login({ login: loginEmail, password });
//     const data = res.data;

//     // Backend { token, user } yoki { accessToken, ... } qaytarishi mumkin
//     const newToken = data.token || data.accessToken || data.access_token;
//     const newUser  = data.user  || data.admin || data.profile || { login: loginEmail };

//     if (!newToken) throw new Error("Token kelmadi");

//     localStorage.setItem('token', newToken);
//     localStorage.setItem('user', JSON.stringify(newUser));
//     setToken(newToken);
//     setUser(newUser);
//     return newUser;
//   };

//   // Logout
//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//   };

//   const value = { user, token, login, logout, isLoggedIn: !!token };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // App ochilganda localStorage ni tekshirish
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login: backend ga POST /auth/login/admin
  // Body: { login: "email", password: "..." }
  const login = async (loginEmail, password) => {
    const res = await authAPI.login({ login: loginEmail, password });
    const data = res.data;

    // Backend { token, user } yoki { accessToken, ... } qaytarishi mumkin
    const newToken = data.token || data.accessToken || data.access_token;
    const newUser  = data.user  || data.admin || data.profile || { login: loginEmail };

    if (!newToken) throw new Error("Token kelmadi");

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, logout, isLoggedIn: !!token };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}