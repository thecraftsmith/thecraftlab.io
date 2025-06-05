import React from 'react'

export default function Logo({ width = 64, height = 64, className = '' }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M28 0 L36 0 L54 54 L10 54 L28 16 Z"
        strokeWidth="2"
        fill="none"
      />
      <line x1="24" y1="42" x2="32" y2="32" strokeWidth="1.5" />
      <line x1="32" y1="32" x2="40" y2="40" strokeWidth="1.5" />
      <line x1="40" y1="40" x2="48" y2="28" strokeWidth="1.5" />
      <circle cx="24" cy="42" r="2" fill="currentColor" />
      <circle cx="32" cy="32" r="2" fill="currentColor" />
      <circle cx="40" cy="40" r="2" fill="currentColor" />
      <circle cx="48" cy="28" r="2" fill="currentColor" />
    </svg>
  )
}