"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HistoryView from "./components/HistoryView";
import CreateWebsiteModal from "./components/CreateWebsiteModal";
import { FlowType } from "@/lib/types";

export default function App() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [websites, setWebsites] = useState([]);

    useEffect(() => {
        const rawData = localStorage.getItem('websites_list');
        if (rawData !== null) {
            setWebsites(JSON.parse(rawData));
        } else {
            // Default Demo Data
            setWebsites([
                {
                    title: "Project Alpha - Final Version",
                    price: "₹1,999",
                    sale: "12",
                    revenue: "₹23,988",
                    status: "Active",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426",
                    lastModified: "12 mins ago",
                    type: "digital"
                },
                {
                    title: "Store - New Collection 2024",
                    price: "₹4,500",
                    sale: "5",
                    revenue: "₹22,500",
                    status: "Active",
                    image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=2371",
                    lastModified: "1 hour ago",
                    type: "list"
                },
                {
                    title: "Mastering React Component Patterns",
                    price: "₹899",
                    sale: "89",
                    revenue: "₹80,011",
                    status: "Draft",
                    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=2422",
                    lastModified: "1 day ago",
                    type: "digital"
                },
                {
                    title: "Fitness & Nutrition Plan V2",
                    price: "₹4,999",
                    sale: "0",
                    revenue: "₹0",
                    status: "Draft",
                    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2370",
                    lastModified: "3 days ago",
                    type: "digital"
                }
            ] as any);
        }
    }, []);

    const handleDelete = (index: number) => {
        if (index === -1) return;
        const target = websites[index] as any;
        if (target && target.slug) {
            localStorage.removeItem(`website_${target.slug}`);
        }
        const newList = [...websites];
        newList.splice(index, 1);
        setWebsites(newList);
        localStorage.setItem('websites_list', JSON.stringify(newList));
    };

    const handleSelectFlow = (id: FlowType) => {
        setIsModalOpen(false);
        router.push(`/builder/${id}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <HistoryView
                websites={websites as any}
                onOpenCreateModal={() => setIsModalOpen(true)}
                onDelete={handleDelete}
            />
            {isModalOpen && (
                <CreateWebsiteModal
                    onClose={() => setIsModalOpen(false)}
                    onSelectFlow={handleSelectFlow}
                />
            )}
        </div>
    );
}
