import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

const ROLES = ['SUPERADMIN', 'ADMIN', 'STUDENT', 'TEACHER', 'MANAGEMENT', 'ADMINSTRATOR'];
const ROLE_COLORS = {
  SUPERADMIN: 'bg-red-100 text-red-700', ADMIN: 'bg-purple-100 text-purple-700',
  TEACHER: 'bg-green-100 text-green-700', STUDENT: 'bg-blue-100 text-blue-700',
  MANAGEMENT: 'bg-orange-100 text-orange-700', ADMINSTRATOR: 'bg-pink-100 text-pink-700',
};

export default function StaffPage() {
  const [staff, setStaff]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [activeTab, setActiveTab]       = useState('all');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [editStaff, setEditStaff]       = useState(null);
  const [form, setForm]                 = useState({ fullName: '', email: '', password: '', role: 'ADMIN', position: '', hire_date: '', address: '' });
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    setLoading(true); setError('');
    try {
      const res = await staffAPI.getAll();
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.items || []);
      setStaff(list);
    } catch (e) {
      setError(e.response?.data?.message || 'Xodimlar yuklanmadi');
    } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditStaff(null);
    setForm({ fullName: '', email: '', password: '', role: 'ADMIN', position: '', hire_date: '', address: '' });
    setSaveError(''); setDrawerOpen(true);
  };

  const openEdit = (s) => {
    setEditStaff(s);
    setForm({ fullName: s.fullName || '', email: s.email || '', password: '', role: s.role || 'ADMIN', position: s.position || '', hire_date: s.hire_date || '', address: s.address || '' });
    setSaveError(''); setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName)              { setSaveError("Ism majburiy");   return; }
    if (!editStaff && !form.email)   { setSaveError("Email majburiy"); return; }
    if (!editStaff && !form.password){ setSaveError("Parol majburiy"); return; }
    setSaving(true); setSaveError('');
    try {
      if (editStaff) {
        const payload = {};
        if (form.fullName)  payload.fullName  = form.fullName;
        if (form.email)     payload.email     = form.email;
        if (form.password)  payload.password  = form.password;
        if (form.role)      payload.role      = form.role;
        if (form.position)  payload.position  = form.position;
        if (form.hire_date) payload.hire_date = form.hire_date;
        if (form.address)   payload.address   = form.address;
        await staffAPI.update(editStaff.id, payload);
      } else {
        // api.js toFormData() orqali multipart — photo yubormaymiz
        await staffAPI.create({
          fullName:  form.fullName,
          email:     form.email,
          password:  form.password,
          role:      form.role,
          position:  form.position  || undefined,
          hire_date: form.hire_date || undefined,
          address:   form.address   || undefined,
        });
      }
      setDrawerOpen(false); loadStaff();
    } catch (e) {
      const msg = e.response?.data?.message;
      setSaveError(Array.isArray(msg) ? msg.join('\n') : (msg || 'Saqlashda xatolik'));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await staffAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadStaff();
    } catch (e) {
      const msg = e.response?.data?.message;
      alert(msg || "O'chirishda xatolik");
    }
  };

  const filtered = activeTab === 'all' ? staff : staff.filter(s => s.role === activeTab);
  const roleCounts = ROLES.reduce((acc, r) => { acc[r] = staff.filter(s => s.role === r).length; return acc; }, {});

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xodimlar</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Xodim qo'shish
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
          {error} — <button className="underline font-medium" onClick={loadStaff}>Qayta yuklash</button>
        </div>
      )}

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 flex-wrap">
        <button onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
            ${activeTab === 'all' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          Barchasi ({staff.length})
        </button>
        {ROLES.map(r => (
          <button key={r} onClick={() => setActiveTab(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all
              ${activeTab === r ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {r} ({roleCounts[r] || 0})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full crm-table">
          <thead>
            <tr><th>#</th><th>Ism</th><th>Role</th><th>Email</th><th>Lavozim</th><th>Ishga kirgan</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Xodimlar mavjud emas</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id}>
                <td className="text-gray-400">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {s.photo
                      ? <img src={s.photo} alt={s.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      : <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                    }
                    <span className="font-medium text-gray-900">{s.fullName}</span>
                  </div>
                </td>
                <td><span className={`px-2 py-1 rounded-lg text-xs font-medium ${ROLE_COLORS[s.role] || 'bg-gray-100 text-gray-600'}`}>{s.role}</span></td>
                <td className="text-gray-500 text-sm">{s.email || '—'}</td>
                <td className="text-gray-500 text-sm">{s.position || '—'}</td>
                <td className="text-gray-500 text-sm">{s.hire_date || '—'}</td>
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
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title={editStaff ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Ism Familiya <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Ism Familiya" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Email <span className="text-red-500">*</span></label>
            <input className="crm-input" type="email" placeholder="user@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">
              Parol {!editStaff && <span className="text-red-500">*</span>}
              {editStaff && <span className="text-xs text-gray-400 ml-1">(o'zgartirish uchun)</span>}
            </label>
            <input className="crm-input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Role <span className="text-red-500">*</span></label>
            <select className="crm-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="crm-label">Lavozim</label>
            <input className="crm-input" placeholder="Manager" value={form.position}
              onChange={e => setForm({ ...form, position: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Ishga kirgan sana</label>
            <input type="date" className="crm-input" value={form.hire_date}
              onChange={e => setForm({ ...form, hire_date: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Manzil</label>
            <input className="crm-input" placeholder="Toshkent" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })} />
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
        title="Xodimni o'chirish" message={`"${deleteTarget?.fullName}" ni o'chirasizmi?`} />
    </div>
  );
}