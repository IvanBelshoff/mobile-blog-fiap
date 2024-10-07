import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_BASE_URL } from '@env';

export const Api = () => {
    const api = axios.create({
        baseURL: EXPO_BASE_URL,
        headers: { Authorization: `Bearer ${Platform.OS === 'web' ? localStorage.getItem('token') : ''}` },
    });

    // Interceptor para adicionar o token no cabeçalho antes de cada requisição
    api.interceptors.request.use(
        async (config) => {
            let token;

            // Verifica se está no web ou mobile e resgata o token
            if (Platform.OS != 'web') {
                token = await SecureStore.getItemAsync('token');
            }

            // Adiciona o token ao cabeçalho de autorização se ele existir
            if (token && Platform.OS != 'web') {
                config.headers.authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            // Trata erros que possam ocorrer ao adicionar o token
            return Promise.reject(error);
        }
    );

    return api;
};
