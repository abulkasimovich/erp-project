// src/components/ConfirmModal.jsx
// A simple "Are you sure?" delete confirmation modal

import React from 'react';

export default function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{title || "O'chirishni tasdiqlang"}</h3>
              <p className="text-sm text-gray-500">{message || "Bu amalni ortga qaytarib bo'lmaydi."}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="btn-secondary">Bekor qilish</button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all"
            >
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
