"use client";

import { Check, Copy, Globe, Edit3 } from "lucide-react";

interface SuccessModalProps {
    onEdit: () => void;
}

export default function SuccessModal({ onEdit }: SuccessModalProps) {
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="bg-white max-w-[620px] w-full rounded-[60px] p-20 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
                <div className="w-28 h-28 rounded-full bg-green-50 flex items-center justify-center mb-10 shadow-inner">
                    <Check size={54} strokeWidth={3} className="text-green-500" />
                </div>
                <h1 className="text-[52px] font-black tracking-tighter leading-tight mb-6">Your website is live!</h1>
                <p className="text-gray-400 font-bold text-lg mb-14 leading-relaxed">Congratulations! Your website has been successfully generated and is ready to share with the world.</p>

                <div className="w-full bg-[#FCFCFD] border border-gray-100 rounded-[35px] p-8 space-y-4 shadow-sm mb-12">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Your Website URL</p>
                    <div className="bg-white px-6 py-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-inner">
                        <span className="text-[16px] font-bold text-gray-700">https://my-website.superprofile.app</span>
                        <Copy size={22} className="text-gray-300 cursor-pointer hover:text-black transition-all" />
                    </div>
                </div>

                <div className="flex gap-5 w-full">
                    <button className="flex-1 bg-black text-white py-6 rounded-[30px] font-black text-lg shadow-2xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                        <Globe size={24} /> Visit Website
                    </button>
                    <button onClick={onEdit} className="flex-1 bg-white text-black py-6 border border-gray-100 rounded-[30px] font-black text-lg shadow-md hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                        <Edit3 size={24} /> Edit Content
                    </button>
                </div>
            </div>
        </div>
    );
}
