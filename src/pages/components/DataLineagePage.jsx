import React from 'react'
import { Link } from 'react-router-dom'
import DataLineage from '../../components/DataLineage'

export default function DataLineagePage() {
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
      <div className="flex-grow flex items-center justify-center">
        <DataLineage />
      </div>
    </div>
  )
}