"use client"

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { authService } from "@/src/services/auth.service";
import { logIn } from "@/src/store/authSlice";
import { useAppDispatch } from "@/src/store/hook";
import { OAuthFallback, OAuthLoadingCard } from "@/src/components/auth/OAuthCallback";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";

function GithubAuthContent() {
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
        const handleGithubAuth = async () => {

            try {
                const user = await authService.loginWithGithub(code);
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
                showSuccess("Signed in successfully through github")
            } catch (error: unknown) {
                const AxiosError = error as AxiosError<ApiResponse<unknown>>

                let errorMessage = AxiosError.response?.data.message

                showError(errorMessage ?? "")
                await new Promise((res) => {
                    setTimeout(() => {
                        res("reslove")
                    }, 700)
                })
                router.replace("/");
            } finally {
                setLoading(false);
            }
        };

        handleGithubAuth();
    }, [code]);

    return <OAuthLoadingCard provider="github" />;
}


export default function GithubAuth() {
    return (
        <Suspense fallback={<OAuthFallback />}>
            <GithubAuthContent />
        </Suspense>
    );
}