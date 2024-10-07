
//AuthContext
export interface AuthContextProps {
    token: string | null;
    userId: string | null;
    regras: string | null;
    permissoes: string | null;
    setToken: (token: string) => void;
    setUserId: (id: string) => void;
    setRegras: (regras: string) => void;
    setPermissoes: (permissoes: string) => void;
}

export interface IAuthContextProps {
    children: React.ReactNode
}
