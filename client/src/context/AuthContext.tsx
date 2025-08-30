import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { ClerkProvider, useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { createClient, Session, User as SupabaseUser } from "@supabase/supabase-js";

// ✅ Supabase init
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Types
interface AuthContextType {
    isAuthenticated: boolean;
    clerkUser: ReturnType<typeof useUser>["user"] | null;
    supabaseUser: SupabaseUser | null;
    session: Session | null;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { isSignedIn } = useClerkAuth();
    const { user } = useUser();
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // 🟢 Track Supabase session
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event: string, session: Session | null) => {
                setSession(session);
                setSupabaseUser(session?.user ?? null);
            }
        );

        // fetch current session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setSupabaseUser(data.session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!isSignedIn || !!supabaseUser,
                clerkUser: user,
                supabaseUser,
                session,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Hook
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
