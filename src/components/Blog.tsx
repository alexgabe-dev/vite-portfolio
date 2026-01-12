
import React, { useEffect, useState } from 'react';
import { fetchBlogPosts } from '../utils/blogApi';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Összes');
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const sortOptions = [
    { value: 'newest', label: 'Legújabb elöl' },
    { value: 'oldest', label: 'Legrégibb elöl' },
  ];
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSortDropdownOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    if (sortDropdownOpen) {
      window.addEventListener('keydown', handleKey);
      window.addEventListener('mousedown', handleClick);
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [sortDropdownOpen]);

  // Extract tags as categories
  const allCategories = Array.from(new Set(posts.flatMap(p =>
    p.tags ? p.tags.map(tag => tag.name) : []
  ).filter(Boolean)));

  const filteredPosts = posts.filter(post => {
    const postTags = post.tags ? post.tags.map(t => t.name) : [];
    const matchesCategory = selectedCategory === 'Összes' || postTags.includes(selectedCategory);
    // Simple search in title and excerpt
    const searchText = [post.title, post.excerpt || '', post.meta_description || '']
      .join(' ').toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : new Date(a.created_at).getTime();
    const dateB = b.published_at ? new Date(b.published_at).getTime() : new Date(b.created_at).getTime();
    if (sortOrder === 'newest') return dateB - dateA;
    return dateA - dateB;
  });

  useEffect(() => {
    fetchBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff5c35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-[#ff8f35] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-[25%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 relative z-10">
        <motion.h1
          className="text-5xl font-bold mb-4 text-center"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          Blog
        </motion.h1>
        <motion.p
          className="text-lg text-gray-400 mb-8 text-center max-w-2xl mx-auto"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          Fedezd fel a legfrissebb digitális trendeket, webes tippeket és inspiráló sikersztorikat!
        </motion.p>

        {/* Search & Filter UI - largely same structure */}
        <div className="relative w-full md:w-1/2 mx-auto mb-10 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff5c35]" size={20} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Keresés a blogban..."
              className="w-full pl-12 pr-14 py-3 rounded-lg bg-[#181828] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5c35] transition shadow"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-2 rounded-lg bg-[#181828] text-[#ff5c35] hover:bg-[#ff5c35]/10 transition border border-[#ff5c35]/30"
              onClick={() => setFilterOpen(v => !v)}
            >
              <Filter size={18} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#181828] border border-gray-700 rounded-xl shadow-lg z-20 animate-fadeIn">
                <button
                  className={`w-full text-left px-4 py-2 rounded-t-xl font-semibold transition-all text-sm ${selectedCategory === 'Összes' ? 'bg-[#ff5c35] text-white' : 'text-gray-300 hover:bg-[#ff5c35]/20'}`}
                  onClick={() => { setSelectedCategory('Összes'); setFilterOpen(false); }}
                >
                  Összes
                </button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    className={`w-full text-left px-4 py-2 font-semibold transition-all text-sm ${selectedCategory === cat ? 'bg-[#ff5c35] text-white' : 'text-gray-300 hover:bg-[#ff5c35]/20'}`}
                    onClick={() => { setSelectedCategory(cat); setFilterOpen(false); }}
                  >
                    {cat}
                  </button>
                ))}
                <div className="border-t border-gray-700 my-2"></div>
                <div className="px-4 py-2 relative" ref={sortDropdownRef}>
                  <label className="block text-xs text-gray-400 mb-1 font-semibold">Rendezés</label>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between bg-[#232336] text-white rounded-lg px-3 py-2 mt-1 focus:outline-none border border-[#ff5c35]/20 text-sm hover:bg-[#232336]/80 transition"
                    onClick={() => setSortDropdownOpen(v => !v)}
                  >
                    {sortOptions.find(o => o.value === sortOrder)?.label}
                  </button>
                  {sortDropdownOpen && (
                    <ul className="absolute left-0 right-0 mt-2 bg-[#232336] rounded-lg shadow-lg border border-[#ff5c35]/20 z-30 animate-fadeIn">
                      {sortOptions.map((option) => (
                        <li
                          key={option.value}
                          className={`px-4 py-2 cursor-pointer text-sm transition-colors ${sortOrder === option.value ? 'bg-[#ff5c35] text-white' : 'text-gray-300 hover:bg-[#ff5c35]/20'}`}
                          onClick={() => { setSortOrder(option.value as 'newest' | 'oldest'); setSortDropdownOpen(false); setFilterOpen(false); }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* View Toggle */}
          <div className="flex items-center gap-1 ml-2 bg-[#181828] rounded-lg border border-gray-700 p-1">
            <button
              type="button"
              className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-[#ff5c35] text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              type="button"
              className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-[#ff5c35] text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setView('list')}
            >
              <ListIcon size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Betöltés...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-gray-400">Nincs találat.</div>
        ) : (
          <>
            {view === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {sortedPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    className="group relative bg-[#181828] rounded-2xl border border-gray-800/60 hover:border-[#ff5c35]/80 shadow-xl transition-all overflow-hidden cursor-pointer flex flex-col min-h-[420px]"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -8, boxShadow: '0 8px 32px 0 #ff5c35aa' }}
                  >
                    <Link to={`/blog/${post.slug}`} className="block h-full">
                      {post.feature_image && (
                        <div className="w-full aspect-[4/3] overflow-hidden bg-[#222] rounded-t-2xl">
                          <img
                            src={post.feature_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                          {post.primary_author && (
                            <>
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff5c35]/30 to-[#ff8f35]/30 flex items-center justify-center text-[#ff5c35] font-bold text-sm overflow-hidden">
                                {post.primary_author.profile_image ? <img src={post.primary_author.profile_image} className="w-full h-full object-cover" alt={post.primary_author.name} /> : post.primary_author.name[0]?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-[#ff5c35]">{post.primary_author.name}</span>
                            </>
                          )}
                          {post.published_at && (
                            <span className="text-gray-500">{new Date(post.published_at).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-base mb-4 line-clamp-3 min-h-[60px]">
                          {post.excerpt ? post.excerpt.slice(0, 120) + '...' : ''}
                        </div>
                        <span className="mt-auto inline-flex items-center gap-2 text-[#ff5c35] font-semibold group-hover:underline group-hover:gap-3 transition-all text-base">
                          Tovább olvasom <ArrowRight size={18} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {view === 'list' && (
              <div className="flex flex-col gap-4 md:gap-6">
                {sortedPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    className="group flex flex-row items-center gap-3 py-2 px-2 bg-[#181828] rounded-xl border border-gray-800/60 hover:border-[#ff5c35]/80 shadow-md transition-all overflow-hidden cursor-pointer"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: idx * 0.06 }}
                    whileHover={{ y: -2 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="flex w-full items-center flex-row gap-3">
                      {post.feature_image && (
                        <div className="w-20 h-20 min-w-[80px] min-h-[80px] aspect-square overflow-hidden bg-[#222] rounded-lg">
                          <img
                            src={post.feature_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h2 className="font-bold group-hover:text-[#ff5c35] transition-colors line-clamp-2 text-base mb-0.5">{post.title}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap mb-2">
                          {post.primary_author && <span className="font-semibold text-[#ff5c35] truncate max-w-[80px]">{post.primary_author.name}</span>}
                          {post.published_at && <span className="text-gray-500 truncate">{new Date(post.published_at).toLocaleDateString()}</span>}
                          {post.reading_time && <span className="hidden md:flex items-center gap-1 bg-[#232336] text-[#ff5c35] px-2 py-0.5 rounded-full font-semibold">{post.reading_time} perc</span>}
                        </div>
                        <div className="hidden md:block text-gray-400 text-sm md:text-base line-clamp-2 mb-1">
                          {post.excerpt}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;