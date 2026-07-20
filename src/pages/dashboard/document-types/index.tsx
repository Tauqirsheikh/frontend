import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import {
    getDocumentTypes,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    bulkDeleteDocumentTypes,
} from "@/services/documentType";
import { toast } from "sonner";
import {
    Plus,
    Edit2,
    Trash2,
    Tags,
    Calendar,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { DocumentTypeFormModal } from "@/section/document-types/DocumentTypeFormModal";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DocType {
    id: number;
    documentTypeName: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
}

export default function DocumentTypes() {
    const [documentTypes, setDocumentTypes] = useState<DocType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<DocType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Delete state
    const [deletingType, setDeletingType] = useState<DocType | null>(null);
    const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
    const [deleting, setDeleting] = useState(false);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await getDocumentTypes();
            setDocumentTypes(response.data || []);
        } catch (error: any) {
            console.error("Error fetching types:", error);
            toast.error("Failed to load document types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleOpenCreate = () => {
        setEditingType(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (type: DocType) => {
        setEditingType(type);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (type: DocType) => {
        try {
            await updateDocumentType(type.id, {
                documentTypeName: type.documentTypeName,
                description: type.description || "",
                isActive: !type.isActive,
            });
            toast.success(`"${type.documentTypeName}" status updated`);
            fetchTypes();
        } catch (error: any) {
            console.error("Status toggle error:", error);
            toast.error("Failed to update status");
        }
    };

    const handleSubmitForm = async (data: any) => {
        setSubmitting(true);
        try {
            if (editingType) {
                await updateDocumentType(editingType.id, data);
                toast.success("Document type updated successfully");
            } else {
                await createDocumentType(data);
                toast.success("Document type created successfully");
            }
            setIsModalOpen(false);
            fetchTypes();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error.response?.data?.message || "Operation failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmSingleDelete = async () => {
        if (!deletingType) return;
        setDeleting(true);
        try {
            await deleteDocumentType(deletingType.id);
            toast.success(`"${deletingType.documentTypeName}" deleted successfully`);
            setDeletingType(null);
            fetchTypes();
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete item");
        } finally {
            setDeleting(false);
        }
    };

    const handleConfirmBulkDelete = async () => {
        if (bulkDeleteIds.length === 0) return;
        setDeleting(true);
        try {
            await bulkDeleteDocumentTypes(bulkDeleteIds as number[]);
            toast.success(`Successfully deleted ${bulkDeleteIds.length} document type(s)`);
            setBulkDeleteIds([]);
            fetchTypes();
        } catch (error: any) {
            console.error("Bulk delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete selected records");
        } finally {
            setDeleting(false);
        }
    };

    const columns: ColumnDef<DocType>[] = [
        {
            id: "id",
            header: "ID",
            accessorKey: "id",
            width: "w-20",
            cell: (row) => <span className="font-bold text-slate-600 dark:text-slate-400 text-xs">#{row.id}</span>,
        },
        {
            id: "documentTypeName",
            header: "Document Type",
            accessorKey: "documentTypeName",
            cell: (row) => <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{row.documentTypeName}</span>,
        },
        {
            id: "description",
            header: "Description",
            accessorKey: "description",
            cell: (row) => (
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {row.description || <span className="text-slate-400 italic">No description</span>}
                </span>
            ),
        },
        {
            id: "isActive",
            header: "Status",
            accessorKey: "isActive",
            width: "w-32",
            cell: (row) => (
                <button
                    onClick={() => handleToggleStatus(row)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 border whitespace-nowrap ${row.isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                        : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30"
                        }`}
                >
                    {row.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {row.isActive ? "Active" : "Inactive"}
                </button>
            ),
        },
        {
            id: "createdAt",
            header: "Created Date",
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
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Document Types</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage categories and classification types for documents.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 bg-[#18beb8] hover:bg-[#129a95] text-white rounded-xl py-3 px-5 font-semibold transition duration-300 shadow-lg shadow-teal-500/10"
                >
                    <Plus size={18} />
                    Add Document Type
                </button>
            </div>

            <DataTable
                data={documentTypes}
                columns={columns}
                searchPlaceholder="Filter document types..."
                loading={loading}
                emptyIcon={<Tags size={32} />}
                emptyTitle="No document types found"
                emptyDescription="Click 'Add Document Type' to create your first category."
                onRefresh={() => {
                    toast.info("Refreshed document types list");
                    fetchTypes();
                }}
                onBulkDelete={(ids) => setBulkDeleteIds(ids)}
                actions={(row) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                            <MoreHorizontal size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleOpenEdit(row)}>
                                <Edit2 size={14} className="mr-2 text-slate-500" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setDeletingType(row)}
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
            <DocumentTypeFormModal
                isOpen={isModalOpen}
                editingType={editingType}
                submitting={submitting}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitForm}
            />

            {/* Single Delete Confirmation */}
            <ConfirmModal
                isOpen={!!deletingType}
                title="Delete Document Type"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800 dark:text-white">"{deletingType?.documentTypeName}"</strong>?
                    </>
                }
                loading={deleting}
                onConfirm={handleConfirmSingleDelete}
                onCancel={() => setDeletingType(null)}
            />

            {/* Bulk Delete Confirmation */}
            <ConfirmModal
                isOpen={bulkDeleteIds.length > 0}
                title="Delete Selected Records"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{bulkDeleteIds.length}</strong> selected record(s)?
                    </>
                }
                loading={deleting}
                onConfirm={handleConfirmBulkDelete}
                onCancel={() => setBulkDeleteIds([])}
            />
        </Layout>
    );
}
