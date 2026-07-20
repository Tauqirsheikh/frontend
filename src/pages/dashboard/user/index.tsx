import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { getUsers, bulkDeleteUsers } from "@/services/user";
import { toast } from "sonner";
import {
    Search,
    User,
    Mail,
    Calendar,
    MoreHorizontal,
    ArrowUpDown,
    ChevronDown,
    Shield,
    RotateCw,
    Trash2,
    Loader2,
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

interface UserType {
    id: number;
    username: string;
    email: string;
    createdAt: string;
}

export default function UserList() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Selection state
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Bulk Delete state
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Sorting states
    const [sortField, setSortField] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        username: true,
        email: true,
        createdAt: true,
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            setUsers(response.data || []);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setBulkDeleting(true);
        try {
            await bulkDeleteUsers(selectedIds);
            toast.success(`Successfully deleted ${selectedIds.length} user(s)`);
            setSelectedIds([]);
            setIsBulkDeleteOpen(false);
            fetchUsers();
        } catch (error: any) {
            console.error("Bulk delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete selected users");
        } finally {
            setBulkDeleting(false);
        }
    };

    // Filtering
    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
    const sortedUsers = [...filteredUsers].sort((a: any, b: any) => {
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
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Selection handlers
    const isAllPageSelected =
        paginatedUsers.length > 0 &&
        paginatedUsers.every((u) => selectedIds.includes(u.id));

    const handleSelectAll = () => {
        if (isAllPageSelected) {
            const pageIds = paginatedUsers.map((u) => u.id);
            setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
        } else {
            const pageIds = paginatedUsers.map((u) => u.id);
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
            <div className="mb-8 select-none">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Users</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage registered accounts in this workspace.</p>
            </div>

            {/* Filter and Controls Top Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm flex items-center justify-between gap-3 transition-colors flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Filter users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300 placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2">
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
                                checked={visibleColumns.username}
                                onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, username: !!val })}
                            >
                                User Details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleColumns.email}
                                onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, email: !!val })}
                            >
                                Email Address
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={visibleColumns.createdAt}
                                onCheckedChange={(val) => setVisibleColumns({ ...visibleColumns, createdAt: !!val })}
                            >
                                Registration Date
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Refresh Button */}
                    <button
                        onClick={() => {
                            toast.info("Refreshed users list");
                            fetchUsers();
                        }}
                        className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Refresh List"
                    >
                        <RotateCw size={14} className={loading ? "animate-spin text-[#18beb8]" : ""} />
                    </button>

                    {/* Bulk Delete Button (Only visible when records selected) */}
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => setIsBulkDeleteOpen(true)}
                            className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60 px-4 py-2.5 rounded-xl text-xs font-semibold transition animate-in fade-in zoom-in-95 duration-150"
                        >
                            <Trash2 size={14} />
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Users Data Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors w-full">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="flex gap-4 items-center animate-pulse">
                                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                                <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                            <User size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No users found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-sm">
                            {searchTerm ? "No user accounts match your search. Try another query." : "No registered users found in the database."}
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

                                    {visibleColumns.username && (
                                        <TableHead className="px-4 py-3.5">
                                            <button
                                                onClick={() => handleSort("username")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                User Details <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.email && (
                                        <TableHead className="px-4 py-3.5">
                                            <button
                                                onClick={() => handleSort("email")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Email Address <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    {visibleColumns.createdAt && (
                                        <TableHead className="px-4 py-3.5 w-48">
                                            <button
                                                onClick={() => handleSort("createdAt")}
                                                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                            >
                                                Registration Date <ArrowUpDown size={12} />
                                            </button>
                                        </TableHead>
                                    )}

                                    <TableHead className="px-4 py-3.5 w-16 text-right font-bold text-slate-600 dark:text-slate-400"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((u: UserType) => {
                                    const isSelected = selectedIds.includes(u.id);
                                    return (
                                        <TableRow
                                            key={u.id}
                                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 transition-colors ${isSelected ? "bg-teal-50/30 dark:bg-teal-950/20" : ""}`}
                                        >
                                            <TableCell className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(u.id)}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#18beb8] focus:ring-[#18beb8]/20 cursor-pointer"
                                                />
                                            </TableCell>

                                            {visibleColumns.id && (
                                                <TableCell className="px-4 py-3.5 font-semibold text-slate-500 dark:text-slate-400 text-xs">
                                                    #{u.id}
                                                </TableCell>
                                            )}

                                            {visibleColumns.username && (
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] dark:text-[#18beb8] flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-teal-100/50 dark:border-teal-950/20">
                                                            {u.username.substring(0, 2)}
                                                        </div>
                                                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">
                                                            {u.username}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.email && (
                                                <TableCell className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                                                        <Mail size={14} className="text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-[220px]" title={u.email}>{u.email}</span>
                                                    </div>
                                                </TableCell>
                                            )}

                                            {visibleColumns.createdAt && (
                                                <TableCell className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={14} className="text-slate-400 shrink-0" />
                                                        <span>
                                                            {new Date(u.createdAt).toLocaleDateString(undefined, {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
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
                                                        <DropdownMenuItem onClick={() => toast.info(`User ${u.username} account is active`)}>
                                                            <Shield size={14} className="mr-2 text-slate-500" />
                                                            User Info
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
                                    {filteredUsers.length}
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

            {/* Modal - Bulk Delete Confirmation */}
            {isBulkDeleteOpen && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-[420px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                            <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-xl">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Delete Selected Users</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                            Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{selectedIds.length}</strong> selected user(s)?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsBulkDeleteOpen(false)}
                                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2.5 font-semibold text-sm transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={bulkDeleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white rounded-xl py-2.5 font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
                            >
                                {bulkDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Records"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
