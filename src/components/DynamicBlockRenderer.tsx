import BlogGrid from './sections/blog-grit'; // Note the filename typo
import { contentBlocks } from '@/db/schema';

// Define a type for the block prop, using the schema type
type Block = typeof contentBlocks.$inferSelect;

interface DynamicBlockRendererProps {
  block: Block;
}

const DynamicBlockRenderer = ({ block }: DynamicBlockRendererProps) => {
  switch (block.blockType) {
    case 'blog-grid':
      // In the future, we would pass block.blockContent to BlogGrid
      // e.g., <BlogGrid content={JSON.parse(block.blockContent)} />
      return <BlogGrid />;

    // Add other cases here for other block types
    // case 'hero-section':
    //   return <HeroSection content={...} />;

    default:
      // Render nothing or a placeholder for unknown block types
      console.warn(`Unknown block type: ${block.blockType}`);
      return null;
  }
};

export default DynamicBlockRenderer;
