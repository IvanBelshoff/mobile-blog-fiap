import React, { useCallback, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { IUsuarioCompleto } from "@/services/Usuarios/interfaces/interfaces";
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { AxiosError } from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppThemeContext } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ContentCopy from "@/components/CopyContent";
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { Environment } from "@/environment";
import { IThemeMaximized } from "@/globalInterfaces/interfaces";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

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

    const { signOut } = useAuth();

    const [usuario, setUsuario] = useState<IUsuarioCompleto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<IDetalhesDeUsuarioAction | undefined>(undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState<string>('');
    const [statePhoto, setStatePhoto] = useState<'original' | 'preview'>('original');
    const [selectedImage, setSelectedImage] = useState<{ uri: string; name: string; type: string } | null>(null);
    const [limitedFileSize, setLimitedFileSize] = useState<boolean>(true);

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    const checkFileSizeBoolean = (fileSizeInBytes: number, maxSizeInMB: number): boolean => {
        // Convertendo o limite de MB para bytes
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        // Verifica se o arquivo ultrapassa o tamanho máximo
        if (fileSizeInBytes > maxSizeInBytes) {
            return true;
        }

        // Retorna null se o arquivo estiver dentro do limite
        return false;
    };

    // Função para escolher a foto
    const pickImageAsync = async () => {
        // Pedir permissão para acessar a galeria
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permissão necessária", "Você precisa conceder permissão para acessar a galeria.");
            return;
        }

        // Abrir a galeria
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Somente imagens
            allowsEditing: true, // Permitir edição da imagem
            quality: 0.1, // Qualidade da imagem
        });

        if (!result.canceled && result.assets[0].fileSize) {

            console.log('Resultado' + result.assets[0].fileSize);
            const fileSize = checkFileSizeBoolean(result.assets[0].fileSize, Environment.FILE_SIZE_LIMIT); // Verifica o tamanho do arquivo

            if (fileSize) {
                setLimitedFileSize(false);
            }

            // Estrutura da imagem conforme o solicitado
            const image = {
                uri: result.assets[0].uri, // Caminho da imagem
                name: result.assets[0].uri.split('/').pop() || `image-${Date.now()}.jpg`, // Nome da imagem
                type: 'image/jpeg' // Tipo de arquivo, pode ser alterado dependendo do tipo real da imagem
            };

            console.log('Imagem' + image.uri);
            // Armazenar a imagem no estado
            setSelectedImage(image);
            setStatePhoto('preview');
        }
    };

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
                console.log('Data:' + data.foto.url);
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

    const handleSubmitPhoto = async () => {

        if (!selectedImage) {
            Alert.alert("Erro", "Nenhuma imagem selecionada.");
            return;
        }

        try {
            setLoading(true);

            const response = await UsuariosService.updatePasswordById(Number(id), undefined, selectedImage);

            if (response instanceof AxiosError) {
                const errors = (response as IActionDetalhesDeUsuarios).response?.data.errors;

                console.log('Erros' + errors);
                setError({
                    errors: {
                        default: errors?.default,
                    }
                });

                setSelectedImage(null);
                setStatePhoto('original');
                setLoading(false);
                return;
            } else {

                Alert.alert("Sucesso", "Foto enviada com sucesso!");

                await fetchUsuario().then(() => {
                    setSelectedImage(null);
                    setStatePhoto('original');
                }).finally(() => {
                    setLoading(false)
                });

            }

        } catch (error) {
            Alert.alert("Erro", "Falha ao enviar a foto.");
            console.error(error);
        }
    };

    const handleResetPassword = async () => {
        try {

            const response = await UsuariosService.updatePasswordById(Number(id), password);

            if (response instanceof AxiosError) {
                const errors = (response as IActionDetalhesDeUsuarios).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                        body: {
                            senha: errors?.body?.senha || 'Erro Desconhecido'
                        }
                    }
                });

                setLoading(false);
                return;
            } else {

                Alert.alert("Sucesso", "Senha alterada com sucesso!");

                signOut();

            }

        } catch (error) {
            Alert.alert("Erro", "Falha ao alterar a senha.");

        }
    }

    const handleChangePassword = async (text: string) => {
        setPassword(text);
    }

    const handleDeletePhoto = async () => {
        try {
            setLoading(true);

            const response = await UsuariosService.deleteFotoById(Number(id));

            if (response instanceof AxiosError) {
                const errors = (response as IActionDetalhesDeUsuarios).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                    }
                });

                setLoading(false);
                return;
            } else {

                Alert.alert("Sucesso", "Foto excluída com sucesso!");

                await fetchUsuario().finally(() => setLoading(false));

            }

        } catch (error) {
            Alert.alert("Erro", "Falha ao excluir a foto.");
            console.error(error);
        }
    }

    const handleCancelSubmit = () => {
        console.log('Cancelar');
        setSelectedImage(null);
        setStatePhoto('original');
        setLimitedFileSize(true);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleCopy = (value: string) => {

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

    useFocusEffect(
        useCallback(() => {

            fetchUsuario();
            
        }, [id])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size={75} color={DefaultTheme.colors.primary} />
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

                            {statePhoto === 'original' ? (
                                <Image
                                    source={{ uri: usuario.foto.url }} // Mostra a imagem selecionada ou a atual
                                    style={styles.profileImage}
                                />
                            ) : (
                                <Image
                                    source={{ uri: selectedImage?.uri }} // Mostra a imagem selecionada ou a atual
                                    style={styles.profileImage}
                                />
                            )}

                            {!limitedFileSize && (
                                <View style={styles.ErrorContainer}>
                                    <Text style={styles.error}>A imagem ultrapassa o limite de tamanho permitido.</Text>
                                </View>
                            )}

                            {selectedImage ? (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={[!limitedFileSize ? styles.buttonUploadDisable : styles.buttonUpload]} onPress={handleSubmitPhoto} disabled={!limitedFileSize}>
                                        <MaterialIcons name="image" size={22} color="#FFF" style={styles.iconButton} />
                                        <Text style={styles.buttonTextUpload}>Salvar Foto</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonDelete} onPress={handleCancelSubmit}>
                                        <MaterialIcons name="cancel" size={22} color={DefaultTheme.colors.primary} style={styles.iconButton} />
                                        <Text style={styles.buttonTextDelete}>Cancelar Alteração</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.buttonUpload} onPress={pickImageAsync}>
                                        <MaterialIcons name="file-upload" size={22} color="#FFF" style={styles.iconButton} />
                                        <Text style={styles.buttonTextUpload}>Carregar Foto</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonDelete} onPress={handleDeletePhoto}>
                                        <MaterialIcons name="delete" size={22} color="#ED145B" style={styles.iconButton} />
                                        <Text style={styles.buttonTextDelete}>Excluir Foto</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </View>

                        <View style={styles.sectionTitleUser}>
                            <Text style={styles.titleUser}>Informações do Usuário</Text>
                        </View>

                        {/* Informações do usuário */}
                        <View style={styles.userContainer}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.labelInput}>Nome</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <TextInput
                                        placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                        style={styles.input}
                                        value={`${usuario.nome} ${usuario.sobrenome}`}
                                        editable={false}
                                        placeholder="nome sobrenome"
                                        keyboardType="default"
                                        autoCapitalize="none"
                                    />
                                    <ContentCopy
                                        value={`${usuario.nome} ${usuario.sobrenome}`}
                                        aoClicarEmCopy={handleCopy}
                                    />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.labelInput}>E-mail</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <TextInput
                                    placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                    style={styles.input}
                                    editable={false}
                                    placeholder="Email"
                                    value={usuario.email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <ContentCopy
                                    value={usuario.email}
                                    aoClicarEmCopy={handleCopy}
                                />
                                </View>
                            </View>

                            <View style={{ flex: 1 }} />

                            <View style={styles.containerResetPassword}>
                                <Text style={styles.sectionTitle}>Alterar Senha</Text>
                                <View style={styles.containerInputPassword}>
                                    <TextInput
                                        placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={handleChangePassword}
                                        style={styles.inputPassword}
                                        placeholder="Senha"
                                    />
                                    <MaterialCommunityIcons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="#aaa"
                                        style={styles.iconPassword}
                                        onPress={toggleShowPassword}
                                    />
                                </View>

                                {error?.errors?.body?.senha && (
                                    <View style={styles.ErrorContainer}>
                                        <Text style={styles.error}>{error?.errors?.body?.senha}</Text>
                                    </View>
                                )}



                            </View>
                            <TouchableOpacity disabled={!password} style={[ styles.confirmButton, !password ? styles.disabledButton : null ]} onPress={handleResetPassword}>
                                <MaterialIcons name="password" size={24} color={'#FFF'} style={styles.iconButton} />
                                <Text style={styles.confirmButtonText}>Atualizar Senha</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView >
    );
}

const stylesTeste = (theme: IThemeMaximized) => {

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
        buttonUploadDisable: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: '#ccc',
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
            justifyContent: 'flex-start',
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 8,
            gap: 10,
            padding: 10,
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
            marginRight: 15,
            color: "#333"
        },
        labelInput: {
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            paddingBottom: 10
        },
        containerResetPassword: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
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
            marginTop: 10,
            marginHorizontal: 50,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderRadius: 8,
        },
        disabledButton: {
            backgroundColor: '#d3d3d3',
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
            color: theme.actions.error,
        },
        ErrorContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
        },
    });
}


