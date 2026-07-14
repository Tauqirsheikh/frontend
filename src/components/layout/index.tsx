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
            <div className="flex">
                <Sidebar />

                <div className="flex-1">
                    <Header />

                    <main className="p-8">{children}</main>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Layout;