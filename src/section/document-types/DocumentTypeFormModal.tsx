import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";

interface DocType {
    id: number;
    documentTypeName: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
}

interface DocumentTypeFormModalProps {
    isOpen: boolean;
    editingType: DocType | null;
    submitting: boolean;
    onClose: () => void;
    onSubmit: (data: { documentTypeName: string; description?: string; isActive?: boolean }) => void;
}

export const DocumentTypeFormModal: React.FC<DocumentTypeFormModalProps> = ({
    isOpen,
    editingType,
    submitting,
    onClose,
    onSubmit,
}) => {
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (editingType) {
            setValue("documentTypeName", editingType.documentTypeName);
            setValue("description", editingType.description || "");
            setValue("isActive", editingType.isActive);
        } else {
            reset({ documentTypeName: "", description: "", isActive: true });
        }
    }, [editingType, isOpen, setValue, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-[450px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {editingType ? "Edit Document Type" : "Add Document Type"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Document Type Name *
                        </label>
                        <input
                            {...register("documentTypeName", { required: true })}
                            placeholder="e.g. Invoice, Contract, Report..."
                            className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Enter a brief description..."
                            rows={3}
                            className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300 resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 select-none">
                        <input
                            type="checkbox"
                            id="isActive"
                            {...register("isActive")}
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#18beb8] focus:ring-[#18beb8]/20 cursor-pointer"
                        />
                        <label
                            htmlFor="isActive"
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                            Active status
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-3 font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-[#18beb8] hover:bg-[#129a95] disabled:bg-[#18beb8]/70 text-white rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
