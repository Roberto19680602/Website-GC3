import Header from '@/components/sections/header';
import BlogGrid from '@/components/sections/blog-grid';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BlogGrid />
      </main>
      <Footer />
    </div>
  );
}