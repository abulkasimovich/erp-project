// src/pages/StaffPage.jsx
// Xodimlar (Staff) page — matches crm_exam_xodim.png

import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

const ROLES = ['DIRECTOR', 'ADMIN', 'TEACHER', 'MARKETER', 'TEST_MARKER'];

const roleBadge = (role) => {
  const map = {
    DIRECTOR:    'bg-purple-100 text-purple-700',
    ADMIN:       'bg-blue-100 text-blue-700',
    TEACHER:     'bg-green-100 text-green-700',
    MARKETER:    'bg-orange-100 text-orange-700',
    TEST_MARKER: 'bg-pink-100 text-pink-700',
  };
  return map[role] || 'bg-gray-100 text-gray-600';
};

export default function StaffPage() {
  const [staff, setStaff]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStaff, setEditStaff]   = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'ADMIN', salary: '', birthDate: '', startDate: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await staffAPI.getAll();
      setStaff(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditStaff(null);
    setForm({ name: '', phone: '', email: '', role: 'ADMIN', salary: '', birthDate: '', startDate: '' });
    setDrawerOpen(true);
  };

  const openEdit = (s) => {
    setEditStaff(s);
    setForm({ name: s.name || '', phone: s.phone || '', email: s.email || '', role: s.role || 'ADMIN', salary: s.salary || '', birthDate: s.birthDate || '', startDate: s.startDate || '' });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editStaff) await staffAPI.update(editStaff.id, form);
      else await staffAPI.create(form);
      setDrawerOpen(false);
      loadStaff();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await staffAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadStaff();
    } catch (e) { console.error(e); }
  };

  // Filter by role tab
  const filtered = activeTab === 'all' ? staff : staff.filter((s) => s.role === activeTab);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  // Role counts for tab labels
  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = staff.filter((s) => s.role === r).length;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Boshqarish</h1>

      {/* Main horizontal tabs (like in screenshot) */}
      <div className="flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto">
        {['Kurslar', 'Filollar', 'Xodimlar', 'Salabalar', 'Rollar', 'Kabul qabullari', 'Talabalar'].map((t) => (
          <button
            key={t}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px
              ${t === 'Xodimlar'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Xodimlar section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Xodimlar</h2>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Xodim qo'shish
          </button>
        </div>

        {/* Role filter tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
              ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            AICoder markazi ({staff.length})
          </button>
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setActiveTab(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
                ${activeTab === r ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {r} ({roleCounts[r] || 0})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full crm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ism</th>
                  <th>Lavozim</th>
                  <th>Telefon</th>
                  <th>Tug'ilgan sana</th>
                  <th>Ishlash sanasi</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">Xodimlar mavjud emas</td></tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr key={s.id}>
                      <td className="text-gray-400">{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {s.photo ? (
                            <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {s.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{s.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${roleBadge(s.role)}`}>
                          {s.role}
                        </span>
                      </td>
                      <td className="text-gray-600">{s.phone}</td>
                      <td className="text-gray-500">{s.birthDate || '—'}</td>
                      <td className="text-gray-500">{s.startDate || '—'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editStaff ? "Xodimni tahrirlash" : "Yangi Xodim qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Ism <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Ism Familiya" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Telefon</label>
            <input className="crm-input" placeholder="+998901234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Email</label>
            <input className="crm-input" type="email" placeholder="example@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Lavozim (Role)</label>
            <select className="crm-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="crm-label">Tug'ilgan sana</label>
            <input type="date" className="crm-input" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Boshlash sanasi</label>
            <input type="date" className="crm-input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Maosh</label>
            <input className="crm-input" type="number" placeholder="0" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setDrawerOpen(false)} className="btn-secondary flex-1">Bekor qilish</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xodimni o'chirish"
        message={`"${deleteTarget?.name}" ni o'chirasizmi?`}
      />
    </div>
  );
}
