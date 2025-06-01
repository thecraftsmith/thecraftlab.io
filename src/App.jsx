import React, { useState, useEffect, lazy, Suspense } from 'react';
import { parseFrontMatter } from './utils/parseFrontMatter';
import DataLineage from './components/DataLineage';

const MarkdownContent = lazy(() => import('./components/MarkdownContent'));

const markdownSections = {
  whoami: import.meta.glob('./content/whoami/*.md', { query: '?raw', import: 'default' }),
  courses: import.meta.glob('./content/courses/*.md', { query: '?raw', import: 'default' }),
  articles: import.meta.glob('./content/articles/*.md', { query: '?raw', import: 'default' }),
  lineage: {},
};

const sectionTitles = {
  whoami: 'Who Am I',
  courses: 'Courses',
  articles: 'Articles',
  lineage: 'Data Lineage',
};

const sectionIcons = {
  whoami: (
    <span className="w-7 h-7 flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"/>
      </svg>
    </span>
  ),
  courses: (
    <span className="w-7 h-7 flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/>
      </svg>
    </span>
  ),
  articles: (
    <span className="w-7 h-7 flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h4"/>
      </svg>
    </span>
  ),
  lineage: (
    <span className="w-7 h-7 flex items-center justify-center">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>
        <path d="M8 12h4M14 12h4"/>
      </svg>
    </span>
  ),
};

const Sidebar = ({
  activeSection,
  setActiveSection,
  minimized,
  setMinimized,
}) => (
  <aside
    className={`
      h-screen z-40 bg-[#2b2b3c] border-r border-[#3a3a4d]
      flex flex-col justify-between py-6
      transition-all duration-300
      ${minimized ? 'w-16' : 'w-56 md:w-64 px-2 md:px-6'}
    `}
  >
    <div className={`flex flex-col ${minimized ? 'gap-0 items-center' : 'gap-8'}`}>
      {!minimized && (
        <div className="text-xl font-bold text-lime-300 tracking-wide pl-2 mb-2">{'>'}the{'<'}craft{'>'}lab{'<'}</div>
      )}
      <nav className={`flex flex-col ${minimized ? 'gap-3 mt-8' : 'gap-2 w-full'}`}>
        {Object.keys(markdownSections).map((section) => (
          <button
            key={section}
            className={`
              group flex items-center ${minimized ? 'justify-center' : 'justify-start'}
              w-full py-3 px-0 rounded-xl text-base transition font-medium
              ${activeSection === section
                ? 'bg-[#24243b] text-lime-300 ring-2 ring-lime-300'
                : 'text-lime-300 hover:bg-lime-900'
              }
              relative
            `}
            style={{ minHeight: 48, minWidth: minimized ? 48 : undefined }}
            onClick={() => setActiveSection(section)}
          >
            {sectionIcons[section]}
            {!minimized && (
              <span className="ml-2 whitespace-nowrap">
                {section === 'whoami'
                  ? 'Who Am I'
                  : section === 'lineage'
                  ? 'Data Lineage'
                  : section.charAt(0).toUpperCase() + section.slice(1)
                }
              </span>
            )}
            {minimized && (
              <span className="absolute left-14 opacity-0 pointer-events-none bg-[#24243b] px-3 py-1 rounded text-xs text-lime-300 shadow group-hover:opacity-100 transition whitespace-nowrap z-50">
                {section === 'whoami'
                  ? 'Who Am I'
                  : section === 'lineage'
                  ? 'Data Lineage'
                  : section.charAt(0).toUpperCase() + section.slice(1)
                }
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
    <div className="w-full flex justify-center mt-4 mb-2">
      <button
        className={`
          flex items-center justify-center w-10 h-10 rounded-xl transition bg-[#232334] text-lime-300 hover:bg-lime-900 border border-[#373751] shadow-lg
        `}
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
);

const FileList = ({ files, activeFile, setActiveFile }) => {
  const formatTitle = (str) =>
    str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col gap-2 flex-1 max-w-xs pr-2">
      {files.map((file) => (
        <button
          key={file.path}
          className={`
            w-full text-left px-5 py-3 rounded-xl font-medium
            transition border-0 shadow-sm
            ${
              activeFile?.path === file.path
                ? 'bg-[#24243b] text-lime-300 ring-2 ring-lime-300'
                : 'bg-[#393953] text-white hover:bg-[#44476a] hover:text-lime-300'
            }
          `}
          style={{ minWidth: '180px' }}
          onClick={() => setActiveFile(file)}
        >
          {formatTitle(file.name)}
        </button>
      ))}
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState('whoami');
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
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

    return (
    <div className="flex h-screen font-mono bg-[#1e1e2e] text-white">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        minimized={sidebarMinimized}
        setMinimized={setSidebarMinimized}
      />
      <main className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarMinimized ? 'ml-8' : 'ml-8'}`}>
        <div className={
          `flex flex-col flex-1 h-full ${
            activeSection === 'lineage'
              ? 'items-stretch justify-center w-full px-0'
          : 'items-start pt-4 md:pt-8 w-full px-2 md:px-4'
          }`
        }>
          <h2 className="text-3xl font-bold text-lime-300 uppercase tracking-wider animate-slideIn mb-6 ml-0">
            {sectionTitles[activeSection]}
          </h2>
          <div className={
            activeSection === 'lineage'
              ? 'flex-1'
              : 'flex w-full max-w-6xl flex-1 gap-4 items-start'
          }>
            {activeSection === 'lineage' ? (
              <DataLineage />
            ) : (
              <>
                <FileList files={files} activeFile={activeFile} setActiveFile={setActiveFile} />
                <div className="flex-1 flex">
                  <div className="w-full bg-[#232334] rounded-xl pl-6 h-full overflow-y-auto dracula-scrollbar max-h-[calc(100vh-120px)]">
                    <Suspense fallback={<div>Loading...</div>}>
                      <MarkdownContent content={content} frontmatter={frontmatter} />
                    </Suspense>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}