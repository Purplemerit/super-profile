"use client";

import { useParams, useRouter } from "next/navigation";
import { useBuilder } from "../components/BuilderContext";
import DigitalProductFlow from "@/app/components/builder/DigitalProductFlow";
import ListProductFlow from "@/app/components/builder/ListProductFlow";
import { FlowType } from "@/lib/types";

export default function BuilderFlowPage() {
    const params = useParams();
    const router = useRouter();
    const type = params.type as FlowType;

    const {
        formData, setFormData,
        step, setStep,
        subStep, setSubStep,
        isLive, setIsLive,
        resetBuilder
    } = useBuilder();

    const onNext = () => {
        if (type === "digital") {
            if (step < 3) setStep(step + 1);
            else setIsLive(true);
        } else if (type === "list") {
            if (step === 1) setStep(2);
            else if (step === 2) {
                if (subStep < 3) setSubStep(subStep + 1);
                else setStep(3);
            } else if (step === 3) {
                setIsLive(true);
            }
        }
    };

    const onBack = () => {
        if (step === 1) router.push("/");
        else if (step === 2) {
            if (subStep > 1) setSubStep(subStep - 1);
            else setStep(1);
        } else if (step === 3) {
            setStep(2);
            setSubStep(3);
        }
    };

    const onCancel = () => {
        resetBuilder();
        router.push("/");
    };

    if (type === "list") {
        return (
            <ListProductFlow
                formData={formData}
                setFormData={setFormData}
                step={step}
                subStep={subStep}
                onNext={onNext}
                onBack={onBack}
                onCancel={onCancel}
                isLive={isLive}
                setIsLive={setIsLive}
                setSubStep={setSubStep}
                setStep={setStep}
            />
        );
    }

    return (
        <DigitalProductFlow
            formData={formData}
            setFormData={setFormData}
            step={step}
            onNext={onNext}
            onBack={onBack}
            onCancel={onCancel}
            isLive={isLive}
            setIsLive={setIsLive}
        />
    );
}
