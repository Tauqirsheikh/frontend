import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { getUsers } from "@/services/user";
import { toast } from "sonner";
import { Search, User, Mail, Calendar, ShieldAlert } from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

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

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Users</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage registered accounts in this workspace.</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex items-center transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Users Table Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="flex gap-4 items-center animate-pulse">
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
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
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950/50">
                                <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-6 py-4">ID</TableHead>
                                <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-6 py-4">User Details</TableHead>
                                <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-6 py-4">Email Address</TableHead>
                                <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-6 py-4">Registration Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((u: UserType) => (
                                <TableRow key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 transition-colors">
                                    <TableCell className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400 text-xs">
                                        #{u.id}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] dark:text-[#18beb8] flex items-center justify-center font-bold text-sm shrink-0 uppercase border border-teal-100/50 dark:border-teal-950/20">
                                                {u.username.substring(0, 2)}
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                                {u.username}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                                            <Mail size={16} className="text-slate-400 dark:text-slate-500" />
                                            <span>{u.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                                            <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                                            <span>{new Date(u.createdAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </Layout>
    );
}
