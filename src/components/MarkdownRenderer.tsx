import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer = ({ markdown }: MarkdownRendererProps) => {
  return <ReactMarkdown className="prose dark:prose-invert max-w-none">{markdown}</ReactMarkdown>;
};

export default MarkdownRenderer;
