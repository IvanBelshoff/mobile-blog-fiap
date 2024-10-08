import React, { createContext, useContext } from "react";
import { useStorageState } from "./useStorageState";
import { ILoginProps } from "./interfaces/interfaces";

const AuthContext = createContext<{
    signIn: (loginData: ILoginProps) => void;
    signOut: () => void;
    session: ILoginProps | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export function useAuth() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error("useSession must be wrapped in a <SessionProvider />");
        }
    }

    return value;
}

export function AuthProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState<ILoginProps>("session");

    return (
        <AuthContext.Provider
            value={{
                signIn: (loginData: ILoginProps) => {
                    // Adicionar lógica de login aqui
                    setSession(loginData); // Salvar os dados da sessão
                },
                signOut: () => {
                    setSession(null); // Remover sessão
                },
                session,
                isLoading,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}
