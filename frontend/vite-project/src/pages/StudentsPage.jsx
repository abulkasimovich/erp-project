import React, { useState, useEffect } from 'react';
import { studentAPI, groupAPI, studentGroupAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

const PER_PAGE = 10;

export default function StudentsPage() {
  const [students, setStudents]         = useState([]);
  const [groups, setGroups]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [page, setPage]                 = useState(1);
  const [search, setSearch]             = useState('');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [editStudent, setEditStudent]   = useState(null);
  const [form, setForm]                 = useState({ fullName: '', email: '', password: '', birth_date: '', groupId: '' });
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadStudents(); loadGroups(); }, []);

  const loadStudents = async () => {
    setLoading(true); setError('');
    try {
      const res = await studentAPI.getAll();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.items || []);
      setStudents(list);
    } catch (e) {
      setError(e.response?.data?.message || 'Talabalar yuklanmadi');
    } finally { setLoading(false); }
  };

  const loadGroups = async () => {
    try {
      const res = await groupAPI.getAll();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setGroups(list);
    } catch (e) { console.error(e); }
  };

  const openAdd = () => {
    setEditStudent(null);
    setForm({ fullName: '', email: '', password: '', birth_date: '', groupId: '' });
    setSaveError(''); setDrawerOpen(true);
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ fullName: s.fullName || '', email: s.email || '', password: '', birth_date: s.birth_date || '', groupId: '' });
    setSaveError(''); setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName)  { setSaveError("Ism majburiy");   return; }
    if (!editStudent && !form.email)    { setSaveError("Email majburiy");  return; }
    if (!editStudent && !form.password) { setSaveError("Parol majburiy"); return; }
    setSaving(true); setSaveError('');
    try {
      if (editStudent) {
        const payload = {};
        if (form.fullName)   payload.fullName   = form.fullName;
        if (form.email)      payload.email      = form.email;
        if (form.password)   payload.password   = form.password;
        if (form.birth_date) payload.birth_date = form.birth_date;
        await studentAPI.update(editStudent.id, payload);
      } else {
        // api.js toFormData() orqali multipart — photo yubormaymiz
        const res = await studentAPI.create({
          fullName:   form.fullName,
          email:      form.email,
          password:   form.password,
          birth_date: form.birth_date || undefined,
        });
        // Guruhga qo'shish
        const newId = res.data?.id || res.data?.student?.id || res.data?.data?.id;
        if (form.groupId && newId) {
          try {
            await studentGroupAPI.create({ 
              groupId:   Number(form.groupId), 
              studentId: Number(newId),
            });
          } catch (groupErr) {
            const gMsg = groupErr.response?.data?.message;
            // Talaba yaratildi lekin guruhga qo'shilmadi
            setSaveError(`Talaba yaratildi ✓, lekin guruhga qo'shilmadi: ${gMsg || "xona to'lgan"}`);
            setDrawerOpen(false);
            loadStudents();
            return;
          }
        }
      }
      setDrawerOpen(false); loadStudents();
    } catch (e) {
      const msg = e.response?.data?.message;
      setSaveError(Array.isArray(msg) ? msg.join('\n') : (msg || 'Saqlashda xatolik'));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await studentAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadStudents();
    } catch (e) {
      const msg = e.response?.data?.message;
      alert(msg || "O'chirishda xatolik");
    }
  };

  const filtered  = students.filter(s => s.fullName?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Talaba qo'shish
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
          {error} — <button className="underline font-medium" onClick={loadStudents}>Qayta yuklash</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Jami: <strong>{students.length}</strong> ta talaba</p>
        <input className="crm-input w-52" placeholder="Qidirish..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full crm-table">
          <thead>
            <tr><th>#</th><th>Ism</th><th>Email</th><th>Tug'ilgan sana</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Talabalar mavjud emas</td></tr>
            ) : paginated.map((s, i) => (
              <tr key={s.id}>
                <td className="text-gray-400">{(page - 1) * PER_PAGE + i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {s.photo
                      ? <img src={s.photo} alt={s.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      : <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                          {s.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                    }
                    <span className="font-medium text-gray-900">{s.fullName}</span>
                  </div>
                </td>
                <td className="text-gray-500 text-sm">{s.email || '—'}</td>
                <td className="text-gray-500">{s.birth_date || '—'}</td>
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
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40">←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40">→</button>
          </div>
        )}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title={editStudent ? "Talabani tahrirlash" : "Talaba qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Ism Familiya <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Ism Familiya" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Email <span className="text-red-500">*</span></label>
            <input className="crm-input" type="email" placeholder="student@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">
              Parol {!editStudent && <span className="text-red-500">*</span>}
              {editStudent && <span className="text-xs text-gray-400 ml-1">(o'zgartirish uchun)</span>}
            </label>
            <input className="crm-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Tug'ilgan sana</label>
            <input type="date" className="crm-input" value={form.birth_date}
              onChange={e => setForm({ ...form, birth_date: e.target.value })} />
          </div>
          {!editStudent && (
            <div>
              <label className="crm-label">Guruhga qo'shish <span className="text-xs text-gray-400">(ixtiyoriy)</span></label>
              <select className="crm-input" value={form.groupId}
                onChange={e => setForm({ ...form, groupId: e.target.value })}>
                <option value="">Guruhni tanlang</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          )}
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
        title="Talabani o'chirish" message={`"${deleteTarget?.fullName}" ni o'chirasizmi?`} />
    </div>
  );
}