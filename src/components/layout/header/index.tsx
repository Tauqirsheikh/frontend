import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const Header = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="bg-white dark:bg-slate-900 h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 transition-colors duration-200 shadow-sm z-10">
            <h1 className="font-bold text-xl text-slate-800 dark:text-white">
                Document Management
            </h1>

            <div className="flex items-center gap-6">
                {mounted ? (
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        title="Toggle Dark/Light Theme"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                ) : (
                    <div className="w-[38px] h-[38px] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                )}

                <div className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    Welcome 👋
                </div>
            </div>
        </header>
    );
};

export default Header;