import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/layout";
import { getDocuments, createDocument, updateDocument, deleteDocument, bulkDeleteDocuments } from "@/services/document";
import { getDocumentTypes } from "@/services/documentType";
import { Document } from "@/types/document";
import { toast } from "sonner";
import {
    FileText,
    Trash2,
    Eye,
    Download,
    Plus,
    Calendar,
    Tags,
    Edit2,
    MoreHorizontal,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { DocumentFormModal } from "@/section/documents/DocumentFormModal";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [docTypes, setDocTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);
    const [uploading, setUploading] = useState(false);

    // Delete state
    const [deletingDoc, setDeletingDoc] = useState<any | null>(null);
    const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
    const [deleting, setDeleting] = useState(false);

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

    const fetchDocTypes = async () => {
        try {
            const response = await getDocumentTypes();
            setDocTypes((response.data || []).filter((t: any) => t.isActive));
        } catch (error) {
            console.error("Error fetching document types:", error);
        }
    };

    useEffect(() => {
        fetchDocuments();
        fetchDocTypes();
    }, []);

    const handleOpenCreate = () => {
        fetchDocTypes();
        setEditingDoc(null);
        setIsUploadOpen(true);
    };

    const handleOpenEdit = (doc: any) => {
        fetchDocTypes();
        setEditingDoc(doc);
        setIsUploadOpen(true);
    };

    const handleUploadSubmit = async (data: any, selectedFile: File | null) => {
        if (!editingDoc && !selectedFile) {
            toast.warning("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("documentName", data.documentName);
        formData.append("description", data.description || "");
        formData.append("documentTypeId", data.documentTypeId);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        setUploading(true);
        try {
            if (editingDoc) {
                await updateDocument(editingDoc.id, formData);
                toast.success("Document updated successfully");
            } else {
                await createDocument(formData);
                toast.success("Document uploaded successfully");
            }
            setIsUploadOpen(false);
            setEditingDoc(null);
            fetchDocuments();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Failed to process document");
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmSingleDelete = async () => {
        if (!deletingDoc) return;
        setDeleting(true);
        try {
            await deleteDocument(deletingDoc.id);
            toast.success(`"${deletingDoc.documentName}" deleted successfully`);
            setDeletingDoc(null);
            fetchDocuments();
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error("Failed to delete document");
        } finally {
            setDeleting(false);
        }
    };

    const handleConfirmBulkDelete = async () => {
        if (bulkDeleteIds.length === 0) return;
        setDeleting(true);
        try {
            await bulkDeleteDocuments(bulkDeleteIds as number[]);
            toast.success(`Successfully deleted ${bulkDeleteIds.length} document(s)`);
            setBulkDeleteIds([]);
            fetchDocuments();
        } catch (error: any) {
            console.error("Bulk delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete selected documents");
        } finally {
            setDeleting(false);
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            id: "id",
            header: "ID",
            accessorKey: "id",
            width: "w-20",
            cell: (row) => <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">#{row.id}</span>,
        },
        {
            id: "documentName",
            header: "Document Name",
            accessorKey: "documentName",
            cell: (row) => (
                <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{row.documentName}</p>
                    {row.description && <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 font-normal max-w-sm">{row.description}</p>}
                </div>
            ),
        },
        {
            id: "documentType",
            header: "Document Type",
            accessorKey: "documentType",
            cell: (row) =>
                row.documentType ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30 whitespace-nowrap">
                        <Tags size={12} />
                        {row.documentType.documentTypeName}
                    </div>
                ) : (
                    <span className="text-slate-400 italic text-xs">Uncategorized</span>
                ),
        },
        {
            id: "format",
            header: "Format",
            width: "w-24",
            cell: (row) => {
                const ext = row.filePath?.split(".").pop()?.toUpperCase() || "FILE";
                return (
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 dark:bg-teal-950/30 text-[#18beb8] dark:text-[#18beb8] border border-teal-100 dark:border-teal-900/30 uppercase whitespace-nowrap">
                        {ext}
                    </span>
                );
            },
        },
        {
            id: "uploadedBy",
            header: "Uploaded By",
            cell: (row) => (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] uppercase border border-slate-200 dark:border-slate-700">
                        {row.user?.username ? row.user.username.substring(0, 2) : "AD"}
                    </div>
                    <span className="font-medium">{row.user?.username || "Admin"}</span>
                </div>
            ),
        },
        {
            id: "createdAt",
            header: "Uploaded Date",
            accessorKey: "createdAt",
            width: "w-36",
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>{new Date(row.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 select-none">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Documents</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage, upload, and view your repository documents.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 bg-[#18beb8] hover:bg-[#129a95] text-white rounded-xl py-3 px-5 font-semibold transition duration-300 shadow-lg shadow-teal-500/10"
                >
                    <Plus size={18} />
                    Upload Document
                </button>
            </div>

            <DataTable
                data={documents}
                columns={columns}
                searchPlaceholder="Filter documents..."
                loading={loading}
                emptyIcon={<FileText size={32} />}
                emptyTitle="No documents found"
                emptyDescription="Get started by uploading your first document."
                onRefresh={() => {
                    toast.info("Refreshed documents list");
                    fetchDocuments();
                }}
                onBulkDelete={(ids) => setBulkDeleteIds(ids)}
                actions={(doc) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                            <MoreHorizontal size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <Link href={`/dashboard/documents/${doc.id}`}>
                                <DropdownMenuItem>
                                    <Eye size={14} className="mr-2 text-slate-500" />
                                    View Details
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => handleOpenEdit(doc)}>
                                <Edit2 size={14} className="mr-2 text-slate-500" />
                                Edit
                            </DropdownMenuItem>
                            <a
                                href={`http://localhost:5000/uploads/${doc.filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                            >
                                <DropdownMenuItem>
                                    <Download size={14} className="mr-2 text-slate-500" />
                                    Download File
                                </DropdownMenuItem>
                            </a>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setDeletingDoc(doc)}
                                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
                            >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            {/* Form Modal */}
            <DocumentFormModal
                isOpen={isUploadOpen}
                editingDoc={editingDoc}
                docTypes={docTypes}
                uploading={uploading}
                onClose={() => setIsUploadOpen(false)}
                onSubmit={handleUploadSubmit}
            />

            {/* Single Delete Confirmation */}
            <ConfirmModal
                isOpen={!!deletingDoc}
                title="Delete Document"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800 dark:text-white">"{deletingDoc?.documentName}"</strong>?
                    </>
                }
                loading={deleting}
                onConfirm={handleConfirmSingleDelete}
                onCancel={() => setDeletingDoc(null)}
            />

            {/* Bulk Delete Confirmation */}
            <ConfirmModal
                isOpen={bulkDeleteIds.length > 0}
                title="Delete Selected Documents"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{bulkDeleteIds.length}</strong> selected document(s)?
                    </>
                }
                loading={deleting}
                onConfirm={handleConfirmBulkDelete}
                onCancel={() => setBulkDeleteIds([])}
            />
        </Layout>
    );
}
