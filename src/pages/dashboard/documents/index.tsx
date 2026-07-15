import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "@/components/layout";
import { getDocuments, createDocument, deleteDocument } from "@/services/document";
import { Document } from "@/types/document";
import { toast } from "sonner";
import { FileText, Upload, Trash, Eye, Download, Search, Plus, X, Calendar, User } from "lucide-react";

export default function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await getDocuments();
            setDocuments(response.data || []);
        } catch (error: any) {
            console.error("Error fetching documents:", error);
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (data: any) => {
        if (!selectedFile) {
            toast.warning("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("documentName", data.documentName);
        formData.append("description", data.description || "");
        formData.append("file", selectedFile);

        setUploading(true);
        try {
            await createDocument(formData);
            toast.success("Document uploaded successfully");
            setIsUploadOpen(false);
            setSelectedFile(null);
            reset();
            fetchDocuments();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this document?")) {
            try {
                await deleteDocument(id);
                toast.success("Document deleted successfully");
                fetchDocuments();
            } catch (error: any) {
                console.error("Delete error:", error);
                toast.error("Failed to delete document");
            }
        }
    };

    const filteredDocs = documents.filter((doc) =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 select-none">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Documents</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage, upload, and view your repository documents.</p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#18beb8] hover:bg-[#129a95] text-white rounded-xl py-3 px-5 font-semibold transition duration-300 shadow-lg shadow-teal-500/10"
                >
                    <Plus size={18} />
                    Upload Document
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 mb-6 shadow-sm flex items-center transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search documents by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                    />
                </div>
            </div>

            {/* Documents List */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 animate-pulse">
                            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4"></div>
                            <div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2"></div>
                            <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4"></div>
                            <div className="h-10 bg-slate-50 dark:bg-slate-950 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No documents found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                        {searchTerm ? "No documents match your search criteria. Try a different search term." : "Get started by uploading your first document to the repository."}
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc: any) => {
                        const fileExt = doc.filePath.split(".").pop()?.toUpperCase() || "FILE";
                        return (
                            <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-[#18beb8]/30 transition duration-300 flex flex-col justify-between transition-colors">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] dark:text-[#18beb8] rounded-xl font-bold text-xs tracking-wider border border-teal-100/50 dark:border-teal-950/20">
                                            {fileExt}
                                        </div>
                                        <div className="flex gap-1">
                                            <Link href={`/dashboard/documents/${doc.id}`} title="View Details">
                                                <button className="p-2 text-slate-400 hover:text-[#18beb8] hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition duration-200">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>
                                            <a
                                                href={`http://localhost:5000/uploads/${doc.filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                title="Download File"
                                            >
                                                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition duration-200">
                                                    <Download size={18} />
                                                </button>
                                            </a>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition duration-200"
                                                title="Delete Document"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1 mb-2">
                                        {doc.documentName}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6">
                                        {doc.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-2 text-xs text-slate-400 dark:text-slate-500 select-none">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400 dark:text-slate-500" />
                                        <span>Uploaded by: <strong className="text-slate-600 dark:text-slate-300">{doc.user?.username || "Admin"}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                                        <span>{new Date(doc.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-[500px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Upload New Document</h2>
                            <button
                                onClick={() => {
                                    setIsUploadOpen(false);
                                    setSelectedFile(null);
                                    reset();
                                }}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(handleUpload)} className="p-6 space-y-4">
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
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Document File *</label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#18beb8] rounded-xl p-6 text-center cursor-pointer transition duration-300 relative bg-slate-50 dark:bg-slate-950 hover:bg-[#18beb8]/10">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
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
                                    onClick={() => {
                                        setIsUploadOpen(false);
                                        setSelectedFile(null);
                                        reset();
                                    }}
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
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
