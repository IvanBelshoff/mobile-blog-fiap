import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { AuthContextProps, IAuthContextProps } from './interfaces/interfaces';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useDrawer deve ser usado dentro de um DrawerProvider');
    }

    return context;
};

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
    return useReducer(
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
        initialValue
    ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === 'web') {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}


export function useStorageState(key: string): UseStateHook<string> {
    // Public
    const [state, setState] = useAsyncState<string>();

    // Get
    useEffect(() => {
        if (Platform.OS === 'web') {
            try {
                if (typeof localStorage !== 'undefined') {
                    setState(localStorage.getItem(key));
                }
            } catch (e) {
                console.error('Local storage is unavailable:', e);
            }
        } else {
            SecureStore.getItemAsync(key).then(value => {
                setState(value);
            });
        }
    }, [key]);

    // Set
    const setValue = useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key]
    );

    return [state, setValue];
}

export const AuthProvider: React.FC<IAuthContextProps> = ({ children }) => {

    const [[_, token], setToken] = useStorageState('token');
    const [[__, userId], setUserId] = useStorageState('userId');
    const [[___, regras], setRegras] = useStorageState('regras');
    const [[____, permissoes], setPermissoes] = useStorageState('permissoes');

    return (
        <AuthContext.Provider value={{
            setToken: (token) => {
                setToken(token);
            },
            setUserId: (id) => {
                setUserId(id);
            },
            setRegras: (regras) => {
                setRegras(regras);
            },
            setPermissoes: (permissoes) => {
                setPermissoes(permissoes);
            },
            token,
            userId,
            regras,
            permissoes
        }}>
            {children}
        </AuthContext.Provider>
    );
};
