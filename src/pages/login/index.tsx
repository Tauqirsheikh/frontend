import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
    User,
    Lock,
    Loader2,
    Menu,
} from "lucide-react";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { login } = useAuth();

    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        setSubmitting(true);

        try {
            await login(data);
            toast.success("Logged in successfully!");
        } catch (error: any) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Invalid email or password"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#18beb8] text-white flex flex-col">

            {/* ================= BACKGROUND: Concentric Circles from Top-Left ================= */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                {/* Concentric waves radiating from top-left */}
                <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] rounded-full bg-[#0e8a83]/30"></div>
                <div className="absolute -top-[300px] -left-[300px] w-[750px] h-[750px] rounded-full bg-[#149f98]/25"></div>
                <div className="absolute -top-[400px] -left-[400px] w-[1000px] h-[1000px] rounded-full bg-[#1bc5bd]/20"></div>
                <div className="absolute -top-[500px] -left-[500px] w-[1250px] h-[1250px] rounded-full bg-[#2ee0d6]/15"></div>
                <div className="absolute -top-[600px] -left-[600px] w-[1500px] h-[1500px] rounded-full bg-[#36d1ca]/10"></div>

                {/* Additional soft background curves */}
                <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[#0e8a83]/20"></div>
                <div className="absolute -bottom-[300px] -right-[300px] w-[800px] h-[800px] rounded-full bg-[#17b3ac]/20"></div>
                <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-[#0e8a83]/15"></div>
            </div>

            {/* ================= PAGE CONTAINER ================= */}
            <div className="relative z-10 flex flex-col flex-1">

                {/* ================= NAVBAR ================= */}
                <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-8 py-8">
                    <h1 className="text-[28px] sm:text-[34px] font-light tracking-wide">
                        <span className="font-bold">DMS</span> VAULT
                    </h1>

                    <nav className="hidden items-center gap-10 text-sm font-semibold text-white lg:flex">
                        <a href="#" className="transition hover:opacity-80">Home</a>
                        <a href="#" className="transition hover:opacity-80">Features</a>
                        <a href="#" className="transition hover:opacity-80">About</a>
                        <a href="#" className="transition hover:opacity-80">Service</a>
                        <a href="#" className="transition hover:opacity-80">Contact</a>

                        <button className="p-1.5 hover:bg-white/10 rounded-lg transition">
                            <Menu size={20} />
                        </button>
                    </nav>

                    <button className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition">
                        <Menu size={24} />
                    </button>
                </header>

                {/* ================= CONTENT CONTAINER ================= */}
                <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between px-8 py-12 lg:py-0 gap-12">

                    {/* LEFT SIDE: Tags & Intro */}
                    <div className="w-full lg:w-[55%] space-y-6 text-left select-none">
                        <h2 className="leading-none">
                            <span className="block text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
                                Creative.
                            </span>
                            <span className="mt-2 block text-2xl sm:text-3xl font-semibold text-teal-50/90">
                                Enterprise Document Workspace
                            </span>
                        </h2>

                        <p className="max-w-xl text-sm leading-7 text-white/85">
                            Vestibulum vitae felis at sapien iaculis molestie.
                            Nulla a leo a lectus volutpat faucibus.
                            Mauris lobortis sapien vel odio rutrum,
                            id pharetra erat blandit.
                            Ut sed neque sed diam finibus auctor.
                            Integer quis odio non augue ullamcorper
                            mattis sit amet eget est.
                            Aenean aliquam metus,
                            et pulvinar nulla malesuada in.
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-8">
                            <button
                                className="
                                    rounded-full
                                    border-2
                                    border-white
                                    px-8
                                    py-3
                                    text-xs
                                    font-bold
                                    tracking-widest
                                    transition
                                    hover:bg-white
                                    hover:text-[#18beb8]
                                "
                            >
                                LEARN MORE
                            </button>

                            <div className="flex gap-3 items-center">
                                <span className="h-2.5 w-2.5 rounded-full border-2 border-white/60"></span>
                                <span className="h-2.5 w-2.5 rounded-full border-2 border-white/60"></span>
                                <span className="h-2.5 w-2.5 rounded-full bg-white"></span>
                                <span className="h-2.5 w-2.5 rounded-full border-2 border-white/60"></span>
                                <span className="h-2.5 w-2.5 rounded-full border-2 border-white/60"></span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Login Card */}
                    <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
                        <div className="w-full max-w-[380px] rounded-[32px] bg-white p-8 sm:p-10 shadow-2xl text-slate-800 border border-slate-100/30">

                            <div className="mb-10 text-center">
                                <h3 className="text-sm font-bold tracking-[0.25em] text-gray-400 uppercase">
                                    DMS VAULT
                                </h3>
                                <div className="mx-auto mt-2 h-[2px] w-12 bg-gray-300"></div>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* ================= EMAIL input ================= */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-4 border-b border-gray-300 pb-2 focus-within:border-[#18beb8] transition duration-200">
                                        <User
                                            size={22}
                                            className="text-gray-400 shrink-0"
                                        />
                                        <input
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                            type="email"
                                            placeholder="ENTER USERNAME"
                                            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 placeholder:text-[10px] placeholder:font-bold placeholder:tracking-wider placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-[10px] text-red-500 font-bold mt-1 pl-9">
                                            {errors.email.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* ================= PASSWORD input ================= */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-4 border-b border-gray-300 pb-2 focus-within:border-[#18beb8] transition duration-200">
                                        <Lock
                                            size={22}
                                            className="text-gray-400 shrink-0"
                                        />
                                        <input
                                            {...register("password", {
                                                required: "Password is required",
                                            })}
                                            type="password"
                                            placeholder="ENTER PASSWORD"
                                            className="w-full border-none bg-transparent p-0 text-sm text-gray-800 placeholder:text-[10px] placeholder:font-bold placeholder:tracking-wider placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-[10px] text-red-500 font-bold mt-1 pl-9">
                                            {errors.password.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* ================= LOGIN BUTTON ================= */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="
                                        mt-4
                                        flex
                                        h-12
                                        w-full
                                        items-center
                                        justify-center
                                        bg-[#18beb8]
                                        text-xs
                                        font-bold
                                        tracking-widest
                                        text-white
                                        transition
                                        hover:bg-[#129a95]
                                        disabled:opacity-70
                                        rounded-md
                                        shadow-lg
                                        shadow-teal-500/20
                                    "
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            LOGGING IN...
                                        </>
                                    ) : (
                                        "LOGIN"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}