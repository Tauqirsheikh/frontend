import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { useAuth } from "@/context/AuthContext";
import { getDocuments } from "@/services/document";
import { Document } from "@/types/document";

export default function Dashboard() {
    const { user } = useAuth();
    const [totalDocs, setTotalDocs] = useState(0);
    const [uploadedToday, setUploadedToday] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDocuments();
                const docList = response.data || [];
                setTotalDocs(docList.length);

                const today = new Date().toDateString();
                const todayCount = docList.filter((doc: Document) => {
                    return new Date(doc.createdAt).toDateString() === today;
                }).length;
                setUploadedToday(todayCount);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Layout>
            <div className="mb-8 select-none">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Here is a quick summary of your document repository.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Total Documents Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition duration-300 transition-colors">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                            Total Documents
                        </h2>
                        <span className="p-2.5 bg-teal-50 dark:bg-teal-950/40 text-[#18beb8] dark:text-[#18beb8] rounded-xl border border-teal-100/50 dark:border-teal-950/10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </span>
                    </div>
                    {loading ? (
                        <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg mt-4"></div>
                    ) : (
                        <p className="text-4xl mt-4 font-bold text-slate-900 dark:text-white">
                            {totalDocs}
                        </p>
                    )}
                </div>

                {/* Uploaded Today Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition duration-300 transition-colors">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                            Uploaded Today
                        </h2>
                        <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100/50 dark:border-emerald-950/10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </span>
                    </div>
                    {loading ? (
                        <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg mt-4"></div>
                    ) : (
                        <p className="text-4xl mt-4 font-bold text-slate-900 dark:text-white">
                            {uploadedToday}
                        </p>
                    )}
                </div>

                {/* Logged User Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition duration-300 transition-colors">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                            Logged User
                        </h2>
                        <span className="p-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-100/50 dark:border-purple-950/10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                    </div>
                    <div className="mt-4 select-none">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {user?.username || "Guest User"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {user?.email || "No email available"}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}