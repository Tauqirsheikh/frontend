import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/router";

import {
    clearAuth,
    getToken,
    getUser,
    setAuth,
} from "@/utils/storage";

import { loginUser } from "@/services/auth";

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const AuthProvider = ({
    children,
}: any) => {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (token) {
            setUser(getUser());
        }

        setLoading(false);
    }, []);

    const login = async (data: any) => {
        const response = await loginUser(data);

        setAuth(
            response.data.token,
            response.data.user
        );

        setUser(response.data.user);

        router.push("/dashboard");
    };

    const logout = () => {
        clearAuth();

        setUser(null);

        router.replace("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);