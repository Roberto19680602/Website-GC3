import Image from 'next/image';
import { Search, MoreHorizontal } from 'lucide-react';
import { z } from 'zod';

// Define a Zod schema for a single blog post to validate the parsed data
const blogPostSchema = z.object({
  image: z.string().nullable(),
  imageAlt: z.string(),
  imageWidth: z.number(),
  imageHeight: z.number(),
  title: z.string(),
  excerpt: z.string(),
  author: z.string(),
  date: z.string(),
  readTime: z.string(),
});

// Define the type for an array of blog posts
const blogPostsSchema = z.array(blogPostSchema);

type BlogPost = z.infer<typeof blogPostSchema>;

const BlogCard = ({ post }: { post: BlogPost }) => (
  <article>
    {post.image ? (
      <Image
        src={post.image}
        alt={post.imageAlt}
        width={post.imageWidth}
        height={post.imageHeight}
        className="w-full h-auto object-cover"
      />
    ) : (
      <div
        className="w-full bg-gray-200"
        style={{ height: `${post.imageHeight}px` }}
        aria-label={post.imageAlt}
      ></div>
    )}
    <div className="bg-[#F8F8F8] p-6">
       <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <span>{post.author}</span>
        </div>
        <div className="flex items-center space-x-2">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
        </div>
        <button aria-label="More options" className="text-gray-500 hover:text-gray-800">
            <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <a href="#" className="block mt-4">
        <h2 className="text-xl font-bold text-[var(--color-text-black)] hover:text-[var(--color-brand-primary)] transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-[15px] text-[var(--color-neutral-dark-gray)] leading-relaxed">
          {post.excerpt}
        </p>
      </a>
    </div>
  </article>
);

interface BlogGridProps {
  content: string | null;
}

const BlogGrid = ({ content }: BlogGridProps) => {
  let posts: BlogPost[] = [];
  let parseError = false;

  if (content) {
    try {
      const parsedData = JSON.parse(content);
      const validationResult = blogPostsSchema.safeParse(parsedData);
      if (validationResult.success) {
        posts = validationResult.data;
      } else {
        console.error("Blog content validation error:", validationResult.error);
        parseError = true;
      }
    } catch (error) {
      console.error("Failed to parse blog content JSON:", error);
      parseError = true;
    }
  }

  if (parseError) {
    return (
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-red-500">Error: El contenido del blog no es válido.</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p>No hay artículos en el blog todavía.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 bg-repeat"
      style={{
        backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/063d45e6-a298-496e-822b-8d1be04b580e-govilkar-com/assets/images/8ca1d4b1209f4712a582d259e1d041c4-15.png?')"
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12">
          <header className="flex justify-between items-center pb-4 border-b border-gray-200 mb-8">
            <a href="#" className="text-lg text-[var(--color-brand-primary)] font-semibold hover:underline">
              All Posts
            </a>
            <button aria-label="Search" className="text-gray-500 hover:text-gray-800">
              <Search className="h-6 w-6" />
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <BlogCard key={index} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;