import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { IUsuarioCompleto } from "@/services/Usuarios/interfaces/interfaces";
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { AxiosError } from "axios";

export default function Profile() {
    
    const { id } = useLocalSearchParams();
    const [usuario, setUsuario] = useState<IUsuarioCompleto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuario = async () => {
        try {
            const data = await UsuariosService.getById(Number(id)); // Chame o serviço com o ID do usuário

            if (data instanceof AxiosError) {
                setError(data.message);
                setLoading(false);
                return;
            } else {
                setUsuario(data);
            }

        } catch (error) {
            setError("Erro ao carregar informações do usuário");
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar dados do usuário pelo id
    useEffect(() => {
        if (id) {
            fetchUsuario();
        }
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando informações...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>{id}</Text>
            {usuario && (
                <>
                    {/* Exibindo a foto do usuário */}
                    <Image
                        source={{ uri: usuario.foto.url }}
                        style={styles.profileImage}
                    />

                    {/* Exibindo nome e sobrenome */}
                    <Text style={styles.name}>{usuario.nome} {usuario.sobrenome}</Text>

                    {/* Exibindo email */}
                    <Text style={styles.email}>{usuario.email}</Text>

                    {/* Exibindo status bloqueado */}
                    <Text style={styles.status}>
                        Status: {usuario.bloqueado ? "Bloqueado" : "Ativo"}
                    </Text>

                    {/* Exibindo últimas atualizações */}
                    <Text style={styles.info}>
                        Último login: {new Date(usuario.ultimo_login).toLocaleString()}
                    </Text>
                    <Text style={styles.info}>
                        Cadastrado por: {usuario.usuario_cadastrador}
                    </Text>
                    <Text style={styles.info}>
                        Atualizado por: {usuario.usuario_atualizador}
                    </Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 18,
        color: '#555',
        marginBottom: 8,
    },
    status: {
        fontSize: 16,
        color: '#777',
        marginBottom: 16,
    },
    info: {
        fontSize: 14,
        color: '#777',
        marginBottom: 4,
    },
    error: {
        fontSize: 18,
        color: 'red',
    },
});
