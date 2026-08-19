import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = (globalThis as any).__AuthContext || ((globalThis as any).__AuthContext = createContext<AuthContextValue | null>(null));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
          email: firebaseUser.email || "",
          role: "user",
          avatarUrl: firebaseUser.photoURL || undefined,
        });
      } else {
        setUser(null);
      }
      setReady(true);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Basic email/password sign in can be implemented here if needed in the future
    console.warn("Email/password sign-in is not fully implemented yet");
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signInWithGoogle, signOut }),
    [user, ready, signIn, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
