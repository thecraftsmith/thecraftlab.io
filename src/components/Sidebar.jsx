import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { sections } from '../config/sections'

export default function Sidebar() {
  const [minimized, setMinimized] = useState(false)

  return (
    <aside
      className={
        `hidden md:flex h-screen z-40 bg-[#2b2b3c] border-r border-[#3a3a4d]
        flex flex-col justify-between py-6
        transition-all duration-300
        ${minimized ? 'w-16' : 'w-56 md:w-64 px-2 md:px-6'}`
      }
    >
      <div className={`flex flex-col ${minimized ? 'gap-0 items-center' : 'gap-8'}`}>
        {!minimized && (
          <div className="text-xl font-bold text-lime-300 tracking-wide pl-2 mb-2">
            {'>'}the{'<'}craft{'>'}lab{'<'}
          </div>
        )}
        <nav className={`flex flex-col ${minimized ? 'gap-3 mt-8' : 'gap-2 w-full'}`}>
          {sections.map(({ key, label, path, icon }) => (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) =>
                `group flex items-center ${
                  minimized ? 'justify-center' : 'justify-start'
                } w-full py-3 rounded-xl text-base transition font-medium ${
                  isActive
                    ? 'bg-[#24243b] text-lime-300 ring-2 ring-lime-300'
                    : 'text-lime-300 hover:bg-lime-900'
                } relative`
              }
              style={{ minHeight: 48, minWidth: minimized ? 48 : undefined }}
            >
              {icon}
              {!minimized && <span className="ml-2 whitespace-nowrap">{label}</span>}
              {minimized && (
                <span className="absolute left-14 opacity-0 pointer-events-none bg-[#24243b] px-3 py-1 rounded text-xs text-lime-300 shadow group-hover:opacity-100 transition whitespace-nowrap z-50">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="w-full flex justify-center mt-4 mb-2">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl transition bg-[#232334] text-lime-300 hover:bg-lime-900 border border-[#373751] shadow-lg"
          onClick={() => setMinimized(!minimized)}
          aria-label={minimized ? 'Expand sidebar' : 'Minimize sidebar'}
          title={minimized ? 'Expandir menu' : 'Recolher menu'}
        >
          {minimized ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </aside>
  )
}