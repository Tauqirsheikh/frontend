import api from "@/lib/axios";

export const loginUser = async (data: any) => {
    const response = await api.post("/auth/login", data);

    return response.data;
};