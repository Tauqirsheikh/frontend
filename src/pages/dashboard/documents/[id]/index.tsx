import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/layout";
import { getDocumentById, deleteDocument } from "@/services/document";
import { toast } from "sonner";
import { ArrowLeft, Calendar, User, Download, Trash, FileText, ExternalLink } from "lucide-react";

export default function DocumentDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDoc = async () => {
            setLoading(true);
            try {
                const response = await getDocumentById(id as string);
                setDocument(response.data);
            } catch (error: any) {
                console.error("Error fetching document:", error);
                toast.error("Failed to load document details");
                router.push("/dashboard/documents");
            } finally {
                setLoading(false);
            }
        };

        fetchDoc();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this document?")) {
            try {
                await deleteDocument(Number(id));
                toast.success("Document deleted successfully");
                router.push("/dashboard/documents");
            } catch (error: any) {
                console.error("Delete error:", error);
                toast.error("Failed to delete document");
            }
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col gap-6 animate-pulse select-none">
                    <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 h-96"></div>
                </div>
            </Layout>
        );
    }

    if (!document) {
        return (
            <Layout>
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Document not found</h3>
                    <Link href="/dashboard/documents" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                        Back to documents
                    </Link>
                </div>
            </Layout>
        );
    }

    const fileUrl = `http://localhost:5000/uploads/${document.filePath}`;
    const fileExt = document.filePath.split(".").pop()?.toLowerCase() || "";
    const isImage = ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(fileExt);
    const isPdf = fileExt === "pdf";

    return (
        <Layout>
            <div className="mb-6 select-none">
                <Link
                    href="/dashboard/documents"
                    className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#18beb8] dark:hover:text-[#18beb8] transition font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to documents
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content & Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/45 border border-teal-100/50 dark:border-teal-950/20 text-[#18beb8] dark:text-[#18beb8] rounded-xl font-bold text-xs uppercase tracking-wider">
                                {fileExt || "FILE"}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                            {document.documentName}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed whitespace-pre-line text-sm">
                            {document.description || "No description provided."}
                        </p>
                    </div>

                    {/* Preview Panel */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-colors">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Document Preview</h3>
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[400px] flex items-center justify-center relative transition-colors">
                            {isImage ? (
                                <img
                                    src={fileUrl}
                                    alt={document.documentName}
                                    className="max-h-[600px] object-contain rounded-lg p-2"
                                />
                            ) : isPdf ? (
                                <iframe
                                    src={`${fileUrl}#toolbar=0`}
                                    className="w-full h-[600px] border-0"
                                    title={document.documentName}
                                ></iframe>
                            ) : (
                                <div className="text-center p-8 select-none">
                                    <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100/30">
                                        <FileText size={32} />
                                    </div>
                                    <h4 className="font-bold text-slate-700 dark:text-slate-300">Preview Not Available</h4>
                                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-4">
                                        This file type (. {fileExt}) cannot be previewed directly.
                                    </p>
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl transition shadow-sm"
                                    >
                                        <ExternalLink size={16} />
                                        Open in New Tab
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm transition-colors">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Details</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="text-slate-400 dark:text-slate-500 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Uploaded By</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                                        {document.user?.username || "Admin"}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">{document.user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="text-slate-400 dark:text-slate-500 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Created At</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                                        {new Date(document.createdAt).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short"
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileText className="text-slate-400 dark:text-slate-500 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Filename</p>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 break-all mt-0.5">
                                        {document.filePath}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-6 flex flex-col gap-3">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="w-full flex items-center justify-center gap-2 bg-[#18beb8] hover:bg-[#129a95] text-white rounded-xl py-3 font-semibold transition shadow-lg shadow-teal-500/10"
                            >
                                <Download size={18} />
                                Download Document
                            </a>
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 border border-red-200 dark:border-red-950/40 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 rounded-xl py-3 font-semibold transition"
                            >
                                <Trash size={18} />
                                Delete Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
