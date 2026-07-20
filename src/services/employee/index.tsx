import api from "@/lib/axios";

export const getEmployees = async () => {
    const response = await api.get("/employees");
    return response.data;
};

export const getEmployeeById = async (id: string | number) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};

export const createEmployee = async (data: {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    department: string;
    designation: string;
    joiningDate: string;
    status?: boolean;
}) => {
    const response = await api.post("/employees", data);
    return response.data;
};

export const updateEmployee = async (
    id: string | number,
    data: {
        employeeCode: string;
        firstName: string;
        lastName: string;
        email: string;
        mobile: string;
        department: string;
        designation: string;
        joiningDate: string;
        status?: boolean;
    }
) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
};

export const deleteEmployee = async (id: string | number) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
};

export const bulkDeleteEmployees = async (ids: number[]) => {
    const response = await api.delete("/employees/bulk-delete", { data: { ids } });
    return response.data;
};
