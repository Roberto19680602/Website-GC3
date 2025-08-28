import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { db } from '@/db';
import { contentBlocks } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import DynamicBlockRenderer from '@/components/DynamicBlockRenderer';

// Data fetching function for the page
async function getHomepageContent() {
  try {
    const blocks = await db
      .select()
      .from(contentBlocks)
      .where(
        and(
          eq(contentBlocks.pageLocation, 'homepage'),
          eq(contentBlocks.isActive, true)
        )
      )
      .orderBy(asc(contentBlocks.id)); // or some other ordering column if available
    return blocks;
  } catch (error) {
    console.error("Failed to fetch homepage content:", error);
    return [];
  }
}

export default async function HomePage() {
  const blocks = await getHomepageContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <DynamicBlockRenderer key={block.id} block={block} />
          ))
        ) : (
          <div className="container text-center py-16">
            <p>No content configured for this page.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}