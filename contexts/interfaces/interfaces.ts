
//AuthContext
export interface ILoginProps {
    token: string | null;
    userId: string | null;
    regras: string[] | null;
    permissoes: string[] | null;
}