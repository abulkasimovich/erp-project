
// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate  = useNavigate();

//   const [form, setForm]     = useState({ login: '', password: '' });
//   const [error, setError]   = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.login || !form.password) {
//       setError("Login va parolni kiriting");
//       return;
//     }
//     setLoading(true);
//     try {
//       await login(form.login, form.password);
//       navigate('/', { replace: true });
//     } catch (err) {
//       const msg = err.response?.data?.message
//         || err.response?.data?.error
//         || err.message
//         || "Login yoki parol noto'g'ri";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* ── Chap: rasm ── */}
//       <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-800">
//         <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/40 z-10" />
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80')` }}
//         />
//         <div className="relative z-20 flex items-end p-10 w-full">
//           <div className="bg-yellow-400 rounded-2xl p-5 max-w-xs">
//             <p className="text-2xl font-bold text-gray-900 leading-snug">
//               ZAMONAVIY<br />KASBLAR<br />MARKAZI
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ── O'ng: login forma ── */}
//       <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white">
//         <div className="w-full max-w-sm">

//           {/* Logo */}
//           <div className="flex items-center gap-2 mb-10">
//             <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
//               </svg>
//             </div>
//             <span className="font-bold text-gray-800 text-lg">Najot Ta'lim</span>
//           </div>

//           <h1 className="text-2xl font-bold text-gray-900 mb-1">Tizimga kirish</h1>
//           <p className="text-gray-400 text-sm mb-8">Hisobingizga kirish uchun ma'lumot kiriting</p>

//           <form onSubmit={handleSubmit} className="space-y-4">

//             {/* Login (email) */}
//             <div>
//               <label className="crm-label">
//                 Login (Email) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className="crm-input"
//                 name="login"
//                 type="email"
//                 placeholder="email@example.com"
//                 value={form.login}
//                 onChange={handleChange}
//                 autoComplete="email"
//               />
//             </div>

//             {/* Parol */}
//             <div>
//               <label className="crm-label">
//                 Parol <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   className="crm-input pr-10"
//                   name="password"
//                   type={showPass ? 'text' : 'password'}
//                   placeholder="Parol kiriting"
//                   value={form.password}
//                   onChange={handleChange}
//                   autoComplete="current-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPass(!showPass)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPass ? (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Xato xabari */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
//                 {error}
//               </div>
//             )}

//             {/* Kirish tugmasi */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
//             >
//               {loading && (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               )}
//               {loading ? 'Kirish...' : 'Kirish'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]     = useState({ login: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

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
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || err.message
        || "Login yoki parol noto'g'ri";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Chap: rasm ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/40 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80')` }}
        />
        <div className="relative z-20 flex items-end p-10 w-full">
          <div className="bg-yellow-400 rounded-2xl p-5 max-w-xs">
            <p className="text-2xl font-bold text-gray-900 leading-snug">
              ZAMONAVIY<br />KASBLAR<br />MARKAZI
            </p>
          </div>
        </div>
      </div>

      {/* ── O'ng: login forma ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">Najot Ta'lim</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tizimga kirish</h1>
          <p className="text-gray-400 text-sm mb-8">Hisobingizga kirish uchun ma'lumot kiriting</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Login (email) */}
            <div>
              <label className="crm-label">
                Login (Email) <span className="text-red-500">*</span>
              </label>
              <input
                className="crm-input"
                name="login"
                type="email"
                placeholder="email@example.com"
                value={form.login}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {/* Parol */}
            <div>
              <label className="crm-label">
                Parol <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className="crm-input pr-10"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Parol kiriting"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Xato xabari */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Kirish tugmasi */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}