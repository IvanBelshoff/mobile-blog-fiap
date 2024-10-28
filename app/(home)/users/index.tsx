import CardUser from "@/components/Cards/CardUser";
import { useAuth } from "@/contexts/AuthContext";
import { useAppThemeContext } from "@/contexts/ThemeContext";
import { Environment } from "@/environment";
import { IThemeMaximized } from "@/globalInterfaces/interfaces";
import { IUsuarioCompleto } from "@/services/Usuarios/interfaces/interfaces";
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

export default function Users() {

    const [usuarios, setUsuarios] = useState<IUsuarioCompleto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { DefaultTheme } = useAppThemeContext()
    const ITEM_HEIGHT = 300; // Defina um valor que corresponda ao tamanho do CardPost
    const flatListRef = useRef<FlatList>(null); // Criando a referência ao FlatList
    const styles = stylesTeste(DefaultTheme);
    const params = useLocalSearchParams<{ filter: string, page: string }>();
    const [page, setPage] = useState<number>(parseInt(params?.page) || 1);
    const [viewArrowUp, setViewArrowUp] = useState<boolean>(false);
    const [userOptions, setUserOptions] = useState<Pick<IUsuarioCompleto, 'id' | 'foto' | 'nome' | 'sobrenome' | 'email'> | null>(null);
    const [openbottomSheetRef, setOpenBottomSheetRef] = useState<boolean>(false);

    const { session } = useAuth();

    const fetchData = async (page: string, filter: string): Promise<IUsuarioCompleto[] | AxiosError> => {

        setLoading(true);

        const result = await UsuariosService.getAll(page, filter, Environment.LIMITE_DE_USUARIOS); // Página 1, sem filtro, limite de 10 posts

        if (result instanceof AxiosError) {
            setLoading(false);
            return result;

        } else {
            setLoading(false);
            return result.data
        }

    };

    const handleDeleteUser = async (id: number) => {

        try {
            setLoadingDelete(true);

            const response = await UsuariosService.deleteById(id);

            if (response instanceof AxiosError) {
                setLoadingDelete(false)
                console.log(response.message);

            } else {
                Alert.alert("Sucesso", "Usuário excluido com sucesso!");
                setUserOptions(null);
                flatListRef.current?.scrollToOffset({ offset: 0 });
                fetchData(params.page || '1', params.filter).then((data) => {
                    if (data instanceof AxiosError) {
                        setError(data.message);

                    } else {
                        setUsuarios(data);
                    }
                }).finally(() => {
                    bottomSheetRef.current?.close();
                    setLoadingDelete(false);
                });
            }
        } catch (error) {
            Alert.alert("Erro", "Falha ao enviar o Usuário.");
            console.error(error);
        }
    };

    const confirmDeleteUser = (id: number) => {
        Alert.alert(
            "Confirmação de Exclusão",
            "Tem certeza de que deseja excluir este usuário?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Exclusão cancelada"),
                    style: "cancel", // Estilo de botão cancelado
                },
                {
                    text: "Sim",
                    onPress: () => handleDeleteUser(id), // Se o usuário confirmar, executa a exclusão
                    style: "destructive", // Estilo de botão de ação destrutiva
                },
            ],
            { cancelable: false } // Não permite fechar o modal tocando fora dele
        );
    };


    const loadMoreData = () => {

        fetchData(params.page || '1', params.filter).then((data) => {

            if (data instanceof AxiosError) {

                setError(data.message);

            } else {

                setUsuarios((oldUsers) => {
                    if (oldUsers.length) {
                        const novosPosts = data.filter((user) => !oldUsers.some((oldPost) => oldPost.id === user.id));
                        const postsAtualizados = [...oldUsers, ...novosPosts];
                        return postsAtualizados;
                    } else {
                        return data;
                    }
                });

            }
        });
    };

    useEffect(() => {

        if (page !== parseInt(params.page || '1')) {

            router.setParams({ page: page.toString() });

        }

    }, [page]);

    const resetScroll = () => {

        if (page == 1) {
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });

        } else {
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            router.setParams({ filter: '', page: '1' });
        }

    }

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {

        const currentOffset = event.nativeEvent.contentOffset.y;

        if (currentOffset > 200) {
            setViewArrowUp(true);
        } else {
            setViewArrowUp(false);
        }

    }

    useFocusEffect(
        useCallback(() => {
            if ((params.page) && (parseInt(params.page) == 1 && page > 1)) {

                setPage(parseInt(params.page));
                flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });

            }

            fetchData(params.page || '1', params.filter).then((data) => {
                if (data instanceof AxiosError) {
                    setError(data.message);

                } else {
                    setUsuarios(data);
                }
            });
        }, [params.filter || params.page])
    );

    const bottomSheetRef = useRef<BottomSheet>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number,) => {
        if (index === 0) {
            setOpenBottomSheetRef(true);
        } else {
            setOpenBottomSheetRef(false)
        }
    }, []);

    const viewUser = (id: number) => {
        router.push({ pathname: '/users/detail/[id]', params: { id: id } });
        bottomSheetRef.current?.close();
        setOpenBottomSheetRef(false);
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        router.setParams({ filter: '', page: '1' });
    }

    // Função para abrir o BottomSheet
    const openBottomSheet = (usuario: Pick<IUsuarioCompleto, 'id' | 'foto' | 'nome' | 'sobrenome' | 'email'>) => {
        setUserOptions(usuario);
        if (openbottomSheetRef) {
            bottomSheetRef.current?.close(); // Fecha a folha completamente

        } else {
            bottomSheetRef.current?.expand(); // Abre a folha completamente (ou use snapToIndex para controlar o estado)
        }
    };

    if (loadingDelete) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size={50} color={DefaultTheme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, }}>

            {error && (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                </View>
            )}

            <FlatList
                ref={flatListRef}
                data={usuarios}
                style={{ marginLeft: 10, marginRight: 10 }}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                getItemLayout={(_, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                )}
                onScroll={onScroll}
                renderItem={({ item, index }) => (
                    <CardUser
                        index={index}
                        aoClicarEmBottomSheet={openBottomSheet}
                        aoClicarEmUser={() => viewUser(item.id)}
                        user={item}
                        key={item.id}
                    />
                )}
                keyExtractor={(item) => item.id.toString() + item.titulo}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                        <Text style={{ color: DefaultTheme.colors.text }}>{Environment.LISTAGEM_VAZIA}</Text>
                    </View>
                }
                onEndReached={(info: { distanceFromEnd: number }) => {

                    if (info.distanceFromEnd != 0) {
                        setPage(prev => prev + 1)
                        loadMoreData();
                    };

                }}
                onEndReachedThreshold={0.5}
            />

            {viewArrowUp && (
                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={resetScroll}
                >
                    <MaterialIcons name="arrow-upward" size={24} color="#fff" />
                </TouchableOpacity>
            )}


            {loading && (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={DefaultTheme.colors.primary} />
                </View>
            )}

            {userOptions && (
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={['60%']} // Defina os pontos de snap em porcentagens ou valores
                    onChange={handleSheetChanges}
                    enablePanDownToClose={true} // Permite fechar ao deslizar para baixo
                    onClose={() => setOpenBottomSheetRef(false)} // Garante que o estado seja atualizado ao fechar
                    handleStyle={{
                        backgroundColor: DefaultTheme.colors.background,
                        borderTopStartRadius: 15,
                        borderTopEndRadius: 15,
                        borderBottomColor: DefaultTheme.colors.border,
                        borderBottomWidth: 1
                    }}
                    backgroundStyle={{ backgroundColor: DefaultTheme.colors.background }} // Estilo de fundo
                    handleIndicatorStyle={{ backgroundColor: DefaultTheme.colors.primary }} // Estilo do indicador
                >
                    <BottomSheetView style={styles.contentContainer}>

                        <View style={styles.containerView}>
                            <View style={styles.imageContainer}  >
                                <Image
                                    source={{ uri: userOptions.foto.url }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={styles.userContainer} >
                                {/* Título centralizado */}
                                <Text style={styles.text}>{userOptions.nome} {userOptions.sobrenome}</Text>

                            </View>
                        </View>

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => router.push({
                                    pathname: '/users/detail/[id]',
                                    params: { id: userOptions.id }
                                })}
                            >
                                <MaterialIcons name="edit" size={30} color={'#FFF'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => router.push({
                                    pathname: '/users/rules/[id]',
                                    params: { id: userOptions.id }
                                })}
                            >
                                <MaterialIcons name="rule" size={30} color={'#FFF'} />
                            </TouchableOpacity>

                            {(session && Number(session.userId) != userOptions.id) && (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => confirmDeleteUser(userOptions.id)}
                                >
                                    <MaterialIcons name="delete" size={30} color={'#FFF'} />
                                </TouchableOpacity>
                            )}

                        </View>

                    </BottomSheetView>
                </BottomSheet>
            )}

        </View>
    );
}

const stylesTeste = (theme: IThemeMaximized) => {
    return StyleSheet.create({
        contentContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            paddingBottom: 27
        },
        containerView: {
            flexDirection: 'column',
            flex: 1,
            gap: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        userContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        imageContainer: {
            width: 150,
            height: 150,
            justifyContent: 'center',
            alignItems: 'center'
        },
        text: {
            color: theme.colors.text,
            fontWeight: 'bold',
            flexWrap: 'wrap',
            fontSize: 26
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: 8,
            borderColor: theme.colors.primary,
            borderWidth: 2
        },
        optionsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 50,
            alignItems: "center"
        },
        option: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary,
            borderRadius: 8,  // Cantos arredondados
            padding: 16
        },
        floatingButton: {
            position: 'absolute',
            bottom: 20, // distância do fundo da tela
            right: 20,   // distância do lado esquerdo da tela
            backgroundColor: theme.colors.primary, // cor do botão (você pode customizar)
            borderRadius: 50,
            padding: 15,
            elevation: 5, // elevação para dar um efeito de sombra
        }
    });
}