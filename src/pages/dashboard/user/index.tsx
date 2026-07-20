import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { getUsers, bulkDeleteUsers } from "@/services/user";
import { toast } from "sonner";
import {
    User,
    Mail,
    Calendar,
    MoreHorizontal,
    Shield,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
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

    // Delete state
    const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
    const [deleting, setDeleting] = useState(false);

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

    const handleConfirmBulkDelete = async () => {
        if (bulkDeleteIds.length === 0) return;
        setDeleting(true);
        try {
            await bulkDeleteUsers(bulkDeleteIds as number[]);
            toast.success(`Successfully deleted ${bulkDeleteIds.length} user(s)`);
            setBulkDeleteIds([]);
            fetchUsers();
        } catch (error: any) {
            console.error("Bulk delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete selected users");
        } finally {
            setDeleting(false);
        }
    };

    const columns: ColumnDef<UserType>[] = [
        {
            id: "id",
            header: "ID",
            accessorKey: "id",
            width: "w-20",
            cell: (row) => <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">#{row.id}</span>,
        },
        {
            id: "username",
            header: "User Details",
            accessorKey: "username",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] dark:text-[#18beb8] flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-teal-100/50 dark:border-teal-950/20">
                        {row.username.substring(0, 2)}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">
                        {row.username}
                    </span>
                </div>
            ),
        },
        {
            id: "email",
            header: "Email Address",
            accessorKey: "email",
            cell: (row) => (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate max-w-[220px]" title={row.email}>{row.email}</span>
                </div>
            ),
        },
        {
            id: "createdAt",
            header: "Registration Date",
            accessorKey: "createdAt",
            width: "w-48",
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>
                        {new Date(row.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="mb-8 select-none">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Users</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage registered accounts in this workspace.</p>
            </div>

            <DataTable
                data={users}
                columns={columns}
                searchPlaceholder="Filter users..."
                loading={loading}
                emptyIcon={<User size={32} />}
                emptyTitle="No users found"
                emptyDescription="No registered users found in the database."
                onRefresh={() => {
                    toast.info("Refreshed users list");
                    fetchUsers();
                }}
                onBulkDelete={(ids) => setBulkDeleteIds(ids)}
                actions={(row) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                            <MoreHorizontal size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => toast.info(`User ${row.username} account is active`)}>
                                <Shield size={14} className="mr-2 text-slate-500" />
                                User Info
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            {/* Bulk Delete Confirmation */}
            <ConfirmModal
                isOpen={bulkDeleteIds.length > 0}
                title="Delete Selected Users"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{bulkDeleteIds.length}</strong> selected user(s)?
                    </>
                }
                loading={deleting}
                onConfirm={handleConfirmBulkDelete}
                onCancel={() => setBulkDeleteIds([])}
            />
        </Layout>
    );
}
