import React, { createContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, signupUser } from "../services/authService";
import {
    getStoredToken,
    getStoredUser,
    setStoredAuth,
    clearStoredAuth,
} from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getStoredToken());
    const [user, setUser] = useState(getStoredUser());
    const [loading, setLoading] = useState(!!getStoredToken());

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = getStoredToken();
            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const res = await getCurrentUser();
                setUser(res.data);
            } catch (error) {
                clearStoredAuth();
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const { token, data: user } = await loginUser(credentials);
            localStorage.setItem("token", token);
            setUser(user);
            setToken(token);
        } catch (error) {
            throw new Error(error?.response?.data?.error || "Login failed");
        }
    };

    const signup = async (userData) => {
        try {
            const { token, data: user } = await signupUser(userData);
            localStorage.setItem("token", token);
            setUser(user);
            setToken(token);
        } catch (error) {
            throw new Error(error?.response?.data?.error || "Signup failed");
        }
    };

    const logout = () => {
        clearStoredAuth();
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            token,
            user,
            loading,
            isAuthenticated: !!token,
            login,
            signup,
            logout,
            setUser,
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}