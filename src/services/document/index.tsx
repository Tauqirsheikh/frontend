import api from "@/lib/axios";

export const getDocuments = async () => {
    const response = await api.get("/documents");

    return response.data;
};

export const deleteDocument = async (id: number) => {
    return await api.delete(`/documents/${id}`);
};

export const createDocument = async (formData: FormData) => {
    return await api.post("/documents", formData);
};

export const updateDocument = async (
    id: number,
    formData: FormData
) => {
    return await api.put(`/documents/${id}`, formData);
};