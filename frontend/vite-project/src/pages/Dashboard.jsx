import React, { useState, useEffect } from 'react';
import { courseAPI, roomAPI } from '../services/api';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';

// Swagger: BEGINNER | INTERMEDIATE | ADVANCED
const LEVELS = [
  { value: 'BEGINNER',     label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED',     label: 'Advanced' },
];

const EMPTY_COURSE = {
  name: '', durationMonth: '', durationLesson: '',
  level: 'BEGINNER', price: '', description: '',
};
const EMPTY_ROOM = { name: '', capacity: '' };

function CourseCard({ course, onEdit, onDelete }) {
  const levelLabel = LEVELS.find(l => l.value === course.level)?.label || course.level || '—';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-gray-400 uppercase">{levelLabel}</span>
          <h3 className="font-semibold text-gray-900 mt-0.5 truncate">{course.name}</h3>
        </div>
        <div className="flex gap-1 ml-2 flex-shrink-0">
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
      <div className="flex flex-wrap gap-2 text-xs mt-2">
        <span className="bg-gray-50 px-2 py-1 rounded-lg text-gray-500">📅 {course.durationMonth || 0} oy</span>
        <span className="bg-gray-50 px-2 py-1 rounded-lg text-gray-500">📖 {course.durationLesson || 0} dars</span>
        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg font-medium">
          {course.price ? Number(course.price).toLocaleString() : 0} so'm
        </span>
      </div>
      {course.description && (
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{course.description}</p>
      )}
    </div>
  );
}

function RoomCard({ room, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-400 mt-1">👥 {room.capacity || 0} kishi</p>
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('kurslar');
  const [courses, setCourses]     = useState([]);
  const [rooms, setRooms]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // Course drawer
  const [courseDrawer, setCourseDrawer] = useState(false);
  const [editCourse, setEditCourse]     = useState(null);
  const [courseForm, setCourseForm]     = useState(EMPTY_COURSE);
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseErr, setCourseErr]       = useState('');

  // Room drawer
  const [roomDrawer, setRoomDrawer] = useState(false);
  const [editRoom, setEditRoom]     = useState(null);
  const [roomForm, setRoomForm]     = useState(EMPTY_ROOM);
  const [roomSaving, setRoomSaving] = useState(false);
  const [roomErr, setRoomErr]       = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);

  const toList = r => Array.isArray(r.data) ? r.data : (r.data?.data || r.data?.items || []);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true); setError('');
    try {
      const [cRes, rRes] = await Promise.all([courseAPI.getAll(), roomAPI.getAll()]);
      setCourses(toList(cRes));
      setRooms(toList(rRes));
    } catch (e) {
      setError(e.response?.data?.message || 'Yuklanmadi');
    } finally { setLoading(false); }
  };

  // ── COURSE ───────────────────────────────────────────────────
  const openAddCourse = () => {
    setEditCourse(null);
    setCourseForm(EMPTY_COURSE);
    setCourseErr('');
    setCourseDrawer(true);
  };

  const openEditCourse = (c) => {
    setEditCourse(c);
    setCourseForm({
      name:           c.name           || '',
      durationMonth:  c.durationMonth  || '',
      durationLesson: c.durationLesson || '',
      level:          c.level          || 'BEGINNER',
      price:          c.price          || '',
      description:    c.description    || '',
    });
    setCourseErr('');
    setCourseDrawer(true);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.name)           { setCourseErr("Kurs nomi majburiy");       return; }
    if (!courseForm.durationMonth)  { setCourseErr("Davomiylik (oy) majburiy"); return; }
    if (!courseForm.durationLesson) { setCourseErr("Dars soni majburiy");       return; }
    if (!courseForm.price)          { setCourseErr("Narx majburiy");            return; }
    if (!courseForm.description)    { setCourseErr("Tavsif majburiy");          return; }

    setCourseSaving(true); setCourseErr('');
    try {
      const payload = {
        name:           courseForm.name,
        durationMonth:  Number(courseForm.durationMonth),
        durationLesson: Number(courseForm.durationLesson),
        level:          courseForm.level || 'BEGINNER',
        price:          String(courseForm.price),
        description:    courseForm.description,
      };
      if (editCourse) await courseAPI.update(editCourse.id, payload);
      else            await courseAPI.create(payload);
      setCourseDrawer(false);
      loadAll();
    } catch (e) {
      const msg = e.response?.data?.message;
      setCourseErr(Array.isArray(msg) ? msg.join('\n') : (msg || 'Saqlashda xatolik'));
    } finally { setCourseSaving(false); }
  };

  // ── ROOM ─────────────────────────────────────────────────────
  const openAddRoom = () => {
    setEditRoom(null);
    setRoomForm(EMPTY_ROOM);
    setRoomErr('');
    setRoomDrawer(true);
  };

  const openEditRoom = (r) => {
    setEditRoom(r);
    setRoomForm({ name: r.name || '', capacity: r.capacity || '' });
    setRoomErr('');
    setRoomDrawer(true);
  };

  const handleSaveRoom = async () => {
    if (!roomForm.name)     { setRoomErr("Xona nomi majburiy"); return; }
    if (!roomForm.capacity) { setRoomErr("Sig'im majburiy");    return; }

    setRoomSaving(true); setRoomErr('');
    try {
      const payload = { name: roomForm.name, capacity: Number(roomForm.capacity) };
      if (editRoom) await roomAPI.update(editRoom.id, payload);
      else          await roomAPI.create(payload);
      setRoomDrawer(false);
      loadAll();
    } catch (e) {
      const msg = e.response?.data?.message;
      setRoomErr(Array.isArray(msg) ? msg.join('\n') : (msg || 'Saqlashda xatolik'));
    } finally { setRoomSaving(false); }
  };

  // ── DELETE ────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'course') await courseAPI.delete(deleteTarget.item.id);
      else                                await roomAPI.delete(deleteTarget.item.id);
      setDeleteTarget(null);
      loadAll();
    } catch (e) {
      const msg = e.response?.data?.message;
      setDeleteTarget(null);
      alert(msg || "O'chirib bo'lmadi. Avval bog'liq guruhlarni o'chiring.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Boshqarish paneli</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
          {error} — <button className="underline font-medium" onClick={loadAll}>Qayta yuklash</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'kurslar', label: `Kurslar (${courses.length})` },
          { key: 'xonalar', label: `Xonalar (${rooms.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${activeTab === t.key
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════ KURSLAR ══════ */}
      {activeTab === 'kurslar' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openAddCourse} className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Kurs qo'shish
            </button>
          </div>
          {courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
              <p className="text-4xl mb-3">📚</p>
              <p className="font-medium">Kurslar mavjud emas</p>
              <button onClick={openAddCourse} className="btn-primary mt-4">Birinchi kursni qo'shish</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {courses.map(c => (
                <CourseCard key={c.id} course={c}
                  onEdit={() => openEditCourse(c)}
                  onDelete={() => setDeleteTarget({ type: 'course', item: c })} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════ XONALAR ══════ */}
      {activeTab === 'xonalar' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openAddRoom} className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Xona qo'shish
            </button>
          </div>
          {rooms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
              <p className="text-4xl mb-3">🏫</p>
              <p className="font-medium">Xonalar mavjud emas</p>
              <button onClick={openAddRoom} className="btn-primary mt-4">Birinchi xonani qo'shish</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rooms.map(r => (
                <RoomCard key={r.id} room={r}
                  onEdit={() => openEditRoom(r)}
                  onDelete={() => setDeleteTarget({ type: 'room', item: r })} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════ COURSE DRAWER ══════ */}
      <Drawer open={courseDrawer} onClose={() => setCourseDrawer(false)}
        title={editCourse ? 'Kursni tahrirlash' : "Kurs qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Kurs nomi <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Frontend Development"
              value={courseForm.name}
              onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="crm-label">Davomiylik (oy) <span className="text-red-500">*</span></label>
              <input className="crm-input" type="number" min="1" placeholder="3"
                value={courseForm.durationMonth}
                onChange={e => setCourseForm({ ...courseForm, durationMonth: e.target.value })} />
            </div>
            <div>
              <label className="crm-label">Dars soni <span className="text-red-500">*</span></label>
              <input className="crm-input" type="number" min="1" placeholder="60"
                value={courseForm.durationLesson}
                onChange={e => setCourseForm({ ...courseForm, durationLesson: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="crm-label">Daraja <span className="text-red-500">*</span></label>
            <select className="crm-input" value={courseForm.level}
              onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}>
              {LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="crm-label">Narx (so'm) <span className="text-red-500">*</span></label>
            <input className="crm-input" type="number" min="0" placeholder="1500000"
              value={courseForm.price}
              onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Tavsif <span className="text-red-500">*</span></label>
            <textarea className="crm-input h-24 resize-none" placeholder="Kurs haqida..."
              value={courseForm.description}
              onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} />
          </div>
          {courseErr && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600 whitespace-pre-wrap">
              {courseErr}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setCourseDrawer(false)} className="btn-secondary flex-1">Bekor qilish</button>
          <button onClick={handleSaveCourse} disabled={courseSaving}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            {courseSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      {/* ══════ ROOM DRAWER ══════ */}
      <Drawer open={roomDrawer} onClose={() => setRoomDrawer(false)}
        title={editRoom ? 'Xonani tahrirlash' : "Xona qo'shish"}>
        <div className="space-y-4">
          <div>
            <label className="crm-label">Xona nomi <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="101-xona"
              value={roomForm.name}
              onChange={e => setRoomForm({ ...roomForm, name: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Sig'im (kishi) <span className="text-red-500">*</span></label>
            <input className="crm-input" type="number" min="1" placeholder="20"
              value={roomForm.capacity}
              onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} />
          </div>
          {roomErr && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600">
              {roomErr}
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setRoomDrawer(false)} className="btn-secondary flex-1">Bekor qilish</button>
          <button onClick={handleSaveRoom} disabled={roomSaving}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            {roomSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      {/* Delete confirm */}
      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="O'chirishni tasdiqlang"
        message={`"${deleteTarget?.item?.name}" ni o'chirasizmi?`} />
    </div>
  );
}