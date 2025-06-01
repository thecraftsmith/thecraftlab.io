import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function MarkdownContent({ content, frontmatter }) {
  const indentClasses = { 1: '', 2: '', 3: 'ml-4', 4: 'ml-6', 5: 'ml-8', 6: 'ml-10' };

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

  const headings = React.useMemo(() => {
    const matches = [];
    const regex = /^ {0,3}(#{1,6})\s+(.*)$/gm;
    let match;
    while ((match = regex.exec(content))) {
      const level = match[1].length;
      const text = match[2].trim().replace(/<[^>]+>/g, '');
      const slug = slugify(text);
      matches.push({ level, text, slug });
    }
    return matches;
  }, [content]);

  const HeadingRenderer = ({ level, children, ...props }) => {
    const text = React.Children.toArray(children).reduce(
      (acc, child) => acc + (typeof child === 'string' ? child : ''),
      ''
    );
    const slug = slugify(text);
    return React.createElement('h' + level, { id: slug, ...props }, children);
  };

  return (
    <div className="flex w-full gap-8">
      <div className="flex-1 max-w-none prose prose-invert prose-headings:text-lime-300 bg-[#232334] rounded-lg shadow-lg animate-fadeIn">
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: (props) => <HeadingRenderer level={1} {...props} />,
            h2: (props) => <HeadingRenderer level={2} {...props} />,
            h3: (props) => <HeadingRenderer level={3} {...props} />,
            h4: (props) => <HeadingRenderer level={4} {...props} />,
            h5: (props) => <HeadingRenderer level={5} {...props} />,
            h6: (props) => <HeadingRenderer level={6} {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {headings.length > 0 && (
        <div className="hidden md:block w-48 h-full overflow-y-auto">
          <div className="sticky top-20">
            <div className="text-sm font-semibold text-lime-300 uppercase tracking-wide pb-2">
              Table of Contents
            </div>
            <ul className="text-sm text-gray-400">
              {headings.map(({ level, text, slug }) => (
                <li key={slug} className={indentClasses[level]}>
                  <a href={`#${slug}`} className="hover:underline">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}