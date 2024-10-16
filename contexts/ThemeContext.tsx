import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as NavigationThemeProvider, Theme } from '@react-navigation/native';
import { IThemeContex } from './interfaces/interfaces';
import { DarkTheme } from '@/themes/Dark';
import { LightTheme } from '@/themes/Light';

// Criando o contexto de tema
const ThemeContext = createContext({} as IThemeContex);

// Hook para acessar o contexto
export const useAppThemeContext = () => {
    return useContext(ThemeContext);
};

// Renomeando o ThemeProvider para AppThemeProvider
export const AppThemeProvider = ({ children }: React.PropsWithChildren) => {

    const systemColorScheme = useColorScheme();
    const [themeName, setThemeName] = useState<"light" | "dark" | "automatic">("automatic");

    // Calcula o tema com base na seleção ou no sistema
    const getTheme = () => {
        if (themeName === "automatic") {
            return systemColorScheme === 'dark' ? DarkTheme : LightTheme;
        } else if (themeName === "light") {
            return LightTheme;
        } else {
            return DarkTheme;
        }
    };

    // Função para alternar tema
    const toggleTheme = useCallback((selectedTheme: "light" | "dark" | "automatic") => {
        setThemeName(selectedTheme);
    }, [themeName]);

    return (
        <ThemeContext.Provider value={{ theme: themeName, toggleTheme: toggleTheme, DefaultTheme: getTheme() }}>
            <NavigationThemeProvider value={getTheme()}>
                {children}
            </NavigationThemeProvider>
        </ThemeContext.Provider>
    );
};
