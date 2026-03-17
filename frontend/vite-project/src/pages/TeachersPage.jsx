import React, { useState, useEffect } from 'react';
import { teacherAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

export default function TeachersPage() {
  const [teachers, setTeachers]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [editTeacher, setEditTeacher]   = useState(null);
  const [form, setForm]                 = useState({ fullName: '', email: '', password: '', position: '', experience: '' });
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadTeachers(); }, []);

  const loadTeachers = async () => {
    setLoading(true); setError('');
    try {
      const res = await teacherAPI.getAll();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.items || []);
      setTeachers(list);
    } catch (e) {
      setError(e.response?.data?.message || "O'qituvchilar yuklanmadi");
    } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditTeacher(null);
    setForm({ fullName: '', email: '', password: '', position: '', experience: '' });
    setSaveError(''); setDrawerOpen(true);
  };

  const openEdit = (t) => {
    setEditTeacher(t);
    setForm({ fullName: t.fullName || '', email: t.email || '', password: '', position: t.position || '', experience: t.experience || '' });
    setSaveError(''); setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName) { setSaveError("Ism majburiy"); return; }
    if (!editTeacher && !form.email) { setSaveError("Email majburiy"); return; }
    if (!editTeacher && !form.password) { setSaveError("Parol majburiy"); return; }
    setSaving(true); setSaveError('');
    try {
      if (editTeacher) {
        // PUT — JSON
        const payload = {};
        if (form.fullName)   payload.fullName   = form.fullName;
        if (form.email)      payload.email      = form.email;
        if (form.password)   payload.password   = form.password;
        if (form.position)   payload.position   = form.position;
        if (form.experience) payload.experience = Number(form.experience);
        await teacherAPI.update(editTeacher.id, payload);
      } else {
        // POST — api.js toFormData() orqali multipart yuboradi
        await teacherAPI.create({
          fullName:   form.fullName,
          email:      form.email,
          password:   form.password,
          position:   form.position,
          experience: form.experience ? Number(form.experience) : undefined,
        });
      }
      setDrawerOpen(false); loadTeachers();
    } catch (e) {
      const msg = e.response?.data?.message;
      setSaveError(Array.isArray(msg) ? msg.join('\n') : (msg || 'Saqlashda xatolik'));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await teacherAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadTeachers();
    } catch (e) {
      const msg = e.response?.data?.message;
      alert(msg || "O'chirishda xatolik");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">O'qituvchilar</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          O'qituvchi qo'shish
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
          {error} — <button className="underline font-medium" onClick={loadTeachers}>Qayta yuklash</button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full crm-table">
          <thead>
            <tr><th>#</th><th>Ism</th><th>Email</th><th>Lavozim</th><th>Tajriba</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">O'qituvchilar mavjud emas</td></tr>
            ) : teachers.map((t, i) => (
              <tr key={t.id}>
                <td className="text-gray-400">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {t.photo
                      ? <img src={t.photo} alt={t.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      : <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {t.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                    }
                    <span className="font-medium text-gray-900">{t.fullName}</span>
                  </div>
                </td>
                <td className="text-gray-500 text-sm">{t.email || '—'}</td>
                <td><span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">{t.position || '—'}</span></td>
                <td className="text-gray-500">{t.experience ? `${t.experience} yil` : '—'}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title={editTeacher ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Ism Familiya <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Ali Valiyev" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Email <span className="text-red-500">*</span></label>
            <input className="crm-input" type="email" placeholder="ali@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">
              Parol {!editTeacher && <span className="text-red-500">*</span>}
              {editTeacher && <span className="text-xs text-gray-400 ml-1">(o'zgartirish uchun)</span>}
            </label>
            <input className="crm-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Lavozim</label>
            <input className="crm-input" placeholder="Senior Developer" value={form.position}
              onChange={e => setForm({ ...form, position: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Tajriba (yil)</label>
            <input className="crm-input" type="number" min="0" placeholder="3" value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })} />
          </div>
          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600 whitespace-pre-wrap">{saveError}</div>
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
        title="O'qituvchini o'chirish" message={`"${deleteTarget?.fullName}" ni o'chirasizmi?`} />
    </div>
  );
}