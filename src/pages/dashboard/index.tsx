import Layout from "@/components/layout";


export default function Dashboard() {
    return (
        <Layout>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold">
                        Total Documents
                    </h2>

                    <p className="text-4xl mt-4 font-bold text-blue-600">
                        0
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold">
                        Uploaded Today
                    </h2>

                    <p className="text-4xl mt-4 font-bold text-blue-600">
                        0
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-semibold">
                        Logged User
                    </h2>

                    <p className="text-xl mt-4">
                        Admin
                    </p>
                </div>
            </div>
        </Layout>
    );
}