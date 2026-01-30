"use client";

interface DevicePreviewProps {
    device: "laptop" | "phone";
    children: React.ReactNode;
}

export default function DevicePreview({ device, children }: DevicePreviewProps) {
    return (
        <div className={`relative transition-all duration-700 ease-in-out ${device === "laptop" ? "w-[94%] aspect-[1.6] max-w-[800px]" : "w-[280px] h-[580px]"}`}>
            <div className={`w-full h-full bg-white rounded-[24px] border-[10px] border-[#1A1A1A] shadow-2xl relative flex flex-col overflow-hidden ${device === "phone" ? "rounded-[32px] border-[12px]" : ""}`}>
                <div className={`flex-1 bg-white overflow-y-auto flex flex-col scrollbar-hide ${device === 'laptop' ? 'p-10' : 'p-6'}`}>
                    {children}
                </div>
            </div>
            {device === "laptop" && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[104%] h-3 bg-[#2D3436] rounded-full opacity-90" />}
        </div>
    );
}
