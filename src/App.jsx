import React, { useState, useEffect, lazy, Suspense } from 'react'
const MarkdownContent = lazy(() => import('./components/MarkdownContent'))
import { parseFrontMatter } from './utils/parseFrontMatter'
import DataLineage from './components/DataLineage'

const markdownSections = {
  whoami: import.meta.glob('./content/whoami/*.md', { query: '?raw', import: 'default' }),
  courses: import.meta.glob('./content/courses/*.md', { query: '?raw', import: 'default' }),
  articles: import.meta.glob('./content/articles/*.md', { query: '?raw', import: 'default' }),
  lineage: {},
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
        const { data, content: mdContent } = parseFrontMatter(md);
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
    lineage: 'Data Lineage',
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
          {['whoami', 'courses', 'articles', 'lineage'].map((section) => (
            <button
              key={section}
              className={`text-left px-3 py-2 rounded ${
                activeSection === section ? 'border border-lime-300 text-lime-300' : 'text-lime-300 hover:bg-lime-900'
              } transition`}
              onClick={() => setActiveSection(section)}
            >
              {section === 'whoami'
                ? 'who am i'
                : section === 'lineage'
                ? 'data lineage'
                : section}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className={`space-y-8 ${activeSection === 'lineage' ? 'w-full' : 'max-w-3xl mx-auto'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-lime-300 uppercase tracking-wider animate-slideIn">{sectionTitle}</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {activeSection === 'lineage' ? (
              <DataLineage />
            ) : (
              <>
                <div className="flex-shrink-0 w-full md:w-48 space-y-2">
                  {files.map((file) => (
                    <button
                      key={file.path}
                      className={`w-full text-left px-3 py-2 rounded bg-[#44475a] ${activeFile?.path === file.path ? 'border-l-4 border-lime-300' : 'hover:bg-[#4f4f6f]'} transition`}
                      onClick={() => setActiveFile(file)}
                    >
                      {formatTitle(file.name)}
                    </button>
                  ))}
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                  <MarkdownContent content={content} frontmatter={frontmatter} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}