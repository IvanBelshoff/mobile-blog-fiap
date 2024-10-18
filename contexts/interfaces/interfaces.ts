import { IThemeMaximized } from "@/globalInterfaces/interfaces";

//AuthContext
export interface ILoginProps {
    token: string | null;
    userId: string | null;
    regras: string[] | null;
    permissoes: string[] | null;
}

export interface IThemeContex {
    theme: "light" | "dark" | "automatic";
    toggleTheme: (selectedTheme: "light" | "dark" | "automatic") => void
    DefaultTheme: IThemeMaximized;
}
