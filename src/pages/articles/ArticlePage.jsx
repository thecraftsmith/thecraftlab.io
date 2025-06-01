import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { parseFrontMatter } from '../../utils/parseFrontMatter'
import MarkdownContent from '../../components/MarkdownContent'

const articleFiles = import.meta.glob('../../content/articles/*.md', { query: '?raw', import: 'default' })

export default function ArticlePage() {
  const { slug } = useParams()
  const [content, setContent] = useState('')
  const [frontmatter, setFrontmatter] = useState({})

  useEffect(() => {
    const filePath = `../../content/articles/${slug}.md`
    const loader = articleFiles[filePath]
    if (!loader) return
    loader().then((raw) => {
      const { data, content: mdContent } = parseFrontMatter(raw)
      setFrontmatter(data)
      setContent(mdContent)
    })
  }, [slug])

  if (!content) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-lime-300 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-2">Home</span>
        </Link>
      </div>
      <div className="w-full bg-[#232334] rounded-xl p-6 overflow-y-auto dracula-scrollbar">
        <MarkdownContent content={content} frontmatter={frontmatter} />
      </div>
    </div>
  )
}