// src/pages/GroupDetail.jsx
// ============================================================
// Group detail page — opened when you click a group row
// Tabs: Ma'lumotlar | Guruh darsliklari | Akademik davomati
// Sub-tabs in Guruh darsliklari: Guruh darslari | Uyga vazifa | Videolar | Imtihonlar | Jurnal
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupAPI, homeworkAPI, videoAPI, lessonAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

// ── Homework row ──────────────────────────────────────────────
function HomeworkRow({ hw, index, onClick }) {
  const isOverdue = hw.submittedCount === 0;
  return (
    <tr className="cursor-pointer hover:bg-gray-50" onClick={() => onClick(hw)}>
      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
      <td className="px-4 py-3">
        <div
          className="px-3 py-2 rounded-lg text-sm font-medium text-white max-w-xs truncate"
          style={{ backgroundColor: isOverdue ? '#EF4444' : '#6B7280' }}
        >
          {hw.topic}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-center text-gray-600">{hw.totalStudents || 15}</td>
      <td className="px-4 py-3 text-sm text-center text-orange-500">{hw.pendingCount || 0}</td>
      <td className="px-4 py-3 text-sm text-center text-green-600">{hw.submittedCount || 0}</td>
      <td className="px-4 py-3 text-sm text-gray-500">
        <div>{hw.assignedAt}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{hw.deadline}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{hw.lessonDate}</td>
      <td className="px-4 py-3">
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

// ── Video row ─────────────────────────────────────────────────
function VideoRow({ video, index }) {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <a href={video.url} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noreferrer">
            {video.name || `${index + 1}.mov`}
          </a>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{video.lessonName}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Tayyor</span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{video.lessonDate}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{video.size}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{video.uploadedAt}</td>
      <td className="px-4 py-3">
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

// ── Homework detail modal ─────────────────────────────────────
function HomeworkDetailModal({ hw, onClose }) {
  const [tab, setTab] = useState('kutayotganlar');
  if (!hw) return null;

  const tabData = {
    kutayotganlar: hw.pendingStudents || [],
    qaytarilganlar: hw.returnedStudents || [],
    qabulqilinganlar: hw.acceptedStudents || [],
    bajarilmagan: hw.notDoneStudents || [],
  };

  const tabLabels = {
    kutayotganlar: `Kutayotganlar ${hw.pendingCount || 0}`,
    qaytarilganlar: 'Qaytarilganlar',
    qabulqilinganlar: 'Qabul qilinganlar',
    bajarilmagan: `Bajarilmagan ${hw.notDoneCount || 0}`,
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <button onClick={onClose} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Orqaga
            </button>
            <h2 className="text-xl font-bold text-gray-900">{hw.topic}</h2>
            <div className="flex gap-6 mt-3 text-sm text-gray-500">
              <div><span className="font-medium text-gray-700">Mavzu</span><br />{hw.topic}</div>
              <div><span className="font-medium text-gray-700">Tugash vaqti</span><br />{hw.deadline}</div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 px-6 py-3 border-b border-gray-100">
            {Object.entries(tabLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${tab === key ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Students list */}
          <div className="p-6 max-h-80 overflow-y-auto">
            {tabData[tab].length === 0 ? (
              <p className="text-center text-gray-400 py-8">Ma'lumot yo'q</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="text-xs font-semibold text-gray-400 pb-3">O'quvchi ismi</th>
                    <th className="text-xs font-semibold text-gray-400 pb-3">Uyga vazifa jo'natilgan vaqt</th>
                  </tr>
                </thead>
                <tbody>
                  {tabData[tab].map((s, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="py-3 text-sm text-gray-700">{s.name}</td>
                      <td className="py-3 text-sm text-gray-500">{s.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main GroupDetail ──────────────────────────────────────────
export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mainTab, setMainTab] = useState("darsliklari"); // 'malumotlar' | 'darsliklari' | 'davomati'
  const [subTab, setSubTab] = useState("lessons");       // 'lessons' | 'homework' | 'videos' | 'exams' | 'journal'

  const [homeworks, setHomeworks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedHW, setSelectedHW] = useState(null);

  // Add homework form
  const [hwForm, setHwForm] = useState({ topic: '', description: '' });
  const [showHWForm, setShowHWForm] = useState(false);
  const [savingHW, setSavingHW] = useState(false);

  // Add video modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoFile, setVideoFile] = useState(null);

  // Add lesson form
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({ type: 'boshqa', topic: '' });

  useEffect(() => {
    loadGroup();
  }, [id]);

  const loadGroup = async () => {
    setLoading(true);
    try {
      const res = await groupAPI.getById(id);
      setGroup(res.data);
      // Load related data
      const [hwRes, vidRes, lesRes] = await Promise.all([
        homeworkAPI.getByGroup(id),
        videoAPI.getByGroup(id),
        lessonAPI.getByGroup(id),
      ]);
      setHomeworks(hwRes.data || []);
      setVideos(vidRes.data || []);
      setLessons(lesRes.data || []);
    } catch (e) {
      console.error('GroupDetail load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHomework = async () => {
    if (!hwForm.topic) return;
    setSavingHW(true);
    try {
      await homeworkAPI.create(id, hwForm);
      setHwForm({ topic: '', description: '' });
      setShowHWForm(false);
      const res = await homeworkAPI.getByGroup(id);
      setHomeworks(res.data || []);
    } catch (e) { console.error(e); } finally { setSavingHW(false); }
  };

  const handleAddLesson = async () => {
    if (!lessonForm.topic) return;
    try {
      await lessonAPI.create(id, lessonForm);
      setShowLessonForm(false);
      setLessonForm({ type: 'boshqa', topic: '' });
      const res = await lessonAPI.getByGroup(id);
      setLessons(res.data || []);
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="font-medium">Guruh topilmadi</p>
        <button onClick={() => navigate('/groups')} className="btn-primary mt-4">Orqaga</button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Back + Title ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/groups')}
            className="p-2 rounded-xl hover:bg-white border border-gray-200 text-gray-500 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{group.name}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${group.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {group.isActive ? 'Aktiv' : 'Nofaol'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">Yuklab olish</button>
          <button className="btn-secondary text-sm">O'qituvchi qo'shish</button>
          <button className="btn-secondary text-sm">Eksport qilish</button>
          <select className="crm-input w-auto text-sm">
            <option>2025 Yillik</option>
            <option>2026 Yillik</option>
          </select>
        </div>
      </div>

      {/* ── Main tabs ── */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {[
          { key: 'malumotlar', label: "Ma'lumotlar" },
          { key: 'darsliklari', label: 'Guruh darsliklari' },
          { key: 'davomati', label: 'Akademik davomati' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setMainTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px
              ${mainTab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════ MA'LUMOTLAR tab ══════════ */}
      {mainTab === 'malumotlar' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Group info card */}
          <div className="col-span-1 bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Guruh ma'lumotlari</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Kurs:</span>
                <span className="font-medium">{group.course?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Xona:</span>
                <span className="font-medium">{group.room?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Boshlanish:</span>
                <span className="font-medium">{group.startDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tugash:</span>
                <span className="font-medium">{group.endDate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dars vaqti:</span>
                <span className="font-medium">{group.time || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kunlar:</span>
                <span className="font-medium">{(group.days || []).join(', ') || '—'}</span>
              </div>
            </div>
          </div>
          {/* Teachers */}
          <div className="col-span-1 bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">O'qituvchilar</h2>
            {(group.teachers || []).map((t) => (
              <div key={t.id} className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {t.name?.charAt(0)}
                </div>
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            ))}
            {!group.teachers?.length && <p className="text-sm text-gray-400">O'qituvchi yo'q</p>}
          </div>
          {/* Students */}
          <div className="col-span-1 bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Talabalar ({group.students?.length || 0})</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(group.students || []).map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                    {s.name?.charAt(0)}
                  </div>
                  <span className="text-sm">{s.name}</span>
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${s.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {s.isActive ? 'To\'lagan' : 'Qarzdor'}
                  </span>
                </div>
              ))}
              {!group.students?.length && <p className="text-sm text-gray-400">Talabalar yo'q</p>}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ GURUH DARSLIKLARI tab ══════════ */}
      {mainTab === 'darsliklari' && (
        <div>
          {/* Sub-tabs */}
          <div className="flex gap-1 mb-6">
            {[
              { key: 'lessons', label: 'Guruh darslari' },
              { key: 'homework', label: 'Uyga vazifa' },
              { key: 'videos', label: 'Videolar' },
              { key: 'exams', label: 'Imtihonlar' },
              { key: 'journal', label: 'Jurnal' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setSubTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${subTab === t.key
                    ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:bg-white/50'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Lessons ── */}
          {subTab === 'lessons' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowLessonForm(true)}
                  className="btn-success flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Qo'shish
                </button>
              </div>
              {showLessonForm && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                  <h3 className="font-bold text-gray-900 mb-4">Yo'qlama va mavzu kiritish</h3>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="lessonType" value="reja" checked={lessonForm.type === 'reja'} onChange={() => setLessonForm({ ...lessonForm, type: 'reja' })} className="accent-primary" />
                      <span className="text-sm">O'quv rejasi bo'yicha</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="lessonType" value="boshqa" checked={lessonForm.type === 'boshqa'} onChange={() => setLessonForm({ ...lessonForm, type: 'boshqa' })} className="accent-primary" />
                      <span className="text-sm text-primary font-medium">Boshqa</span>
                    </label>
                  </div>
                  <div>
                    <label className="crm-label">Mavzu <span className="text-red-500">*</span></label>
                    <input className="crm-input" placeholder="CRM frontend" value={lessonForm.topic} onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setShowLessonForm(false)} className="btn-secondary">Bekor qilish</button>
                    <button onClick={handleAddLesson} className="btn-success">E'lon qilish</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full crm-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mavzu</th>
                      <th>Sana</th>
                      <th>Davomati</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-10 text-gray-400">Darslar mavjud emas</td></tr>
                    ) : (
                      lessons.map((l, i) => (
                        <tr key={l.id}>
                          <td>{i + 1}</td>
                          <td className="font-medium">{l.topic}</td>
                          <td>{l.date}</td>
                          <td>
                            <div className="flex gap-1 flex-wrap">
                              {(l.attendance || []).map((a) => (
                                <span
                                  key={a.studentId}
                                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${a.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                                >
                                  {a.studentName?.charAt(0)}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Homework ── */}
          {subTab === 'homework' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowHWForm(true)}
                  className="btn-success flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Uyga vazifa qo'shish
                </button>
              </div>

              {/* Add HW form */}
              {showHWForm && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setShowHWForm(false)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 className="font-bold text-gray-900">Yangi uyga vazifa yaratish</h3>
                  </div>
                  <div className="mb-3">
                    <label className="crm-label">Mavzu <span className="text-red-500">*</span></label>
                    <select className="crm-input" value={hwForm.topic} onChange={(e) => setHwForm({ ...hwForm, topic: e.target.value })}>
                      <option value="">Mavzulardan birini tanlang</option>
                      {lessons.map((l) => (
                        <option key={l.id} value={l.topic}>{l.topic}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="crm-label">Izoh</label>
                    <div className="border border-gray-200 rounded-xl">
                      <div className="flex gap-2 p-2 border-b border-gray-100 text-xs text-gray-500 flex-wrap">
                        <span className="cursor-pointer hover:text-gray-700">H₁</span>
                        <span className="cursor-pointer hover:text-gray-700">H₂</span>
                        <span className="cursor-pointer hover:text-gray-700">Sans Serif</span>
                        <span className="cursor-pointer hover:text-gray-700">Normal</span>
                        <span className="cursor-pointer hover:text-gray-700 font-bold">B</span>
                        <span className="cursor-pointer hover:text-gray-700 italic">I</span>
                        <span className="cursor-pointer hover:text-gray-700 underline">U</span>
                      </div>
                      <textarea
                        className="w-full p-3 text-sm focus:outline-none rounded-b-xl resize-none h-24"
                        placeholder="Izoh kiriting..."
                        value={hwForm.description}
                        onChange={(e) => setHwForm({ ...hwForm, description: e.target.value })}
                      />
                    </div>
                  </div>
                  {/* Upload */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center mb-4">
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm text-gray-400">Yuklash</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowHWForm(false)} className="btn-secondary flex-1">Bekor qilish</button>
                    <button onClick={handleAddHomework} disabled={savingHW} className="btn-success flex-1 flex items-center justify-center gap-2">
                      {savingHW && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      E'lon qilish
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full crm-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mavzu</th>
                      <th className="text-center">
                        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </th>
                      <th className="text-center">⏰</th>
                      <th className="text-center">✅</th>
                      <th>Berilgan vaqt</th>
                      <th>Tugash vaqti</th>
                      <th>Dars sanasi</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeworks.length === 0 ? (
                      <tr><td colSpan={9} className="text-center py-10 text-gray-400">Uyga vazifalar mavjud emas</td></tr>
                    ) : (
                      homeworks.map((hw, i) => (
                        <HomeworkRow key={hw.id} hw={hw} index={i} onClick={setSelectedHW} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Videos ── */}
          {subTab === 'videos' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="btn-success flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Qo'shish
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full crm-table">
                  <thead>
                    <tr>
                      <th>Video nomi</th>
                      <th>Dars nomi</th>
                      <th>Status</th>
                      <th>Dars sanasi</th>
                      <th>Hajmi</th>
                      <th>Qo'shilgan vaqti</th>
                      <th>Harakatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-10 text-gray-400">Videolar mavjud emas</td></tr>
                    ) : (
                      videos.map((v, i) => (
                        <VideoRow key={v.id} video={v} index={i} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Exams / Journal placeholders */}
          {(subTab === 'exams' || subTab === 'journal') && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="font-medium">Bu bo'lim tez orada qo'shiladi</p>
            </div>
          )}
        </div>
      )}

      {/* ══════════ AKADEMIK DAVOMATI tab ══════════ */}
      {mainTab === 'davomati' && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p className="font-medium">Akademik davomat tez orada qo'shiladi</p>
        </div>
      )}

      {/* ── Video upload modal ── */}
      {showVideoModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowVideoModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Qo'shish</h3>
                <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Videofaylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                </p>
                <p className="text-xs text-gray-400">Video(.mp4, .webm, .ogg, .avi, .mkv, .rmvb, .ogv, .mov) formatlarida bo'lishi kerak</p>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
                <label htmlFor="video-upload" className="mt-4 btn-primary inline-block cursor-pointer">
                  Fayl tanlash
                </label>
                {videoFile && <p className="text-xs text-green-600 mt-2">{videoFile.name}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowVideoModal(false)} className="btn-secondary flex-1">Bekor qilish</button>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="btn-success flex-1"
                >
                  Qo'shilgan vaqti
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Homework detail modal ── */}
      {selectedHW && (
        <HomeworkDetailModal hw={selectedHW} onClose={() => setSelectedHW(null)} />
      )}
    </div>
  );
}
