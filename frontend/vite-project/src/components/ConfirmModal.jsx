import React, { useState } from 'react';

export default function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{title || "O'chirishni tasdiqlang"}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{message || "Bu amalni ortga qaytarib bo'lmaydi."}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} disabled={loading} className="btn-secondary">
              Bekor qilish
            </button>
            <button onClick={handleConfirm} disabled={loading}
              className="bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all flex items-center gap-2 disabled:opacity-60">
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}