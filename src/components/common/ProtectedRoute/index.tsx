import {
    useEffect,
} from "react";

import {
    useRouter,
} from "next/router";

import {
    useAuth,
} from "@/context/AuthContext";

export default function ProtectedRoute({
    children,
}: any) {

    const {
        user,
        loading,
    } = useAuth();

    const router = useRouter();

    useEffect(() => {

        if (!loading && !user) {

            router.replace("/login");

        }

    }, [loading, user]);

    if (loading)
        return null;

    if (!user)
        return null;

    return children;

}