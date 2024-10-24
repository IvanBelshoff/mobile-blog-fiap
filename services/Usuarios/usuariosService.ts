import { AxiosError, isAxiosError } from 'axios';
import { IDataToken, IUsuarioCompleto, IUsuarioComTotalCount } from './interfaces/interfaces';
import { IResponseErrosGeneric } from '../Posts/postsService';
import { Api } from '../api/api';

const login = async (email: string, senha: string): Promise<IDataToken | AxiosError> => {

    try {
        const data = await Api().post('/entrar', { email, senha });

        if (data.status == 200) {
            return data.data;
        }

        return new AxiosError('Erro ao consultar o registros.', undefined, data.config);
    } catch (error) {

        const errors = (error as IResponseErrosGeneric).response;

        if (isAxiosError(error)) {
            return error;
        }

        return new AxiosError(
            errors?.data?.errors?.default || 'Erro ao consultar o registros.',
            errors?.status || '500');
    }
};

const getById = async (id: number): Promise<IUsuarioCompleto | AxiosError> => {

    try {

        const data = await Api().get(`/usuarios/${id}`);

        if (data.status == 200) {
            return data.data;
        }

        return new AxiosError('Erro ao consultar o registros.', undefined, data.config);

    } catch (error) {

        const errors = (error as IResponseErrosGeneric).response;

        if (isAxiosError(error)) {
            return error;
        }

        return new AxiosError(
            errors?.data?.errors?.default || 'Erro ao consultar o registros.',
            errors?.status || '500');
    }

};

export const updatePasswordById = async (
    id: number,
    senha?: string,
    foto?: { uri: string; name: string; type: string },
): Promise<void | AxiosError> => {
    try {

        const formData = new FormData();

        senha && (
            formData.append('senha', senha)
        );

        foto && (
            formData.append('foto', foto as unknown as File)
        );

        const data = await Api().patch(`/usuarios/password/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (data.status == 204) {
            return;
        }

        return new AxiosError('Erro ao consultar o registros.', undefined, data.config);

    } catch (error) {

        const errors = (error as IResponseErrosGeneric).response;

        if (isAxiosError(error)) {
            return error;
        }

        return new AxiosError(
            errors?.data?.errors?.default || 'Erro ao consultar o registros.',
            errors?.status || '500');
    }
};


const recoverPassword = async (emailRecuperacao: string): Promise<void | AxiosError> => {
    try {
        const data = await Api().post('/recuperar', { emailRecuperacao });

        if (data.status == 200) {
            return data.data;
        }

        return new AxiosError('Erro ao consultar o registros.', undefined, data.config);
    } catch (error) {

        const errors = (error as IResponseErrosGeneric).response;

        if (isAxiosError(error)) {
            return error;
        }

        return new AxiosError(
            errors?.data?.errors?.default || 'Erro ao consultar o registros.',
            errors?.status || '500');
    }
};

const deleteFotoById = async (id: number): Promise<void | AxiosError> => {
    try {
        const data = await Api().delete(`/usuarios/foto/${id}`);

        if (data.status == 204) {
            return;
        }

        return new AxiosError('Erro ao consultar o registros.', undefined, data.config);

    } catch (error) {

        const errors = (error as IResponseErrosGeneric).response;

        if (isAxiosError(error)) {
            return error;
        }

        return new AxiosError(
            errors?.data?.errors?.default || 'Erro ao consultar o registros.',
            errors?.status || '500');

    }
};

const getAll = async (page?: string, filter?: string, limit?: string): Promise<IUsuarioComTotalCount | AxiosError> => {
    try {

        const data = await Api().get('usuarios', {
            params: {
                page: Number(page),
                filter: filter,
                limit: limit,
            }
        });

        if (data.status == 200) {
            return {
                data: data.data,
                totalCount: Number(data.headers['x-total-count'] || limit),
            };
        }

        return new AxiosError('Erro ao consultar o registros.', undefined, data.config);

    } catch (error) {

        const errors = (error as IResponseErrosGeneric).response;

        if (isAxiosError(error)) {
            return error;
        }

        return new AxiosError(
            errors?.data?.errors?.default || 'Erro ao consultar o registros.',
            errors?.status || '500');

    }
};

const deleteById = async (id: number): Promise<void | AxiosError> => {
    try {
        const data = await Api().delete(`/usuarios/${id}`);

        if (data.status == 204) {
            return;
        }

        return new AxiosError('Erro ao consultar o registros.', undefined, data.config);

    } catch (error) {

        const errors = (error as IResponseErrosGeneric).response;

        if (isAxiosError(error)) {
            return error;
        }

        return new AxiosError(
            errors?.data?.errors?.default || 'Erro ao consultar o registros.',
            errors?.status || '500');

    }
};


export const UsuariosService = {
    getAll,
    deleteById,
    login,
    getById,
    updatePasswordById,
    recoverPassword,
    deleteFotoById
};