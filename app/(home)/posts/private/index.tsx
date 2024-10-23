import CardPostPrivate from "@/components/Cards/CardPostPrivate";
import { useAppThemeContext } from "@/contexts/ThemeContext";
import { Environment } from "@/environment";
import { IThemeMaximized } from "@/globalInterfaces/interfaces";
import { IPosts, PostsService } from "@/services/Posts/postsService";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Image, Alert } from "react-native";
import { Divider } from "react-native-paper";

export default function PrivatePosts() {

    const [posts, setPosts] = useState<IPosts[]>([]);
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
    const [postOptions, setPostOptions] = useState<Pick<IPosts, 'id' | 'foto' | 'titulo' | 'visivel'> | null>(null);
    const [openbottomSheetRef, setOpenBottomSheetRef] = useState<boolean>(false);

    const fetchData = async (page: string, filter: string): Promise<IPosts[] | AxiosError> => {

        setLoading(true);

        const result = await PostsService.getAll(page, filter, Environment.LIMITE_DE_POSTS); // Página 1, sem filtro, limite de 10 posts

        if (result instanceof AxiosError) {
            setLoading(false);
            return result;

        } else {
            setLoading(false);
            return result.data
        }

    };

    const handleDeletePost = async (id: number) => {

        try {
            setLoadingDelete(true);

            const response = await PostsService.deleteById(id);

            if (response instanceof AxiosError) {
                setLoadingDelete(false);
                console.log(response.message);

            } else {
                Alert.alert("Sucesso", "Post excluido com sucesso!");
                setPostOptions(null);
                flatListRef.current?.scrollToOffset({ offset: 0 });
                fetchData(params.page || '1', params.filter).then((data) => {
                    if (data instanceof AxiosError) {
                        setError(data.message);

                    } else {
                        setPosts(data);
                    }
                }).finally(() => {
                    bottomSheetRef.current?.close();
                    setLoadingDelete(false);
                });
            }
        } catch (error) {
            Alert.alert("Erro", "Falha ao enviar o post.");
            console.error(error);
        }
    };

    const confirmDeletePost = (id: number) => {
        Alert.alert(
            "Confirmação de Exclusão",
            "Tem certeza de que deseja excluir este post?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Exclusão cancelada"),
                    style: "cancel", // Estilo de botão cancelado
                },
                {
                    text: "Sim",
                    onPress: () => handleDeletePost(id), // Se o usuário confirmar, executa a exclusão
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

                setPosts((oldPosts) => {
                    if (oldPosts.length) {
                        const novosPosts = data.filter((post) => !oldPosts.some((oldPost) => oldPost.id === post.id));
                        const postsAtualizados = [...oldPosts, ...novosPosts];
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

    useEffect(() => {

        if ((params.page) && (parseInt(params.page) == 1 && page > 1)) {

            setPage(parseInt(params.page));
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });

        }

        fetchData(params.page || '1', params.filter).then((data) => {
            if (data instanceof AxiosError) {
                setError(data.message);

            } else {
                setPosts(data);
            }
        });

    }, [params.filter || params.page]);

    const bottomSheetRef = useRef<BottomSheet>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number,) => {
        if (index === 0) {
            setOpenBottomSheetRef(true);
        } else {
            setOpenBottomSheetRef(false)
        }
    }, []);

    const viewPost = (id: number) => {
        router.push({ pathname: 'posts/public/detail/[id]', params: { id: id } });
        bottomSheetRef.current?.close();
        setOpenBottomSheetRef(false);
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        router.setParams({ filter: '', page: '1' });
    }

    // Função para abrir o BottomSheet
    const openBottomSheet = (post: Pick<IPosts, 'id' | 'foto' | 'titulo' | 'visivel'>) => {
        setPostOptions(post);
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
                data={posts}
                style={{ marginLeft: 10, marginRight: 10 }}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                getItemLayout={(_, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                )}
                onScroll={onScroll}
                renderItem={({ item, index }) =>
                    <CardPostPrivate
                        post={item}
                        index={index}
                        aoClicarEmPost={() => {
                            router.push({
                                pathname: '/posts/private/detail/[id]',
                                params: { id: item.id }
                            });
                        }}
                        aoClicarEmBottomSheet={openBottomSheet}
                    />
                }
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

            {postOptions && (
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={['65%']} // Defina os pontos de snap em porcentagens ou valores
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

                        <View style={styles.imageContainer}>
                            <Text style={styles.titlePost}>{postOptions.titulo}</Text>
                            <Image
                                source={{ uri: postOptions.foto?.url }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={styles.optionsContainer}>

                            {postOptions.visivel && (
                                <TouchableOpacity style={styles.option} onPress={() => viewPost(postOptions.id)}>
                                    <MaterialIcons name="open-in-new" size={30} color={'#FFF'} />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => router.push({
                                    pathname: '/posts/private/detail/[id]',
                                    params: { id: postOptions.id }
                                })}>
                                <MaterialIcons name="edit" size={30} color={'#FFF'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => confirmDeletePost(postOptions.id)} // Chama a função que exibirá o modal
                            >
                                <MaterialIcons name="delete" size={30} color={'#FFF'} />
                            </TouchableOpacity>

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
            padding: 25,
            gap: 10,
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageContainer: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 25
        },
        titlePost: {
            color: theme.colors.text,
            fontSize: 20,
            fontWeight: 'bold'
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 8,
            marginBottom: 12,
        },
        optionsContainer: {
            flex: 1,
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

{/*{postOptions && (
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={['65%']} // Defina os pontos de snap em porcentagens ou valores
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

                        <View style={styles.imageContainer}>
                            <Text style={styles.titlePost}>{postOptions.titulo}</Text>
                            <Image
                                source={{ uri: postOptions.foto?.url }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        {postOptions.visivel && (
                            <View style={styles.optionContainer}>
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => viewPost(postOptions.id)}
                                >
                                    <MaterialIcons name="visibility" size={24} color={DefaultTheme.colors.primary} />
                                    <Text style={styles.optionText}>Visualizar Post</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.divider} />

                        <View style={styles.optionContainer}>
                            <TouchableOpacity style={styles.option}>
                                <MaterialIcons name="edit" size={24} color={DefaultTheme.colors.primary} />
                                <Text style={styles.optionText}>Editar Post</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.optionContainer}>
                            <TouchableOpacity style={styles.option}>
                                <MaterialIcons name="delete" size={24} color={DefaultTheme.colors.primary} />
                                <Text style={styles.optionText}>Excluir Post</Text>
                            </TouchableOpacity>
                        </View>

                    </BottomSheetView>
                </BottomSheet>
            )}*/}

/*

const stylesTeste = (theme: IThemeMaximized) => {
    return StyleSheet.create({
        contentContainer: {
            flex: 1,
            gap: 15,
            padding: 25,
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        imageContainer: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 25
        },
        titlePost: {
            color: theme.colors.text,
            fontSize: 20,
            fontWeight: 'bold'
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 8,
            marginBottom: 12,
            borderColor: theme.colors.primary,
            borderWidth: 2
        },
        optionContainer: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        option: {
            flexDirection: 'row', // Coloca o ícone e o texto lado a lado
            alignItems: 'center'
        },
        optionText: {
            fontSize: 18, // Aumenta o tamanho da fonte
            color: theme.colors.text, // Cor do texto
            marginLeft: 10, // Espaço entre o ícone e o texto
            fontWeight: 'light'
        },
        divider: {
            width: '100%',
            justifyContent: 'center',
            backgroundColor: theme.colors.border,
            height: 1
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
 */



