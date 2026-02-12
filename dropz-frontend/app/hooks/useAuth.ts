"use client";

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dropz.onrender.com";

// Device detection utility
const getDeviceType = (): 'mobile' | 'desktop' => {
    if (typeof window === 'undefined') return 'desktop';
    const ua = navigator.userAgent;
    return /Mobile|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop';
};

export function useAuth() {
    const { login: loginWithPrivy, logout: logoutPrivy, authenticated: privyAuthenticated, ready, user: privyUser } = usePrivy();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customAuth, setCustomAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCustomAuth(!!localStorage.getItem("dropz_auth_token"));
        }
    }, []);

    // Session timeout monitoring - check every minute
    useEffect(() => {
        const checkSession = () => {
            if (typeof window === "undefined") return;

            const expiryTime = localStorage.getItem("dropz_session_expiry");
            if (expiryTime && Date.now() > parseInt(expiryTime)) {
                // Session expired - auto logout
                localStorage.removeItem("dropz_auth_token");
                localStorage.removeItem("dropz_custom_wallet");
                localStorage.removeItem("dropz_session_expiry");
                setCustomAuth(false);
                router.push("/");
            }
        };

        // Check immediately on mount
        checkSession();

        // Then check every minute
        const interval = setInterval(checkSession, 60000);
        return () => clearInterval(interval);
    }, [router]);

    const logout = useCallback(async () => {
        await logoutPrivy();
        if (typeof window !== "undefined") {
            localStorage.removeItem("dropz_auth_token");
            localStorage.removeItem("dropz_custom_wallet");
            localStorage.removeItem("dropz_session_expiry");
            window.location.href = "/";
        }
    }, [logoutPrivy]);

    const updateProfile = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("dropz_auth_token");
            const wallet = JSON.parse(localStorage.getItem("dropz_custom_wallet") || "{}").address;

            const res = await fetch(`${BACKEND_URL}/auth/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...data, wallet }),
            });
            const updatedUser = await res.json();
            if (!res.ok) throw new Error(updatedUser.message || "Update failed");
            return updatedUser;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generateSeedphrase = async () => {
        setLoading(true);
        setError(null);
        try {
            const wallet = ethers.Wallet.createRandom();
            return {
                address: wallet.address,
                seedPhrase: wallet.mnemonic?.phrase,
                privateKey: wallet.privateKey,
            };
        } catch (err: any) {
            setError("Failed to generate wallet");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerSeedphraseWallet = async (address: string, seed: string) => {
        setLoading(true);
        setError(null);
        try {
            const deviceType = getDeviceType();
            const res = await fetch(`${BACKEND_URL}/auth/seed/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet: address, seedPhrase: seed, deviceType }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            // Calculate session expiry time
            const expiryDuration = deviceType === 'mobile' ? 60 * 60 * 1000 : 2 * 60 * 60 * 1000; // 1hr or 2hrs in ms
            const expiryTime = Date.now() + expiryDuration;

            localStorage.setItem("dropz_auth_token", data.token);
            localStorage.setItem("dropz_custom_wallet", JSON.stringify({ address, seed }));
            localStorage.setItem("dropz_session_expiry", expiryTime.toString());
            setCustomAuth(true);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginWithSeedphrase = async (seed: string) => {
        setLoading(true);
        setError(null);
        try {
            const wallet = ethers.Wallet.fromPhrase(seed);
            const deviceType = getDeviceType();
            const res = await fetch(`${BACKEND_URL}/auth/seed/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet: wallet.address, seedPhrase: seed, deviceType }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            // Calculate session expiry time
            const expiryDuration = deviceType === 'mobile' ? 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
            const expiryTime = Date.now() + expiryDuration;

            localStorage.setItem("dropz_auth_token", data.token);
            localStorage.setItem("dropz_custom_wallet", JSON.stringify({ address: wallet.address, seed }));
            localStorage.setItem("dropz_session_expiry", expiryTime.toString());
            setCustomAuth(true);
            return data;
        } catch (err: any) {
            setError(err.message || "Invalid seed phrase");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const setPassword = async (wallet: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("dropz_auth_token");
            const res = await fetch(`${BACKEND_URL}/auth/set-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ wallet, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to set password");
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginWithPassword = async (wallet: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const deviceType = getDeviceType();
            const res = await fetch(`${BACKEND_URL}/auth/login-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet, password, deviceType }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            // Calculate session expiry time
            const expiryDuration = deviceType === 'mobile' ? 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
            const expiryTime = Date.now() + expiryDuration;

            localStorage.setItem("dropz_auth_token", data.token);
            localStorage.setItem("dropz_custom_wallet", JSON.stringify({ address: wallet }));
            localStorage.setItem("dropz_session_expiry", expiryTime.toString());
            setCustomAuth(true);
            return data;
        } catch (err: any) {
            setError(err.message || "Invalid credentials");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        ready,
        authenticated: privyAuthenticated || customAuth,
        loading,
        error,
        loginWithPrivy,
        generateSeedphrase,
        registerSeedphraseWallet,
        loginWithSeedphrase,
        setPassword,
        loginWithPassword,
        updateProfile,
        logout,
        user: privyUser || (customAuth ? { custom: true } : null),
    };
}
