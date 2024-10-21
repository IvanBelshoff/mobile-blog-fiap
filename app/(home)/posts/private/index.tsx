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
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Divider } from "react-native-paper";

export default function PrivatePosts() {

    const [posts, setPosts] = useState<IPosts[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { DefaultTheme } = useAppThemeContext()
    const ITEM_HEIGHT = 300; // Defina um valor que corresponda ao tamanho do CardPost
    const flatListRef = useRef<FlatList>(null); // Criando a referência ao FlatList
    const styles = stylesTeste(DefaultTheme);
    const params = useLocalSearchParams<{ filter: string, page: string }>();
    const [page, setPage] = useState<number>(parseInt(params?.page) || 1);
    const [viewArrowUp, setViewArrowUp] = useState<boolean>(false);
    const [idPost, setIdPost] = useState<number>(0);
    const [openbottomSheetRef, setOpenBottomSheetRef] = useState<boolean>(false);

    const fetchData = async (page: string, filter: string): Promise<IPosts[] | AxiosError> => {

        setLoading(true);

        const result = await PostsService.getAllLogged(page, filter, Environment.LIMITE_DE_POSTS); // Página 1, sem filtro, limite de 10 posts

        if (result instanceof AxiosError) {
            setLoading(false);
            return result;

        } else {
            setLoading(false);
            return result.data
        }

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

     console.log(DefaultTheme.colors.text)

    }, [DefaultTheme]);

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

    // Função para abrir o BottomSheet
    const openBottomSheet = (id: number) => {
        setIdPost(id);
        if (openbottomSheetRef) {
            bottomSheetRef.current?.close(); // Fecha a folha completamente

        } else {
            bottomSheetRef.current?.expand(); // Abre a folha completamente (ou use snapToIndex para controlar o estado)
        }
    };

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
                                pathname: '/posts/public/detail/[id]',
                                params: { id: item.id.toString() || 0 }
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

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={['40%']} // Defina os pontos de snap em porcentagens ou valores
                onChange={handleSheetChanges}
                enablePanDownToClose={true} // Permite fechar ao deslizar para baixo
                onClose={() => setOpenBottomSheetRef(false)} // Garante que o estado seja atualizado ao fechar
            >
                <BottomSheetView style={styles.contentContainer}>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity style={styles.option}>
                            <MaterialIcons name="visibility" size={24} color={DefaultTheme.colors.text} />
                            <Text style={styles.optionText}>Visualizar Post</Text>
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity style={styles.option}>
                            <MaterialIcons name="edit" size={24} color={DefaultTheme.colors.text} />
                            <Text style={styles.optionText}>Editar Post</Text>
                        </TouchableOpacity>
                        <Divider />
                        <TouchableOpacity style={styles.option}>
                            <MaterialIcons name="delete" size={24} color="red" />
                            <Text style={[styles.optionText, { color: 'red' }]}>Excluir Post</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheet>


        </View>
    );
}

const stylesTeste = (theme: IThemeMaximized) => {
    return StyleSheet.create({
        contentContainer: {
            flex: 1,
            padding: 36,
            alignItems: 'center',
        },
        floatingButton: {
            position: 'absolute',
            bottom: 20, // distância do fundo da tela
            right: 20,   // distância do lado esquerdo da tela
            backgroundColor: theme.colors.primary, // cor do botão (você pode customizar)
            borderRadius: 50,
            padding: 15,
            elevation: 5, // elevação para dar um efeito de sombra
        },
        optionContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        option: {
            flexDirection: 'row', // Coloca o ícone e o texto lado a lado
            alignItems: 'center',
            paddingVertical: 12
        },
        optionText: {
            fontSize: 18, // Aumenta o tamanho da fonte
            color: '#000', // Cor do texto
            marginLeft: 10, // Espaço entre o ícone e o texto
        },
    });
}

