import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { IPostCompleto, PostsService } from "@/services/Posts/postsService";
import { AxiosError } from "axios";

export default function Post() {

    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<IPostCompleto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = async () => {
        try {
            const data = await PostsService.getById(Number(id));

            if (data instanceof AxiosError) {
                setError(data.message);
                setLoading(false);
                return;
            } else {
                setPost(data);
            }

        } catch (error) {
            setError("Erro ao carregar informações do post");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {post && (
                <View>
                    {/* Exibindo a foto do post com cantos arredondados */}
                    {post.foto?.url && (
                        <Image
                            source={{ uri: post.foto.url }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}

                    {/* Exibindo o título do post */}
                    <Text style={styles.title}>{post.titulo}</Text>

                    {/* Exibindo a data e o autor do post */}
                    <Text style={styles.info}>
                        Publicado em: {new Date(post.data_criacao).toLocaleDateString()} por: {post.usuario_cadastrador}
                    </Text>

                    {/* Informações de atualização */}
                    <Text style={styles.info}>
                        Atualizado em: {new Date(post.data_atualizacao).toLocaleDateString()} por {post.usuario_atualizador}
                    </Text>

                    {/* Exibindo o conteúdo do post */}
                    <Text style={styles.content}>
                        {post.conteudo}
                    </Text>
                </View>
            )}
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 16, // Cantos arredondados na imagem
        marginBottom: 16,
        marginTop: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    content: {
        fontSize: 18,
        lineHeight: 26, // Altura da linha para facilitar a leitura
        color: '#555',
        textAlign: 'justify',
        marginBottom: 16, // Este deve funcionar agora
        marginTop: 16,
    },
    info: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    error: {
        fontSize: 18,
        color: 'red',
    },
});
