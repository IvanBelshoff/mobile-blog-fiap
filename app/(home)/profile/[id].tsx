import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { IUsuarioCompleto } from "@/services/Usuarios/interfaces/interfaces";
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { AxiosError } from "axios";
import * as ImagePicker from 'expo-image-picker'; // Importar ImagePicker
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as FileSystem from 'expo-file-system'; // Importar FileSystem
import { useAuth } from "@/contexts/AuthContext";
import { Theme } from "@react-navigation/native";
import { useAppThemeContext } from "@/contexts/ThemeContext";

interface IActionDetalhesDeUsuarios {
    response?: {
        data: {
            errors?: {
                default?: string
                body?: {
                    senha: string,
                }
            },
        }
    }
    success?: {
        message: string
    }
}

interface IDetalhesDeUsuarioAction {
    errors?: {
        default?: string
        body?: {
            senha: string,
        }
    },
    success?: {
        message: string
    }
}

export default function Profile() {

    const { id } = useLocalSearchParams();
    const [usuario, setUsuario] = useState<IUsuarioCompleto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<IDetalhesDeUsuarioAction | undefined>(undefined);
    const [senha, setSenha] = useState<string>(""); // Estado para senha
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined); // Estado para imagem selecionada
    const [fodace, setFodace] = useState<string>(""); // Estado para imagem selecionada
    const { signOut } = useAuth();
    const { DefaultTheme } = useAppThemeContext();

    const fetchUsuario = async () => {
        try {
            const data = await UsuariosService.getById(Number(id)); // Chame o serviço com o ID do usuário

            if (data instanceof AxiosError) {
                const errors = (usuario as IActionDetalhesDeUsuarios).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                    }
                });
                setLoading(false);
                return;
            } else {
                setUsuario(data);
            }

        } catch (error) {
            setError({
                errors: {
                    default: "Erro ao carregar informações do usuário"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (id: number, senha?: string, selectedImage?: string) => {
        try {
            let file: { uri: string; name: string; type: string } | undefined;

            // Verificar se uma imagem foi selecionada
            if (selectedImage) {
                setFodace('teste');
                const info = await FileSystem.getInfoAsync(selectedImage);
                if (info.exists) {
                    // Montar o objeto do arquivo
                    file = {
                        uri: info.uri,
                        name: info.uri.split('/').pop() || 'image.jpg',
                        type: 'image/jpeg', // ou o tipo correto
                    };

                    setFodace(file.uri);
                }
            }

            // Agora file estará definido ou undefined, assim a chamada ao serviço pode ser feita
            const usuario = await UsuariosService.updatePasswordById(
                id,
                senha || undefined,
                file // Passa o file diretamente, pode ser undefined
            );

            if (usuario instanceof Error) {
                // Limpar estados em caso de erro
                setSenha(""); // Limpa a senha
                setSelectedImage(undefined); // Limpa a imagem
                file = undefined; // Limpa o arquivo

                const errors = (usuario as IActionDetalhesDeUsuarios).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                        body: {
                            senha: errors?.body?.senha || "Erro desconhecido",
                        }
                    }
                });
            } else {
                // Limpar estados em caso de sucesso
                setSenha(""); // Limpa a senha
                setSelectedImage(undefined); // Limpa a imagem
                file = undefined; // Limpa o arquivo
                setError(undefined);

                if (senha) {
                    // Navegar para a Home
                    Alert.alert("Sucesso", "Senha atualizada com sucesso.");
                    signOut();
                    router.push("/");
                } else {
                    fetchUsuario();
                    Alert.alert("Sucesso", "Foto atualizada com sucesso.");
                }
            }

        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao atualizar as informações.");
        }
    };

    const styles = stylesTeste(DefaultTheme);

    // Função para buscar dados do usuário pelo id
    useEffect(() => {
        if (id) {
            fetchUsuario();
        }
    }, [id]);

    // Função para escolher a foto
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Armazena a URI da imagem
        } else {
            alert('Você não selecionou nenhuma imagem.');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando informações...</Text>
            </View>
        );
    }

    if (error?.errors?.default) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error?.errors?.default}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "height" : "padding"}
        >
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}  // Escondendo a barra de rolagem
                enableOnAndroid={true}  // Ativar a rolagem automática no Android
                extraScrollHeight={100} // Ajuste extra para garantir que o botão fique visível
            >
                {usuario && (
                    <View style={{ flex: 1 }}>
                        {/* Imagem de perfil centralizada */}
                        <View style={styles.imageContainer}>

                            <Image
                                source={{ uri: selectedImage || usuario.foto.url }} // Mostra a imagem selecionada ou a atual
                                style={styles.profileImage}
                            />

                            {fodace && (
                                <Text style={{ color: '#ff0000' }}>{fodace}</Text>
                            )}


                            {/* Botões para alterar e excluir foto */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.buttonAlter} onPress={pickImageAsync}>
                                    <Text style={styles.buttonText}>Alterar Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonDelete}>
                                    <Text style={styles.buttonText}>Excluir Foto</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Informações do usuário */}
                        <View style={styles.userContainer}>
                            <Text style={styles.name}>Nome: {usuario.nome} {usuario.sobrenome}</Text>
                            <Text style={styles.email}>E-mail: {usuario.email}</Text>
                        </View>
                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Seção para alterar senha */}
                        <View style={styles.passwordContainer}>
                            <Text style={styles.sectionTitle}>Alterar Senha</Text>

                            {error?.errors?.body?.senha && (
                                <Text style={{ color: '#ff0000' }}>{error?.errors?.body?.senha}</Text>
                            )}

                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Digite sua nova senha"
                                secureTextEntry
                                value={senha}
                                onChangeText={setSenha}

                            // Atualiza a senha no estado
                            />

                            {/* Botão Confirmar */}
                            {(senha.length > 0 || selectedImage) && (
                                <TouchableOpacity style={styles.confirmButton} onPress={() => handleSubmit(Number(id) || 0, senha, selectedImage)}>
                                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
}

const stylesTeste = (theme: Theme) => {

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.colors.background,
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageContainer: {
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
            marginTop: 10,
        },
        profileImage: {
            width: 200,
            height: 200,
            borderRadius: 100, // Redonda
            marginBottom: 16,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        userContainer: {
            flexDirection: 'column',
            gap: 10,
        },
        buttonDelete: {
            flex: 1,
            backgroundColor: '#FF0000',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginHorizontal: 5,
        },
        buttonAlter: {
            flex: 1,
            backgroundColor: '#007bff',
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            marginHorizontal: 5,
        },
        buttonText: {
            color: theme.colors.text,
            fontWeight: 'bold',
        },
        divider: {
            borderBottomColor: theme.colors.border,
            borderBottomWidth: 1,
            marginVertical: 16,
        },
        name: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 8,
            color: theme.colors.text,
        },
        email: {
            fontSize: 18,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 16,
        },
        passwordContainer: {
            marginTop: 10,
            marginBottom: 16,
            gap: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        passwordInput: {
            width: '100%',
            padding: 10,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 16,
        },
        titleAccount: {
            fontSize: 25,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 8,
            color: theme.colors.text,
        },
        error: {
            fontSize: 18,
            color: 'red',
        },
        confirmButton: {
            backgroundColor: '#28a745',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
        },
        confirmButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
    });
}


