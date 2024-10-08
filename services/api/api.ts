import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_BASE_URL } from '@env';
import { ILoginProps } from '@/contexts/interfaces/interfaces';

export const Api = () => {

    const api = axios.create({
        baseURL: EXPO_BASE_URL,
    });

    if (Platform.OS == 'web') {

        let tokenWeb;

        api.interceptors.request.use(

            (config) => {

                const session = localStorage.getItem('session');

                if (session) {

                    const sessionProps = JSON.parse(session) as ILoginProps;

                    tokenWeb = sessionProps.token;

                } else {
                    tokenWeb = '';
                }

                config.headers.authorization = `Bearer ${tokenWeb}`;

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

    }

    if (Platform.OS != 'web') {

        let tokenMobile;

        api.interceptors.request.use(

            async (config) => {

                const session = await SecureStore.getItemAsync('session');

                if (session) {

                    const sessionProps = JSON.parse(session) as ILoginProps;

                    tokenMobile = sessionProps.token;

                } else {
                    tokenMobile = '';
                }

                config.headers.authorization = `Bearer ${tokenMobile}`

                return config;
            },
            (error) => {
                // Trata erros que possam ocorrer ao adicionar o token
                return Promise.reject(error);
            }
        );
    }

    return api;
};
