import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace("/dashboard");
            } else {
                router.replace("/login");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="text-xl font-semibold text-blue-600 animate-pulse font-sans">
                Loading...
            </div>
        </div>
    );
}
