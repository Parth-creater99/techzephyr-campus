import React from 'react';

export function CitLogo({ size = 36 }) {
  return (
    <div
      className="cit-crest-badge"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: 'linear-gradient(135deg, #c54a26 0%, #db822a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 3px 10px rgba(197, 74, 38, 0.28)',
        flexShrink: 0,
        position: 'relative',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 36 36"
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Academic Portico / Graduation Cap */}
        <path
          d="M18 4L4 11L18 18L32 11L18 4Z"
          fill="#ffffff"
        />
        {/* Shield Body / Open Book Contours */}
        <path
          d="M9 15.5V24C9 24 13 28 18 28C23 28 27 24 27 24V15.5"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Knowledge Horizon / Crest Accent */}
        <path
          d="M14 20.5C16 22 20 22 22 20.5"
          stroke="#fae1bb"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="18" cy="11" r="2.2" fill="#db822a" />
        <path
          d="M32 11V20"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="32" cy="20.5" r="1.2" fill="#ffffff" />
      </svg>
    </div>
  );
}

export default CitLogo;
