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
                <div className="flex flex-col gap-6 animate-pulse">
                    <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 h-96"></div>
                </div>
            </Layout>
        );
    }

    if (!document) {
        return (
            <Layout>
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8">
                    <h3 className="text-xl font-bold text-slate-700">Document not found</h3>
                    <Link href="/dashboard/documents" className="mt-4 inline-block text-blue-600 hover:underline">
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
            <div className="mb-6">
                <Link
                    href="/dashboard/documents"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to documents
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content & Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider">
                                {fileExt || "FILE"}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                            {document.documentName}
                        </h1>
                        <p className="text-slate-600 mt-4 leading-relaxed whitespace-pre-line">
                            {document.description || "No description provided."}
                        </p>
                    </div>

                    {/* Preview Panel */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Document Preview</h3>
                        <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 min-h-[400px] flex items-center justify-center relative">
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
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <FileText size={32} />
                                    </div>
                                    <h4 className="font-bold text-slate-700">Preview Not Available</h4>
                                    <p className="text-sm text-slate-400 mt-1 mb-4">
                                        This file type (. {fileExt}) cannot be previewed directly.
                                    </p>
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition"
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
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Details</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="text-slate-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Uploaded By</p>
                                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                                        {document.user?.username || "Admin"}
                                    </p>
                                    <p className="text-xs text-slate-400">{document.user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="text-slate-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Created At</p>
                                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                                        {new Date(document.createdAt).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short"
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FileText className="text-slate-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Filename</p>
                                    <p className="text-sm font-semibold text-slate-700 break-all mt-0.5">
                                        {document.filePath}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 mt-6 pt-6 flex flex-col gap-3">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition"
                            >
                                <Download size={18} />
                                Download Document
                            </a>
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 border border-red-200 hover:border-red-600 hover:bg-red-50 text-red-600 rounded-xl py-3 font-semibold transition"
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
