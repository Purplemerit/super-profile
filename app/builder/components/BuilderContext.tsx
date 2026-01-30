"use client";

import React, { createContext, useContext, useState } from "react";
import { FlowType, FormData } from "@/lib/types";

interface BuilderContextType {
    flowType: FlowType;
    setFlowType: (type: FlowType) => void;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    subStep: number;
    setSubStep: React.Dispatch<React.SetStateAction<number>>;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    isLive: boolean;
    setIsLive: (isLive: boolean) => void;
    resetBuilder: () => void;
}

const initialFormData: FormData = {
    title: "",
    category: "",
    cta: "Get It Now",
    description: "",
    pricingType: "fixed",
    price: "",
    discountPrice: "",
    pppEnabled: true,
    limitPurchases: true,
    themeId: "default",
    buttonColor: "#000000",
    buttonTextColor: "#FFFFFF",
    paymentPageFor: "Website Link",
    websiteLink: "",
    compulsoryBuy: false,
    customPageUrl: "",
    pageExpiry: false,
    darkTheme: false,
    deactivateSales: false,
    trackingToggle: false,
    brandColor: "#000000"
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
    const [flowType, setFlowType] = useState<FlowType>("digital");
    const [step, setStep] = useState(1);
    const [subStep, setSubStep] = useState(1);
    const [isLive, setIsLive] = useState(false);
    const [formData, setFormData] = useState<FormData>(initialFormData);

    // Auto-save & Restore Draft
    React.useEffect(() => {
        const savedDraft = localStorage.getItem('builder_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setFormData(parsed.formData || initialFormData);
                setStep(parsed.step || 1);
                setSubStep(parsed.subStep || 1);
                setFlowType(parsed.flowType || "digital");
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, []);

    React.useEffect(() => {
        if (!isLive) {
            localStorage.setItem('builder_draft', JSON.stringify({ formData, step, subStep, flowType }));
        }
    }, [formData, step, subStep, flowType, isLive]);

    const resetBuilder = () => {
        setStep(1);
        setSubStep(1);
        setIsLive(false);
        setFormData(initialFormData);
        localStorage.removeItem('builder_draft');
    };

    return (
        <BuilderContext.Provider value={{
            flowType, setFlowType,
            step, setStep,
            subStep, setSubStep,
            formData, setFormData,
            isLive, setIsLive,
            resetBuilder
        }}>
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const context = useContext(BuilderContext);
    if (context === undefined) {
        throw new Error("useBuilder must be used within a BuilderProvider");
    }
    return context;
}
