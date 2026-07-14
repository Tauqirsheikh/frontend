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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Overview</h1>
                <p className="text-slate-500 mt-1">Here is a quick summary of your document repository.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Total Documents Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                            Total Documents
                        </h2>
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </span>
                    </div>
                    {loading ? (
                        <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg mt-4"></div>
                    ) : (
                        <p className="text-4xl mt-4 font-bold text-slate-900">
                            {totalDocs}
                        </p>
                    )}
                </div>

                {/* Uploaded Today Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                            Uploaded Today
                        </h2>
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </span>
                    </div>
                    {loading ? (
                        <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-lg mt-4"></div>
                    ) : (
                        <p className="text-4xl mt-4 font-bold text-slate-900">
                            {uploadedToday}
                        </p>
                    )}
                </div>

                {/* Logged User Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                            Logged User
                        </h2>
                        <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xl font-bold text-slate-900">
                            {user?.username || "Guest User"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            {user?.email || "No email available"}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}