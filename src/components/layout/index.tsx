import { ReactNode } from "react";
import Sidebar from "./sideBar";
import Header from "./header";

interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1">
                <Header />

                <main className="p-8">{children}</main>
            </div>
        </div>
    );
};

export default Layout;