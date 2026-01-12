
import React, { useEffect, useState } from 'react';
import { fetchBlogPosts } from '../utils/blogApi';
import { BlogPost } from '../types/blog';
import { motion } from 'framer-motion';
import FeaturedPost from './blog/FeaturedPost';
import BlogCard from './blog/BlogCard';
import Sidebar from './blog/Sidebar';
import { Helmet } from 'react-helmet';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Összes');

  useEffect(() => {
    fetchBlogPosts().then((data) => {
      const sorted = data.sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return dateB - dateA;
      });
      setPosts(sorted);
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(posts.flatMap(p => p.tags ? p.tags.map(t => t.name) : [])));

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'Összes' || (post.tags && post.tags.some(t => t.name === selectedCategory));
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.featured) || posts[0];
  // If searching or filtering, show all matches. If standard view, exclude featured post from list ONLY if it was found via the featured flag or if it's the first one.
  const isDefaultView = !search && selectedCategory === 'Összes';
  const listPosts = isDefaultView ? filteredPosts.filter(p => p.id !== featuredPost?.id) : filteredPosts;

  return (
    <>
      <Helmet>
        <title>Blog - Vizitor.hu | Webfejlesztés</title>
        <meta name="description" content="Szakmai cikkek, esettanulmányok és digitális trendek." />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-20 relative">
        {/* Background - Subtle */}
        <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-[#ff5c35]/5 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#ff5c35] border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-gray-500 font-medium">Cikkek betöltése...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Featured Post (Only on default view) */}
              {isDefaultView && featuredPost && (
                <FeaturedPost post={featuredPost} />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Main Content */}
                <div className="lg:col-span-8">
                  <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-4">
                    <h2 className="text-3xl font-bold text-white relative">
                      {selectedCategory === 'Összes' ? 'Legfrissebbek' : selectedCategory}
                      <span className="absolute -bottom-4 left-0 w-1/3 h-1 bg-[#ff5c35]"></span>
                    </h2>
                    <span className="text-gray-500 text-sm">
                      {listPosts.length} cikk
                    </span>
                  </div>

                  {listPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                      {listPosts.map((post, idx) => (
                        <BlogCard key={post.id} post={post} index={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Nincs találat</h3>
                      <p className="text-gray-400 mb-6">Próbálj más keresőszót vagy kategóriát.</p>
                      <button
                        onClick={() => { setSearch(''); setSelectedCategory('Összes'); }}
                        className="px-6 py-2 bg-[#ff5c35]/10 text-[#ff5c35] rounded-full hover:bg-[#ff5c35] hover:text-white transition-all font-semibold"
                      >
                        Vissza az összeshez
                      </button>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 pl-0 lg:pl-8 border-l border-gray-800/50">
                  <Sidebar
                    categories={categories}
                    recentPosts={posts.slice(0, 5)}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onSearch={setSearch}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;