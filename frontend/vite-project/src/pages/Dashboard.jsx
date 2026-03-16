// src/pages/Dashboard.jsx
// ============================================================
// Boshqarish (Dashboard) page
// Tabs: Kurslar (Courses) | Xonalar (Rooms)
// Also shows course categories table
// ============================================================

import React, { useState, useEffect } from 'react';
import { courseAPI, roomAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

// ── Course card ───────────────────────────────────────────────
function CourseCard({ course, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-gray-400">{course.category || 'Kurs'}</span>
          <h3 className="font-semibold text-gray-900 mt-0.5">{course.name}</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(course)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(course)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {course.duration || 0} min
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {course.studentCount || 0} ta
        </span>
        <span className="flex items-center gap-1 text-green-600 font-medium">
          {(course.price || 0).toLocaleString()} so'm
        </span>
      </div>
    </div>
  );
}

// ── Room card ─────────────────────────────────────────────────
function RoomCard({ room, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-400 mt-1">Sig'im: {room.capacity || 0}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(room)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(room)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('kurslar');
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('course'); // 'course' | 'room'
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load data
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        courseAPI.getAll(),
        roomAPI.getAll(),
      ]);
      setCourses(cRes.data || []);
      setRooms(rRes.data || []);
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Open drawer for add/edit
  const openDrawer = (type, item = null) => {
    setDrawerType(type);
    setEditItem(item);
    setForm(item || {});
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (drawerType === 'course') {
        if (editItem) await courseAPI.update(editItem.id, form);
        else await courseAPI.create(form);
      } else {
        if (editItem) await roomAPI.update(editItem.id, form);
        else await roomAPI.create(form);
      }
      setDrawerOpen(false);
      loadAll();
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'course') await courseAPI.delete(deleteTarget.item.id);
      else await roomAPI.delete(deleteTarget.item.id);
      setDeleteTarget(null);
      loadAll();
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  // Tab nav items from cr.png
  const tabs = [
    'Kurslar', 'Filollar va Matematika', '4-mashq', 'Niner markazi',
    'SAT', 'IELTS full mock', 'IELTS full mock centre', 'IELTS full mock',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Boshqarish</h1>

      {/* ── Horizontal tabs (like in cr.png) ── */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {['Kurslar', 'Filollar', 'Xonalar', 'Salabalar', 'Rollar', 'Kabul qabullari', 'Talabalar'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t.toLowerCase())}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${activeTab === t.toLowerCase()
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ══════════ KURSLAR tab ══════════ */}
      {activeTab === 'kurslar' && (
        <div>
          {/* Add course button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openDrawer('course')}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Kurs qo'shish
            </button>
          </div>

          {/* Course cards grid */}
          {courses.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="font-medium">Kurslar mavjud emas</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {courses.map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  onEdit={(item) => openDrawer('course', item)}
                  onDelete={(item) => setDeleteTarget({ type: 'course', item })}
                />
              ))}
            </div>
          )}

          {/* Kurs kategoriyalari */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Kurs kategoriyalari</h2>
              <button className="btn-primary text-xs px-3 py-2">Kategoriya qo'shish</button>
            </div>
            <table className="w-full crm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nomi</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-gray-400 py-6">Kategoriyalar mavjud emas</td></tr>
                ) : (
                  categories.map((cat, idx) => (
                    <tr key={cat.id}>
                      <td>{idx + 1}</td>
                      <td>{cat.name}</td>
                      <td>
                        <button className="text-gray-400 hover:text-red-500 p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════ XONALAR tab ══════════ */}
      {activeTab === 'xonalar' && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => openDrawer('room')}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Xona qo'shish
            </button>
          </div>
          {rooms.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="font-medium">Xonalar mavjud emas</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {rooms.map((r) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  onEdit={(item) => openDrawer('room', item)}
                  onDelete={(item) => setDeleteTarget({ type: 'room', item })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other tabs: placeholder */}
      {!['kurslar', 'xonalar'].includes(activeTab) && (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium">Bu bo'lim tez orada qo'shiladi</p>
        </div>
      )}

      {/* ══════════ DRAWER ══════════ */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerType === 'course'
          ? (editItem ? 'Kursni tahrirlash' : "Kurs qo'shish")
          : (editItem ? 'Xonani tahrirlash' : "Xona qo'shish")}
      >
        {/* COURSE FORM */}
        {drawerType === 'course' && (
          <div className="space-y-4">
            <div>
              <label className="crm-label">Kurs nomi <span className="text-red-500">*</span></label>
              <input className="crm-input" placeholder="Kurs nomi" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="crm-label">Kurs haqida (ixtiyoriy)</label>
              <textarea className="crm-input h-24 resize-none" placeholder="Tavsif..." value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="crm-label">Davomiylik (daqiqa)</label>
                <input className="crm-input" type="number" placeholder="90" value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div>
                <label className="crm-label">Dars soni</label>
                <input className="crm-input" type="number" placeholder="12" value={form.lessonCount || ''} onChange={(e) => setForm({ ...form, lessonCount: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="crm-label">Narx (so'm)</label>
              <input className="crm-input" type="number" placeholder="400000" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="crm-label">Rangi</label>
              <div className="flex gap-2 flex-wrap mt-1">
                {['#7C3AED','#10B981','#3B82F6','#F59E0B','#EF4444','#EC4899','#06B6D4','#8B5CF6'].map(color => (
                  <button
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROOM FORM */}
        {drawerType === 'room' && (
          <div className="space-y-4">
            <div>
              <label className="crm-label">Xona nomi <span className="text-red-500">*</span></label>
              <input className="crm-input" placeholder="Xona nomi" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="crm-label">Sig'im</label>
              <input className="crm-input" type="number" placeholder="30" value={form.capacity || ''} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setDrawerOpen(false)} className="btn-secondary flex-1">Bekor qilish</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      {/* ══════════ DELETE CONFIRM ══════════ */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="O'chirishni tasdiqlang"
        message="Bu elementni o'chirasizmi? Bu amalni ortga qaytarib bo'lmaydi."
      />
    </div>
  );
}
