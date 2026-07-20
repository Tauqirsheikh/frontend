import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, UserCheck } from "lucide-react";

interface EmployeeFormModalProps {
    isOpen: boolean;
    editingEmployee: any | null;
    submitting: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
    isOpen,
    editingEmployee,
    submitting,
    onClose,
    onSubmit,
}) => {
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (editingEmployee) {
            setValue("employeeCode", editingEmployee.employeeCode);
            setValue("firstName", editingEmployee.firstName);
            setValue("lastName", editingEmployee.lastName);
            setValue("email", editingEmployee.email);
            setValue("mobile", editingEmployee.mobile);
            setValue("department", editingEmployee.department);
            setValue("designation", editingEmployee.designation);
            const formattedDate = editingEmployee.joiningDate
                ? new Date(editingEmployee.joiningDate).toISOString().split("T")[0]
                : "";
            setValue("joiningDate", formattedDate);
            setValue("status", editingEmployee.status);
        } else {
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
        }
    }, [editingEmployee, isOpen, setValue, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-[550px] max-w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {editingEmployee ? "Edit Employee Profile" : "Register Employee"}
                    </h2>
                    <button
                        onClick={onClose}
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
                            onClick={onClose}
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
    );
};
