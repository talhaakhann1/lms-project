"use client"

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from "@/src/services/auth.service";
import { logIn } from "@/src/store/authSlice";
import { useAppDispatch } from "@/src/store/hook";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { OAuthFallback, OAuthLoadingCard } from "@/src/components/auth/OAuthCallback";

function GoogleAuthContent() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code');

    const dispatch = useAppDispatch()

    const hasProcessedCode = useRef(false);

    useEffect(() => {
        if (hasProcessedCode.current) return;
        if (!code) {
            router.replace("/");
            setLoading(false);
            return;
        }

        hasProcessedCode.current = true;
        const handleGoogleAuth = async () => {

            try {
                const user = await authService.loginWithGoogle(code);
                await new Promise((res) => {
                    setTimeout(() => {
                        res("reslove")
                    }, 700)
                })
                dispatch(logIn(user))
                if (["admin", "instructor"].includes(user.role)) {
                    router.replace("/admin");
                } else {
                    router.replace("/dashboard");
                }
                showSuccess("Signed in successfully through google")
            } catch (error: unknown) {
                showError(
                    error instanceof Error
                        ? error.message
                        : "Google authentication failed"
                );

                await new Promise((res) => {
                    setTimeout(() => {
                        res("reslove")
                    }, 700)
                })

                router.replace("/sign-in");
            } finally {
                setLoading(false);
            }
        };

        handleGoogleAuth();
    }, [code, dispatch, router]);

    return <OAuthLoadingCard provider="google" />;
}

export default function GoogleAuth() {
    return (
        <Suspense fallback={<OAuthFallback />}>
            <GoogleAuthContent />
        </Suspense>
    );
}