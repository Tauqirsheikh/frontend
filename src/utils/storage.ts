const TOKEN_KEY = "token";
const USER_KEY = "user";

export const setAuth = (token: string, user: any) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
    if (typeof window === "undefined") return null;

    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};