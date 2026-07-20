import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    bulkDeleteEmployees,
} from "@/services/employee";
import { toast } from "sonner";
import {
    Plus,
    Edit2,
    Trash2,
    Briefcase,
    Calendar,
    CheckCircle2,
    XCircle,
    Mail,
    Phone,
    Layers,
    MoreHorizontal,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { EmployeeFormModal } from "@/section/employees/EmployeeFormModal";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface EmployeeType {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    department: string;
    designation: string;
    joiningDate: string;
    status: boolean;
}

export default function Employees() {
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Delete state
    const [deletingEmployee, setDeletingEmployee] = useState<EmployeeType | null>(null);
    const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
    const [deleting, setDeleting] = useState(false);

    const fetchEmployeesData = async () => {
        setLoading(true);
        try {
            const response = await getEmployees();
            setEmployees(response.data || []);
        } catch (error: any) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesData();
    }, []);

    const handleOpenCreate = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (emp: EmployeeType) => {
        setEditingEmployee(emp);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (emp: EmployeeType) => {
        try {
            const formattedDate = emp.joiningDate ? new Date(emp.joiningDate).toISOString().split("T")[0] : "";
            await updateEmployee(emp.id, {
                employeeCode: emp.employeeCode,
                firstName: emp.firstName,
                lastName: emp.lastName,
                email: emp.email,
                mobile: emp.mobile,
                department: emp.department,
                designation: emp.designation,
                joiningDate: formattedDate,
                status: !emp.status,
            });
            toast.success(`Employee "${emp.firstName} ${emp.lastName}" status updated`);
            fetchEmployeesData();
        } catch (error: any) {
            console.error("Status toggle error:", error);
            toast.error("Failed to update status");
        }
    };

    const handleSubmitForm = async (data: any) => {
        setSubmitting(true);
        try {
            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, data);
                toast.success("Employee details updated successfully");
            } else {
                await createEmployee(data);
                toast.success("Employee created successfully");
            }
            setIsModalOpen(false);
            fetchEmployeesData();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error.response?.data?.message || "Operation failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmSingleDelete = async () => {
        if (!deletingEmployee) return;
        setDeleting(true);
        try {
            await deleteEmployee(deletingEmployee.id);
            toast.success(`Employee "${deletingEmployee.firstName} ${deletingEmployee.lastName}" deleted successfully`);
            setDeletingEmployee(null);
            fetchEmployeesData();
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete employee");
        } finally {
            setDeleting(false);
        }
    };

    const handleConfirmBulkDelete = async () => {
        if (bulkDeleteIds.length === 0) return;
        setDeleting(true);
        try {
            await bulkDeleteEmployees(bulkDeleteIds as number[]);
            toast.success(`Successfully deleted ${bulkDeleteIds.length} employee(s)`);
            setBulkDeleteIds([]);
            fetchEmployeesData();
        } catch (error: any) {
            console.error("Bulk delete error:", error);
            toast.error(error.response?.data?.message || "Failed to delete selected employees");
        } finally {
            setDeleting(false);
        }
    };

    const columns: ColumnDef<EmployeeType>[] = [
        {
            id: "employeeCode",
            header: "Code",
            accessorKey: "employeeCode",
            width: "w-24",
            cell: (row) => <span className="font-bold text-slate-600 dark:text-slate-400 text-xs">#{row.employeeCode}</span>,
        },
        {
            id: "employee",
            header: "Employee",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] dark:text-[#18beb8] flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-teal-100/50 dark:border-teal-950/20">
                        {row.firstName.substring(0, 1)}{row.lastName.substring(0, 1)}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">
                        {row.firstName} {row.lastName}
                    </span>
                </div>
            ),
        },
        {
            id: "contactInfo",
            header: "Contact Info",
            cell: (row) => (
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]" title={row.email}>{row.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        <span>{row.mobile}</span>
                    </div>
                </div>
            ),
        },
        {
            id: "designation",
            header: "Designation",
            accessorKey: "designation",
            cell: (row) => <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold whitespace-nowrap">{row.designation}</span>,
        },
        {
            id: "department",
            header: "Department",
            accessorKey: "department",
            cell: (row) => (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    <Layers size={10} className="text-slate-400 shrink-0" />
                    {row.department}
                </div>
            ),
        },
        {
            id: "status",
            header: "Status",
            accessorKey: "status",
            width: "w-28",
            cell: (row) => (
                <button
                    onClick={() => handleToggleStatus(row)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 border whitespace-nowrap ${row.status
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                        : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30"
                        }`}
                >
                    {row.status ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {row.status ? "Active" : "Inactive"}
                </button>
            ),
        },
        {
            id: "joiningDate",
            header: "Joined Date",
            accessorKey: "joiningDate",
            width: "w-32",
            cell: (row) => (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>{new Date(row.joiningDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 select-none">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Employees</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage employee profiles, designations, and departments.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 bg-[#18beb8] hover:bg-[#129a95] text-white rounded-xl py-3 px-5 font-semibold transition duration-300 shadow-lg shadow-teal-500/10"
                >
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            <DataTable
                data={employees}
                columns={columns}
                searchPlaceholder="Filter employees..."
                loading={loading}
                emptyIcon={<Briefcase size={32} />}
                emptyTitle="No employees found"
                emptyDescription="Click 'Add Employee' to register your first worker profile."
                onRefresh={() => {
                    toast.info("Refreshed employees list");
                    fetchEmployeesData();
                }}
                onBulkDelete={(ids) => setBulkDeleteIds(ids)}
                actions={(row) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                            <MoreHorizontal size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleOpenEdit(row)}>
                                <Edit2 size={14} className="mr-2 text-slate-500" />
                                Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setDeletingEmployee(row)}
                                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
                            >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            {/* Form Modal */}
            <EmployeeFormModal
                isOpen={isModalOpen}
                editingEmployee={editingEmployee}
                submitting={submitting}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitForm}
            />

            {/* Single Delete Confirmation */}
            <ConfirmModal
                isOpen={!!deletingEmployee}
                title="Delete Employee"
                description={
                    <>
                        Are you sure you want to delete employee <strong className="text-slate-800 dark:text-white">"{deletingEmployee?.firstName} {deletingEmployee?.lastName}"</strong>?
                    </>
                }
                loading={deleting}
                onConfirm={handleConfirmSingleDelete}
                onCancel={() => setDeletingEmployee(null)}
            />

            {/* Bulk Delete Confirmation */}
            <ConfirmModal
                isOpen={bulkDeleteIds.length > 0}
                title="Delete Selected Employees"
                description={
                    <>
                        Are you sure you want to delete <strong className="text-slate-800 dark:text-white">{bulkDeleteIds.length}</strong> selected employee(s)?
                    </>
                }
                loading={deleting}
                onConfirm={handleConfirmBulkDelete}
                onCancel={() => setBulkDeleteIds([])}
            />
        </Layout>
    );
}
