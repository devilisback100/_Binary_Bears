import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser, getCurrentUser } from "../services/authService";

export const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ CRITICAL: Restore auth on EVERY page load
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            // Try to restore user from token
            const restoreUser = async () => {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token invalid/expired → clear it
                    localStorage.removeItem("token");
                    setUser(null);
                    setIsAuthenticated(false);
                } finally {
                    setLoading(false);
                }
            };

            restoreUser();
        } else {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const { token, data: userData } = await loginUser(credentials);
            localStorage.setItem("token", token);
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
            setIsAuthenticated(false);
            throw new Error(error?.response?.data?.message || "Login failed");
        }
    };

    const signup = async (userData) => {
        try {
            const { token, data: userDataResponse } = await signupUser(userData);
            localStorage.setItem("token", token);
            setUser(userDataResponse);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            localStorage.removeItem("token");
            throw new Error(error?.response?.data?.message || "Signup failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    // Show loading spinner until auth restored
    if (loading) {
        return (
            <div className="auth-loading">
                <div className="spinner"></div>
                <p>Checking authentication...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}