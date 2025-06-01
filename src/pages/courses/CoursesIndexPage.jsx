import React from 'react'
import { Link } from 'react-router-dom'

const courseFiles = import.meta.glob('../../content/courses/*.md', { query: '?raw', import: 'default' })

export default function CoursesIndexPage() {
  const courses = React.useMemo(
    () =>
      Object.keys(courseFiles).map((filePath) => {
        const name = filePath.split('/').pop().replace(/\.md$/, '')
        return { name, slug: name }
      }),
    []
  )

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
        Courses
      </h2>
      <ul className="space-y-4">
        {courses.map(({ name, slug }) => (
          <li key={slug}>
            <Link
              to={`/courses/${slug}`}
              className="block p-4 bg-[#232334] rounded-xl shadow hover:bg-[#2e2e40] transition"
            >
              <span className="text-xl font-medium text-lime-300">
                {name.replace(/-/g, ' ')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}