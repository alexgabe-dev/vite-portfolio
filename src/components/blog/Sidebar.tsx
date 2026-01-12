
import React, { useState } from 'react';
import { Search, MapPin, Tag, ChevronRight, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types/blog';

interface SidebarProps {
    categories: string[];
    recentPosts: BlogPost[];
    onSearch: (query: string) => void;
    selectedCategory: string;
    onSelectCategory: (cat: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, recentPosts, onSearch, selectedCategory, onSelectCategory }) => {
    const [email, setEmail] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!privacyAccepted) return;
        // In a real app, send to API
        console.log('Subscribing:', email);
        alert('Köszönjük a feliratkozást!');
        setEmail('');
        setPrivacyAccepted(false);
    };

    return (
        <aside className="space-y-12">
            {/* Search Widget - Minimal */}
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Keresés..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-800 py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5c35] transition-colors"
                />
                <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#ff5c35] transition-colors" />
            </div>

            {/* Local Services Widget - Clean Card */}
            <div className="relative group overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#181827] to-[#0a0a0f] border border-gray-800 transition-colors group-hover:border-[#ff5c35]/30"></div>
                <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-[#ff5c35]/10 rounded-lg text-[#ff5c35]">
                            <MapPin size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Vállalkozásod van?</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Növeld bevételed személyre szabott webes megoldásokkal. Helyi szakértelem, globális minőség.
                    </p>
                    <Link to="/kapcsolat" className="inline-flex items-center text-[#ff5c35] font-semibold text-sm hover:gap-2 transition-all">
                        Ingyenes Konzultáció <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
            </div>

            {/* Categories - List Style */}
            <div>
                <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#ff5c35] rounded-full"></span>
                    Kategóriák
                </h3>
                <div className="space-y-1">
                    <button
                        onClick={() => onSelectCategory('Összes')}
                        className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-all ${selectedCategory === 'Összes' ? 'text-[#ff5c35] font-semibold pl-4' : 'text-gray-400 hover:text-white hover:pl-4'}`}
                    >
                        <span>Összes</span>
                        {selectedCategory === 'Összes' && <ChevronRight size={14} />}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat ? 'text-[#ff5c35] font-semibold pl-4' : 'text-gray-400 hover:text-white hover:pl-4'}`}
                        >
                            <span>{cat}</span>
                            {selectedCategory === cat && <ChevronRight size={14} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Newsletter - Minimal Strip */}
            <div className="bg-[#181827] p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                    <Mail size={18} className="text-[#ff5c35]" />
                    Hírlevél
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                    Hetente egy email a legújabb trendekről. Semmi spam.
                </p>
                <div className="flex gap-2">
                    <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email..."
                            className="w-full bg-[#0a0a0f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5c35] transition-colors"
                        />
                        <div className="mt-4 flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="privacy"
                                checked={privacyAccepted}
                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-600 bg-[#0a0a0f] text-[#ff5c35] focus:ring-[#ff5c35]"
                            />
                            <label htmlFor="privacy" className="text-xs text-gray-400 leading-tight">
                                Elolvastam és elfogadom az <a href="https://vizitor.hu/adatvedelem" target="_blank" rel="noopener noreferrer" className="text-[#ff5c35] hover:underline">Adatvédelmi Tájékoztatót</a>.
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={!privacyAccepted}
                            className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${privacyAccepted ? 'bg-[#ff5c35] text-white hover:bg-[#ff5c35]/90' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                        >
                            Feliratkozás
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
