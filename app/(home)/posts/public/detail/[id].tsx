import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, Button, Share, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { IPostCompleto, PostsService } from "@/services/Posts/postsService";
import { AxiosError } from "axios";
import { Theme, useNavigation, useRoute } from "@react-navigation/native";
import { useAppThemeContext } from "@/contexts/ThemeContext";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Environment } from "@/environment";

export default function DetailPublicPost() {

    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<IPostCompleto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { DefaultTheme } = useAppThemeContext();
    const route = useRoute();
    const currentRouteName = route.name;
    const styles = stylesTeste(DefaultTheme);

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

    const onShare = async () => {
        try {
            const url = `${Environment.WEB_URL}/${currentRouteName.replace("[id]", id)}`;
            const message = `Olá! Confira este conteúdo incrível! ${url}`;
            const result = await Share.share({
                message: message,
                url: url,
                title: 'Compartilhar Link'
            });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
               console.log('Compartilhado com atividade:', result.activityType);
            } else {
              // shared
               console.log('Conteúdo compartilhado com sucesso!');
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
            console.log('Compartilhamento cancelado.');
          }
        } catch (error: any) {
          console.error('Erro ao compartilhar:', error);
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
        <ScrollView contentContainerStyle={styles.scrollViewContent} showVerticalScrollIndicator={false}>
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
                        Publicado em: {new Date(post.data_criacao).toLocaleDateString("pt-BR")} por: {post.usuario_cadastrador}
                    </Text>

                    {/* Informações de atualização */}
                    <Text style={styles.info}>
                        Atualizado em: {new Date(post.data_atualizacao).toLocaleDateString("pt-BR")} por {post.usuario_atualizador}
                    </Text>

                    {/* Exibindo o conteúdo do post */}
                    <Text style={styles.content}>
                        {post.conteudo}
                    </Text>
                    <SafeAreaProvider>
                        <SafeAreaView>
                            <TouchableOpacity style={styles.buttonShare} onPress={onShare}>
                                <Text style={styles.buttonText}>Compartilhar</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaProvider>
                </View>
            )}
        </ScrollView>

    );
}

const stylesTeste = (theme: Theme) => {
    return StyleSheet.create({
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
            borderRadius: 16,
            marginBottom: 16,
            marginTop: 16,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 20,
            marginTop: 20,
            paddingHorizontal: 12,
        },
        content: {
            fontSize: 18,
            lineHeight: 26,
            color: theme.dark ? '#ECECEC': theme.colors.text,
            textAlign: 'justify',
            marginBottom: 16,
            marginTop: 16,
            paddingHorizontal: 14,
        },
        info: {
            fontSize: 14,
            color: theme.dark ? '#FFFFFFB3' : '#555',
            marginBottom: 8,
            paddingHorizontal: 20,
        },
        error: {
            fontSize: 18,
            color: 'red',
        },
        buttonShare: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
        },
        buttonText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

}