import Link from "next/link";
import { useRouter } from "next/router";
import {
    LayoutDashboard,
    FileText,
    LogOut,
} from "lucide-react";

const Sidebar = () => {
    const router = useRouter();

    const menu = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
        },
        {
            name: "Documents",
            icon: FileText,
            href: "/dashboard/documents",
        },
    ];

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <aside className="w-64 h-screen bg-blue-600 text-white flex flex-col">
            <div className="text-2xl font-bold p-6 border-b border-blue-500">
                DMS
            </div>

            <nav className="flex-1 px-4 py-5">
                {menu.map((item) => {
                    const Icon = item.icon;

                    const active =
                        router.pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition ${active
                                ? "bg-white text-blue-600"
                                : "hover:bg-blue-700"
                                }`}
                        >
                            <Icon size={20} />

                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 rounded-lg py-3"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;