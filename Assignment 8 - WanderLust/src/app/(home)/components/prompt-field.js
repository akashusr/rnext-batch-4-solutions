"use client";

import { createPlan } from "@/actions/plan";
import { Bot, Info } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import GlowEffect from "./gloweffect";
import QuickSuggestionsTag from "./quick-suggestions-tag";
import SubmitButton from "./submit-button";

export default function PromptField() {
    const [state, formAction] = useFormState(createPlan, null);
    const textareaRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const handleKeyDown = (e) => {
            // Check for Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (formRef.current) {
                    formRef.current.requestSubmit();
                }
            }
        };

        textarea.addEventListener("keydown", handleKeyDown);

        return () => {
            textarea.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            {/* Error Message */}
            {state?.error && (
                <div
                    className={`my-5 mb-4 flex w-full max-w-3xl items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800`}>
                    <span>
                        <Info />
                    </span>
                    <p>{state?.error}</p>
                </div>
            )}

            <div className="group relative z-20 mb-24 w-full max-w-3xl">
                {/* Glow Effect */}
                <GlowEffect />
                {/* form  */}
                <form
                    ref={formRef}
                    action={formAction}
                    className="relative flex items-start rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                    <div className="p-4 pt-5">
                        <Bot className="h-7 w-7 text-emerald-600" />
                    </div>
                    <textarea
                        ref={textareaRef}
                        className="h-[140px] w-full resize-none border-none bg-transparent px-3 py-4 text-lg leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                        placeholder="e.g. A romantic 4-day trip to Paris in Spring, focusing on art museums and hidden cafes..."
                        name="prompt"
                    />
                    <SubmitButton />
                </form>
                {/* Quick Suggestion Tags */}
                <QuickSuggestionsTag />
            </div>
        </>
    );
}
