import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import matter from 'gray-matter';

const markdownSections = {
  whoami: import.meta.glob('./content/whoami/*.md', { query: '?raw', import: 'default' }),
  courses: import.meta.glob('./content/courses/*.md', { query: '?raw', import: 'default' }),
  articles: import.meta.glob('./content/articles/*.md', { query: '?raw', import: 'default' }),
};

export default function App() {
  const [activeSection, setActiveSection] = useState('whoami');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [content, setContent] = useState('');
  const [frontmatter, setFrontmatter] = useState({});

  useEffect(() => {
    const loadFiles = async () => {
      const sectionFiles = markdownSections[activeSection];
      const entries = Object.entries(sectionFiles);
      const loadedFiles = entries.map(([path, resolver]) => {
        const name = path.split('/').pop().replace(/\.md$/, '');
        return { path, name, resolver };
      });
      setFiles(loadedFiles);
      setActiveFile(loadedFiles[0] || null);
    };
    loadFiles();
    setSidebarOpen(false);
  }, [activeSection]);

  useEffect(() => {
    const loadContent = async () => {
      if (activeFile) {
        const md = await activeFile.resolver();
        const { data, content: mdContent } = matter(md);
        setFrontmatter(data);
        setContent(mdContent);
      } else {
        setFrontmatter({});
        setContent('');
      }
    };
    loadContent();
  }, [activeFile]);

  const formatTitle = (str) =>
    str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const sectionTitle = {
    whoami: 'Who Am I',
    courses: 'Courses',
    articles: 'Articles',
  }[activeSection];

  return (
    <div className="flex flex-col md:flex-row h-screen font-mono bg-[#1e1e2e] text-white">
      <header className="md:hidden flex items-center justify-between px-4 py-2 bg-[#2b2b3c] border-b border-[#3a3a4d]">
        <div className="text-xl font-bold text-lime-300 tracking-wide">{'>'}the{'<'}craft{'>'}lab{'<'}</div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl focus:outline-none"
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </header>

<aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block bg-[#2b2b3c] border-r border-[#3a3a4d] p-4 md:p-6 flex flex-col gap-8 w-48 md:w-60 flex-shrink-0`}>
        <div className="hidden md:block text-xl font-bold text-lime-300 tracking-wide">{'>'}the{'<'}craft{'>'}lab{'<'}</div>
        <nav className="flex flex-col gap-3 mt-4">
          {['whoami', 'courses', 'articles'].map((section) => (
            <button
              key={section}
              className={`text-left px-3 py-2 rounded ${
                activeSection === section ? 'border border-lime-300 text-lime-300' : 'text-lime-300 hover:bg-lime-900'
              } transition`}
              onClick={() => setActiveSection(section)}
            >
              {section === 'whoami' ? 'who am i' : section}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-lime-300 uppercase tracking-wider animate-slideIn">{sectionTitle}</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0 w-full md:w-48 space-y-2">
              {files.map((file) => (
                <button
                  key={file.path}
                  className={`w-full text-left px-3 py-2 rounded bg-[#44475a] ${
                    activeFile?.path === file.path ? 'border-l-4 border-lime-300' : 'hover:bg-[#4f4f6f]'
                  } transition`}
                  onClick={() => setActiveFile(file)}
                >
                  {formatTitle(file.name)}
                </button>
              ))}
            </div>
            <div className="prose prose-invert prose-headings:text-lime-300 flex-1 bg-[#2b2b3c] p-4 md:p-6 rounded-lg shadow-lg animate-fadeIn">
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
                    <div className="space-y-1 mt-2 text-gray-400">
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                allowDangerousHtml
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}