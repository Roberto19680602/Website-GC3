import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { db } from '@/db';
import { contentBlocks } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import DynamicBlockRenderer from '@/components/DynamicBlockRenderer';

// Data fetching function for the page
async function getAboutPageContent() {
  try {
    const blocks = await db
      .select()
      .from(contentBlocks)
      .where(
        and(
          eq(contentBlocks.pageLocation, 'about-page'),
          eq(contentBlocks.isActive, true)
        )
      )
      .orderBy(asc(contentBlocks.id));
    return blocks;
  } catch (error) {
    console.error("Failed to fetch about page content:", error);
    return [];
  }
}

export default async function NosotrosPage() {
  const blocks = await getAboutPageContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <DynamicBlockRenderer key={block.id} block={block} />
          ))
        ) : (
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold">Sobre Nosotros</h1>
            <p className="mt-4">El contenido para esta página se está preparando.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}