import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import ArticlesIndexPage from './pages/articles/ArticlesIndexPage'
import ArticlePage from './pages/articles/ArticlePage'
import CoursesIndexPage from './pages/courses/CoursesIndexPage'
import CoursePage from './pages/courses/CoursePage'
import ComponentsIndexPage from './pages/components/ComponentsIndexPage'
import DataLineagePage from './pages/components/DataLineagePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen font-mono bg-[#1e1e2e] text-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesIndexPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/courses" element={<CoursesIndexPage />} />
            <Route path="/courses/:slug" element={<CoursePage />} />
            <Route path="/components" element={<ComponentsIndexPage />} />
            <Route path="/components/data-lineage" element={<DataLineagePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}