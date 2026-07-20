import api from "@/lib/axios";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const bulkDeleteUsers = async (ids: number[]) => {
    const response = await api.delete("/users/bulk-delete", { data: { ids } });
    return response.data;
};
