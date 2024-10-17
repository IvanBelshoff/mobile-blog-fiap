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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ContentCopy from "@/components/CopyContent";
import * as Clipboard from 'expo-clipboard';

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
                const info = await FileSystem.getInfoAsync(selectedImage);
                if (info.exists) {
                    // Montar o objeto do arquivo
                    file = {
                        uri: info.uri,
                        name: info.uri.split('/').pop() || 'image.jpg',
                        type: 'image/jpeg', // ou o tipo correto
                    };
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


    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleCopy = (value: string) => {
        console.log(value);

        if (Platform.OS === 'web') {
            // Utiliza a API nativa do navegador para copiar o texto
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(value)
                    .then(() => {
                        Alert.alert('Sucesso', 'Texto copiado para a área de transferência!');
                    })
                    .catch((err) => {
                        Alert.alert('Erro', 'Falha ao copiar o texto');
                        console.error('Erro ao copiar para a área de transferência:', err);
                    });
            }
        }

        if (Platform.OS === 'android' || Platform.OS === 'ios') {
            // Utiliza o Clipboard do React Native para Android/iOS
            Clipboard.setStringAsync(value);

        }
    };
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

                            {/* Botões para alterar e excluir foto */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.buttonUpload} onPress={pickImageAsync}>
                                    <MaterialIcons name="file-upload" size={22} color="#FFF" style={styles.iconButton} />
                                    <Text style={styles.buttonTextUpload}>Carregar Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonDelete}>
                                    <MaterialIcons name="delete" size={22} color="#ED145B" style={styles.iconButton} />
                                    <Text style={styles.buttonTextDelete}>Excluir Foto</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.sectionTitleUser}>
                            <Text style={styles.titleUser}>Informações do Usuário</Text>
                        </View>

                        {/* Informações do usuário */}
                        <View style={styles.userContainer}>

                            <View style={styles.containerInput}>

                                <Text style={styles.labelInput}>Nome:</Text>

                                <TextInput
                                    style={styles.input}
                                    editable={false}
                                    placeholder="Email"
                                    value={`${usuario.nome} ${usuario.sobrenome}`}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#aaa"
                                />

                                <ContentCopy
                                    value={`${usuario.nome} ${usuario.sobrenome}`}
                                    aoClicarEmCopy={handleCopy}
                                />

                            </View>

                            <View style={styles.containerInput}>

                                <Text style={styles.labelInput}>E-mail:</Text>

                                <TextInput
                                    style={styles.input}
                                    editable={false}
                                    placeholder="Email"
                                    value={usuario.email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#aaa"
                                />

                                <ContentCopy
                                    value={usuario.email}
                                    aoClicarEmCopy={handleCopy}
                                />

                            </View>

                            <View style={{ flex: 1 }} />

                            <View style={styles.containetResetPassword}>

                                <Text style={styles.sectionTitle}>Alterar Senha</Text>

                                <View style={styles.containerInputPassword}>
                                    <TextInput
                                        secureTextEntry={!showPassword}
                                        value={senha}
                                        onChangeText={setSenha}
                                        style={styles.inputPassword}
                                        placeholder="Senha"
                                        placeholderTextColor="#aaa"
                                    />
                                    <MaterialCommunityIcons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="#aaa"
                                        style={styles.iconPassword}
                                        onPress={toggleShowPassword}
                                    />
                                </View>

                                {senha && (
                                    <TouchableOpacity style={styles.confirmButton} onPress={() => handleSubmit(usuario.id, senha)}>
                                            <MaterialIcons name="password" size={24} color={'#FFF'} style={styles.iconButton} />
                                        <Text style={styles.confirmButtonText}>Atualizar Senha</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

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
        imageContainer: {
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
            marginTop: 10,
        },
        profileImage: {
            width: 200,
            height: 200,
            borderRadius: 25, // Redonda
            marginBottom: 16,
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        buttonContainer: {
            flexDirection: 'row',
            gap: 10,
        },
        buttonUpload: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary,
            borderRadius: 8,  // Cantos arredondados
            paddingVertical: 12,
            paddingHorizontal: 12,
            // Adicionando sombra
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // Para Android
        },
        buttonDelete: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFF",
            borderRadius: 8,  // Cantos arredondados
            paddingVertical: 12,
            paddingHorizontal: 12,
            // Adicionando sombra
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // Para Android
        },
        buttonTextUpload: {
            color: '#FFF',
            fontSize: 15,
            fontWeight: "bold",
            marginLeft: 2, // Espaço entre o ícone e o texto
        },
        buttonTextDelete: {
            color: theme.colors.primary,
            fontSize: 15,
            fontWeight: "bold",
            marginLeft: 2, // Espaço entre o ícone e o texto
        },
        iconButton: {
            marginRight: 8,
        },
        sectionTitleUser: {
            marginTop: 12,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        titleUser: {
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 8,
            color: theme.colors.text
        },
        userContainer: {
            flexDirection: 'column',
            flex: 1,
            gap: 15,
            marginTop: 5,
            justifyContent: 'flex-start',
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 10,
            paddingTop: 25,
            paddingBottom: 25,
            paddingLeft: 10,
            paddingRight: 10,
        },
        containerInput: {
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        input: {
            height: 50,
            flex: 1,
            backgroundColor: "#FFF",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            color: "#333"
        },
        labelInput: {
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text
        },
        containetResetPassword: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 22
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        containerInputPassword: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: '100%',
            backgroundColor: "#FFF",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            color: "#333"
        },
        inputPassword: {
            flex: 1,
            color: '#333',
            paddingVertical: 10,
            paddingRight: 10,
            fontSize: 16,
        },
        iconPassword: {
            marginLeft: 10,
        },
        confirmButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.primary,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 8,
        },
        confirmButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        error: {
            fontSize: 18,
            color: 'red',
        }
    });
}


