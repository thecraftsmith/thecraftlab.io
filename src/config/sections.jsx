import React from 'react'

export const sectionIcons = {
  articles: (
    <span className="w-7 h-7 flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M8 9h8M8 13h8M8 17h4"/>
      </svg>
    </span>
  ),
  courses: (
    <span className="w-7 h-7 flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2"/>
        <path d="M16 3v4M8 3v4"/>
      </svg>
    </span>
  ),
  components: (
    <span className="w-7 h-7 flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="6" cy="12" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="18" cy="12" r="2"/>
        <path d="M8 12h4M14 12h4"/>
      </svg>
    </span>
  ),
}

export const sections = [
  { key: 'articles', label: 'Articles', path: '/articles', icon: sectionIcons.articles },
  { key: 'courses', label: 'Courses', path: '/courses', icon: sectionIcons.courses },
  { key: 'components', label: 'Components', path: '/components', icon: sectionIcons.components },
]