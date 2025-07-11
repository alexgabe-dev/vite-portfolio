import React, { useEffect, useState } from 'react';
import { fetchBlogPosts } from '../utils/blogApi';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import BlogContentRenderer from './BlogContentRenderer';

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

  // Dropdown zárása ESC-re vagy fókuszvesztésre
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

  // Get all unique categories from posts (support both relation objects and string arrays)
  const allCategories = Array.from(new Set(posts.flatMap(p =>
    Array.isArray(p.categories)
      ? p.categories.map((cat: any) => typeof cat === 'object' && cat !== null ? cat.name : cat)
      : []
  ).filter(Boolean)));

  // Filtered posts by search and category
  const filteredPosts = posts.filter(post => {
    const postCategoryNames = Array.isArray(post.categories)
      ? post.categories.map((cat: any) => typeof cat === 'object' && cat !== null ? cat.name : cat)
      : [];
    const matchesCategory = selectedCategory === 'Összes' || postCategoryNames.includes(selectedCategory);
    const searchText = [post.title, post.metaDescription, post.excerpt, Array.isArray(post.content) ? post.content.map((block: any) => block.children?.map((c: any) => c.text).join(' ')).join(' ') : '']
      .join(' ').toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Rendezés a sortOrder alapján
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  useEffect(() => {
    fetchBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-24 relative overflow-hidden">
      {/* Modern Background Effect */}
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
          Fedezd fel a legfrissebb digitális trendeket, webes tippeket és inspiráló sikersztorikat! Olvass, tanulj, fejlődj – és hozd ki a legtöbbet vállalkozásodból vagy projektedből!
        </motion.p>
        {/* Search Bar with Filter Button and View Toggle */}
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
              aria-label="Szűrés kategóriára"
            >
              <Filter size={18} />
            </button>
            {/* Filter Dropdown */}
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
                    aria-haspopup="listbox"
                    aria-expanded={sortDropdownOpen}
                  >
                    {sortOptions.find(o => o.value === sortOrder)?.label}
                    <svg className={`ml-2 w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {sortDropdownOpen && (
                    <ul
                      tabIndex={-1}
                      className="absolute left-0 right-0 mt-2 bg-[#232336] rounded-lg shadow-lg border border-[#ff5c35]/20 z-30 animate-fadeIn"
                      role="listbox"
                    >
                      {sortOptions.map((option, idx) => (
                        <li
                          key={option.value}
                          role="option"
                          aria-selected={sortOrder === option.value}
                          className={`px-4 py-2 cursor-pointer flex items-center gap-2 text-sm transition-colors ${sortOrder === option.value ? 'bg-[#ff5c35] text-white' : 'text-gray-300 hover:bg-[#ff5c35]/20'}`}
                          onClick={() => { setSortOrder(option.value as 'newest' | 'oldest'); setSortDropdownOpen(false); setFilterOpen(false); }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSortOrder(option.value as 'newest' | 'oldest'); setSortDropdownOpen(false); setFilterOpen(false);
                            }
                          }}
                          tabIndex={0}
                        >
                          {sortOrder === option.value && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          )}
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
              aria-label="Rács nézet"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              type="button"
              className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-[#ff5c35] text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setView('list')}
              aria-label="Lista nézet"
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
            {/* GRID NÉZET */}
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
                      {post.coverImage && (
                        <div className="w-full aspect-[4/3] overflow-hidden bg-[#222] rounded-t-2xl">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col h-full">
                       
                        {/* Szerző és dátum */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff5c35]/30 to-[#ff8f35]/30 flex items-center justify-center text-[#ff5c35] font-bold text-sm">
                            {post.author?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-semibold text-[#ff5c35]">{post.author}</span>
                          {post.publishedAt && (
                            <span className="text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                        {/* MetaDescription vagy fallback */}
                        <div className="text-gray-400 text-base mb-4 line-clamp-3 min-h-[60px]">
                          {post.metaDescription && post.metaDescription.length > 0 ? (
                            post.metaDescription.length > 120
                              ? post.metaDescription.slice(0, 120) + '…'
                              : post.metaDescription
                          ) : post.excerpt && post.excerpt.length > 0 ? (
                            post.excerpt.length > 120
                              ? post.excerpt.slice(0, 120) + '…'
                              : post.excerpt
                          ) : (
                            <BlogContentRenderer content={Array.isArray(post.content) ? [post.content[0]] : typeof post.content === 'string' ? post.content?.slice(0, 120) : ''} />
                          )}
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
            {/* LIST NÉZET */}
            {view === 'list' && (
              <div className="flex flex-col gap-4 md:gap-6">
                {sortedPosts.map((post, idx) => {
                  // Reading time calculation (200 words/min)
                  const getReadingTime = (text: string) => {
                    const words = text.split(/\s+/).length;
                    return Math.max(1, Math.round(words / 200));
                  };
                  const readingTime = getReadingTime(
                    Array.isArray(post.content)
                      ? post.content.map((block: any) => block.children?.map((c: any) => c.text).join(' ')).join(' ')
                      : typeof post.content === 'string' ? post.content : ''
                  );
                  let category = 'Cikk';
                  if (Array.isArray(post.categories) && post.categories.length > 0) {
                    const cat = post.categories[0];
                    if (typeof cat === 'object' && cat !== null && 'name' in cat) {
                      category = (cat as { name: string }).name;
                    } else if (typeof cat === 'string') {
                      category = cat;
                    }
                  }
                  return (
                    <motion.div
                      key={post.id}
                      className="group flex flex-row items-center gap-3 py-2 px-2 bg-[#181828] rounded-xl border border-gray-800/60 hover:border-[#ff5c35]/80 shadow-md transition-all overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-[#ff5c35]/60"
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -2, boxShadow: '0 2px 12px 0 #ff5c35aa' }}
                    >
                      <Link to={`/blog/${post.slug}`} className="flex w-full items-center flex-row gap-3 group outline-none focus:ring-2 focus:ring-[#ff5c35]/60">
                        {post.coverImage && (
                          <div className="w-20 h-20 min-w-[80px] min-h-[80px] aspect-square overflow-hidden bg-[#222] rounded-lg">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {/* Content */}
                       <div className="flex-1 flex flex-col justify-center min-w-0">
                         {/* Title */}
                         <h2 className="font-bold group-hover:text-[#ff5c35] transition-colors line-clamp-2 text-base mb-0.5">{post.title}</h2>
                         {/* Meta row: compact on mobile, as before on desktop */}
                         <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap mb-2">
                           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ff5c35]/30 to-[#ff8f35]/30 flex items-center justify-center text-[#ff5c35] font-bold text-xs">
                             {post.author?.[0]?.toUpperCase()}
                           </div>
                           <span className="font-semibold text-[#ff5c35] truncate max-w-[80px]">{post.author}</span>
                           {post.publishedAt && (
                             <span className="text-gray-500 truncate">{new Date(post.publishedAt).toLocaleDateString()}</span>
                           )}
                           {/* Desktop/tablet only: Reading time and category badge */}
                           <span className="hidden md:flex items-center gap-1 bg-[#232336] text-[#ff5c35] px-2 py-0.5 rounded-full font-semibold">
                             <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             {readingTime} perc
                           </span>
                         </div>
                         {/* Desktop/tablet only: Description */}
                         <div className="hidden md:block text-gray-400 text-sm md:text-base line-clamp-2 mb-1">
                           {post.metaDescription && post.metaDescription.length > 0 ? (
                             post.metaDescription.length > 120
                               ? post.metaDescription.slice(0, 120) + '…'
                               : post.metaDescription
                           ) : post.excerpt && post.excerpt.length > 0 ? (
                             post.excerpt.length > 120
                               ? post.excerpt.slice(0, 120) + '…'
                               : post.excerpt
                           ) : (
                             <BlogContentRenderer content={Array.isArray(post.content) ? [post.content[0]] : typeof post.content === 'string' ? post.content?.slice(0, 120) : ''} />
                           )}
                         </div>
                       </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog; 