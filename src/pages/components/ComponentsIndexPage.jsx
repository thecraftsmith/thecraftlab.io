import React from 'react'
import { Link } from 'react-router-dom'
import { sectionIcons } from '../../config/sections'

export default function ComponentsIndexPage() {
  const components = [
    { key: 'data-lineage', label: 'Data Lineage', path: '/components/data-lineage', icon: sectionIcons.components },
  ]

  return (
    <div className="flex flex-col px-4 py-6">
      <Link
        to="/"
        className="inline-flex items-center text-gray-400 hover:text-lime-300 transition mb-4"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2">Home</span>
      </Link>
      <h2 className="text-3xl font-bold text-lime-300 uppercase tracking-wider mb-6">
        Components
      </h2>
      <ul className="space-y-4">
        {components.map(({ key, label, path, icon }) => (
          <li key={key}>
            <Link
              to={path}
              className="flex items-center p-4 bg-[#232334] rounded-xl shadow hover:bg-[#2e2e40] transition"
            >
              {icon}
              <span className="ml-2 text-xl font-medium text-lime-300">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}