import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export default function ServiciosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="text-center py-16">
            <h1 className="text-4xl font-bold">Nuestros Servicios</h1>
            <p className="mt-4">El contenido para esta página se está preparando.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}