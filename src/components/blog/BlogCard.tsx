
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/blog';

interface BlogCardProps {
    post: BlogPost;
    index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col h-full bg-[#181827] rounded-2xl border border-gray-800 hover:border-[#ff5c35]/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff5c35]/10"
        >
            <Link to={`/blog/${post.slug}`} className="block flex-1 flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                    {post.feature_image ? (
                        <img
                            src={post.feature_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                            No Image
                        </div>
                    )}
                    {/* Category Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.tags?.slice(0, 2).map(tag => (
                            <span key={tag.slug} className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/10 shadow-sm">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        {post.published_at && (
                            <span>{new Date(post.published_at).toLocaleDateString('hu-HU')}</span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        {post.reading_time && (
                            <span className="flex items-center gap-1">
                                <Clock size={12} className="text-[#ff5c35]" />
                                {post.reading_time} perc
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#ff5c35] transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center text-[#ff5c35] font-semibold text-sm group-hover:underline">
                        Olvass tovább <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default BlogCard;
