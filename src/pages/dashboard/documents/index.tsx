import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "@/components/layout";
import { getDocuments, createDocument, updateDocument, deleteDocument } from "@/services/document";
import { getDocumentTypes } from "@/services/documentType";
import { Document } from "@/types/document";
import { toast } from "sonner";
import {
    FileText,
    Upload,
    Trash2,
    Eye,
    Download,
    Search,
    Plus,
    X,
    Calendar,
    User,
    Tags,
    Edit2,
    MoreHorizontal,
    ArrowUpDown,
    ChevronDown,
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

export default function Documents() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [docTypes, setDocTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Selection state
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Sorting states
    const [sortField, setSortField] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        documentName: true,
        documentType: true,
        format: true,
        uploadedBy: true,
        createdAt: true,
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { register, handleSubmit, reset, setValue } = useForm();

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleOpenCreate = () => {
        setEditingDoc(null);
        setSelectedFile(null);
        reset({
            documentName: "",
            description: "",
            documentTypeId: "",
        });
        setIsUploadOpen(true);
    };

    const handleOpenEdit = (doc: any) => {
        setEditingDoc(doc);
        setSelectedFile(null);
        setValue("documentName", doc.documentName);
        setValue("description", doc.description || "");
        setValue("documentTypeId", doc.documentTypeId || "");
        setIsUploadOpen(true);
    };

    const handleUpload = async (data: any) => {
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
            setSelectedFile(null);
            reset();
            fetchDocuments();
        } catch (error: any) {
            console.error("Upload/Update error:", error);
            toast.error(error.response?.data?.message || "Failed to process document");
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

    // Filtering
    const filteredDocs = documents.filter((doc) =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
    const sortedDocs = [...filteredDocs].sort((a: any, b: any) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "documentType") {
            aValue = a.documentType?.documentTypeName || "";
            bValue = b.documentType?.documentTypeName || "";
        } else if (sortField === "uploadedBy") {
            aValue = a.user?.username || "";
            bValue = b.user?.username || "";
        }

        if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = (bValue || "").toLowerCase();
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);
    const paginatedDocs = sortedDocs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Selection handlers
    const isAllPageSelected =
        paginatedDocs.length > 0 &&
        paginatedDocs.every((d) => selectedIds.includes(d.id));

    const handleSelectAll = () => {
        if (isAllPageSelected) {
            const pageIds = paginatedDocs.map((d) => d.id);
            setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
        } else {
            const pageIds = paginatedDocs.map((d) => d.id);
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
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Documents</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage, upload, and view your repository documents.</p>
                </div>
                <button
                    onClick={() => {
                        fetchDocTypes();
                        handleOpenCreate();
                    }}
                    className="flex items-center justify-center gap-2 bg-[#18beb8] hover:bg-[#129a95] text-white rounded-xl py-3 px-5 font-semibold transition duration-300 shadow-lg shadow-teal-500/10"
                >
                    <Plus size={18} />
                    Upload Document
                </button>
            </div>

            {/* Filter and Columns Top Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm flex items-center justify-between gap-4 transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Filter documents..."
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
                            checked={visibleColumns.documentName}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, documentName: !!val })}
                        >
                            Document Name
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.documentType}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, documentType: !!val })}
                        >
                            Document Type
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.format}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, format: !!val })}
                        >
                            Format
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.uploadedBy}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, uploadedBy: !!val })}
                        >
                            Uploaded By
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={visibleColumns.createdAt}
                            onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, createdAt: !!val })}
                        >
                            Uploaded Date
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Documents Data Table */}
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
                ) : filteredDocs.length === 0 ? (
                    <div className="text-center py-16 px-4 select-none">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No documents found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-sm">
                            {searchTerm ? "No documents match your search criteria. Try a different search term." : "Get started by uploading your first document."}
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

                                    {visibleColumns.documentName && (
                                        <TableHead className="px-4 py-3.5">
                                            <button
                                                onClick={() => handleSort("documentName")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Document Name <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.documentType && (
                                        <TableHead className="px-4 py-3.5">
                                            <button
                                                onClick={() => handleSort("documentType")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Document Type <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.format && (
                                        <TableHead className="px-4 py-3.5 w-24 font-bold text-slate-600 dark:text-slate-400">
                                            Format
                                        </TableHead>
                                    )}

                                    {visibleColumns.uploadedBy && (
                                        <TableHead className="px-4 py-3.5">
                                            <button
                                                onClick={() => handleSort("uploadedBy")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Uploaded By <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.createdAt && (
                                        <TableHead className="px-4 py-3.5 w-36">
                                            <button
                                                onClick={() => handleSort("createdAt")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Uploaded Date <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    <TableHead className="px-4 py-3.5 w-16 text-right font-bold text-slate-600 dark:text-slate-400"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedDocs.map((doc: any) => {
                                    const fileExt = doc.filePath?.split(".").pop()?.toUpperCase() || "FILE";
                                    const isSelected = selectedIds.includes(doc.id);
                                    return (
                                        <TableRow
                                            key={doc.id}
                                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 transition-colors ${isSelected ? "bg-teal-50/30 dark:bg-teal-950/20" : ""}`}
                                        >
                                            <TableCell className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(doc.id)}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#18beb8] focus:ring-[#18beb8]/20 cursor-pointer"
                                                />
                                            </TableCell>

                                            {visibleColumns.id && (
                                                <TableCell className="px-4 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs">
                                                    #{doc.id}
                                                </TableCell>
                                            )}

                                            {visibleColumns.documentName && (
                                                <TableCell className="px-4 py-3.5">
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">
                                                            {doc.documentName}
                                                        </p>
                                                        {doc.description && (
                                                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 font-normal max-w-sm">
                                                                {doc.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.documentType && (
                                                <TableCell className="px-4 py-3.5">
                                                    {doc.documentType ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30 whitespace-nowrap">
                                                            <Tags size={12} />
                                                            {doc.documentType.documentTypeName}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-xs">Uncategorized</span>
                                                    )}
                                                </TableCell>
                                            )}

                                            {visibleColumns.format && (
                                                <TableCell className="px-4 py-3.5">
                                                    <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 dark:bg-teal-950/30 text-[#18beb8] dark:text-[#18beb8] border border-teal-100 dark:border-teal-900/30 uppercase whitespace-nowrap">
                                                        {fileExt}
                                                    </span>
                                                </TableCell>
                                            )}

                                            {visibleColumns.uploadedBy && (
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] uppercase border border-slate-200 dark:border-slate-700">
                                                            {doc.user?.username ? doc.user.username.substring(0, 2) : "AD"}
                                                        </div>
                                                        <span className="font-medium">{doc.user?.username || "Admin"}</span>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.createdAt && (
                                                <TableCell className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} className="text-slate-400 shrink-0" />
                                                        <span>
                                                            {new Date(doc.createdAt).toLocaleDateString(undefined, {
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
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <Link href={`/dashboard/documents/${doc.id}`}>
                                                            <DropdownMenuItem>
                                                                <Eye size={14} className="mr-2 text-slate-500" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem onClick={() => {
                                                            fetchDocTypes();
                                                            handleOpenEdit(doc);
                                                        }}>
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
                                                            onClick={() => handleDelete(doc.id)}
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
                                    {filteredDocs.length}
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

            {/* Upload/Edit Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-[500px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editingDoc ? "Edit Document" : "Upload New Document"}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsUploadOpen(false);
                                    setEditingDoc(null);
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
                                    onClick={() => {
                                        setIsUploadOpen(false);
                                        setEditingDoc(null);
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
            )}
        </Layout>
    );
}
