import Link from "next/link";
import { useRouter } from "next/router";
import {
    LayoutDashboard,
    FileText,
    LogOut,
    Users,
    Tags,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
    const router = useRouter();
    const { logout } = useAuth();

    const menu = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
        },
        {
            name: "Document Types",
            icon: Tags,
            href: "/dashboard/document-types",
        },
        {
            name: "Documents",
            icon: FileText,
            href: "/dashboard/documents",
        },
        {
            name: "Users",
            icon: Users,
            href: "/dashboard/user",
        },
    ];

    return (
        <aside className="w-64 h-screen bg-[#18beb8] dark:bg-[#118c87] text-white flex flex-col border-r border-[#149f9a] dark:border-[#0e7571] transition-colors duration-200 shrink-0">
            <div className="text-2xl font-bold p-6 border-b border-[#149f9a] dark:border-[#0e7571] tracking-wider select-none">
                DMS VAULT
            </div>

            <nav className="flex-1 px-4 py-5 select-none">
                {menu.map((item) => {
                    const Icon = item.icon;

                    // Support active highlighting even for nested subpaths (like details view)
                    const active = item.href === "/dashboard"
                        ? router.pathname === "/dashboard"
                        : router.pathname === item.href || router.pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition font-medium text-sm ${active
                                ? "bg-white text-[#18beb8] dark:bg-slate-950 dark:text-[#18beb8] shadow-sm font-semibold"
                                : "hover:bg-white/10 text-white"
                                }`}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 rounded-xl py-3 font-semibold text-sm transition shadow-lg shadow-red-500/10"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;