"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { usePrivy } from "@privy-io/react-auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://dropz.onrender.com";

export function useAuth() {
    const { login: loginWithPrivy, logout: logoutPrivy, authenticated, ready, user: privyUser } = usePrivy();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const logout = useCallback(async () => {
        await logoutPrivy();
        localStorage.removeItem("dropz_auth_token");
        localStorage.removeItem("dropz_custom_wallet");
        window.location.href = "/";
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

    const importSeedphraseWallet = async (seed: string) => {
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
            // If already registered, we should probably login or just store it

            localStorage.setItem("dropz_auth_token", data.token);
            localStorage.setItem("dropz_custom_wallet", JSON.stringify({ address: wallet.address, seed }));
            return data;
        } catch (err: any) {
            setError("Invalid seed phrase or import failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const isCustomAuthenticated = () => {
        return !!localStorage.getItem("dropz_auth_token");
    };

    return {
        ready,
        authenticated: authenticated || isCustomAuthenticated(),
        loading,
        error,
        loginWithPrivy,
        registerWithEmail,
        loginWithEmail,
        generateSeedphrase,
        registerSeedphraseWallet,
        importSeedphraseWallet,
        logout,
        user: privyUser || (isCustomAuthenticated() ? { custom: true } : null),
    };
}
