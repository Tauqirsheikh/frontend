import React from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "warning" | "info";
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    description,
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "destructive",
    loading = false,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const isDestructive = variant === "destructive";

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-[420px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${isDestructive ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400" : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"}`}>
                        {isDestructive ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This action cannot be undone.</p>
                    </div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                    {description}
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 font-semibold text-sm transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 ${isDestructive ? "bg-red-600 hover:bg-red-700 shadow-red-500/10" : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/10"} disabled:opacity-70 text-white rounded-xl py-2.5 font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
