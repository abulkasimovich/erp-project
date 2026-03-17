import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, {
  groupAPI, lessonAPI, homeworkAPI, videoAPI,
  attendanceAPI, studentGroupAPI
} from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import Drawer from '../components/Drawer';

const Spinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? 'bg-green-100 text-green-700'
    : score >= 50 ? 'bg-yellow-100 text-yellow-700'
    : 'bg-red-100 text-red-600';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>{score} ball</span>;
};

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoInputRef = useRef(null);

  const [group, setGroup]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('darslar');

  // Data
  const [lessons, setLessons]     = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [videos, setVideos]       = useState([]);
  const [students, setStudents]   = useState([]);

  // Attendance
  const [selLesson, setSelLesson]     = useState(null);
  const [attendance, setAttendance]   = useState([]);
  const [attLoading, setAttLoading]   = useState(false);
  const [attSaving, setAttSaving]     = useState({});

  // Homework detail
  const [selHw, setSelHw]         = useState(null);
  const [hwResponses, setHwResponses] = useState([]);
  const [hwResults, setHwResults]     = useState([]);
  const [hwLoading, setHwLoading]     = useState(false);

  // Rating
  const [ratings, setRatings]     = useState([]);
  const [ratingLoading, setRatingLoading] = useState(false);

  // Drawers
  const [lessonDrawer, setLessonDrawer]   = useState(false);
  const [lessonTitle, setLessonTitle]     = useState('');
  const [lessonSaving, setLessonSaving]   = useState(false);
  const [lessonErr, setLessonErr]         = useState('');

  const [hwDrawer, setHwDrawer]       = useState(false);
  const [hwTitle, setHwTitle]         = useState('');
  const [hwLessonId, setHwLessonId]   = useState('');
  const [hwSaving, setHwSaving]       = useState(false);
  const [hwErr, setHwErr]             = useState('');

  const [resultDrawer, setResultDrawer]   = useState(false);
  const [resultForm, setResultForm]       = useState({ responseId: '', title: '', score: '' });
  const [resultSaving, setResultSaving]   = useState(false);
  const [resultErr, setResultErr]         = useState('');

  const [ratingDrawer, setRatingDrawer]   = useState(false);
  const [ratingScore, setRatingScore]     = useState('');
  const [ratingLessonId, setRatingLessonId] = useState('');
  const [ratingSaving, setRatingSaving]   = useState(false);
  const [ratingErr, setRatingErr]         = useState('');

  const [videoUploading, setVideoUploading] = useState(false);
  const [videoLessonId, setVideoLessonId]   = useState('');
  const [videoErr, setVideoErr]             = useState('');

  // Deletes
  const [delLesson, setDelLesson]   = useState(null);
  const [delHw, setDelHw]           = useState(null);
  const [delVideo, setDelVideo]     = useState(null);
  const [delStudent, setDelStudent] = useState(null);

  const toList = r => Array.isArray(r.data) ? r.data : (r.data?.data || r.data?.items || []);

  // StudentGroup yoki Student obyektidan ID va nomni olish
  // Backend: { id, studentId, student: { id, fullName, email, birth_date } }
  // Yoki to'g'ridan: { id, fullName, email, birth_date }
  const getStudentId   = (s) => s?.student?.id   || s?.studentId || s?.id;
  const getStudentName = (s) => s?.student?.fullName || s?.fullName || '—';
  const getStudentEmail = (s) => s?.student?.email || s?.email || '—';
  const getStudentBDate = (s) => s?.student?.birth_date || s?.birth_date || '—';
  // StudentGroup ID (guruhdan o'chirish uchun)
  const getStudentGroupId = (s) => s?.id;

  useEffect(() => { loadAll(); }, [id]);

  const loadAll = async () => {
    setLoading(true); setError('');
    try {
      const [gRes, lRes, hRes, vRes, sRes] = await Promise.all([
        groupAPI.getById(id),
        lessonAPI.getByGroup(id),
        homeworkAPI.getByGroup(id),
        videoAPI.getByGroup(id),
        groupAPI.getStudents(id),
      ]);

      const groupData = gRes.data;
      setGroup(groupData);
      setLessons(toList(lRes));
      setHomeworks(toList(hRes));
      setVideos(toList(vRes));

      // /groups/students/:groupId → StudentGroup[] yoki Student[]
      // Har xil backend response strukturalarini qo'llab-quvvatlash
      const raw = sRes.data;
      let list = Array.isArray(raw) ? raw
        : Array.isArray(raw?.data)  ? raw.data
        : Array.isArray(raw?.items) ? raw.items
        : [];

      // Agar bo'sh bo'lsa, group.students dan olishga urinish
      if (list.length === 0 && groupData?.students?.length > 0) {
        list = groupData.students.map(s => ({ id: s.id, student: s }));
      }

      setStudents(list);
    } catch (e) {
      setError(e.response?.data?.message || 'Guruh yuklanmadi');
    } finally { setLoading(false); }
  };

  // ── DAVOMAT ──────────────────────────────────────────────────
  const loadAttendance = async (lesson) => {
    setSelLesson(lesson); setAttLoading(true); setAttendance([]);
    try {
      const res = await attendanceAPI.getByLesson(lesson.id);
      setAttendance(toList(res));
    } catch { setAttendance([]); }
    finally { setAttLoading(false); }
  };

  const toggleAttendance = async (studentId, currentPresent) => {
    setAttSaving(p => ({ ...p, [studentId]: true }));
    try {
      await attendanceAPI.create({
        lessonId:  Number(selLesson.id),
        studentId: Number(studentId),
        isPresent: !currentPresent,
      });
      // Optimistic update
      setAttendance(prev => {
        const exists = prev.find(a => (a.studentId === studentId || a.student?.id === studentId));
        if (exists) return prev.map(a =>
          (a.studentId === studentId || a.student?.id === studentId)
            ? { ...a, isPresent: !currentPresent } : a
        );
        return [...prev, { studentId, isPresent: !currentPresent }];
      });
    } catch (e) { console.error(e); }
    finally { setAttSaving(p => ({ ...p, [studentId]: false })); }
  };

  // ── HOMEWORK DATA ─────────────────────────────────────────────
  const loadHwData = async (hw) => {
    setSelHw(hw); setHwLoading(true);
    try {
      const [rRes, resRes] = await Promise.all([
        api.get(`/homework-response/homework/${hw.id}`),
        api.get(`/homework-result/homework/${hw.id}`),
      ]);
      setHwResponses(toList(rRes));
      setHwResults(toList(resRes));
    } catch { setHwResponses([]); setHwResults([]); }
    finally { setHwLoading(false); }
  };

  // ── RATING ────────────────────────────────────────────────────
  const loadRatings = async () => {
    if (!group?.teacher?.id) return;
    setRatingLoading(true);
    try {
      const teacherId = group.teacher?.id || group.teacherId;
      if (!teacherId) { setRatings([]); setRatingLoading(false); return; }
      const res = await api.get(`/rating/teacher/${teacherId}`);
      setRatings(toList(res));
    } catch { setRatings([]); }
    finally { setRatingLoading(false); }
  };

  useEffect(() => {
    if (tab === 'rating' && group) loadRatings();
  }, [tab, group]);

  // ── ADD LESSON ────────────────────────────────────────────────
  const handleAddLesson = async () => {
    if (!lessonTitle.trim()) { setLessonErr("Mavzu majburiy"); return; }
    setLessonSaving(true); setLessonErr('');
    try {
      await lessonAPI.create({ groupId: Number(id), title: lessonTitle.trim() });
      setLessonDrawer(false); setLessonTitle('');
      const res = await lessonAPI.getByGroup(id);
      setLessons(toList(res));
    } catch (e) {
      const msg = e.response?.data?.message;
      setLessonErr(Array.isArray(msg) ? msg.join('\n') : (msg || 'Xatolik'));
    } finally { setLessonSaving(false); }
  };

  // ── ADD HOMEWORK ──────────────────────────────────────────────
  const handleAddHw = async () => {
    if (!hwTitle.trim()) { setHwErr("Sarlavha majburiy"); return; }
    if (!hwLessonId)     { setHwErr("Darsni tanlang");   return; }
    setHwSaving(true); setHwErr('');
    try {
      await homeworkAPI.create({ title: hwTitle.trim(), groupId: Number(id), lessonId: Number(hwLessonId) });
      setHwDrawer(false); setHwTitle(''); setHwLessonId('');
      const res = await homeworkAPI.getByGroup(id);
      setHomeworks(toList(res));
    } catch (e) {
      const msg = e.response?.data?.message;
      setHwErr(Array.isArray(msg) ? msg.join('\n') : (msg || 'Xatolik'));
    } finally { setHwSaving(false); }
  };

  // ── ADD HOMEWORK RESULT ───────────────────────────────────────
  const handleAddResult = async () => {
    if (!resultForm.responseId) { setResultErr("Javobni tanlang"); return; }
    if (!resultForm.score)      { setResultErr("Ball kiriting");   return; }
    setResultSaving(true); setResultErr('');
    try {
      await api.post('/homework-result', {
        responseId: Number(resultForm.responseId),
        title:      resultForm.title || undefined,
        score:      Number(resultForm.score),
      });
      setResultDrawer(false); setResultForm({ responseId: '', title: '', score: '' });
      if (selHw) loadHwData(selHw);
    } catch (e) {
      const msg = e.response?.data?.message;
      setResultErr(Array.isArray(msg) ? msg.join('\n') : (msg || 'Xatolik'));
    } finally { setResultSaving(false); }
  };

  // ── ADD RATING ────────────────────────────────────────────────
  const handleAddRating = async () => {
    if (!ratingScore) { setRatingErr("Ball tanlang"); return; }
    if (!group?.teacher?.id && !group?.teacherId) { setRatingErr("O'qituvchi topilmadi"); return; }
    setRatingSaving(true); setRatingErr('');
    try {
      const body = {
        teacherId: Number(group.teacher?.id || group.teacherId),
        score:     Number(ratingScore),
      };
      if (ratingLessonId) body.lessonId = Number(ratingLessonId);
      await api.post('/rating', body);
      setRatingDrawer(false); setRatingScore(''); setRatingLessonId('');
      loadRatings();
    } catch (e) {
      const msg = e.response?.data?.message;
      setRatingErr(Array.isArray(msg) ? msg.join('\n') : (msg || 'Xatolik'));
    } finally { setRatingSaving(false); }
  };

  // ── UPLOAD VIDEO ──────────────────────────────────────────────
  const handleVideoUpload = async (file) => {
    if (!file) return;
    if (!videoLessonId) { setVideoErr("Darsni tanlang"); return; }
    setVideoUploading(true); setVideoErr('');
    try {
      const fd = new FormData();
      fd.append('groupId',  Number(id));
      fd.append('lessonId', Number(videoLessonId));
      fd.append('file', file);
      await api.post('/lesson-video', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const res = await videoAPI.getByGroup(id);
      setVideos(toList(res));
      setVideoLessonId('');
      if (videoInputRef.current) videoInputRef.current.value = '';
    } catch (e) {
      const msg = e.response?.data?.message;
      setVideoErr(Array.isArray(msg) ? msg.join('\n') : (msg || 'Video yuklanmadi'));
    } finally { setVideoUploading(false); }
  };

  // ── DELETES ───────────────────────────────────────────────────
  const handleDelLesson = async () => {
    if (!delLesson) return;
    try {
      await lessonAPI.delete(delLesson.id); setDelLesson(null);
      if (selLesson?.id === delLesson.id) setSelLesson(null);
      setLessons(toList(await lessonAPI.getByGroup(id)));
    } catch (e) { console.error(e); }
  };

  const handleDelHw = async () => {
    if (!delHw) return;
    try {
      await homeworkAPI.delete(delHw.id); setDelHw(null);
      if (selHw?.id === delHw.id) { setSelHw(null); setHwResponses([]); setHwResults([]); }
      setHomeworks(toList(await homeworkAPI.getByGroup(id)));
    } catch (e) { console.error(e); }
  };

  const handleDelVideo = async () => {
    if (!delVideo) return;
    try {
      await videoAPI.delete(delVideo.id); setDelVideo(null);
      setVideos(toList(await videoAPI.getByGroup(id)));
    } catch (e) { console.error(e); }
  };

  const handleDelStudent = async () => {
    if (!delStudent) return;
    try {
      await studentGroupAPI.delete(getStudentGroupId(delStudent)); setDelStudent(null);
      setStudents(toList(await groupAPI.getStudents(id)));
    } catch (e) { console.error(e); }
  };

  if (loading) return <Spinner />;
  if (error)   return (
    <div className="text-center py-16">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate('/groups')} className="btn-secondary">Orqaga</button>
    </div>
  );
  if (!group) return (
    <div className="text-center py-16 text-gray-400">
      <p>Guruh topilmadi</p>
      <button onClick={() => navigate('/groups')} className="btn-primary mt-4">Orqaga</button>
    </div>
  );

  const TABS = [
    { key: 'darslar',    label: `Darslar`,    count: lessons.length },
    { key: 'davomat',    label: 'Davomat',    count: null },
    { key: 'homework',   label: 'Vazifalar',  count: homeworks.length },
    { key: 'hwResponse', label: 'Javoblar',   count: hwResponses.length },
    { key: 'hwResult',   label: 'Natijalar',  count: hwResults.length },
    { key: 'rating',     label: 'Reyting',    count: ratings.length },
    { key: 'video',      label: 'Videolar',   count: videos.length },
    { key: 'talabalar',  label: 'Talabalar',  count: students.length },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/groups')}
            className="p-2 rounded-xl hover:bg-white border border-gray-200 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-sm text-gray-400">
              {group.course?.name} • {group.startTime} • {(group.weekDays || []).join(', ')}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl font-medium">
            👨‍🏫 {group.teacher?.fullName || group.teacherName || "O'qituvchi yo'q"}
          </span>
          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl font-medium">
            🏫 {group.room?.name || "Xona yo'q"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 mb-6 overflow-x-auto pb-1 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px
              ${tab === t.key ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
            {t.count !== null && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════ DARSLAR ══════════════ */}
      {tab === 'darslar' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setLessonTitle(''); setLessonErr(''); setLessonDrawer(true); }}
              className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dars qo'shish
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full crm-table">
              <thead>
                <tr><th>#</th><th>Mavzu</th><th>Yaratilgan</th><th>Amallar</th></tr>
              </thead>
              <tbody>
                {lessons.length === 0
                  ? <tr><td colSpan={4} className="text-center py-12 text-gray-400">Darslar mavjud emas</td></tr>
                  : lessons.map((l, i) => (
                    <tr key={l.id}>
                      <td className="text-gray-400">{i + 1}</td>
                      <td className="font-medium text-gray-900">{l.title}</td>
                      <td className="text-gray-400 text-sm">
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString('uz-UZ') : '—'}
                      </td>
                      <td>
                        <button onClick={() => setDelLesson(l)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ DAVOMAT ══════════════ */}
      {tab === 'davomat' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Darsni tanlang</h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {lessons.length === 0
                ? <p className="text-sm text-gray-400 text-center py-6">Darslar yo'q. Avval dars qo'shing.</p>
                : lessons.map((l, i) => (
                  <button key={l.id} onClick={() => loadAttendance(l)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all
                      ${selLesson?.id === l.id
                        ? 'bg-purple-600 text-white font-medium'
                        : 'hover:bg-gray-50 text-gray-700 border border-gray-100'}`}>
                    <span className="font-semibold">{i + 1}.</span> {l.title}
                  </button>
                ))
              }
            </div>
          </div>

          <div className="md:col-span-2">
            {!selLesson ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                ← Chap tomondagi darsni tanlang
              </div>
            ) : attLoading ? <Spinner /> : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-purple-50">
                  <h3 className="font-bold text-purple-900">{selLesson.title}</h3>
                  <p className="text-xs text-purple-600 mt-0.5">
                    ✓ Kelgan: {attendance.filter(a => a.isPresent).length} / {students.length}
                  </p>
                </div>
                {students.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">Guruhda talabalar yo'q</div>
                ) : (
                  <table className="w-full crm-table">
                    <thead>
                      <tr><th>#</th><th>Talaba</th><th>Holat</th><th>Belgilash</th></tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const sid  = getStudentId(s);
                        const name = getStudentName(s);
                        const att  = attendance.find(a =>
                          a.studentId === sid || a.student?.id === sid
                        );
                        const present = att?.isPresent ?? false;
                        const busy    = attSaving[sid];
                        return (
                          <tr key={sid}>
                            <td className="text-gray-400">{i + 1}</td>
                            <td className="font-medium">{name}</td>
                            <td>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                                ${present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {present ? '✓ Keldi' : '✗ Kelmadi'}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => toggleAttendance(sid, present)} disabled={busy}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-50
                                  ${present
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                {busy ? '...' : present ? "Kelmagan ✗" : "Kelgan ✓"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ HOMEWORK ══════════════ */}
      {tab === 'homework' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setHwTitle(''); setHwLessonId(''); setHwErr(''); setHwDrawer(true); }}
              className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Vazifa qo'shish
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full crm-table">
              <thead>
                <tr><th>#</th><th>Sarlavha</th><th>Dars</th><th>Yaratilgan</th><th>Javoblar</th><th>Amallar</th></tr>
              </thead>
              <tbody>
                {homeworks.length === 0
                  ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">Vazifalar yo'q</td></tr>
                  : homeworks.map((hw, i) => (
                    <tr key={hw.id}>
                      <td className="text-gray-400">{i + 1}</td>
                      <td>
                        <button onClick={() => { loadHwData(hw); setTab('hwResponse'); }}
                          className="font-medium text-purple-700 hover:underline text-left">
                          {hw.title}
                        </button>
                      </td>
                      <td className="text-gray-500 text-sm">{hw.lesson?.title || '—'}</td>
                      <td className="text-gray-400 text-sm">
                        {hw.createdAt ? new Date(hw.createdAt).toLocaleDateString('uz-UZ') : '—'}
                      </td>
                      <td>
                        <button onClick={() => { loadHwData(hw); setTab('hwResponse'); }}
                          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-100">
                          Ko'rish →
                        </button>
                      </td>
                      <td>
                        <button onClick={() => setDelHw(hw)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ HW RESPONSE ══════════════ */}
      {tab === 'hwResponse' && (
        <div>
          {/* Vazifa tanlash */}
          {homeworks.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {homeworks.map(hw => (
                <button key={hw.id} onClick={() => loadHwData(hw)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                    ${selHw?.id === hw.id ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {hw.title}
                </button>
              ))}
            </div>
          )}

          {!selHw ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              Yuqoridan vazifani tanlang
            </div>
          ) : hwLoading ? <Spinner /> : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{selHw.title} — Javoblar</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{hwResponses.length} ta javob yuborilgan</p>
                </div>
                {hwResponses.length > 0 && (
                  <button onClick={() => { setResultForm({ responseId: '', title: '', score: '' }); setResultErr(''); setResultDrawer(true); }}
                    className="btn-primary text-sm">
                    Ball berish
                  </button>
                )}
              </div>
              <table className="w-full crm-table">
                <thead>
                  <tr><th>#</th><th>Talaba</th><th>Sarlavha</th><th>Fayl</th><th>Natija</th><th>Yuborilgan</th></tr>
                </thead>
                <tbody>
                  {hwResponses.length === 0
                    ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">Hali javob yuborilmagan</td></tr>
                    : hwResponses.map((r, i) => {
                        const result = hwResults.find(res => res.responseId === r.id || res.response?.id === r.id);
                        return (
                          <tr key={r.id}>
                            <td className="text-gray-400">{i + 1}</td>
                            <td className="font-medium">{r.student?.fullName || '—'}</td>
                            <td className="text-gray-600">{r.title || '—'}</td>
                            <td>
                              {r.file
                                ? <a href={r.file} target="_blank" rel="noreferrer"
                                    className="text-purple-600 text-sm underline hover:text-purple-800">
                                    📎 Yuklab olish
                                  </a>
                                : <span className="text-gray-400 text-sm">—</span>
                              }
                            </td>
                            <td>
                              {result
                                ? <ScoreBadge score={result.score} />
                                : <span className="text-xs text-gray-400">Baholanmagan</span>
                              }
                            </td>
                            <td className="text-gray-400 text-sm">
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString('uz-UZ') : '—'}
                            </td>
                          </tr>
                        );
                      })
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ HW RESULT ══════════════ */}
      {tab === 'hwResult' && (
        <div>
          {homeworks.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {homeworks.map(hw => (
                <button key={hw.id} onClick={() => loadHwData(hw)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                    ${selHw?.id === hw.id ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {hw.title}
                </button>
              ))}
            </div>
          )}

          {!selHw ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              Vazifani tanlang
            </div>
          ) : hwLoading ? <Spinner /> : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{selHw.title} — Natijalar</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Baholangan: {hwResults.length} / {hwResponses.length}
                  </p>
                </div>
                <button onClick={() => { setResultForm({ responseId: '', title: '', score: '' }); setResultErr(''); setResultDrawer(true); }}
                  className="btn-primary text-sm">
                  + Ball berish
                </button>
              </div>

              {/* Baholanmagan talabalar */}
              {hwResponses.filter(r => !hwResults.find(res => res.responseId === r.id || res.response?.id === r.id)).length > 0 && (
                <div className="px-5 py-3 bg-yellow-50 border-b border-yellow-100">
                  <p className="text-xs font-medium text-yellow-700">
                    ⚠️ Baholanmagan javoblar: {hwResponses.filter(r =>
                      !hwResults.find(res => res.responseId === r.id || res.response?.id === r.id)
                    ).map(r => r.student?.fullName).join(', ')}
                  </p>
                </div>
              )}

              <table className="w-full crm-table">
                <thead>
                  <tr><th>#</th><th>Talaba</th><th>Izoh</th><th>Ball</th><th>Sana</th></tr>
                </thead>
                <tbody>
                  {hwResults.length === 0
                    ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">Natijalar yo'q</td></tr>
                    : hwResults.map((r, i) => (
                      <tr key={r.id}>
                        <td className="text-gray-400">{i + 1}</td>
                        <td className="font-medium">
                          {r.response?.student?.fullName || r.student?.fullName || '—'}
                        </td>
                        <td className="text-gray-500 text-sm">{r.title || '—'}</td>
                        <td><ScoreBadge score={r.score} /></td>
                        <td className="text-gray-400 text-sm">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('uz-UZ') : '—'}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ RATING ══════════════ */}
      {tab === 'rating' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setRatingScore(''); setRatingLessonId(''); setRatingErr(''); setRatingDrawer(true); }}
              className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Reyting qo'shish
            </button>
          </div>
          {ratingLoading ? <Spinner /> : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full crm-table">
                <thead>
                  <tr><th>#</th><th>O'qituvchi</th><th>Dars</th><th>Ball</th><th>Sana</th></tr>
                </thead>
                <tbody>
                  {ratings.length === 0
                    ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">Reytinglar yo'q</td></tr>
                    : ratings.map((r, i) => (
                      <tr key={r.id}>
                        <td className="text-gray-400">{i + 1}</td>
                        <td className="font-medium">{r.teacher?.fullName || group.teacher?.fullName || '—'}</td>
                        <td className="text-gray-500 text-sm">{r.lesson?.title || '—'}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">{'★'.repeat(Math.min(5, r.score))}</span>
                            <span className="text-gray-300">{'☆'.repeat(Math.max(0, 5 - r.score))}</span>
                            <span className="text-sm font-bold text-gray-700 ml-1">{r.score}/5</span>
                          </div>
                        </td>
                        <td className="text-gray-400 text-sm">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('uz-UZ') : '—'}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ VIDEO ══════════════ */}
      {tab === 'video' && (
        <div>
          {/* Upload panel */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Video yuklash</h3>
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex-1 min-w-48">
                <label className="crm-label">Darsni tanlang <span className="text-red-500">*</span></label>
                <select className="crm-input" value={videoLessonId}
                  onChange={e => setVideoLessonId(e.target.value)}>
                  <option value="">Darsni tanlang</option>
                  {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </div>
              <div>
                <label className="crm-label">Video fayl</label>
                <input ref={videoInputRef} type="file" accept="video/*"
                  className="crm-input text-sm py-1.5"
                  onChange={e => handleVideoUpload(e.target.files[0])}
                  disabled={videoUploading || !videoLessonId} />
              </div>
            </div>
            {videoUploading && (
              <div className="flex items-center gap-2 mt-3 text-purple-600 text-sm">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                Video yuklanmoqda...
              </div>
            )}
            {videoErr && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{videoErr}</div>
            )}
            {!videoLessonId && (
              <p className="text-xs text-gray-400 mt-2">⚠️ Avval darsni tanlang, keyin fayl yuklang</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full crm-table">
              <thead>
                <tr><th>#</th><th>Video</th><th>Dars</th><th>Yuklangan</th><th>Amallar</th></tr>
              </thead>
              <tbody>
                {videos.length === 0
                  ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">Videolar yo'q</td></tr>
                  : videos.map((v, i) => (
                    <tr key={v.id}>
                      <td className="text-gray-400">{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {v.file?.split('/').pop() || v.filename || `Video ${i + 1}`}
                            </p>
                            {v.file && (
                              <a href={`http://localhost:3000/${v.file}`} target="_blank" rel="noreferrer"
                                className="text-xs text-purple-600 hover:underline">▶ Ochish</a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-500 text-sm">{v.lesson?.title || '—'}</td>
                      <td className="text-gray-400 text-sm">
                        {v.createdAt ? new Date(v.createdAt).toLocaleDateString('uz-UZ') : '—'}
                      </td>
                      <td>
                        <button onClick={() => setDelVideo(v)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ TALABALAR ══════════════ */}
      {tab === 'talabalar' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full crm-table">
            <thead>
              <tr><th>#</th><th>Ism</th><th>Email</th><th>Tug'ilgan sana</th><th>Amallar</th></tr>
            </thead>
            <tbody>
              {students.length === 0
                ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">Talabalar yo'q</td></tr>
                : students.map((s, i) => {
                    const name  = getStudentName(s);
                    const email = getStudentEmail(s);
                    const bd    = getStudentBDate(s);
                    return (
                      <tr key={s.id}>
                        <td className="text-gray-400">{i + 1}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{name}</span>
                          </div>
                        </td>
                        <td className="text-gray-500 text-sm">{email}</td>
                        <td className="text-gray-500 text-sm">{bd}</td>
                        <td>
                          <button onClick={() => setDelStudent(s)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      )}

      {/* ══════ DRAWERS ══════ */}

      {/* Dars qo'shish */}
      <Drawer open={lessonDrawer} onClose={() => setLessonDrawer(false)} title="Dars qo'shish">
        <div className="space-y-4">
          <div>
            <label className="crm-label">Dars mavzusi <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Masalan: React Hooks" value={lessonTitle}
              onChange={e => setLessonTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddLesson()} />
          </div>
          {lessonErr && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600">{lessonErr}</div>}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setLessonDrawer(false)} className="btn-secondary flex-1">Bekor</button>
          <button onClick={handleAddLesson} disabled={lessonSaving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {lessonSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      {/* Vazifa qo'shish */}
      <Drawer open={hwDrawer} onClose={() => setHwDrawer(false)} title="Uyga vazifa qo'shish">
        <div className="space-y-4">
          <div>
            <label className="crm-label">Sarlavha <span className="text-red-500">*</span></label>
            <input className="crm-input" placeholder="Vazifa sarlavhasi" value={hwTitle}
              onChange={e => setHwTitle(e.target.value)} />
          </div>
          <div>
            <label className="crm-label">Dars <span className="text-red-500">*</span></label>
            <select className="crm-input" value={hwLessonId} onChange={e => setHwLessonId(e.target.value)}>
              <option value="">Darsni tanlang</option>
              {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          {hwErr && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600">{hwErr}</div>}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setHwDrawer(false)} className="btn-secondary flex-1">Bekor</button>
          <button onClick={handleAddHw} disabled={hwSaving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {hwSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      {/* Ball berish */}
      <Drawer open={resultDrawer} onClose={() => setResultDrawer(false)} title="Vazifaga ball berish">
        <div className="space-y-4">
          <div>
            <label className="crm-label">Javobni tanlang <span className="text-red-500">*</span></label>
            <select className="crm-input" value={resultForm.responseId}
              onChange={e => setResultForm({ ...resultForm, responseId: e.target.value })}>
              <option value="">Javobni tanlang</option>
              {hwResponses
                .filter(r => !hwResults.find(res => res.responseId === r.id || res.response?.id === r.id))
                .map(r => (
                  <option key={r.id} value={r.id}>
                    {r.student?.fullName || 'Talaba'} {r.title ? `— ${r.title}` : ''}
                  </option>
                ))
              }
            </select>
            {hwResponses.filter(r => !hwResults.find(res => res.responseId === r.id || res.response?.id === r.id)).length === 0 && (
              <p className="text-xs text-gray-400 mt-1">Barcha javoblar baholangan</p>
            )}
          </div>
          <div>
            <label className="crm-label">Izoh (ixtiyoriy)</label>
            <input className="crm-input" placeholder="Yaxshi ish!" value={resultForm.title}
              onChange={e => setResultForm({ ...resultForm, title: e.target.value })} />
          </div>
          <div>
            <label className="crm-label">Ball (0–100) <span className="text-red-500">*</span></label>
            <input className="crm-input" type="number" min="0" max="100" placeholder="85"
              value={resultForm.score}
              onChange={e => setResultForm({ ...resultForm, score: e.target.value })} />
            {resultForm.score && (
              <div className="mt-1"><ScoreBadge score={Number(resultForm.score)} /></div>
            )}
          </div>
          {resultErr && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600">{resultErr}</div>}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setResultDrawer(false)} className="btn-secondary flex-1">Bekor</button>
          <button onClick={handleAddResult} disabled={resultSaving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {resultSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      {/* Reyting qo'shish */}
      <Drawer open={ratingDrawer} onClose={() => setRatingDrawer(false)} title="Reyting qo'shish">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm text-gray-500">O'qituvchi:</p>
            <p className="font-medium text-gray-900">{group.teacher?.fullName || group.teacherName || "O'qituvchi yo'q"}</p>
          </div>
          <div>
            <label className="crm-label">Dars (ixtiyoriy)</label>
            <select className="crm-input" value={ratingLessonId}
              onChange={e => setRatingLessonId(e.target.value)}>
              <option value="">Darsni tanlang (ixtiyoriy)</option>
              {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          <div>
            <label className="crm-label">Ball (1–5) <span className="text-red-500">*</span></label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setRatingScore(n)}
                  className={`flex-1 py-3 rounded-xl text-lg font-bold transition-all
                    ${ratingScore === n
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {['😞','😐','🙂','😊','🤩'][n - 1]} {n}
                </button>
              ))}
            </div>
          </div>
          {ratingErr && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-600">{ratingErr}</div>}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button onClick={() => setRatingDrawer(false)} className="btn-secondary flex-1">Bekor</button>
          <button onClick={handleAddRating} disabled={ratingSaving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {ratingSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Saqlash
          </button>
        </div>
      </Drawer>

      {/* Confirms */}
      <ConfirmModal open={!!delLesson} onClose={() => setDelLesson(null)} onConfirm={handleDelLesson}
        title="Darsni o'chirish" message={`"${delLesson?.title}" darsini o'chirasizmi?`} />
      <ConfirmModal open={!!delHw} onClose={() => setDelHw(null)} onConfirm={handleDelHw}
        title="Vazifani o'chirish" message={`"${delHw?.title}" vazifasini o'chirasizmi?`} />
      <ConfirmModal open={!!delVideo} onClose={() => setDelVideo(null)} onConfirm={handleDelVideo}
        title="Videoni o'chirish" message="Bu videoni o'chirasizmi?" />
      <ConfirmModal open={!!delStudent} onClose={() => setDelStudent(null)} onConfirm={handleDelStudent}
        title="Talabani guruhdan chiqarish"
        message={`"${getStudentName(delStudent)}" ni guruhdan chiqarasizmi?`} />
    </div>
  );
}