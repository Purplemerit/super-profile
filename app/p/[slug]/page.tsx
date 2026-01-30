"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormData } from "@/lib/types";
import {
    ImageIcon, Users, Instagram, Twitter, Store
} from "lucide-react";

export default function PublicProductPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [formData, setFormData] = useState<FormData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = localStorage.getItem(`website_${slug}`);
        if (data) {
            setFormData(JSON.parse(data));
        }
        setLoading(false);
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center font-black">Loading...</div>;
    if (!formData) return <div className="h-screen flex items-center justify-center font-black text-red-500">Website not found / published yet.</div>;

    const isDark = formData.darkTheme;
    const themeStyles = {
        tech: { bg: 'bg-[#0F172A]', text: 'text-white', sub: 'text-gray-400', font: "'Space Mono', monospace", border: 'border-white/10' },
        dawn: { bg: 'bg-[#FFF7ED]', text: 'text-gray-900', sub: 'text-gray-500', font: 'inherit', border: 'border-orange-100' },
        dusk: { bg: 'bg-[#1E1B4B]', text: 'text-white', sub: 'text-gray-400', font: 'inherit', border: 'border-white/10' },
        default: { bg: isDark ? 'bg-[#121212]' : 'bg-white', text: isDark ? 'text-white' : 'text-gray-900', sub: isDark ? 'text-gray-400' : 'text-gray-500', font: 'inherit', border: isDark ? 'border-white/10' : 'border-gray-100' }
    };

    const style = themeStyles[formData.themeId as keyof typeof themeStyles] || themeStyles.default;
    const brandColor = formData.brandColor || '#000000';

    return (
        <div
            className={`min-h-screen ${style.bg} ${style.text} transition-all duration-700`}
            style={{
                backgroundImage: formData.customBgImage ? `linear-gradient(rgba(${isDark || formData.themeId === 'tech' || formData.themeId === 'dusk' ? '0,0,0' : '255,255,255'}, 0.8), rgba(${isDark || formData.themeId === 'tech' || formData.themeId === 'dusk' ? '0,0,0' : '255,255,255'}, 0.8)), url(${formData.customBgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: style.font
            }}
        >
            <div className="max-w-3xl mx-auto py-24 px-8 flex flex-col items-center gap-20">
                {/* Hero */}
                <header className="flex flex-col items-center text-center gap-10 w-full">
                    {formData.digitalFilesImage || formData.coverImage ? (
                        <div className="w-full aspect-[16/9] rounded-[48px] overflow-hidden shadow-2xl border border-white/10 relative group">
                            <img src={formData.digitalFilesImage || formData.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Cover" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    ) : null}
                    <div className="space-y-6 max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">{formData.title}</h1>
                        <p className={`text-lg md:text-xl font-medium leading-relaxed ${style.sub}`}>
                            {formData.description || formData.productDescription}
                        </p>
                        <div className="flex flex-col items-center gap-4 pt-4">
                            <button
                                className="px-14 py-6 rounded-full text-xl font-black shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all w-full md:w-auto min-w-[300px]"
                                style={{
                                    backgroundColor: brandColor,
                                    color: '#FFFFFF'
                                }}
                            >
                                {formData.cta || "Get It Now"} • ₹{formData.price}
                            </button>
                            {formData.pppEnabled && formData.discountPrice && (
                                <p className="text-sm font-bold text-green-500 bg-green-500/10 px-4 py-2 rounded-full">
                                    Special Offer: Save {Math.round((1 - Number(formData.discountPrice) / Number(formData.price)) * 100)}% Today
                                </p>
                            )}
                        </div>
                    </div>
                </header>

                {/* Product List / Collection */}
                <section className="w-full space-y-12">
                    {formData.products && formData.products.length > 0 ? (
                        <div className="grid gap-10">
                            {formData.products.map((product) => (
                                <div key={product.id} className={`group p-8 md:p-10 rounded-[48px] border ${style.border} ${isDark ? 'bg-white/5' : 'bg-gray-50/50'} backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500`}>
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="w-full md:w-[45%] aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-lg relative">
                                            {product.image ? (
                                                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                    <Store size={60} strokeWidth={1} />
                                                </div>
                                            )}
                                            <div className="absolute top-6 left-6">
                                                <div className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur text-black text-[10px] font-black uppercase tracking-widest border border-white shadow-lg">Premium</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center space-y-6">
                                            <div className="space-y-3">
                                                <h3 className="text-3xl md:text-4xl font-black tracking-tight">{product.title}</h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Digital Access</div>
                                                    <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">Best Seller</div>
                                                </div>
                                            </div>
                                            <p className={`text-lg leading-relaxed ${style.sub}`}>{product.description}</p>
                                            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1 font-sans">Lifetime Access</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-4xl font-black">₹{product.price}</span>
                                                        {formData.discountPrice && <span className="text-lg text-gray-400 line-through">₹{Number(product.price) * 2}</span>}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => alert("Redirecting to secure checkout...")}
                                                    className="px-10 py-5 rounded-[24px] font-black text-white shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg uppercase tracking-widest"
                                                    style={{ backgroundColor: brandColor }}
                                                >
                                                    Unlock Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`p-10 rounded-[48px] border ${style.border} ${isDark ? 'bg-white/5' : 'bg-gray-50/50'} backdrop-blur-xl shadow-xl space-y-8`}>
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="w-full md:w-[48%] aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-lg">
                                    <img src={formData.digitalFilesImage || formData.coverImage} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center space-y-6">
                                    <h3 className="text-3xl md:text-4xl font-black tracking-tight">{formData.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Digital Content</div>
                                        <div className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">Instant Access</div>
                                    </div>
                                    <p className={`text-lg leading-relaxed ${style.sub}`}>{formData.productDescription || formData.description}</p>
                                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Limited Offer</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black">₹{formData.price}</span>
                                                {formData.discountPrice && <span className="text-lg text-gray-400 line-through">₹{formData.price}</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => alert("Redirecting to secure checkout...")}
                                            className="px-8 py-4 rounded-2xl font-black text-white shadow-xl hover:-translate-y-1 transition-all"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* FAQ / Experience */}
                {formData.faqs && formData.faqs.length > 0 && (
                    <section className="w-full space-y-10">
                        <div className="text-center space-y-3">
                            <h3 className="text-4xl font-black">What's Inside?</h3>
                            <p className={`text-lg ${style.sub}`}>Common questions and detailed insights</p>
                        </div>
                        <div className="grid gap-6">
                            {formData.faqs.map((faq, i) => (
                                <div key={i} className={`p-10 rounded-[40px] border ${style.border} ${isDark ? 'bg-white/5' : 'bg-white'} shadow-xl hover:scale-[1.01] transition-all`}>
                                    <h4 className="text-2xl font-black mb-4">{faq.question}</h4>
                                    <p className={`text-lg leading-relaxed ${style.sub}`}>{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className={`w-full py-24 border-t ${style.border} flex flex-col items-center gap-12`}>
                    <div className="flex items-center gap-8">
                        {formData.socialInstagram && (
                            <a href={`https://instagram.com/${formData.socialInstagram}`} target="_blank" className="w-16 h-16 flex items-center justify-center bg-white shadow-2xl rounded-3xl text-pink-500 hover:scale-110 hover:-rotate-6 transition-all border border-gray-100">
                                <Instagram size={30} />
                            </a>
                        )}
                        {formData.socialTwitter && (
                            <a href={`https://twitter.com/${formData.socialTwitter}`} target="_blank" className="w-16 h-16 flex items-center justify-center bg-white shadow-2xl rounded-3xl text-blue-400 hover:scale-110 hover:rotate-6 transition-all border border-gray-100">
                                <Twitter size={30} />
                            </a>
                        )}
                    </div>
                    <div className="text-center space-y-4">
                        <p className="font-black text-[12px] opacity-30 tracking-[0.4em] uppercase">{formData.footerText || "Powered by SuperProfile"}</p>
                        <div className="h-1.5 w-12 bg-gray-200 rounded-full mx-auto" style={{ backgroundColor: brandColor }} />
                    </div>
                </footer>
            </div>
        </div>
    );
}
