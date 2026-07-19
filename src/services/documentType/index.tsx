import api from "@/lib/axios";

export const getDocumentTypes = async () => {
    const response = await api.get("/document-types");
    return response.data;
};

export const getDocumentTypeById = async (id: string | number) => {
    const response = await api.get(`/document-types/${id}`);
    return response.data;
};

export const createDocumentType = async (data: { documentTypeName: string; description?: string; isActive?: boolean }) => {
    const response = await api.post("/document-types", data);
    return response.data;
};

export const updateDocumentType = async (id: string | number, data: { documentTypeName: string; description?: string; isActive?: boolean }) => {
    const response = await api.put(`/document-types/${id}`, data);
    return response.data;
};

export const deleteDocumentType = async (id: string | number) => {
    const response = await api.delete(`/document-types/${id}`);
    return response.data;
};
