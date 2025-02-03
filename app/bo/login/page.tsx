"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signInWithGoogle } from "../../../lib/firebase";


const LoginPage = () => {

    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectPath = searchParams.get("redirect") || "";

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();

            if (redirectPath) {
                router.push(redirectPath);
            }
        } catch (error) {
            console.error("Error logging in with Google", error);
        }
    };

    return <div className="flex items-center justify-center min-h-screen">
        <div className="p-6">
            <div className="text-2xl font-bold text-golden">Login</div>
            <button
                onClick={handleGoogleSignIn}
                className="w-full px-4 py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Sign in with Google
            </button>
      </div>
    </div>
};

export default LoginPage;
