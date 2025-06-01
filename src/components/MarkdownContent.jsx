import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function MarkdownContent({ content, frontmatter }) {
  return (
    <div className="flex-1 full-w prose prose-invert prose-headings:text-lime-300 bg-[#232334] rounded-lg shadow-lg animate-fadeIn">
      {frontmatter && (
        <>
          <div className="hidden md:block metadata space-y-1 mb-4 text-sm text-gray-400">
            {frontmatter.created && <div><strong>Created:</strong> {frontmatter.created}</div>}
            {frontmatter.updated && <div><strong>Last updated:</strong> {frontmatter.updated}</div>}
            {frontmatter.version && <div><strong>Version:</strong> {frontmatter.version}</div>}
            {frontmatter.author && <div><strong>Author:</strong> {frontmatter.author}</div>}
            {frontmatter.references && frontmatter.references.length > 0 && (
              <div>
                <strong>References:</strong>
                <ul className="list-disc list-inside">
                  {frontmatter.references.map((ref, idx) => (
                    <li key={idx}>
                      <a href={ref} target="_blank" rel="noopener noreferrer" className="underline text-lime-300">
                        {ref}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <details className="md:hidden metadata mb-4 text-sm bg-[#232331] p-2 rounded">
            <summary className="cursor-pointer font-semibold text-lime-300">Details</summary>
            <div className="space-y-1 text-gray-400">
              {frontmatter.created && <div><strong>Created:</strong> {frontmatter.created}</div>}
              {frontmatter.updated && <div><strong>Last updated:</strong> {frontmatter.updated}</div>}
              {frontmatter.version && <div><strong>Version:</strong> {frontmatter.version}</div>}
              {frontmatter.author && <div><strong>Author:</strong> {frontmatter.author}</div>}
              {frontmatter.references && frontmatter.references.length > 0 && (
                <div>
                  <strong>References:</strong>
                  <ul className="list-disc list-inside">
                    {frontmatter.references.map((ref, idx) => (
                      <li key={idx}>
                        <a href={ref} target="_blank" rel="noopener noreferrer" className="underline text-lime-300">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        </>
      )}
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}