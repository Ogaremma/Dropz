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
            const res = await fetch(`${BACKEND_URL}/auth/seed/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet: address, seedPhrase: seed }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            localStorage.setItem("dropz_auth_token", data.token);
            localStorage.setItem("dropz_custom_wallet", JSON.stringify({ address, seed }));
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

    return {
        ready,
        authenticated: privyAuthenticated || customAuth,
        loading,
        error,
        loginWithPrivy,
        generateSeedphrase,
        registerSeedphraseWallet,
        loginWithSeedphrase,
        updateProfile,
        logout,
        user: privyUser || (customAuth ? { custom: true } : null),
    };
}
