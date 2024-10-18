import { IThemeMaximized } from "@/globalInterfaces/interfaces";

export const DarkTheme: IThemeMaximized = {
    dark: true,
    colors: {
        primary: '#ED145B', // Cor principal do aplicativo
        background: '#000', // Cor de fundo escura
        card: '#1F1F1F', // Cor de fundo dos cards
        text: '#FFFFFF', // Cor do texto principal
        border: '#FFFFFF', // Cor das bordas
        notification: '#FF453A', // Cor das notificações
    },
    actions: {
        error: "#FF453A",
        success: "#34C759",
        warning: "#FFD60A",
        info: "#007AFF"
    }
};
