// src/App.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

const markdownSections = {
  whoami: import.meta.glob('./content/whoami/*.md', { as: 'raw' }),
  courses: import.meta.glob('./content/courses/*.md', { as: 'raw' }),
  articles: import.meta.glob('./content/articles/*.md', { as: 'raw' }),
};

export default function App() {
  const [activeSection, setActiveSection] = useState('whoami');
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [content, setContent] = useState('');

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
        setContent(md);
      } else {
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
    <div className="app-container">
      <nav className="sidebar">
        <div className="logo">{'>the<craft>lab<'}</div>
        <ul className="nav-list">
          {['whoami', 'courses', 'articles'].map((section) => (
            <li key={section}>
              <button
                className={`nav-btn ${activeSection === section ? 'active' : ''}`}
                onClick={() => setActiveSection(section)}
              >
                {section === 'whoami' ? 'who am i' : section}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        <header className="section-title">
          <h2>{sectionTitle}</h2>
        </header>
        <div className="section-container">
          <aside className="file-list">
            {files.map((file) => (
              <button
                key={file.path}
                className={`file-btn ${
                  activeFile && activeFile.path === file.path ? 'active' : ''
                }`}
                onClick={() => setActiveFile(file)}
              >
                {formatTitle(file.name)}
              </button>
            ))}
          </aside>
          <div className="file-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
}