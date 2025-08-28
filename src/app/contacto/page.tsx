import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { db } from '@/db';
import { contentBlocks } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import DynamicBlockRenderer from '@/components/DynamicBlockRenderer';
import { ContactForm } from '@/components/auth/contact-form';

// Data fetching function for the page
async function getContactPageContent() {
  try {
    const blocks = await db
      .select()
      .from(contentBlocks)
      .where(
        and(
          eq(contentBlocks.pageLocation, 'contact-page'),
          eq(contentBlocks.isActive, true)
        )
      )
      .orderBy(asc(contentBlocks.id));
    return blocks;
  } catch (error) {
    console.error("Failed to fetch contact page content:", error);
    return [];
  }
}

export default async function ContactoPage() {
  const blocks = await getContactPageContent();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="bg-gradient-to-r from-[#1E5F99] to-[#55ACEE] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contacte con Nosotros
              </h1>
              <p className="text-xl opacity-90">
                Estamos aquí para ayudarle con sus necesidades legales. 
                Contáctenos hoy para una consulta personalizada.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />
            <div className="space-y-8">
              {blocks.map((block) => (
                <DynamicBlockRenderer key={block.id} block={block} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}