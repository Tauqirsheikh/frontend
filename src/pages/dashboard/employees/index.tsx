import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/layout";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from "@/services/employee";
import { toast } from "sonner";
import {
    Search,
    Plus,
    X,
    Edit2,
    Trash2,
    Briefcase,
    Calendar,
    CheckCircle2,
    XCircle,
    Loader2,
    Mail,
    Phone,
    Layers,
    UserCheck,
} from "lucide-react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { register, handleSubmit, reset, setValue } = useForm();

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

    // Reset pagination page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleOpenCreate = () => {
        setEditingEmployee(null);
        reset({
            employeeCode: "",
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            department: "",
            designation: "",
            joiningDate: "",
            status: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (emp: EmployeeType) => {
        setEditingEmployee(emp);
        setValue("employeeCode", emp.employeeCode);
        setValue("firstName", emp.firstName);
        setValue("lastName", emp.lastName);
        setValue("email", emp.email);
        setValue("mobile", emp.mobile);
        setValue("department", emp.department);
        setValue("designation", emp.designation);
        // Format joiningDate to YYYY-MM-DD for date input prefill
        const formattedDate = emp.joiningDate ? new Date(emp.joiningDate).toISOString().split("T")[0] : "";
        setValue("joiningDate", formattedDate);
        setValue("status", emp.status);
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
            toast.success(`Employee "${emp.firstName} ${emp.lastName}" status is now ${!emp.status ? "Active" : "Inactive"}`);
            fetchEmployeesData();
        } catch (error: any) {
            console.error("Status toggle error:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const onSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            if (editingEmployee) {
                // Update mode
                await updateEmployee(editingEmployee.id, {
                    employeeCode: data.employeeCode,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    mobile: data.mobile,
                    department: data.department,
                    designation: data.designation,
                    joiningDate: data.joiningDate,
                    status: data.status,
                });
                toast.success("Employee details updated successfully");
            } else {
                // Create mode
                await createEmployee({
                    employeeCode: data.employeeCode,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    mobile: data.mobile,
                    department: data.department,
                    designation: data.designation,
                    joiningDate: data.joiningDate,
                    status: data.status,
                });
                toast.success("Employee created successfully");
            }
            setIsModalOpen(false);
            reset();
            fetchEmployeesData();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error.response?.data?.message || "Operation failed. Ensure employee code and email are unique.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (emp: EmployeeType) => {
        if (confirm(`Are you sure you want to delete employee "${emp.firstName} ${emp.lastName}"?`)) {
            try {
                await deleteEmployee(emp.id);
                toast.success("Employee deleted successfully");
                fetchEmployeesData();
            } catch (error: any) {
                console.error("Delete error:", error);
                toast.error(error.response?.data?.message || "Failed to delete employee");
            }
        }
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination slices
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex items-center transition-colors">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by code, name, email, department, or designation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="flex gap-4 items-center animate-pulse">
                                <div className="h-4 w-10 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                                <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                                <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="text-center py-16 px-4 select-none">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No employees found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-sm">
                            {searchTerm ? "No employees match your search. Try another query." : "Click 'Add Employee' to register your first worker profile."}
                        </p>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950/50">
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5 w-24">Code</TableHead>
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5">Employee</TableHead>
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5">Contact Info</TableHead>
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5">Designation</TableHead>
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5">Department</TableHead>
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5 w-28">Status</TableHead>
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5 w-32">Joined Date</TableHead>
                                    <TableHead className="font-bold text-slate-500 dark:text-slate-400 px-5 py-3.5 w-28 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedEmployees.map((emp) => (
                                    <TableRow key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 transition-colors">
                                        <TableCell className="px-5 py-3.5 font-bold text-slate-600 dark:text-slate-400 text-xs">
                                            #{emp.employeeCode}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] dark:text-[#18beb8] flex items-center justify-center font-bold text-xs shrink-0 uppercase border border-teal-100/50 dark:border-teal-950/20">
                                                    {emp.firstName.substring(0, 1)}{emp.lastName.substring(0, 1)}
                                                </div>
                                                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">
                                                    {emp.firstName} {emp.lastName}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                    <Mail size={12} className="text-slate-400 shrink-0" />
                                                    <span className="truncate max-w-[180px]" title={emp.email}>{emp.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                    <Phone size={12} className="text-slate-400 shrink-0" />
                                                    <span>{emp.mobile}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-slate-700 dark:text-slate-200 text-sm font-semibold whitespace-nowrap">
                                            {emp.designation}
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-slate-600 dark:text-slate-300 text-sm">
                                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                                <Layers size={10} className="text-slate-400 shrink-0" />
                                                {emp.department}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5">
                                            <button
                                                onClick={() => handleToggleStatus(emp)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none cursor-pointer transition-colors duration-200 border whitespace-nowrap ${emp.status
                                                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                                                    : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30"
                                                    }`}
                                            >
                                                {emp.status ? (
                                                    <>
                                                        <CheckCircle2 size={12} />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={12} />
                                                        Inactive
                                                    </>
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-slate-600 dark:text-slate-300 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400 shrink-0" />
                                                <span>
                                                    {new Date(emp.joiningDate).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-3.5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenEdit(emp)}
                                                    className="p-1.5 text-slate-400 hover:text-[#18beb8] hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition"
                                                    title="Edit Profile"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                                                    title="Delete Profile"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors select-none">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
                                    </span>{" "}
                                    of <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredEmployees.length}</span> entries
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                                                page === currentPage
                                                    ? "bg-[#18beb8] text-white shadow-md shadow-teal-500/10"
                                                    : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal - Create/Edit Employee */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-[550px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editingEmployee ? "Edit Employee Profile" : "Register Employee"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Employee Code *
                                    </label>
                                    <input
                                        {...register("employeeCode", { required: true })}
                                        placeholder="e.g. EMP001"
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Joining Date *
                                    </label>
                                    <input
                                        type="date"
                                        {...register("joiningDate", { required: true })}
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300 dark:color-scheme-dark"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        {...register("firstName", { required: true })}
                                        placeholder="First name..."
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        {...register("lastName", { required: true })}
                                        placeholder="Last name..."
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email", { required: true })}
                                        placeholder="name@company.com"
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        {...register("mobile", { required: true })}
                                        placeholder="Phone number..."
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Department *
                                    </label>
                                    <input
                                        {...register("department", { required: true })}
                                        placeholder="e.g. Engineering, Sales, HR..."
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Designation *
                                    </label>
                                    <input
                                        {...register("designation", { required: true })}
                                        placeholder="e.g. Software Engineer, Manager..."
                                        className="w-full bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#18beb8]/20 focus:border-[#18beb8] transition duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 select-none pt-2">
                                <input
                                    type="checkbox"
                                    id="status"
                                    {...register("status")}
                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#18beb8] focus:ring-[#18beb8]/20 cursor-pointer"
                                />
                                <label
                                    htmlFor="status"
                                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5"
                                >
                                    <UserCheck size={16} className="text-slate-400" />
                                    Active employee status
                                </label>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-3 font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-[#18beb8] hover:bg-[#129a95] disabled:bg-[#18beb8]/70 text-white rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
