import { ReactNode } from "react";
import Sidebar from "./sideBar";
import Header from "./header";
import ProtectedRoute from "@/components/common/ProtectedRoute";

interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    <Header />

                    <main className="p-8 flex-1">{children}</main>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Layout;