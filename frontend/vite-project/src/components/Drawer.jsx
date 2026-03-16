// src/components/Drawer.jsx
// ============================================================
// A slide-in drawer from the right side.
// Usage:
//   <Drawer open={isOpen} onClose={() => setOpen(false)} title="Guruh qo'shish">
//     ... form content ...
//   </Drawer>
// ============================================================

import React from 'react';

export default function Drawer({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <>
      {/* Dark overlay behind drawer */}
      <div
        className="drawer-overlay"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="drawer p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-6">Yangi yaratish uchun quyidagi ma'lumotlarni kiriting.</p>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
