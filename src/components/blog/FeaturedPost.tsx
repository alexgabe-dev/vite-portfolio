
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/blog';

interface FeaturedPostProps {
    post: BlogPost;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[550px] rounded-3xl overflow-hidden mb-16 group cursor-pointer shadow-2xl shadow-black/50"
        >
            <Link to={`/blog/${post.slug}`} className="block w-full h-full relative">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 overflow-hidden">
                    {post.feature_image ? (
                        <img
                            src={post.feature_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#181827]" />
                    )}
                    {/* Gradient Overlay - Smooth transition from bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent opacity-90" />
                </div>

                {/* Content Container */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-20 flex flex-col items-start max-w-4xl">
                    {/* Tag / Featured Badge */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.featured && (
                            <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="px-3 py-1 bg-[#ff5c35] text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-[#ff5c35]/20"
                            >
                                Kiemelt
                            </motion.span>
                        )}
                        {post.tags?.[0] && (
                            <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                            >
                                {post.tags[0].name}
                            </motion.span>
                        )}
                    </div>

                    {/* Title */}
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg"
                    >
                        {post.title}
                    </motion.h1>

                    {/* Meta Info */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-6 text-gray-300 text-sm font-medium"
                    >
                        {post.primary_author && (
                            <div className="flex items-center gap-2">
                                {post.primary_author.profile_image ? (
                                    <img src={post.primary_author.profile_image} alt={post.primary_author.name} className="w-10 h-10 rounded-full border-2 border-white/20" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#ff5c35] flex items-center justify-center text-white font-bold border-2 border-white/20">
                                        {post.primary_author.name[0]}
                                    </div>
                                )}
                                <span className="text-white drop-shadow-md">{post.primary_author.name}</span>
                            </div>
                        )}
                        {post.reading_time && (
                            <span className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                {post.reading_time} perc olvasás
                            </span>
                        )}
                    </motion.div>
                </div>

                {/* Floating Action Button for Read More */}
                <div className="absolute bottom-10 right-10 z-20 hidden md:flex items-center justify-center w-16 h-16 bg-[#ff5c35] rounded-full text-white shadow-lg shadow-[#ff5c35]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-45deg]">
                    <ArrowRight size={28} />
                </div>
            </Link>
        </motion.div>
    );
};

export default FeaturedPost;
