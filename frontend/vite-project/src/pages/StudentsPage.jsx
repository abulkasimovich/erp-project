// src/pages/StudentsPage.jsx
// O'quvchilar (Students) page — table + drawer add/edit

import React, { useState, useEffect } from 'react';
import { studentAPI, groupAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('faol');
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', parentPhone: '',
    birthDate: '', groupId: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    loadStudents();
    loadGroups();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getAll();
      setStudents(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadGroups = async () => {
    try {
      const res = await groupAPI.getAll();
      setGroups(res.data || []);
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    setEditStudent(null);
    setForm({ name: '', phone: '', parentPhone: '', birthDate: '', groupId: '' });
    setDrawerOpen(true);
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ name: s.name || '', phone: s.phone || '', parentPhone: s.parentPhone || '', birthDate: s.birthDate || '', groupId: s.groupId || '' });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editStudent) await studentAPI.update(editStudent.id, form);
      else await studentAPI.create(form);
      setDrawerOpen(false);
      loadStudents();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadStudents();
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const PER_PAGE = 10;
  const totalPages = Math.ceil(students.length / PER_PAGE);
  const paginated = students.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">Taqvim ko'rish</button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Talaba qo'shish
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
            {t === 'faol' ? 'Faol talabalar' : 'Arxiv'}
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
                <th>Guruh</th>
                <th>Telefon</th>
                <th>Tug'ilgan sana</th>
                <th>Qo'shilgan sana</th>
                <th>Balans</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Talabalar mavjud emas</td></tr>
              ) : (
                paginated.map((s, i) => (
                  <tr key={s.id}>
                    <td className="text-gray-400">{(page - 1) * PER_PAGE + i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                          {s.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{s.name}</span>
                      </div>
                    </td>
                    <td>
                      {s.group ? (
                        <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded-lg font-medium">{s.group.name}</span>
                      ) : <span className="text-gray-400 text-xs">Guruhsiz</span>}
                    </td>
                    <td className="text-gray-600">{s.phone}</td>
                    <td className="text-gray-500">{s.birthDate || '—'}</td>
                    <td className="text-gray-500">{s.createdAt || '—'}</td>
                    <td>
                      {s.balance !== undefined ? (
                        <span className={`font-medium text-sm ${s.balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {Number(s.balance).toLocaleString()} so'm
                        </span>
                      ) : '—'}
                    </td>
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
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                  ${p === page ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editStudent ? "Talabani tahrirlash" : "Talaba qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Ism <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Ism Familiya" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Talaba raqami</label>
            <input className="crm-input" placeholder="+998901234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Ota-ona raqami</label>
            <input className="crm-input" placeholder="+998901234567" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Tug'ilgan sana</label>
            <input type="date" className="crm-input" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Guruh</label>
            <select className="crm-input" value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}>
              <option value="">Guruhni tanlang</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
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
        title="Talabani o'chirish"
        message={`"${deleteTarget?.name}" ni o'chirasizmi?`}
      />
    </div>
  );
}
