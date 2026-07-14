import { useForm } from "react-hook-form";

import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const { register, handleSubmit } =
        useForm();

    const { login } = useAuth();

    const onSubmit = async (data: any) => {
        await login(data);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-100">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-xl rounded-xl p-8 w-[400px]"
            >
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
                    Document Management
                </h1>

                <input
                    {...register("email")}
                    placeholder="Email"
                    className="w-full border rounded-lg p-3 mb-4"
                />

                <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded-lg p-3 mb-6"
                />

                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3"
                >
                    Login
                </button>
            </form>

        </div>
    );
}