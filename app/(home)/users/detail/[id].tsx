import { useAppThemeContext } from "@/contexts/ThemeContext";
import { IThemeMaximized } from "@/globalInterfaces/interfaces";
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, KeyboardAvoidingView, Image, TouchableOpacity, TextInput, Platform, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from 'expo-image-picker';
import { Environment } from "@/environment";
import { useAuth } from "@/contexts/AuthContext";
import RNPickerSelect from 'react-native-picker-select';

interface IUserForm {
    nome?: string;
    sobrenome?: string;
    email?: string;
    senha?: string;
    foto?: {
        uri: string;
        name: string;
        type: string
    },
    bloqueado?: boolean;
}

export interface IActionNovoUsuario {
    response?: {
        data: {
            errors?: {
                default?: string
                body?: {
                    nome: string,
                    sobrenome: string,
                    email: string,
                    senha: string
                }
            },
            success?: {
                message?: string
            }

        }
    }
}

export interface INovoUsuarioAction {
    errors?: {
        default?: string
        body?: {
            nome?: string,
            sobrenome?: string,
            email?: string,
            senha?: string
        }
    },
    success?: {
        message?: string
    }
}

export default function DetailUser() {

    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [UserForm, setUserForm] = useState<IUserForm>({
        nome: undefined,
        sobrenome: undefined,
        email: undefined,
        foto: undefined,
        bloqueado: undefined
    });
    const [error, setError] = useState<INovoUsuarioAction | undefined>(undefined);
    const [statePhoto, setStatePhoto] = useState<'default' | 'preview'>('default');
    const [limitedFileSize, setLimitedFileSize] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<{ uri: string; name: string; type: string } | null>(null);

    const { id } = useLocalSearchParams();
    const { session } = useAuth();

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    const router = useRouter()

    const fetchUser = async () => {

        try {
            const data = await UsuariosService.getById(Number(id));

            if (data instanceof AxiosError) {
                setLoading(false);
                const errors = (data as IActionNovoUsuario).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                        body: {
                            nome: errors?.body?.nome,
                            sobrenome: errors?.body?.sobrenome,
                            email: errors?.body?.email,
                            senha: errors?.body?.senha
                        }
                    }
                });

                return;
            } else {
                setUserForm({
                    nome: data.nome,
                    sobrenome: data.sobrenome,
                    email: data.email,
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
                        nome: undefined,
                        sobrenome: undefined,
                        email: undefined,
                        senha: undefined
                    }
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitUser = async () => {

        try {
            setLoading(true);

            const response = await UsuariosService.updateById(Number(id), UserForm?.nome, UserForm?.sobrenome, UserForm?.email, selectedImage || undefined, UserForm?.bloqueado == true ? 'true' : 'false', UserForm?.senha);

            if (response instanceof AxiosError) {
                setLoading(false);
                const errors = (response as IActionNovoUsuario).response?.data.errors;
                setError({
                    errors: {
                        default: errors?.default,
                        body: {
                            nome: errors?.body?.nome,
                            sobrenome: errors?.body?.sobrenome,
                            email: errors?.body?.email,
                            senha: errors?.body?.senha
                        }
                    }
                });

            } else {
                Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
                
                router.push('/users')

                await fetchUser().then(() => {
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

            const response = await UsuariosService.deleteFotoById(Number(id));

            if (response instanceof AxiosError) {
                const errors = (response as IActionNovoUsuario).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                    }
                });

                setLoading(false);
                return;
            } else {

                Alert.alert("Sucesso", "Foto excluída com sucesso!");

                await fetchUser().finally(() => setLoading(false));

            }

        } catch (error) {
            Alert.alert("Erro", "Falha ao excluir a foto.");
            console.error(error);
        }
    }

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

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => setError({
                errors: {
                    default: undefined,
                    body: {
                        nome: undefined,
                        sobrenome: undefined,
                        email: undefined,
                        senha: undefined
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
            fetchUser();
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

                {UserForm && (
                    <View style={{ flex: 1, paddingVertical: 16 }}>

                        {/* Imagem de perfil centralizada */}
                        <View style={styles.imageContainer}>

                            {statePhoto === 'default' ? (
                                <Image
                                    source={{ uri: UserForm.foto?.uri }} // Mostra a imagem selecionada ou a atual
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
                                <Text style={styles.label}>Nome</Text>
                                <TextInput
                                    placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                    style={styles.input}
                                    value={UserForm?.nome}
                                    onChangeText={text => setUserForm({ ...UserForm, nome: text })}
                                    placeholder="Digite o nome do usuário"
                                />
                                {error?.errors?.body?.nome && (
                                    <Text style={styles.error}>{error?.errors?.body?.nome}</Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.label}>Sobrenome</Text>
                                <TextInput
                                    placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                    style={styles.input}
                                    value={UserForm?.sobrenome}
                                    onChangeText={text => setUserForm({ ...UserForm, sobrenome: text })}
                                    placeholder="Digite o sobrenome do usuário"
                                />
                                {error?.errors?.body?.sobrenome && (
                                    <Text style={styles.error}>{error?.errors?.body?.sobrenome}</Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.label}>E-mail</Text>
                                <TextInput
                                    placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                    style={styles.input}
                                    value={UserForm?.email}
                                    onChangeText={text => setUserForm({ ...UserForm, email: text })}
                                    placeholder="Digite o e-mail do usuário"
                                />
                                {error?.errors?.body?.email && (
                                    <Text style={styles.error}>{error?.errors?.body?.email}</Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.label}>Selecione o status</Text>
                                <RNPickerSelect
                                    onValueChange={(value: 'true' | 'false') => setUserForm({ ...UserForm, bloqueado: value === 'true' ? true : false })}
                                    items={[
                                        { label: 'Bloqueado', value: 'true' },
                                        { label: 'Desbloqueado', value: 'false' }
                                    ]}
                                    value={UserForm?.bloqueado == true ? 'true' : 'false'}

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

                            {(session && Number(session.userId) != Number(id)) && (

                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={styles.label}>Nova Senha</Text>
                                    <View style={styles.containerInputPassword}>
                                        <TextInput
                                            secureTextEntry={!showPassword}
                                            value={UserForm.senha}
                                            onChangeText={text => setUserForm({ ...UserForm, senha: text })}
                                            style={styles.inputPassword}
                                            placeholder="Senha"
                                            placeholderTextColor={DefaultTheme.dark ? '#FFF' : '#333'}
                                        />
                                        <MaterialCommunityIcons
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            size={24}
                                            color={DefaultTheme.dark ? '#FFF' : '#aaa'}
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
                            )}

                            {(UserForm?.nome || UserForm?.sobrenome || UserForm?.email || UserForm.senha) && (

                                <TouchableOpacity style={styles.confirmButton} onPress={handleSubmitUser}>
                                    <MaterialIcons name="post-add" size={24} color={'#FFF'} style={styles.iconButton} />
                                    <Text style={styles.confirmButtonText}>Atualizar Usuário</Text>
                                </TouchableOpacity>
                            )}

                        </View>


                    </View>
                )}

            </KeyboardAwareScrollView>
        </KeyboardAvoidingView >
    )
}

const stylesTeste = (theme: IThemeMaximized) => {

    return StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 0,
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
            marginBottom: 10,
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
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
        },
        inputPassword: {
            flex: 1,
            paddingVertical: 10,
            paddingRight: 10,
            fontSize: 16,
            color: theme.colors.text,
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