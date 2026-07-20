import api from "@/lib/axios";

export const getDocuments = async () => {
    const response = await api.get("/documents");
    return response.data;
};

export const getDocumentById = async (id: number | string) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
};

export const deleteDocument = async (id: number) => {
    return await api.delete(`/documents/${id}`);
};

export const createDocument = async (formData: FormData) => {
    return await api.post("/documents", formData);
};

export const updateDocument = async (
    id: number | string,
    formData: FormData
) => {
    return await api.put(`/documents/${id}`, formData);
};

export const bulkDeleteDocuments = async (ids: number[]) => {
    const response = await api.delete("/documents/bulk-delete", { data: { ids } });
    return response.data;
};