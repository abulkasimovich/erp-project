// src/components/Toggle.jsx
// A simple on/off toggle switch (like in the groups table)

import React from 'react';

export default function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`toggle ${value ? 'toggle-on' : 'toggle-off'}`}
    >
      <span className={`toggle-circle ${value ? 'toggle-circle-on' : 'toggle-circle-off'}`} />
    </button>
  );
}
