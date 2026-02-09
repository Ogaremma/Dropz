"use client";

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { usePrivy } from "@privy-io/react-auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dropz.onrender.com";

export function useAuth() {
    const { login: loginWithPrivy, logout: logoutPrivy, authenticated: privyAuthenticated, ready, user: privyUser } = usePrivy();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customAuth, setCustomAuth] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCustomAuth(!!localStorage.getItem("dropz_auth_token"));
        }
    }, []);

    const logout = useCallback(async () => {
        await logoutPrivy();
        if (typeof window !== "undefined") {
            localStorage.removeItem("dropz_auth_token");
            localStorage.removeItem("dropz_custom_wallet");
            window.location.href = "/";
        }
    }, [logoutPrivy]);

    const registerWithEmail = async (email: string, pass: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BACKEND_URL}/auth/email/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            localStorage.setItem("dropz_auth_token", data.token);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BACKEND_URL}/auth/email/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: pass }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("dropz_auth_token", data.token);
            return data;
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
            const res = await fetch(`${BACKEND_URL}/auth/seed/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet: address, seedPhrase: seed }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            localStorage.setItem("dropz_auth_token", data.token);
            localStorage.setItem("dropz_custom_wallet", JSON.stringify({ address, seed }));
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
            const res = await fetch(`${BACKEND_URL}/auth/seed/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet: wallet.address, seedPhrase: seed }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("dropz_auth_token", data.token);
            localStorage.setItem("dropz_custom_wallet", JSON.stringify({ address: wallet.address, seed }));
            setCustomAuth(true);
            return data;
        } catch (err: any) {
            setError(err.message || "Invalid seed phrase");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const isCustomAuthenticated = () => {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem("dropz_auth_token");
    };

    return {
        ready,
        authenticated: privyAuthenticated || customAuth,
        loading,
        error,
        loginWithPrivy,
        registerWithEmail,
        loginWithEmail,
        generateSeedphrase,
        registerSeedphraseWallet,
        loginWithSeedphrase,
        logout,
        user: privyUser || (customAuth ? { custom: true } : null),
    };
}
