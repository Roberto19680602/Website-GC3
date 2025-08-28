import Image from 'next/image';
import { Search, MoreHorizontal } from 'lucide-react';

type BlogPost = {
  image: string | null;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
};

const blogPosts: BlogPost[] = [
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/063d45e6-a298-496e-822b-8d1be04b580e-govilkar-com/assets/images/234705a77b7b4aae825b096666ebbd41-8.webp?",
    imageAlt: "An hourglass, symbolizing time.",
    imageWidth: 355,
    imageHeight: 237,
    title: "TIME IS OF THE ESSENCE",
    excerpt: "Time is of the essence in some contracts and there are legal repercussions for breach of the time schedule.",
    author: "Mihir Govilkar",
    date: "Oct 14, 2021",
    readTime: "6 min read"
  },
  {
    image: null,
    imageAlt: "A gavel, book, and scales of justice.",
    imageWidth: 355,
    imageHeight: 237,
    title: "Indian Judiciary: 'Settlement', Lawyers & Expectations",
    excerpt: "This article discusses the unscrupulous practices followed by some lawyers by guaranteeing outcomes to their clients and their expectations.",
    author: "Mihir Govilkar",
    date: "Oct 5, 2021",
    readTime: "4 min read"
  },
  {
    image: null,
    imageAlt: "A collection of social media app icons on a smartphone screen.",
    imageWidth: 355,
    imageHeight: 237,
    title: "The Evolution of Law with Technology",
    excerpt: "It was in the year 1998, that I had gone on a family trip to Singapore. I remember, my elder brother searching desperately for a...",
    author: "Mihir Govilkar",
    date: "Sep 28, 2021",
    readTime: "7 min read"
  },
  {
    image: null,
    imageAlt: "Two people holding hands in a supportive gesture.",
    imageWidth: 355,
    imageHeight: 237,
    title: "Mediation in our Culture & Traditions",
    excerpt: "My journey in Mediation is as yet, short. But in my short journey, I have recognised the power that Mediation can have and it is...",
    author: "Mihir Govilkar",
    date: "Aug 31, 2021",
    readTime: "17 min read"
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/063d45e6-a298-496e-822b-8d1be04b580e-govilkar-com/assets/images/234705a77b7b4aae825b096666ebbd41-9.webp?",
    imageAlt: "A firm handshake between two business professionals.",
    imageWidth: 355,
    imageHeight: 237,
    title: "LEGAL VALIDITY OF THE ORAL AGREEMENT IN 'LAGAAN'.",
    excerpt: "Today, I was watching the movie Lagaan which was released in the year 2001. The movie depicts events (fictional) that transpired in the...",
    author: "Mihir Govilkar",
    date: "Jul 14, 2021",
    readTime: "11 min read"
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/063d45e6-a298-496e-822b-8d1be04b580e-govilkar-com/assets/images/0a1b91b965d01bc858fbf83a0916770f-14.png?",
    imageAlt: "Promotional poster for the movie 'Baazigar'.",
    imageWidth: 355,
    imageHeight: 237,
    title: "The Improbable 'Power of Attorney' in 'Baazigar'.",
    excerpt: "A few days ago, I had written an article on the legal validity of the oral agreement in the movie 'Lagaan'. It was an interesting...",
    author: "Mihir Govilkar",
    date: "Jul 30, 2021",
    readTime: "8 min read"
  }
];

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

const BlogGrid = () => {
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
            {blogPosts.map((post, index) => (
              <BlogCard key={index} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogGrid;