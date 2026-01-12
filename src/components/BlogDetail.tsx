
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogPostBySlug, fetchBlogPosts } from '../utils/blogApi';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ArrowRight, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin, Copy, ChevronLeft, ChevronRight, Mail, MapPin, BookOpen, Sparkles, Check, Send } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      const currentPost = await fetchBlogPostBySlug(slug);
      if (currentPost) setPost(currentPost);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff5c35] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">Cikk betöltése...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-gray-400 pt-20">
        <p className="text-xl mb-4">Nincs ilyen blogcikk.</p>
        <button onClick={() => navigate('/blog')} className="px-6 py-3 bg-[#ff5c35] text-white rounded-lg font-semibold hover:bg-[#ff5c35]/90 transition">
          Vissza a bloghoz
        </button>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(post.html || '');
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{post.title} - Vizitor.hu Blog</title>
        <meta name="description" content={post.excerpt || post.meta_description || ''} />
      </Helmet>

      <article className="min-h-screen bg-[#0a0a0f] text-white pt-20">
        {/* Hero Section - Full Width */}
        <div className="relative w-full h-[50vh] min-h-[400px] max-h-[550px]">
          {post.feature_image ? (
            <img src={post.feature_image} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#181827] to-[#0a0a0f]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />

          <Link
            to="/blog"
            className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft size={18} /> Vissza
          </Link>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
            <div className="max-w-7xl mx-auto">
              {post.tags?.[0] && (
                <span className="inline-block px-3 py-1 bg-[#ff5c35] text-white text-xs font-bold rounded-lg uppercase tracking-wider mb-4">
                  {post.tags[0].name}
                </span>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-4xl"
              >
                {post.title}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                {post.primary_author && (
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-[#ff5c35]" />
                    <span>{post.primary_author.name}</span>
                  </div>
                )}
                {post.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#ff5c35]" />
                    <span>{new Date(post.published_at).toLocaleDateString('hu-HU')}</span>
                  </div>
                )}
                {post.reading_time && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#ff5c35]" />
                    <span>{post.reading_time} perc</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Column - Article Content */}
            <div className="lg:col-span-8">
              <div
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag size={18} className="text-[#ff5c35]" />
                    {post.tags.map(tag => (
                      <span key={tag.slug} className="px-3 py-1 bg-[#181827] text-gray-300 text-sm rounded-lg border border-gray-700">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prev/Next Navigation */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link to={`/blog/${prevPost.slug}`} className="group p-5 bg-[#181827] rounded-xl border border-gray-800 hover:border-[#ff5c35]/50 transition-all">
                    <div className="flex items-center gap-2 text-[#ff5c35] text-xs mb-2">
                      <ChevronLeft size={14} /> Előző cikk
                    </div>
                    <h4 className="font-semibold text-white group-hover:text-[#ff5c35] transition-colors line-clamp-2 text-sm">
                      {prevPost.title}
                    </h4>
                  </Link>
                ) : <div />}
              </div>
            </div>
            {/* Right Column - Sidebar */}
            <aside className="lg:col-span-4 space-y-8">

              {/* Author Card */}
              {post.primary_author && (
                <div className="bg-[#181827] rounded-2xl p-6 border border-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    {post.primary_author.profile_image ? (
                      <img src={post.primary_author.profile_image} alt={post.primary_author.name} className="w-16 h-16 rounded-full border-2 border-[#ff5c35]" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#ff5c35] flex items-center justify-center text-white text-2xl font-bold">
                        {post.primary_author.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white text-lg">{post.primary_author.name}</h4>
                      <p className="text-gray-400 text-sm">Szerző</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="font-bold text-[#ff5c35]">Analitika.</span>{' '}
                    <span className="font-bold text-[#ff5c35]">Stratégia.</span>{' '}
                    <span className="font-bold text-[#ff5c35]">Eredmény.</span>{' '}
                    <span className="text-gray-500">Ez az, ami meghatároz minden projektemet.</span>
                  </p>
                </div>
              )}

              {/* Share Widget */}
              <div className="bg-[#181827] rounded-2xl p-6 border border-gray-800">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Share2 size={18} className="text-[#ff5c35]" /> Megosztás
                </h4>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-3 bg-[#0a0a0f] hover:bg-[#1877f2] rounded-xl transition-colors flex items-center justify-center"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-3 bg-[#0a0a0f] hover:bg-[#1da1f2] rounded-xl transition-colors flex items-center justify-center"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-3 bg-[#0a0a0f] hover:bg-[#0077b5] rounded-xl transition-colors flex items-center justify-center"
                  >
                    <Linkedin size={20} />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className={`flex-1 p-3 rounded-xl transition-colors flex items-center justify-center ${copied ? 'bg-green-600' : 'bg-[#0a0a0f] hover:bg-[#ff5c35]'}`}
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              {/* CTA Widget */}
              <div className="bg-gradient-to-br from-[#ff5c35] to-[#ff8f35] rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-[#ff5c35]/20">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MapPin size={20} />
                    </div>
                    <h4 className="font-bold text-lg">Weboldalt szeretnél?</h4>
                  </div>
                  <p className="text-white text-sm mb-5 leading-relaxed opacity-95">
                    Weboldalak, amik konvertálnak. SEO, ami hoz. Marketing, ami működik.
                  </p>
                  <Link to="/kapcsolat" className="inline-block w-full py-3.5 bg-white text-[#ff5c35] rounded-xl text-center font-bold hover:bg-gray-100 transition-colors shadow-lg">
                    Kérj Ajánlatot!
                  </Link>
                </div>
              </div>

              {/* Related Posts Widget */}
              {relatedPosts.length > 0 && (
                <div className="bg-[#181827] rounded-2xl p-6 border border-gray-800">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-[#ff5c35]" /> Kapcsolódó cikkek
                  </h4>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 3).map((related) => (
                      <Link key={related.id} to={`/blog/${related.slug}`} className="flex gap-3 group">
                        {related.feature_image && (
                          <img src={related.feature_image} alt={related.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-white text-sm group-hover:text-[#ff5c35] transition-colors line-clamp-2">
                            {related.title}
                          </h5>
                          {related.reading_time && (
                            <span className="text-gray-500 text-xs">{related.reading_time} perc</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}



            </aside>
          </div>
        </div>

        {/* Newsletter Section - Premium Design */}
        <div className="relative py-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff5c35]/5 via-[#0a0a0f] to-[#ff5c35]/10" />
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#ff5c35]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-[#ff5c35]/5 rounded-full blur-[100px]" />

          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="bg-[#181827]/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">

                {/* Left Side - Content */}
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ff5c35]/10 text-[#ff5c35] text-sm font-semibold rounded-full w-fit mb-6">
                    <Sparkles size={14} />
                    Maradj naprakész
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Csatlakozz a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c35] to-[#ff8f35]">hírlevelünkhöz</span>
                  </h2>

                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Kapd meg a legújabb cikkeket, tippeket és exkluzív tartalmakat közvetlenül az inboxodba. Nincs spam, bármikor leiratkozhatsz.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {['Heti frissítések', 'Exkluzív tartalom', 'Korai hozzáférés'].map((feature, index) => (
                      <span key={feature} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a0a0f] border border-gray-800 rounded-full text-sm text-gray-300">
                        <Check size={12} className="text-[#ff5c35]" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex flex-col justify-center">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="email"
                        placeholder="Add meg az email címed"
                        className="w-full bg-[#0a0a0f] border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5c35] focus:ring-2 focus:ring-[#ff5c35]/20 transition-all"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-[#ff5c35] to-[#ff8f35] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff5c35]/20"
                    >
                      Feliratkozás
                      <Send size={18} />
                    </button>

                    <p className="text-center text-xs text-gray-500">
                      A feliratkozással elfogadod az{' '}
                      <a href="https://vizitor.hu/adatvedelem" target="_blank" rel="noopener noreferrer" className="text-[#ff5c35] hover:underline">
                        Adatvédelmi Tájékoztatót
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                Csatlakozz <span className="text-white font-semibold">500+</span> feliratkozóhoz
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Related Posts Section - Premium Design */}
        <div className="relative py-24 overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f17] to-[#0a0a0f]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff5c35]/5 rounded-full blur-[120px]" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-[#ff5c35]/10 text-[#ff5c35] text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
                Olvasd el ezeket is
              </span>
              <h3 className="text-4xl md:text-5xl font-bold">
                További <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c35] to-[#ff8f35]">cikkek</span>
              </h3>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allPosts.filter(p => p.slug !== post.slug).slice(0, 3).map((recent, idx) => (
                <Link
                  key={recent.id}
                  to={`/blog/${recent.slug}`}
                  className="group relative bg-[#181827] rounded-3xl overflow-hidden border border-gray-800/50 hover:border-[#ff5c35]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#ff5c35]/10 hover:-translate-y-2"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {recent.feature_image ? (
                      <img
                        src={recent.feature_image}
                        alt={recent.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#181827] to-[#0a0a0f] flex items-center justify-center">
                        <span className="text-6xl opacity-20">📄</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181827] via-transparent to-transparent opacity-80" />

                    {/* Category Badge */}
                    {recent.tags?.[0] && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/10">
                          {recent.tags[0].name}
                        </span>
                      </div>
                    )}

                    {/* Reading Time Badge */}
                    {recent.reading_time && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-[#ff5c35] text-white text-xs font-bold rounded-lg flex items-center gap-1">
                          <Clock size={12} /> {recent.reading_time} perc
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-gray-500 text-xs mb-4">
                      {recent.published_at && (
                        <span>{new Date(recent.published_at).toLocaleDateString('hu-HU')}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-[#ff5c35] transition-colors duration-300">
                      {recent.title}
                    </h4>

                    {/* Excerpt */}
                    {recent.excerpt && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                        {recent.excerpt}
                      </p>
                    )}

                    {/* Read More */}
                    <div className="flex items-center text-[#ff5c35] font-semibold text-sm">
                      <span className="group-hover:mr-2 transition-all duration-300">Olvass tovább</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ff5c35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#181827] border border-gray-800 rounded-full text-white font-semibold hover:border-[#ff5c35] hover:text-[#ff5c35] transition-all duration-300"
              >
                Összes cikk megtekintése
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogDetail;