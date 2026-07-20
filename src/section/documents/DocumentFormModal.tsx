import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Upload } from "lucide-react";

interface DocumentFormModalProps {
    isOpen: boolean;
    editingDoc: any | null;
    docTypes: any[];
    uploading: boolean;
    onClose: () => void;
    onSubmit: (data: any, file: File | null) => void;
}

export const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
    isOpen,
    editingDoc,
    docTypes,
    uploading,
    onClose,
    onSubmit,
}) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        setSelectedFile(null);
        if (editingDoc) {
            setValue("documentName", editingDoc.documentName);
            setValue("description", editingDoc.description || "");
            setValue("documentTypeId", editingDoc.documentTypeId || "");
        } else {
            reset({
                documentName: "",
                description: "",
                documentTypeId: "",
            });
        }
    }, [editingDoc, isOpen, setValue, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleFormSubmit = (data: any) => {
        onSubmit(data, selectedFile);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-[500px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {editingDoc ? "Edit Document" : "Upload New Document"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Type *</label>
                        <select
                            {...register("documentTypeId", { required: "Document type is required" })}
                            className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                            required
                        >
                            <option value="" className="dark:bg-slate-900">Select document type...</option>
                            {docTypes.map((t) => (
                                <option key={t.id} value={t.id} className="dark:bg-slate-900">
                                    {t.documentTypeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Name *</label>
                        <input
                            {...register("documentName", { required: true })}
                            placeholder="Enter document title..."
                            className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            {...register("description")}
                            placeholder="Enter a brief description..."
                            rows={3}
                            className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Document File {editingDoc ? "(Optional - leave empty to keep current file)" : "*"}
                        </label>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#18beb8] rounded-xl p-6 text-center cursor-pointer transition duration-300 relative bg-slate-50 dark:bg-slate-950 hover:bg-[#18beb8]/10">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required={!editingDoc}
                            />
                            <Upload className="mx-auto text-slate-400 dark:text-slate-500 mb-2" size={28} />
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {selectedFile ? selectedFile.name : "Click or drag file to upload"}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "Any file format supported"}
                            </p>
                        </div>
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
                            disabled={uploading}
                            className="flex-1 bg-[#18beb8] hover:bg-[#129a95] disabled:bg-[#18beb8]/70 text-white rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10"
                        >
                            {uploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                    {editingDoc ? "Saving Changes..." : "Uploading..."}
                                </>
                            ) : (
                                editingDoc ? "Save Changes" : "Upload"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
