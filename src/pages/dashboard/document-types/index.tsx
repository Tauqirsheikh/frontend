import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout";
import {
    getDocumentTypes,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
} from "@/services/documentType";
import { toast } from "sonner";
import {
    Search,
    Plus,
    X,
    Edit2,
    Trash2,
    Tags,
    Calendar,
    CheckCircle2,
    XCircle,
    Loader2,
    MoreHorizontal,
    ArrowUpDown,
    ChevronDown,
    Eye,
} from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
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
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<DocType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Selection state
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Sorting states
    const [sortField, setSortField] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        documentTypeName: true,
        description: true,
        isActive: true,
        createdAt: true,
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { register, handleSubmit, reset, setValue } = useForm();

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

    // Reset pagination page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleOpenCreate = () => {
        setEditingType(null);
        reset({ documentTypeName: "", description: "", isActive: true });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (type: DocType) => {
        setEditingType(type);
        setValue("documentTypeName", type.documentTypeName);
        setValue("description", type.description || "");
        setValue("isActive", type.isActive);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (type: DocType) => {
        try {
            await updateDocumentType(type.id, {
                documentTypeName: type.documentTypeName,
                description: type.description || "",
                isActive: !type.isActive,
            });
            toast.success(`"${type.documentTypeName}" is now ${!type.isActive ? "Active" : "Inactive"}`);
            fetchTypes();
        } catch (error: any) {
            console.error("Status toggle error:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const onSubmit = async (data: any) => {
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
            reset();
            fetchTypes();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error.response?.data?.message || "Operation failed. Ensure type name is unique.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (type: DocType) => {
        if (confirm(`Are you sure you want to delete "${type.documentTypeName}"?`)) {
            try {
                await deleteDocumentType(type.id);
                toast.success("Document type deleted successfully");
                fetchTypes();
            } catch (error: any) {
                console.error("Delete error:", error);
                toast.error(error.response?.data?.message || "Failed to delete document type");
            }
        }
    };

    // Filtering
    const filteredTypes = documentTypes.filter(
        (type) =>
            type.documentTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sorting
    const sortedTypes = [...filteredTypes].sort((a: any, b: any) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = (bValue || "").toLowerCase();
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedTypes.length / itemsPerPage);
    const paginatedTypes = sortedTypes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Selection handlers
    const isAllPageSelected =
        paginatedTypes.length > 0 &&
        paginatedTypes.every((t) => selectedIds.includes(t.id));

    const handleSelectAll = () => {
        if (isAllPageSelected) {
            const pageIds = paginatedTypes.map((t) => t.id);
            setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
        } else {
            const pageIds = paginatedTypes.map((t) => t.id);
            const combined = Array.from(new Set([...selectedIds, ...pageIds]));
            setSelectedIds(combined);
        }
    };

    const handleSelectRow = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

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

            {/* Filter and Columns Top Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm flex items-center justify-between gap-4 transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Filter document types..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300 placeholder:text-slate-400"
                    />
                </div>

                {/* Columns Visibility Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        Columns <ChevronDown size={14} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.id}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, id: !!val })}
                        >
                            ID
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.documentTypeName}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, documentTypeName: !!val })}
                        >
                            Document Type
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.description}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, description: !!val })}
                        >
                            Description
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.isActive}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, isActive: !!val })}
                        >
                            Status
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.createdAt}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, createdAt: !!val })}
                        >
                            Created Date
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Document Types Data Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors w-full">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="flex gap-4 items-center animate-pulse">
                                <div className="h-4 w-10 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                                <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                                <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredTypes.length === 0 ? (
                    <div className="text-center py-16 px-4 select-none">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                            <Tags size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No document types found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-sm">
                            {searchTerm ? "No document types match your search. Try another query." : "Click 'Add Document Type' to create your first category."}
                        </p>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                    <TableHead className="w-12 px-4 py-3.5">
                                        <input
                                            type="checkbox"
                                            checked={isAllPageSelected}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#18beb8] focus:ring-[#18beb8]/20 cursor-pointer"
                                        />
                                    </TableHead>

                                    {visibleColumns.id && (
                                        <TableHead className="px-4 py-3.5 w-20">
                                            <button
                                                onClick={() => handleSort("id")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                ID <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.documentTypeName && (
                                        <TableHead className="px-4 py-3.5">
                                            <button
                                                onClick={() => handleSort("documentTypeName")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Document Type <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.description && (
                                        <TableHead className="px-4 py-3.5 font-bold text-slate-600 dark:text-slate-400">
                                            Description
                                        </TableHead>
                                    )}

                                    {visibleColumns.isActive && (
                                        <TableHead className="px-4 py-3.5 w-32">
                                            <button
                                                onClick={() => handleSort("isActive")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Status <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.createdAt && (
                                        <TableHead className="px-4 py-3.5 w-36">
                                            <button
                                                onClick={() => handleSort("createdAt")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Created Date <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    <TableHead className="px-4 py-3.5 w-16 text-right font-bold text-slate-600 dark:text-slate-400"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTypes.map((type) => {
                                    const isSelected = selectedIds.includes(type.id);
                                    return (
                                        <TableRow
                                            key={type.id}
                                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 transition-colors ${isSelected ? "bg-teal-50/30 dark:bg-teal-950/20" : ""}`}
                                        >
                                            <TableCell className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(type.id)}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#18beb8] focus:ring-[#18beb8]/20 cursor-pointer"
                                                />
                                            </TableCell>

                                            {visibleColumns.id && (
                                                <TableCell className="px-4 py-3.5 font-bold text-slate-600 dark:text-slate-400 text-xs">
                                                    #{type.id}
                                                </TableCell>
                                            )}

                                            {visibleColumns.documentTypeName && (
                                                <TableCell className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">
                                                    {type.documentTypeName}
                                                </TableCell>
                                            )}

                                            {visibleColumns.description && (
                                                <TableCell className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-sm">
                                                    {type.description || <span className="text-slate-400 italic">No description</span>}
                                                </TableCell>
                                            )}

                                            {visibleColumns.isActive && (
                                                <TableCell className="px-4 py-3.5">
                                                    <button
                                                        onClick={() => handleToggleStatus(type)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none cursor-pointer transition-colors duration-200 border whitespace-nowrap ${type.isActive
                                                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                                                            : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30"
                                                            }`}
                                                    >
                                                        {type.isActive ? (
                                                            <>
                                                                <CheckCircle2 size={12} />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle size={12} />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </button>
                                                </TableCell>
                                            )}

                                            {visibleColumns.createdAt && (
                                                <TableCell className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} className="text-slate-400 shrink-0" />
                                                        <span>
                                                            {new Date(type.createdAt).toLocaleDateString(undefined, {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            )}

                                            <TableCell className="px-4 py-3.5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                                                        <MoreHorizontal size={18} />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem onClick={() => handleOpenEdit(type)}>
                                                            <Edit2 size={14} className="mr-2 text-slate-500" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(type)}
                                                            className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
                                                        >
                                                            <Trash2 size={14} className="mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Footer - Selection count & Pagination */}
                        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors select-none">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {selectedIds.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {filteredTypes.length}
                                </span>{" "}
                                row(s) selected.
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal - Create/Edit Document Type */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-[450px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editingType ? "Edit Document Type" : "Add Document Type"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
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
                                    onClick={() => setIsModalOpen(false)}
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
            )}
        </Layout>
    );
}
