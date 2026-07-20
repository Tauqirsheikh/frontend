import React, { useState, useEffect } from "react";
import {
    Search,
    ChevronDown,
    ArrowUpDown,
    RotateCw,
    Trash2,
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
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export interface ColumnDef<T> {
    id: string;
    header: string;
    accessorKey?: keyof T;
    sortable?: boolean;
    cell?: (row: T) => React.ReactNode;
    width?: string;
    align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    searchPlaceholder?: string;
    filterFunction?: (item: T, searchTerm: string) => boolean;
    getId?: (item: T) => number | string;
    onRefresh?: () => void;
    onBulkDelete?: (selectedIds: (number | string)[]) => void;
    loading?: boolean;
    emptyIcon?: React.ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    itemsPerPage?: number;
    actions?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
    data,
    columns,
    searchPlaceholder = "Filter records...",
    filterFunction,
    getId = (item: any) => item.id,
    onRefresh,
    onBulkDelete,
    loading = false,
    emptyIcon,
    emptyTitle = "No records found",
    emptyDescription = "There are no records matching your criteria.",
    itemsPerPage = 10,
    actions,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    // Visibility dictionary: columnId -> boolean
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        columns.forEach((col) => {
            initial[col.id] = true;
        });
        return initial;
    });

    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination page on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Handle Sort Header click
    const handleSort = (columnId: string) => {
        if (sortField === columnId) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(columnId);
            setSortOrder("asc");
        }
    };

    // Filter data
    const filteredData = data.filter((item) => {
        if (!searchTerm.trim()) return true;
        if (filterFunction) return filterFunction(item, searchTerm);
        return Object.values(item as any).some((val) =>
            String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Sort data
    const sortedData = [...filteredData].sort((a: any, b: any) => {
        if (!sortField) return 0;
        const col = columns.find((c) => c.id === sortField);
        let aVal = col?.accessorKey ? a[col.accessorKey] : a[sortField];
        let bVal = col?.accessorKey ? b[col.accessorKey] : b[sortField];

        if (typeof aVal === "string") {
            aVal = aVal.toLowerCase();
            bVal = (bVal || "").toLowerCase();
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Selection handlers
    const isAllPageSelected =
        paginatedData.length > 0 &&
        paginatedData.every((item) => selectedIds.includes(getId(item)));

    const handleSelectAll = () => {
        if (isAllPageSelected) {
            const pageIds = paginatedData.map((item) => getId(item));
            setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
        } else {
            const pageIds = paginatedData.map((item) => getId(item));
            const combined = Array.from(new Set([...selectedIds, ...pageIds]));
            setSelectedIds(combined);
        }
    };

    const handleSelectRow = (id: number | string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleTriggerBulkDelete = () => {
        if (onBulkDelete && selectedIds.length > 0) {
            onBulkDelete(selectedIds);
        }
    };

    // Helper to clear selections when data changes / deleted
    useEffect(() => {
        setSelectedIds((prev) => prev.filter((id) => data.some((item) => getId(item) === id)));
    }, [data]);

    const activeVisibleColumns = columns.filter((col) => visibleColumns[col.id]);

    return (
        <div className="w-full">
            {/* Filter and Top Control Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm flex items-center justify-between gap-3 transition-colors flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
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
                            {columns.map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    checked={visibleColumns[col.id]}
                                    onCheckedChange={(val) =>
                                        setVisibleColumns({ ...visibleColumns, [col.id]: !!val })
                                    }
                                >
                                    {col.header}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Refresh Button */}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Refresh List"
                        >
                            <RotateCw size={14} className={loading ? "animate-spin text-[#18beb8]" : ""} />
                        </button>
                    )}

                    {/* Bulk Delete Button */}
                    {selectedIds.length > 0 && onBulkDelete && (
                        <button
                            onClick={handleTriggerBulkDelete}
                            className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60 px-4 py-2.5 rounded-xl text-xs font-semibold transition animate-in fade-in zoom-in-95 duration-150"
                        >
                            <Trash2 size={14} />
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Table Container */}
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
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-16 px-4 select-none">
                        {emptyIcon && (
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                                {emptyIcon}
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{emptyTitle}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-sm">
                            {emptyDescription}
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

                                    {activeVisibleColumns.map((col) => (
                                        <TableHead key={col.id} className={`px-4 py-3.5 ${col.width || ""}`}>
                                            {col.sortable !== false ? (
                                                <button
                                                    onClick={() => handleSort(col.id)}
                                                    className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                                >
                                                    {col.header} <ArrowUpDown size={12} />
                                                </button>
                                            ) : (
                                                <span className="font-bold text-slate-600 dark:text-slate-400">
                                                    {col.header}
                                                </span>
                                            )}
                                        </TableHead>
                                    ))}

                                    {actions && (
                                        <TableHead className="px-4 py-3.5 w-16 text-right font-bold text-slate-600 dark:text-slate-400"></TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedData.map((row) => {
                                    const rowId = getId(row);
                                    const isSelected = selectedIds.includes(rowId);

                                    return (
                                        <TableRow
                                            key={rowId}
                                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 transition-colors ${isSelected ? "bg-teal-50/30 dark:bg-teal-950/20" : ""}`}
                                        >
                                            <TableCell className="px-4 py-3.5">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectRow(rowId)}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#18beb8] focus:ring-[#18beb8]/20 cursor-pointer"
                                                />
                                            </TableCell>

                                            {activeVisibleColumns.map((col) => (
                                                <TableCell key={col.id} className="px-4 py-3.5">
                                                    {col.cell
                                                        ? col.cell(row)
                                                        : col.accessorKey
                                                        ? String(row[col.accessorKey] ?? "")
                                                        : null}
                                                </TableCell>
                                            ))}

                                            {actions && (
                                                <TableCell className="px-4 py-3.5 text-right">
                                                    {actions(row)}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Footer Pagination & Selection Summary */}
                        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors select-none">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {selectedIds.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {filteredData.length}
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
        </div>
    );
}
