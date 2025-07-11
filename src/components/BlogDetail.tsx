import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogPosts } from '../utils/blogApi';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle, Clock, ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import BlogContentRenderer from './BlogContentRenderer';

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts().then((posts) => {
      // Sort posts by publishedAt (desc), fallback to createdAt
      const sorted = [...posts].sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      setAllPosts(sorted);
      const found = sorted.find((p) => (p.slug || '').toLowerCase() === (slug || '').toLowerCase());
      setPost(found || null);
      setLoading(false);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Find previous and next posts
  const currentIndex = allPosts.findIndex((p) => p.slug === post?.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Reading time calculation
  function getReadingTime(text: string): number {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }
  const readingTime = post ? getReadingTime(
    Array.isArray(post.content)
      ? post.content.map((block: any) => block.children?.map((c: any) => c.text).join(' ')).join(' ')
      : typeof post.content === 'string' ? post.content : ''
  ) : 1;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Betöltés...</div>;
  }
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <p>Nincs ilyen blogcikk.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-[#ff5c35] text-white rounded-lg font-semibold hover:bg-[#ff5c35]/90 transition">Vissza</button>
      </div>
    );
  }

  // Dinamikus zóna renderelése (csak QuoteBlock támogatott most)
  const renderBodyBlocks = () => {
    if (!Array.isArray((post as any).bodyBlocks)) return null;
    return (post as any).bodyBlocks.map((block: any, i: number) => {
      if (block.__component === 'blog.quote-block' || block.__component === 'blog.quoteblock') {
        return (
          <blockquote key={i} className="brand-quote-block relative">
            <p>{block.text.replace(/^"|"$/g, '')}</p>
            {block.author && <cite>{block.author}</cite>}
          </blockquote>
        );
      }
      // További blokktípusok ide jöhetnek
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      {/* Modern Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <Link
          to="/blog"
          className="mb-8 flex items-center gap-2 text-[#ff5c35] hover:underline font-semibold"
        >
          <ArrowLeft size={20} /> Vissza a bloghoz
        </Link>
        {post.coverImage && (
          <div className="h-72 w-full overflow-hidden rounded-2xl mb-8 bg-[#222]">
            <img
              src={post.coverImage.startsWith('http') ? post.coverImage : `${post.coverImage}`}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <motion.h1
          className="text-4xl font-bold mb-4"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {post.title}
        </motion.h1>
        <div className="mb-6 text-gray-400 text-sm flex flex-wrap gap-4 items-center">
          <span className="font-semibold text-[#ff5c35]">{post.author}</span>
          {post.publishedAt && (
            <span className="text-gray-500 flex items-center gap-2">
              {new Date(post.publishedAt).toLocaleDateString()}
              <span className="flex items-center gap-1 ml-3 text-xs text-gray-400">
                <Clock size={16} className="inline-block text-[#ff5c35]" />
                {readingTime} perc olvasás
              </span>
            </span>
          )}
        </div>
        <div className="prose prose-invert max-w-none text-lg mb-4">
          {/* Dinamikus zóna (QuoteBlock-ok) */}
          {renderBodyBlocks()}
          {/* Mindig jelenjen meg a content mező, ha van */}
          {post.content && (
            <BlogContentRenderer content={post.content} />
          )}
        </div>
        {/* Previous/Next navigation at the bottom */}
        <div className="relative mt-16 border-t border-gray-800 pt-10 min-h-[60px]">
          <div className="flex flex-row justify-between items-center w-full absolute left-0 right-0 px-2 sm:px-0 top-0">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="flex items-center justify-center p-2 rounded-full hover:bg-[#ff5c35]/10 transition"
                aria-label="Előző cikk"
              >
                <ArrowLeftCircle size={44} className="text-[#ff5c35]" />
              </Link>
            ) : <div className="w-[48px]" />} 
            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="flex items-center justify-center p-2 rounded-full hover:bg-[#ff5c35]/10 transition"
                aria-label="Következő cikk"
              >
                <ArrowRightCircle size={44} className="text-[#ff5c35]" />
              </Link>
            ) : <div className="w-[48px]" />}
          </div>
        </div>
        {/* Recent Posts section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-6 text-[#ff5c35]">Legutóbbi cikkek</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {allPosts.filter(p => p.slug !== post.slug).slice(0, 3).map((recent) => (
              <Link
                key={recent.id}
                to={`/blog/${recent.slug}`}
                className="group relative bg-[#181828] rounded-2xl border border-gray-800/60 hover:border-[#ff5c35]/80 shadow-xl transition-all overflow-hidden cursor-pointer flex flex-col"
              >
                {recent.coverImage && (
                  <div className="h-48 w-full overflow-hidden bg-[#222]">
                    <img
                      src={recent.coverImage}
                      alt={recent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col">
                  {/* Kategória badge */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#ff5c35]/10 text-[#ff5c35] tracking-wide uppercase">
                      {Array.isArray(recent.categories) && recent.categories.length > 0 ? recent.categories[0] : 'Cikk'}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2 group-hover:text-[#ff5c35] transition-colors line-clamp-2">{recent.title}</h4>
                  <span className="inline-flex items-center gap-2 text-[#ff5c35] font-semibold group-hover:underline group-hover:gap-3 transition-all text-base mt-2">
                    Tovább olvasom <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 