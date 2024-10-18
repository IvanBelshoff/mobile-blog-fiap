import { IThemeMaximized } from "@/globalInterfaces/interfaces";

export const LightTheme: IThemeMaximized = {
    dark: false,
    colors: {
        primary: '#ED145B', // Cor principal do aplicativo
        background: '#FFFFFF', // Cor de fundo
        card: '#F5F5F5', // Cor de fundo dos cards
        text: '#000000', // Cor do texto principal
        border: '#E0E0E0', // Cor das bordas
        notification: '#FF453A', // Cor das notificações
    },
    actions: {
        error: "#FF453A",
        success: "#34C759",
        warning: "#FFD60A",
        info: "#007AFF"
    }
};
