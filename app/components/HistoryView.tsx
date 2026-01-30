"use client";

import { Plus, Search, MoreVertical, List, LayoutGrid, Download, Edit3, ExternalLink, Trash2 } from "lucide-react";
import { Website } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";

interface HistoryViewProps {
    websites: Website[];
    onOpenCreateModal: () => void;
    onDelete?: (index: number) => void;
}

export default function HistoryView({ websites, onOpenCreateModal, onDelete }: HistoryViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClick = () => setOpenMenuId(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const filteredWebsites = useMemo(() => {
        return websites.filter(site => {
            const matchesSearch = site.title.toLowerCase().includes(searchQuery.toLowerCase());
            let matchesTab = activeTab === "All";
            if (!matchesTab) {
                if (activeTab === "Active") {
                    matchesTab = site.status === "Active" || site.status === "Published";
                } else {
                    matchesTab = site.status === activeTab;
                }
            }
            return matchesSearch && matchesTab;
        });
    }, [websites, searchQuery, activeTab]);

    const stats = useMemo(() => {
        return {
            total: websites.length,
            published: websites.filter(s => s.status === "Active" || s.status === "Published").length,
            drafts: websites.filter(s => s.status === "Draft").length,
            unpublished: websites.filter(s => s.status === "Pending").length,
        };
    }, [websites]);

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
            {/* Hero Banner Section */}
            <div className="relative h-64 w-full overflow-hidden">
                <img
                    src="/topimage.png"
                    alt="banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-white text-[56px] font-black tracking-tighter drop-shadow-2xl">Website</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 space-y-6">
                {/* Stats / Controls */}
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex gap-2">
                        {[
                            { name: "All", count: stats.total },
                            { name: "Active", label: "Published", count: stats.published },
                            { name: "Pending", label: "Unpublished", count: stats.unpublished },
                            { name: "Draft", label: "Drafts", count: stats.drafts }
                        ].map((tab) => {
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`px-5 py-2 rounded-full text-[12px] font-black border transition-all ${isActive ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"}`}
                                >
                                    {tab.label || tab.name} ({tab.count})
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={onOpenCreateModal}
                        className="bg-black text-white px-5 py-2 rounded-full flex items-center gap-2 text-[12px] font-bold transition-transform active:scale-95 shadow-lg"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Create New
                    </button>
                </div>

                {/* Search & Utility */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input
                            type="text"
                            placeholder="Find a website..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-[13px] outline-none focus:border-black transition-colors"
                        />
                    </div>
                    <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-gray-50 text-black shadow-inner" : "text-gray-300 hover:text-gray-500"}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-gray-50 text-black shadow-inner" : "text-gray-300 hover:text-gray-500"}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4 pb-20">
                    <h3 className="text-[14px] font-black text-gray-400 uppercase tracking-widest px-1">Recent Activity</h3>

                    {filteredWebsites.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center space-y-3">
                            <p className="text-gray-400 font-bold">No websites found matching your search.</p>
                            <button onClick={() => { setSearchQuery(""); setActiveTab("All"); }} className="text-sm font-black text-black underline underline-offset-4">Clear all filters</button>
                        </div>
                    ) : (
                        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
                            {filteredWebsites.map((site, i) => (
                                <div key={i} className={`group bg-white border border-gray-100 rounded-2xl hover:border-black/10 hover:shadow-xl transition-all cursor-pointer ${viewMode === "grid" ? "flex flex-col p-0 overflow-hidden" : "flex items-center justify-between p-4"}`}>
                                    <div className={`flex items-center gap-4 ${viewMode === "grid" ? "flex-col items-start gap-0 w-full" : ""}`}>
                                        <div className={`${viewMode === "grid" ? "w-full aspect-[16/10] rounded-none border-b" : "w-12 h-12 rounded-xl"} bg-gray-50 overflow-hidden border border-gray-50 shadow-inner`}>
                                            <img
                                                src={site.image}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt={site.title}
                                            />
                                        </div>
                                        <div className={`space-y-0.5 ${viewMode === "grid" ? "p-5" : ""}`}>
                                            <h4 className="text-[15px] font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{site.title}</h4>
                                            <p className="text-[11px] text-gray-400 font-medium tracking-tight">Edited {site.lastModified || "Just now"}</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-5 ${viewMode === "grid" ? "px-5 pb-5 pt-0 border-t-0 mt-auto justify-between w-full" : "relative"}`}>
                                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${site.status === 'Active' || site.status === 'Published'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : site.status === 'Draft'
                                                ? 'bg-gray-50 text-gray-400 border-gray-100'
                                                : 'bg-orange-50 text-orange-600 border-orange-100'
                                            }`}>
                                            {site.status === 'Active' || site.status === 'Published' ? 'Published' : site.status}
                                        </span>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === ((site as any).slug || i.toString()) ? null : ((site as any).slug || i.toString()));
                                                }}
                                                className="p-1.5 text-gray-300 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {(openMenuId === ((site as any).slug || i.toString())) && (
                                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] py-2 z-[60] animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.location.href = `/builder/${site.type || 'digital'}`;
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-[13px] font-black text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                    >
                                                        <Edit3 size={14} /> Edit Content
                                                    </button>
                                                    {(site as any).slug && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(`/p/${(site as any).slug}`, '_blank')
                                                            }}
                                                            className="w-full px-4 py-2.5 text-left text-[13px] font-black text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                        >
                                                            <ExternalLink size={14} /> View Live Site
                                                        </button>
                                                    )}
                                                    <div className="h-[1px] bg-gray-50 my-1" />
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (onDelete && window.confirm("Are you sure you want to delete this website? This action cannot be undone.")) {
                                                                const actualIndex = websites.findIndex(s => s === site);
                                                                onDelete(actualIndex);
                                                            }
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-[13px] font-black text-red-500 hover:bg-red-50 flex items-center gap-3"
                                                    >
                                                        <Trash2 size={14} /> Delete Website
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
