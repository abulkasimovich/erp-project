// src/pages/TeachersPage.jsx
// ============================================================
// O'qituvchilar (Teachers) page
// Table with all teachers + right drawer to add/edit
// ============================================================

import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('faol'); // 'faol' | 'arxiv'

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', subject: '', salary: '',
    salaryType: 'foiz', percent: '',
    startDate: '', birthDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadTeachers(); }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getAll();
      setTeachers(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditTeacher(null);
    setForm({ name: '', phone: '', subject: '', salary: '', salaryType: 'foiz', percent: '', startDate: '', birthDate: '' });
    setDrawerOpen(true);
  };

  const openEdit = (t) => {
    setEditTeacher(t);
    setForm({
      name: t.name || '', phone: t.phone || '', subject: t.subject || '',
      salary: t.salary || '', salaryType: t.salaryType || 'foiz',
      percent: t.percent || '', startDate: t.startDate || '', birthDate: t.birthDate || '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editTeacher) await teacherAPI.update(editTeacher.id, form);
      else await teacherAPI.create(form);
      setDrawerOpen(false);
      loadTeachers();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teacherAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadTeachers();
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">O'qituvchilar</h1>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtr
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            O'qituvchi qo'shish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['faol', 'arxiv'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all
              ${activeTab === t ? 'bg-white border border-gray-200 shadow-sm text-gray-900' : 'text-gray-500 hover:bg-white/50'}`}
          >
            {t === 'faol' ? "Faol o'qituvchilar" : 'Arxiv'}
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
                <th>Fan</th>
                <th>Telefon</th>
                <th>Tug'ilgan sana</th>
                <th>Ishlagan vaqti</th>
                <th>Oy maoshi</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">O'qituvchilar mavjud emas</td></tr>
              ) : (
                teachers.map((t, i) => (
                  <tr key={t.id}>
                    <td className="text-gray-400">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {t.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{t.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">{t.subject || '—'}</span>
                    </td>
                    <td className="text-gray-600">{t.phone}</td>
                    <td className="text-gray-500">{t.birthDate || '—'}</td>
                    <td className="text-gray-500">{t.startDate || '—'}</td>
                    <td>
                      {t.salary ? (
                        <span className="text-green-600 font-medium">{Number(t.salary).toLocaleString()} so'm</span>
                      ) : '—'}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteTarget(t)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
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

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editTeacher ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}
      >
        <div className="space-y-4">
          <div>
            <label className="crm-label">Ism Familiya <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Ali Valiyev" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Telefon <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="+998 90 123 45 67" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Fan turi <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Frontend, IELTS..." value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
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
            <label className="crm-label">Maosh turi</label>
            <div className="flex gap-3">
              {['foiz', 'solishtirma', 'Belgilangan'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="salaryType"
                    value={type}
                    checked={form.salaryType === type}
                    onChange={() => setForm({ ...form, salaryType: type })}
                    className="accent-primary"
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="crm-label">Maosh miqdori</label>
            <input className="crm-input" type="number" placeholder="500000" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
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
        title="O'qituvchini o'chirish"
        message={`"${deleteTarget?.name}" ni o'chirasizmi?`}
      />
    </div>
  );
}
