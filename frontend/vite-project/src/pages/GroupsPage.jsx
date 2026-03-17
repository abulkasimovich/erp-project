// // src/pages/GroupsPage.jsx
// // ============================================================
// // Guruhlar (Groups) page
// // - Stats cards at top (total groups, teachers, students)
// // - Table with toggle, group name, course badge, schedule, etc.
// // - Right drawer to add/edit a group
// // - Click row → navigate to GroupDetail
// // ============================================================

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { groupAPI, teacherAPI, courseAPI, roomAPI, studentAPI } from '../services/api';
// import Drawer from '../components/Drawer';
// import Toggle from '../components/Toggle';
// import ConfirmModal from '../components/ConfirmModal';

// // Days of week for the form checkboxes
// const DAYS = [
//   { key: 'dushanba',  label: 'Dushanba' },
//   { key: 'seshanba',  label: 'Seshanba' },
//   { key: 'chorshanba',label: 'Chorshanba' },
//   { key: 'payshanba', label: 'Payshanba' },
//   { key: 'juma',      label: 'Juma' },
//   { key: 'shanba',    label: 'Shanba' },
//   { key: 'yakshanba', label: 'Yakshanba' },
// ];

// // Course color badge
// function CourseBadge({ name, color }) {
//   const colorMap = {
//     'math': 'bg-orange-100 text-orange-700',
//     'ielts': 'bg-purple-100 text-purple-700',
//     'sat': 'bg-blue-100 text-blue-700',
//   };
//   const lower = (name || '').toLowerCase();
//   const cls = Object.entries(colorMap).find(([k]) => lower.includes(k))?.[1] || 'bg-gray-100 text-gray-600';
//   return (
//     <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
//       {name}
//     </span>
//   );
// }

// export default function GroupsPage() {
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState('guruhlar'); // 'guruhlar' | 'arxiv'
//   const [groups, setGroups] = useState([]);
//   const [stats, setStats] = useState({ total: 0, teachers: 0, students: 0 });
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');

//   // For drawer select options
//   const [courses, setCourses] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [students, setStudents] = useState([]);

//   // Drawer state
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editGroup, setEditGroup] = useState(null);
//   const [form, setForm] = useState({
//     name: '', courseId: '', roomId: '', days: [],
//     time: '09:00', startDate: '', endDate: '',
//     teacherIds: [], studentIds: [],
//   });
//   const [saving, setSaving] = useState(false);

//   // Delete confirm
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   // ── Load everything ─────────────────────────────────────────
//   useEffect(() => {
//     loadGroups();
//     loadOptions();
//   }, []);

//   const loadGroups = async () => {
//     setLoading(true);
//     try {
//       const res = await groupAPI.getAll();
//       const data = res.data || [];
//       setGroups(data);
//       // Calculate stats from data (or use /groups/stats if available)
//       const uniqueTeachers = new Set(data.flatMap(g => g.teacherIds || [])).size;
//       const totalStudents  = data.reduce((sum, g) => sum + (g.studentCount || 0), 0);
//       setStats({ total: data.length, teachers: uniqueTeachers, students: totalStudents });
//     } catch (e) {
//       console.error('Groups load error:', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadOptions = async () => {
//     try {
//       const [cRes, rRes, tRes, sRes] = await Promise.all([
//         courseAPI.getAll(),
//         roomAPI.getAll(),
//         teacherAPI.getAll(),
//         studentAPI.getAll(),
//       ]);
//       setCourses(cRes.data || []);
//       setRooms(rRes.data || []);
//       setTeachers(tRes.data || []);
//       setStudents(sRes.data || []);
//     } catch (e) { console.error(e); }
//   };

//   // ── Open drawer ─────────────────────────────────────────────
//   const openAdd = () => {
//     setEditGroup(null);
//     setForm({ name: '', courseId: '', roomId: '', days: [], time: '09:00', startDate: '', endDate: '', teacherIds: [], studentIds: [] });
//     setDrawerOpen(true);
//   };

//   const openEdit = (g, e) => {
//     e.stopPropagation();
//     setEditGroup(g);
//     setForm({
//       name: g.name || '',
//       courseId: g.courseId || '',
//       roomId: g.roomId || '',
//       days: g.days || [],
//       time: g.time || '09:00',
//       startDate: g.startDate || '',
//       endDate: g.endDate || '',
//       teacherIds: g.teacherIds || [],
//       studentIds: g.studentIds || [],
//     });
//     setDrawerOpen(true);
//   };

//   // Toggle a day checkbox
//   const toggleDay = (day) => {
//     setForm((prev) => ({
//       ...prev,
//       days: prev.days.includes(day)
//         ? prev.days.filter((d) => d !== day)
//         : [...prev.days, day],
//     }));
//   };

//   // ── Save ────────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!form.name) return;
//     setSaving(true);
//     try {
//       if (editGroup) await groupAPI.update(editGroup.id, form);
//       else await groupAPI.create(form);
//       setDrawerOpen(false);
//       loadGroups();
//     } catch (e) {
//       console.error('Save group error:', e);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Toggle group status ──────────────────────────────────────
//   const handleToggle = async (group, e) => {
//     e.stopPropagation();
//     try {
//       await groupAPI.toggleStatus(group.id);
//       setGroups((prev) =>
//         prev.map((g) => g.id === group.id ? { ...g, isActive: !g.isActive } : g)
//       );
//     } catch (e) { console.error(e); }
//   };

//   // ── Delete ───────────────────────────────────────────────────
//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     try {
//       await groupAPI.delete(deleteTarget.id);
//       setDeleteTarget(null);
//       loadGroups();
//     } catch (e) { console.error(e); }
//   };

//   // Filter by search
//   const filtered = groups.filter((g) =>
//     g.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* ── Page header ── */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Guruhlar</h1>
//         <button onClick={openAdd} className="btn-primary flex items-center gap-2">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Guruh qo'shish
//         </button>
//       </div>

//       {/* ── Tabs ── */}
//       <div className="flex gap-2 mb-6">
//         {['guruhlar', 'arxiv'].map((t) => (
//           <button
//             key={t}
//             onClick={() => setActiveTab(t)}
//             className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
//               ${activeTab === t ? 'bg-white border border-gray-200 text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
//           >
//             {t === 'arxiv' && (
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//               </svg>
//             )}
//             {t === 'guruhlar' ? 'Guruhlar' : 'Arxiv'}
//           </button>
//         ))}
//       </div>

//       {/* ── Stats cards ── */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         {/* Total groups */}
//         <div className="stat-card flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">Jami guruhlar</p>
//             <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
//           </div>
//           <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
//             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           </div>
//         </div>

//         {/* Teachers */}
//         <div className="stat-card flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">O'qituvchilar</p>
//             <p className="text-3xl font-bold text-gray-900 mt-1">{stats.teachers}</p>
//           </div>
//           <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
//             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//             </svg>
//           </div>
//         </div>

//         {/* Students */}
//         <div className="stat-card flex items-start justify-between">
//           <div>
//             <p className="text-sm text-gray-500">O'quvchilar</p>
//             <p className="text-3xl font-bold text-gray-900 mt-1">{stats.students}</p>
//           </div>
//           <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
//             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* ── Table ── */}
//       <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full crm-table">
//             <thead>
//               <tr>
//                 <th>Status</th>
//                 <th>Guruh</th>
//                 <th>Kurs</th>
//                 <th>Davomiyligi</th>
//                 <th>Dars vaqti</th>
//                 <th>Kim qo'shgan</th>
//                 <th>Xona</th>
//                 <th>O'qituvchi</th>
//                 <th>Talabalar</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={10} className="text-center py-12 text-gray-400">
//                     <p className="font-medium">Guruhlar mavjud emas</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((g) => (
//                   <tr
//                     key={g.id}
//                     className="cursor-pointer"
//                     onClick={() => navigate(`/groups/${g.id}`)}
//                   >
//                     {/* Toggle */}
//                     <td onClick={(e) => e.stopPropagation()}>
//                       <div className="flex items-center gap-2">
//                         <Toggle
//                           value={g.isActive}
//                           onChange={() => handleToggle(g, { stopPropagation: () => {} })}
//                         />
//                         <span className={g.isActive ? 'badge-active' : 'badge-inactive'}>
//                           {g.isActive ? 'ACTIVE' : 'INACTIVE'}
//                         </span>
//                       </div>
//                     </td>
//                     {/* Name */}
//                     <td className="font-medium text-gray-900">{g.name}</td>
//                     {/* Course badge */}
//                     <td>
//                       {g.course && <CourseBadge name={g.course.name} />}
//                     </td>
//                     {/* Duration */}
//                     <td>
//                       <div className="text-sm">
//                         <div>{g.duration || 90} minut</div>
//                         <div className="text-gray-400 text-xs">
//                           {g.startDate} – {g.endDate}
//                         </div>
//                       </div>
//                     </td>
//                     {/* Time */}
//                     <td>
//                       <div className="text-sm">
//                         <div>{g.time || '09:00'}</div>
//                         <div className="text-gray-400 text-xs">{(g.days || []).join(', ')}</div>
//                       </div>
//                     </td>
//                     {/* Added by */}
//                     <td>
//                       <div className="text-sm">
//                         <div>{g.createdBy?.name || '—'}</div>
//                         <div className="text-gray-400 text-xs">{g.createdAt}</div>
//                       </div>
//                     </td>
//                     {/* Room */}
//                     <td className="text-sm">{g.room?.name || '—'}</td>
//                     {/* Teacher */}
//                     <td>
//                       {g.teachers?.length > 0 ? (
//                         <div className="flex items-center gap-1">
//                           <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
//                             {g.teachers[0]?.name?.charAt(0)}
//                           </div>
//                           <span className="text-sm">{g.teachers[0]?.name}</span>
//                         </div>
//                       ) : (
//                         <span className="text-xs text-gray-400">O'qituvchi yo'q</span>
//                       )}
//                     </td>
//                     {/* Student count */}
//                     <td className="text-sm font-medium">{g.studentCount || 0}</td>
//                     {/* Actions */}
//                     <td onClick={(e) => e.stopPropagation()}>
//                       <div className="flex gap-1">
//                         <button onClick={(e) => openEdit(g, e)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={(e) => { e.stopPropagation(); setDeleteTarget(g); }}
//                           className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ══════════ ADD/EDIT DRAWER ══════════ */}
//       <Drawer
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         title={editGroup ? "Guruhni tahrirlash" : "Guruh qo'shish"}
//       >
//         <div className="space-y-4">
//           {/* Group name */}
//           <div>
//             <label className="crm-label">Guruh nomi <span className="text-red-500">*</span></label>
//             <input
//               className="crm-input"
//               placeholder="Frontend 2024"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//           </div>

//           {/* Course */}
//           <div>
//             <label className="crm-label">Kurs <span className="text-red-500">*</span></label>
//             <select
//               className="crm-input"
//               value={form.courseId}
//               onChange={(e) => setForm({ ...form, courseId: e.target.value })}
//             >
//               <option value="">Kursni tanlang</option>
//               {courses.map((c) => (
//                 <option key={c.id} value={c.id}>{c.name}</option>
//               ))}
//             </select>
//           </div>

//           {/* Room */}
//           <div>
//             <label className="crm-label">Xona <span className="text-red-500">*</span></label>
//             <select
//               className="crm-input"
//               value={form.roomId}
//               onChange={(e) => setForm({ ...form, roomId: e.target.value })}
//             >
//               <option value="">Xonani tanlang</option>
//               {rooms.map((r) => (
//                 <option key={r.id} value={r.id}>{r.name}</option>
//               ))}
//             </select>
//           </div>

//           {/* Days of week */}
//           <div>
//             <label className="crm-label">Dars kunlari <span className="text-red-500">*</span></label>
//             <div className="grid grid-cols-2 gap-2 mt-1">
//               {DAYS.map((d) => (
//                 <label key={d.key} className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={form.days.includes(d.key)}
//                     onChange={() => toggleDay(d.key)}
//                     className="w-4 h-4 rounded text-primary accent-primary"
//                   />
//                   <span className="text-sm text-gray-700">{d.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Time */}
//           <div>
//             <label className="crm-label">Dars vaqti <span className="text-red-500">*</span></label>
//             <input
//               type="time"
//               className="crm-input"
//               value={form.time}
//               onChange={(e) => setForm({ ...form, time: e.target.value })}
//             />
//           </div>

//           {/* Start date */}
//           <div>
//             <label className="crm-label">Boshlanish sanasi <span className="text-red-500">*</span></label>
//             <input
//               type="date"
//               className="crm-input"
//               value={form.startDate}
//               onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//             />
//           </div>

//           {/* End date */}
//           <div>
//             <label className="crm-label">Tugash sanasi <span className="text-red-500">*</span></label>
//             <input
//               type="date"
//               className="crm-input"
//               value={form.endDate}
//               onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//             />
//           </div>

//           {/* Teachers multi-select */}
//           <div>
//             <label className="crm-label">O'qituvchilar</label>
//             <div className="border border-gray-200 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1.5">
//               {teachers.length === 0
//                 ? <p className="text-xs text-gray-400">O'qituvchilar mavjud emas</p>
//                 : teachers.map((t) => (
//                   <label key={t.id} className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={form.teacherIds.includes(t.id)}
//                       onChange={() => {
//                         const ids = form.teacherIds.includes(t.id)
//                           ? form.teacherIds.filter((id) => id !== t.id)
//                           : [...form.teacherIds, t.id];
//                         setForm({ ...form, teacherIds: ids });
//                       }}
//                       className="w-4 h-4 accent-primary"
//                     />
//                     <span className="text-sm">{t.name}</span>
//                   </label>
//                 ))
//               }
//             </div>
//           </div>

//           {/* Students multi-select */}
//           <div>
//             <label className="crm-label">Studentlar</label>
//             <div className="border border-gray-200 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1.5">
//               {students.length === 0
//                 ? <p className="text-xs text-gray-400">Talabalar mavjud emas</p>
//                 : students.map((s) => (
//                   <label key={s.id} className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={form.studentIds.includes(s.id)}
//                       onChange={() => {
//                         const ids = form.studentIds.includes(s.id)
//                           ? form.studentIds.filter((id) => id !== s.id)
//                           : [...form.studentIds, s.id];
//                         setForm({ ...form, studentIds: ids });
//                       }}
//                       className="w-4 h-4 accent-primary"
//                     />
//                     <span className="text-sm">{s.name}</span>
//                   </label>
//                 ))
//               }
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
//           <button onClick={() => setDrawerOpen(false)} className="btn-secondary flex-1">Bekor qilish</button>
//           <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
//             {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
//             Saqlash
//           </button>
//         </div>
//       </Drawer>

//       {/* Delete confirm */}
//       <ConfirmModal
//         open={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={handleDelete}
//         title="Guruhni o'chirish"
//         message={`"${deleteTarget?.name}" guruhini o'chirasizmi?`}
//       />
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupAPI, teacherAPI, courseAPI, roomAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

const WEEK_DAYS = [
  { key: 'MONDAY',    label: 'Dushanba' },
  { key: 'TUESDAY',   label: 'Seshanba' },
  { key: 'WEDNESDAY', label: 'Chorshanba' },
  { key: 'THURSDAY',  label: 'Payshanba' },
  { key: 'FRIDAY',    label: 'Juma' },
  { key: 'SATURDAY',  label: 'Shanba' },
  { key: 'SUNDAY',    label: 'Yakshanba' },
];

const EMPTY_FORM = {
  name: '', courseId: '', roomId: '', teacherId: '',
  weekDays: [], startTime: '09:00', startDate: '',
};

export default function GroupsPage() {
  const navigate = useNavigate();

  const [groups, setGroups]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const [courses, setCourses]   = useState([]);
  const [rooms, setRooms]       = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [editGroup, setEditGroup]       = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadGroups(); loadOptions(); }, []);

  const loadGroups = async () => {
    setLoading(true); setError('');
    try {
      const res = await groupAPI.getAll();
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setGroups(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Cannot GET /groups/all');
    } finally { setLoading(false); }
  };

  const loadOptions = async () => {
    try {
      const [cRes, rRes, tRes] = await Promise.all([
        courseAPI.getAll(), roomAPI.getAll(), teacherAPI.getAll(),
      ]);
      const toList = r => Array.isArray(r.data) ? r.data : (r.data?.data || []);
      setCourses(toList(cRes));
      setRooms(toList(rRes));
      setTeachers(toList(tRes));
    } catch (e) { console.error('Options error:', e); }
  };

  const openAdd = () => {
    setEditGroup(null); setForm(EMPTY_FORM); setSaveError(''); setDrawerOpen(true);
  };

  const openEdit = (g, e) => {
    e.stopPropagation(); setEditGroup(g);
    setForm({
      name:      g.name      || '',
      courseId:  g.courseId  || g.course?.id  || '',
      roomId:    g.roomId    || g.room?.id    || '',
      teacherId: g.teacherId || g.teacher?.id || '',
      weekDays:  g.weekDays  || [],
      startTime: g.startTime || '09:00',
      startDate: g.startDate ? g.startDate.split('T')[0] : '',
    });
    setSaveError(''); setDrawerOpen(true);
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      weekDays: prev.weekDays.includes(day)
        ? prev.weekDays.filter(d => d !== day)
        : [...prev.weekDays, day],
    }));
  };

  const handleSave = async () => {
    if (!form.name)      { setSaveError("Guruh nomi majburiy");        return; }
    if (!form.teacherId) { setSaveError("O'qituvchi majburiy");        return; }
    if (!form.roomId)    { setSaveError("Xona majburiy");              return; }
    if (!form.courseId)  { setSaveError("Kurs majburiy");              return; }
    if (!form.startDate) { setSaveError("Boshlanish sanasi majburiy"); return; }
    if (form.weekDays.length === 0) { setSaveError("Kamida 1 kun tanlang"); return; }

    setSaving(true); setSaveError('');
    try {
      const payload = {
        name:      form.name,
        teacherId: Number(form.teacherId),
        roomId:    Number(form.roomId),
        courseId:  Number(form.courseId),
        startDate: new Date(form.startDate).toISOString(),
        startTime: form.startTime,
        weekDays:  form.weekDays,
      };
      if (editGroup) await groupAPI.update(editGroup.id, payload);
      else await groupAPI.create(payload);
      setDrawerOpen(false); loadGroups();
    } catch (e) {
      const msg = e.response?.data?.message;
      setSaveError(Array.isArray(msg) ? msg.join('\n') : (msg || 'Saqlashda xatolik'));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await groupAPI.delete(deleteTarget.id); setDeleteTarget(null); loadGroups(); }
    catch (e) { console.error(e); }
  };

  const filtered = groups.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Guruhlar</h1>
        <div className="flex items-center gap-3">
          <input className="crm-input w-48" placeholder="Qidirish..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Guruh qo'shish
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
          {error} — <button className="underline font-medium" onClick={loadGroups}>Qayta yuklash</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Jami guruhlar', value: groups.length, emoji: '👥' },
          { label: "O'qituvchilar", value: new Set(groups.map(g => g.teacherId).filter(Boolean)).size, emoji: '👨‍🏫' },
          { label: 'Kurslar',       value: new Set(groups.map(g => g.courseId).filter(Boolean)).size,  emoji: '📚' },
        ].map(s => (
          <div key={s.label} className="stat-card flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
            </div>
            <span className="text-3xl">{s.emoji}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full crm-table">
            <thead>
              <tr>
                <th>#</th><th>Guruh nomi</th><th>Kurs</th>
                <th>Dars vaqti</th><th>Kunlar</th><th>Xona</th>
                <th>O'qituvchi</th><th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Guruhlar mavjud emas</td></tr>
              ) : filtered.map((g, i) => (
                <tr key={g.id} className="cursor-pointer" onClick={() => navigate(`/groups/${g.id}`)}>
                  <td className="text-gray-400">{i + 1}</td>
                  <td className="font-semibold text-gray-900">{g.name}</td>
                  <td>
                    {g.course?.name && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {g.course.name}
                      </span>
                    )}
                  </td>
                  <td className="text-sm font-medium">{g.startTime || '—'}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {(g.weekDays || []).map(d => (
                        <span key={d} className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                          {WEEK_DAYS.find(w => w.key === d)?.label?.slice(0, 3) || d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-sm text-gray-600">{g.room?.name || '—'}</td>
                  <td>
                    {g.teacher?.fullName
                      ? <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {g.teacher.fullName.charAt(0)}
                          </div>
                          <span className="text-sm">{g.teacher.fullName}</span>
                        </div>
                      : <span className="text-xs text-gray-400">Yo'q</span>
                    }
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button onClick={e => openEdit(g, e)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={e => { e.stopPropagation(); setDeleteTarget(g); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title={editGroup ? "Guruhni tahrirlash" : "Guruh qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Guruh nomi <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Frontend N1" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Kurs <span className="text-red-500">*</span></label>
            <select className="crm-input" value={form.courseId}
              onChange={e => setForm({ ...form, courseId: e.target.value })}>
              <option value="">Kursni tanlang</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="crm-label">Xona <span className="text-red-500">*</span></label>
            <select className="crm-input" value={form.roomId}
              onChange={e => setForm({ ...form, roomId: e.target.value })}>
              <option value="">Xonani tanlang</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity} kishi)</option>)}
            </select>
          </div>
          <div>
            <label className="crm-label">O'qituvchi <span className="text-red-500">*</span></label>
            <select className="crm-input" value={form.teacherId}
              onChange={e => setForm({ ...form, teacherId: e.target.value })}>
              <option value="">O'qituvchini tanlang</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="crm-label">Dars kunlari <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {WEEK_DAYS.map(d => (
                <label key={d.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.weekDays.includes(d.key)}
                    onChange={() => toggleDay(d.key)} className="w-4 h-4 accent-purple-600" />
                  <span className="text-sm text-gray-700">{d.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="crm-label">Dars vaqti <span className="text-red-500">*</span></label>
            <input type="time" className="crm-input" value={form.startTime}
              onChange={e => setForm({ ...form, startTime: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Boshlanish sanasi <span className="text-red-500">*</span></label>
            <input type="date" className="crm-input" value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600 whitespace-pre-wrap">
              {saveError}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setDrawerOpen(false)} className="btn-secondary flex-1">Bekor qilish</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Guruhni o'chirish" message={`"${deleteTarget?.name}" guruhini o'chirasizmi?`} />
    </div>
  );
}