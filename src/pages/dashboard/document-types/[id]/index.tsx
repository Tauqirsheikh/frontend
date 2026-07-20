import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/layout";
import { getDocumentTypeById, deleteDocumentType } from "@/services/documentType";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Tags, CheckCircle2, XCircle } from "lucide-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function DocumentTypeDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [docType, setDocType] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchType = async () => {
            setLoading(true);
            try {
                const response = await getDocumentTypeById(id as string);
                setDocType(response.data);
            } catch (error: any) {
                console.error("Error fetching document type:", error);
                toast.error("Failed to load document type details");
                router.push("/dashboard/document-types");
            } finally {
                setLoading(false);
            }
        };

        fetchType();
    }, [id, router]);

    const handleDelete = async () => {
        if (!id) return;
        setDeleting(true);
        try {
            await deleteDocumentType(id as string);
            toast.success("Document type deleted successfully");
            router.push("/dashboard/document-types");
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error("Failed to delete document type");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col gap-6 animate-pulse select-none">
                    <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 h-64"></div>
                </div>
            </Layout>
        );
    }

    if (!docType) {
        return (
            <Layout>
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Document type not found</h3>
                    <Link href="/dashboard/document-types" className="mt-4 inline-block text-teal-600 hover:underline">
                        Back to Document Types
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-6 select-none">
                <Link
                    href="/dashboard/document-types"
                    className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#18beb8] dark:hover:text-[#18beb8] transition font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Document Types
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm max-w-3xl transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/45 border border-teal-100/50 dark:border-teal-950/20 text-[#18beb8] rounded-xl font-bold text-xs">
                        #{docType.id}
                    </span>
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${docType.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                            }`}
                    >
                        {docType.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {docType.isActive ? "Active" : "Inactive"}
                    </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] rounded-xl">
                        <Tags size={24} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                        {docType.documentTypeName}
                    </h1>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm leading-relaxed">
                    {docType.description || "No description provided."}
                </p>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-6 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Created: {new Date(docType.createdAt).toLocaleDateString()}</span>
                    </div>

                    <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="text-red-600 hover:text-red-700 font-semibold transition"
                    >
                        Delete Document Type
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Document Type"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800 dark:text-white">"{docType.documentTypeName}"</strong>?
                    </>
                }
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
            />
        </Layout>
    );
}
