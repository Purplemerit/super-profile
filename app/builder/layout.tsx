"use client";

import { BuilderProvider } from "./components/BuilderContext";

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BuilderProvider>
            <div className="min-h-screen bg-white font-sans">
                {children}
            </div>
        </BuilderProvider>
    );
}
