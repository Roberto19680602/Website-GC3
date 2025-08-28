import BlogGrid from './sections/blog-grid';
import HtmlRenderer from './HtmlRenderer';
import MarkdownRenderer from './MarkdownRenderer';
import { contentBlocks } from '@/db/schema';

// Define a type for the block prop, using the schema type
type Block = typeof contentBlocks.$inferSelect;

interface DynamicBlockRendererProps {
  block: Block;
}

const DynamicBlockRenderer = ({ block }: DynamicBlockRendererProps) => {
  if (!block.blockContent) {
    return null;
  }

  switch (block.blockType) {
    case 'blog-grid':
      return <BlogGrid content={block.blockContent} />;

    case 'html':
      return <HtmlRenderer html={block.blockContent} />;

    case 'markdown':
      return <MarkdownRenderer markdown={block.blockContent} />;

    case 'text':
      return <p>{block.blockContent}</p>;

    default:
      console.warn(`Unknown block type: ${block.blockType}`);
      return (
        <div className="border-2 border-dashed border-red-500 p-4 my-4">
          <p className="text-red-500 font-bold">Unknown Block Type: "{block.blockType}"</p>
          <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">{block.blockContent}</pre>
        </div>
      );
  }
};

export default DynamicBlockRenderer;
