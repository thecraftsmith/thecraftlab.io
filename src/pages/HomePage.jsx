import React from 'react'
import { Link } from 'react-router-dom'
import { sections } from '../config/sections'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center px-4 py-8">
      <h1 className="text-4xl font-bold text-lime-300 mb-8">thecraftlab.io</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
        {sections.map(({ key, label, path, icon }) => (
          <Link
            to={path}
            key={key}
            className="group relative block w-full max-w-xs mx-auto h-56 p-6 bg-[#232334] rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex items-center text-lime-300 mb-4">
              {icon}
              <span className="ml-3 text-2xl font-bold tracking-wide">
                {label}
              </span>
            </div>
            <p className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
              Explore {label.toLowerCase()}
            </p>
            <div className="absolute bottom-4 right-4 text-gray-500 transition-colors duration-300 group-hover:text-lime-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}