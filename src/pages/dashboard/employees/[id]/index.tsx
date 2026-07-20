import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/layout";
import { getEmployeeById, deleteEmployee } from "@/services/employee";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Mail, Phone, Layers, Briefcase, CheckCircle2, XCircle } from "lucide-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function EmployeeDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchEmployee = async () => {
            setLoading(true);
            try {
                const response = await getEmployeeById(id as string);
                setEmployee(response.data);
            } catch (error: any) {
                console.error("Error fetching employee:", error);
                toast.error("Failed to load employee profile");
                router.push("/dashboard/employees");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id, router]);

    const handleDelete = async () => {
        if (!id) return;
        setDeleting(true);
        try {
            await deleteEmployee(id as string);
            toast.success("Employee deleted successfully");
            router.push("/dashboard/employees");
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error("Failed to delete employee");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col gap-6 animate-pulse select-none">
                    <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 h-80"></div>
                </div>
            </Layout>
        );
    }

    if (!employee) {
        return (
            <Layout>
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Employee profile not found</h3>
                    <Link href="/dashboard/employees" className="mt-4 inline-block text-teal-600 hover:underline">
                        Back to Employees
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-6 select-none">
                <Link
                    href="/dashboard/employees"
                    className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#18beb8] dark:hover:text-[#18beb8] transition font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Employees
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm max-w-3xl transition-colors space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] flex items-center justify-center font-bold text-xl uppercase border border-teal-100/50">
                            {employee.firstName.substring(0, 1)}{employee.lastName.substring(0, 1)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                                {employee.firstName} {employee.lastName}
                            </h1>
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">#{employee.employeeCode}</p>
                        </div>
                    </div>
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${employee.status
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                            }`}
                    >
                        {employee.status ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {employee.status ? "Active" : "Inactive"}
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Mail size={16} className="text-slate-400" />
                            <span className="font-semibold">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Phone size={16} className="text-slate-400" />
                            <span>{employee.mobile}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Briefcase size={16} className="text-slate-400" />
                            <span className="font-semibold">{employee.designation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Layers size={16} className="text-slate-400" />
                            <span>{employee.department}</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Joined: {new Date(employee.joiningDate).toLocaleDateString()}</span>
                    </div>

                    <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="text-red-600 hover:text-red-700 font-semibold transition"
                    >
                        Delete Profile
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={isDeleteOpen}
                title="Delete Employee"
                description={
                    <>
                        Are you sure you want to delete employee <strong className="text-slate-800 dark:text-white">"{employee.firstName} {employee.lastName}"</strong>?
                    </>
                }
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
            />
        </Layout>
    );
}
