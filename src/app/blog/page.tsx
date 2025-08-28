import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { db } from '@/db';
import { contentBlocks } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import DynamicBlockRenderer from '@/components/DynamicBlockRenderer';

// Data fetching function for the page
async function getBlogPageContent() {
  try {
    const blocks = await db
      .select()
      .from(contentBlocks)
      .where(
        and(
          eq(contentBlocks.pageLocation, 'blog-page'),
          eq(contentBlocks.isActive, true)
        )
      )
      .orderBy(asc(contentBlocks.id));
    return blocks;
  } catch (error) {
    console.error("Failed to fetch blog page content:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blocks = await getBlogPageContent();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-[#1E5F99] to-[#55ACEE] py-20">
          <div className="container">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Blog de GC3 Consultoría
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Compartimos conocimiento y perspectivas sobre estrategia empresarial,
                liderazgo e innovación para impulsar el crecimiento de tu organización
              </p>
            </div>
          </div>
        </section>

        <div className="container py-16">
            {blocks.length > 0 ? (
              blocks.map((block) => (
                <DynamicBlockRenderer key={block.id} block={block} />
              ))
            ) : (
              <div className="text-center py-16">
                <p>No hay contenido para el blog en este momento.</p>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
