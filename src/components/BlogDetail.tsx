
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogPostBySlug, fetchBlogPosts } from '../utils/blogApi';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle, Clock, ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';

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
    // Fetch all posts for navigation (prev/next) and recent list
    // In a real large blog, you wouldn't fetch all, but Ghost has a small limit by default, 
    // we might want to just fetch 'browse' and 'read' separately properly. 
    // For now we do what we did before but ideally we optimize.
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      // Load the specific post content (including html)
      const currentPost = await fetchBlogPostBySlug(slug);
      if (currentPost) setPost(currentPost);

      // Load recent posts for sidebar/nav
      const posts = await fetchBlogPosts();
      setAllPosts(posts);
      setLoading(false);
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const currentIndex = allPosts.findIndex((p) => p.slug === post?.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

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

  // Ghost returns sanitized HTML usually, but safe to purify
  const sanitizedContent = DOMPurify.sanitize(post.html || '');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      </div>
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <Link
          to="/blog"
          className="mb-8 flex items-center gap-2 text-[#ff5c35] hover:underline font-semibold"
        >
          <ArrowLeft size={20} /> Vissza a bloghoz
        </Link>
        {post.feature_image && (
          <div className="h-72 w-full overflow-hidden rounded-2xl mb-8 bg-[#222]">
            <img
              src={post.feature_image}
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
          {post.primary_author && <span className="font-semibold text-[#ff5c35]">{post.primary_author.name}</span>}
          {post.published_at && (
            <span className="text-gray-500 flex items-center gap-2">
              {new Date(post.published_at).toLocaleDateString()}
              {post.reading_time && (
                <span className="flex items-center gap-1 ml-3 text-xs text-gray-400">
                  <Clock size={16} className="inline-block text-[#ff5c35]" />
                  {post.reading_time} perc olvasás
                </span>
              )}
            </span>
          )}
        </div>

        {/* Ghost Content */}
        <div className="prose prose-invert max-w-none text-lg mb-4 ghost-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

        {/* Navigation */}
        <div className="relative mt-16 border-t border-gray-800 pt-10 min-h-[60px]">
          <div className="flex flex-row justify-between items-center w-full absolute left-0 right-0 px-2 sm:px-0 top-0">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="flex items-center justify-center p-2 rounded-full hover:bg-[#ff5c35]/10 transition">
                <ArrowLeftCircle size={44} className="text-[#ff5c35]" />
              </Link>
            ) : <div className="w-[48px]" />}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="flex items-center justify-center p-2 rounded-full hover:bg-[#ff5c35]/10 transition">
                <ArrowRightCircle size={44} className="text-[#ff5c35]" />
              </Link>
            ) : <div className="w-[48px]" />}
          </div>
        </div>

        {/* Recent */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-6 text-[#ff5c35]">Legutóbbi cikkek</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {allPosts.filter(p => p.slug !== post.slug).slice(0, 3).map((recent) => (
              <Link key={recent.id} to={`/blog/${recent.slug}`} className="group relative bg-[#181828] rounded-2xl border border-gray-800/60 hover:border-[#ff5c35]/80 shadow-xl transition-all overflow-hidden flex flex-col">
                {recent.feature_image && (
                  <div className="h-48 w-full overflow-hidden bg-[#222]">
                    <img src={recent.feature_image} alt={recent.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                )}
                <div className="p-6 flex flex-col">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#ff5c35]/10 text-[#ff5c35] tracking-wide uppercase">
                      {recent.tags?.[0]?.name || 'Cikk'}
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