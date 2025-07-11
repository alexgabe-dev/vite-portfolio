import React from 'react';
// @ts-ignore
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

interface Block {
  type?: string;
  children?: any[];
  text?: string;
  level?: number;
  [key: string]: any;
}

interface BlogContentRendererProps {
  content: any;
}

const renderBlock = (block: Block, i: number) => {
  // Strapi React MD Editor block structure
  switch (block.type) {
    case 'heading':
      const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
      return <Tag key={i} className={`font-bold mt-6 mb-2 text-${block.level === 1 ? '3xl' : block.level === 2 ? '2xl' : 'xl'}`}>{block.children?.map((c, j) => c.text || '').join(' ')}</Tag>;
    case 'paragraph':
      return <p key={i} className="mb-4 leading-relaxed">{block.children?.map((c, j) => c.text || '').join(' ')}</p>;
    case 'quote':
      return <blockquote key={i} className="border-l-4 border-[#ff5c35] pl-4 italic my-4 text-gray-300">{block.children?.map((c, j) => c.text || '').join(' ')}</blockquote>;
    case 'code':
      return <pre key={i} className="bg-[#181828] rounded p-4 my-4 overflow-x-auto"><code>{block.children?.map((c, j) => c.text || '').join(' ')}</code></pre>;
    case 'bulleted-list':
      return <ul key={i} className="list-disc pl-6 mb-4">{block.children?.map((li, j) => <li key={j}>{li.children?.map((c: any) => c.text || '').join(' ')}</li>)}</ul>;
    case 'numbered-list':
      return <ol key={i} className="list-decimal pl-6 mb-4">{block.children?.map((li, j) => <li key={j}>{li.children?.map((c: any) => c.text || '').join(' ')}</li>)}</ol>;
    case 'image':
      return <img key={i} src={block.url} alt={block.alt || ''} className="my-6 rounded shadow max-w-full" />;
    default:
      // fallback: try to render children as text
      if (block.children) {
        return <div key={i}>{block.children.map((c, j) => c.text || '').join(' ')}</div>;
      }
      return null;
  }
};

const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ content }) => {
  if (!content) return null;

  // Block JSON (array)
  if (Array.isArray(content)) {
    return <div>{content.map((block, i) => renderBlock(block, i))}</div>;
  }

  // String: Markdown or HTML
  if (typeof content === 'string') {
    // Heurisztika: ha van benne <tag>, akkor HTML, különben Markdown
    if (/<[a-z][\s\S]*>/i.test(content.trim())) {
      return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />;
    } else {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }
  }

  // Egyéb típus: ne jelenítsen meg semmit
  return null;
};

export default BlogContentRenderer; 