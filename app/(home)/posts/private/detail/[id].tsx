import { useAppThemeContext } from "@/contexts/ThemeContext";
import { PostsService } from "@/services/Posts/postsService";
import { AxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Environment } from "@/environment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';
import { IThemeMaximized } from "@/globalInterfaces/interfaces";

interface IPostForm {
    titulo?: string;
    descricao?: string;
    foto?: {
        uri: string;
        name: string;
        type: string
    },
    visivel?: boolean;
}

interface IActionNovoPost {
    response?: {
        data: {
            errors?: {
                default?: string
                body?: {
                    titulo: string
                    conteudo: string
                    visivel: string
                }
            },
            success?: {
                message?: string
            }
        }
    }
}

interface INovoPostAction {
    errors?: {
        default?: string
        body?: {
            titulo?: string
            conteudo?: string
            visivel?: string
        }
    },
    success?: {
        message?: string
    }
}


export default function DetailPostPrivate() {

    const [loading, setLoading] = useState<boolean>(false);
    const [PostForm, setPostForm] = useState<IPostForm>({
        titulo: undefined,
        descricao: undefined,
        foto: undefined,
        visivel: undefined
    });
    const [error, setError] = useState<INovoPostAction | undefined>(undefined);
    const [statePhoto, setStatePhoto] = useState<'default' | 'preview'>('default');
    const [limitedFileSize, setLimitedFileSize] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<{ uri: string; name: string; type: string } | null>(null);

    const { id } = useLocalSearchParams();

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    const fetchPost = async () => {

        try {
            const data = await PostsService.getById(Number(id));

            if (data instanceof AxiosError) {
                setError({
                    errors: {
                        default: data.message,
                        body: {
                            conteudo: undefined,
                            titulo: undefined,
                            visivel: undefined
                        }
                    }
                });

                setLoading(false);

                return;
            } else {
                setPostForm({
                    titulo: data.titulo,
                    descricao: data.conteudo,
                    visivel: data.visivel,
                    foto: {
                        uri: data.foto?.url,
                        name: data.foto.nome,
                        type: data.foto.tipo
                    }
                });
            }

        } catch (error) {
            setError({
                errors: {
                    default: 'Erro ao carregar informações do post',
                    body: {
                        conteudo: undefined,
                        titulo: undefined,
                        visivel: undefined
                    }
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPost = async () => {

        try {
            setLoading(true);

            const response = await PostsService.updateById(Number(id), PostForm?.titulo, PostForm?.descricao, PostForm?.visivel == true ? 'true' : 'false', selectedImage || undefined);

            if (response instanceof AxiosError) {
                setLoading(false);
                const errors = (response as IActionNovoPost).response?.data.errors;
                setError({
                    errors: {
                        default: errors?.default,
                        body: {
                            conteudo: errors?.body?.conteudo,
                            titulo: errors?.body?.titulo,
                            visivel: errors?.body?.visivel
                        }
                    }
                });

            } else {
                Alert.alert("Sucesso", "Post criado com sucesso!");

                await fetchPost().then(() => {
                    setSelectedImage(null);
                    setStatePhoto('default');
                }).finally(() => {
                    setLoading(false)
                });
            }
        } catch (error) {
            Alert.alert("Erro", "Falha ao enviar o post.");
            console.error(error);
        }
    };

    const handleCancelSubmit = () => {
        console.log('Cancelar');
        setSelectedImage(null);
        setStatePhoto('default');
        setLimitedFileSize(true);
    }

    const resetForm = () => {
        setPostForm({ ...PostForm, descricao: undefined, titulo: undefined });
    }

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

    const handleDeletePhoto = async () => {
        try {
            setLoading(true);

            const response = await PostsService.deleteCapaById(Number(id));

            if (response instanceof AxiosError) {
                const errors = (response as IActionNovoPost).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                    }
                });

                setLoading(false);
                return;
            } else {

                Alert.alert("Sucesso", "Foto excluída com sucesso!");

                await fetchPost().finally(() => setLoading(false));

            }

        } catch (error) {
            Alert.alert("Erro", "Falha ao excluir a foto.");
            console.error(error);
        }
    }

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
            allowsEditing: false, // Permitir edição da imagem
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

    useEffect(() => {
        if (error) {
            setTimeout(() => setError({
                errors: {
                    default: undefined,
                    body: {
                        conteudo: undefined,
                        titulo: undefined,
                        visivel: undefined
                    }
                },
                success: {
                    message: undefined
                }
            }), 20000);
        }
    }, [error]);

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size={50} color={DefaultTheme.colors.primary} />
                <Text style={{ color: DefaultTheme.colors.text }}>Carregando informações...</Text>
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
                {PostForm && (
                    <View style={{ flex: 1 }}>
                        {/* Imagem de perfil centralizada */}
                        <View style={styles.imageContainer}>

                            {statePhoto === 'default' ? (
                                <Image
                                    source={{ uri: PostForm.foto?.uri }} // Mostra a imagem selecionada ou a atual
                                    style={styles.image}
                                />
                            ) : (
                                <Image
                                    source={{ uri: selectedImage?.uri }} // Mostra a imagem selecionada ou a atual
                                    style={styles.image}
                                />
                            )}

                            {!limitedFileSize && (
                                <View style={styles.ErrorContainer}>
                                    <Text style={styles.error}>A imagem ultrapassa o limite de tamanho permitido.</Text>
                                </View>
                            )}

                            {selectedImage ? (
                                <View style={styles.buttonContainer}>
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

                        {/* Informações do usuário */}
                        <View style={styles.userContainer}>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.label}>Título</Text>
                                <TextInput
                                    placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                    style={styles.input}
                                    value={PostForm?.titulo}
                                    onChangeText={text => setPostForm({ ...PostForm, titulo: text })}
                                    placeholder="Digite o título"
                                />
                                {error?.errors?.body?.titulo && (
                                    <Text style={styles.error}>{error?.errors?.body?.titulo}</Text>
                                )}
                            </View>


                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.label}>Selecione a Visibilidade</Text>
                                <RNPickerSelect
                                    onValueChange={(value: 'true' | 'false') => setPostForm({ ...PostForm, visivel: value === 'true' ? true : false })}
                                    items={[
                                        { label: 'Visível', value: 'true' },
                                        { label: 'Não Visível', value: 'false' }
                                    ]}
                                    value={PostForm?.visivel == true ? 'true' : 'false'}

                                    placeholder={{ label: "Selecione uma opção", value: 'true' }}
                                    darkTheme={DefaultTheme.dark}
                                    style={{
                                        viewContainer: {
                                            borderWidth: 1,
                                            borderColor: DefaultTheme.colors.border,
                                            borderRadius: 8,
                                        },
                                        inputAndroid: {
                                            color: DefaultTheme.colors.text,
                                        },
                                        placeholder: {
                                            color: DefaultTheme.colors.text,
                                        }
                                    }}
                                />
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.label}>Conteúdo</Text>
                                <TextInput
                                    placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                    style={[styles.input, styles.textArea]}
                                    value={PostForm?.descricao}
                                    onChangeText={text => setPostForm({ ...PostForm, descricao: text })}
                                    placeholder="Digite o conteúdo"
                                    multiline
                                />
                                {error?.errors?.body?.conteudo && (
                                    <Text style={styles.error}>{error?.errors?.body?.titulo}</Text>
                                )}
                            </View>

                            {(PostForm?.titulo || PostForm?.descricao || PostForm?.foto) && (

                                <TouchableOpacity style={styles.confirmButton} onPress={handleSubmitPost}>
                                    <MaterialIcons name="update" size={24} color={'#FFF'} style={styles.iconButton} />
                                    <Text style={styles.confirmButtonText}>Atualizar Post</Text>
                                </TouchableOpacity>
                            )}
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
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: theme.colors.background,
        },
        label: {
            fontSize: 16,
            marginBottom: 8,
            color: theme.colors.text,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: theme.colors.text,
        },
        textArea: {
            height: 100,
            textAlignVertical: 'top',
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        imageContainer: {
            alignItems: 'center',
            marginBottom: 16,
        },
        image: {
            width: '100%',
            height: 250,
            borderRadius: 16, // Cantos arredondados na imagem
            marginBottom: 16,
            marginTop: 16,
            borderColor: theme.colors.primary,
            borderWidth: 2,
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
            color: theme.actions.error,
            alignItems: 'center',
            justifyContent: 'center',
        },
        ErrorContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
        },
    });
}