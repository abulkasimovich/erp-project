// // src/pages/LoginPage.jsx
// // Login page — matches the design from login.png
// // Left side: building photo, Right side: login form

// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.username || !form.password) {
//       setError("Login va parolni kiriting");
//       return;
//     }
//     setLoading(true);
//     try {
//       await login(form.username, form.password);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || "Login yoki parol noto'g'ri");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* ── Left: Building photo ── */}
//       <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-800">
//         <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/40 z-10" />
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80')`,
//           }}
//         />
//         {/* Center text on photo */}
//         {/* <div className="relative z-20 flex items-end p-10 w-full">
//           <div className="bg-yellow-400 rounded-2xl p-5 max-w-xs">
//             <p className="text-2xl font-bold text-gray-900 leading-snug">
//               ZAMONAVIY<br />KASBLAR<br />MARKAZI
//             </p>
//           </div>
//         </div> */}
//       </div>

//       {/* ── Right: Login form ── */}
//       <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white">
//         {/* Logo */}
//         <div className="w-full max-w-sm">
//           <div className="flex items-center gap-2 mb-10">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
//               </svg>
//             </div>
//             <span className="font-bold text-gray-800 text-lg">CRM EDU</span>
//           </div>

//           <h1 className="text-2xl font-bold text-gray-900 mb-1">Tizimga kirish</h1>
//           <p className="text-gray-400 text-sm mb-8">Hisobingizga kirish uchun ma'lumot kiriting</p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Username */}
//             <div>
//               <label className="crm-label">Login <span className="text-red-500">*</span></label>
//               <input
//                 className="crm-input"
//                 name="username"
//                 placeholder="Login kiriting"
//                 value={form.username}
//                 onChange={handleChange}
//                 autoComplete="username"
//               />
//               {!form.username && error && (
//                 <p className="text-xs text-red-500 mt-1">Login kiritilmagan</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="crm-label">Parol <span className="text-red-500">*</span></label>
//               <div className="relative">
//                 <input
//                   className="crm-input pr-10"
//                   name="password"
//                   type="password"
//                   placeholder="Parol kiriting"
//                   value={form.password}
//                   onChange={handleChange}
//                   autoComplete="current-password"
//                 />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 </span>
//               </div>
//             </div>

//             {/* Error message */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
//                 {error}
//               </div>
//             )}

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
//             >
//               {loading ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : null}
//               Kirish
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/pages/LoginPage.jsx
// Login page — matches the design from login.png
// Left side: building photo, Right side: login form

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.login || !form.password) {
      setError("Login va parolni kiriting");
      return;
    }
    setLoading(true);
    try {
      await login(form.login, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Building photo ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/40 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80')`,
          }}
        />
        {/* Center text on photo */}
        <div className="relative z-20 flex items-end p-10 w-full">
          <div className="bg-yellow-400 rounded-2xl p-5 max-w-xs">
            <p className="text-2xl font-bold text-gray-900 leading-snug">
              ZAMONAVIY<br />KASBLAR<br />MARKAZI
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white">
        {/* Logo */}
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">Najot Ta'lim</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tizimga kirish</h1>
          <p className="text-gray-400 text-sm mb-8">Hisobingizga kirish uchun ma'lumot kiriting</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="crm-label">Login <span className="text-red-500">*</span></label>
              <input
                className="crm-input"
                name="login"
                placeholder="Email kiriting"
                value={form.login}
                onChange={handleChange}
                autoComplete="email"
              />
              {!form.login && error && (
                <p className="text-xs text-red-500 mt-1">Login kiritilmagan</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="crm-label">Parol <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  className="crm-input pr-10"
                  name="password"
                  type="password"
                  placeholder="Parol kiriting"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              Kirish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}