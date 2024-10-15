import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList } from 'react-native';
import { AxiosError } from 'axios';
import { router, useLocalSearchParams } from 'expo-router';

import { IPosts, PostsService } from '@/services/Posts/postsService';
import CardPost from '@/components/Cards/CardPost';
import { Environment } from '@/environment';

export default function Index() {

  const [posts, setPosts] = useState<IPosts[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const ITEM_HEIGHT = 300; // Defina um valor que corresponda ao tamanho do CardPost
  const flatListRef = useRef<FlatList>(null); // Criando a referência ao FlatList

  const params = useLocalSearchParams<{ filter: string, page: string }>();
  const [page, setPage] = useState<number>(parseInt(params?.page) || 1);
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

  return (
    <View style={{ flex: 1 }}>
      {error && (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={posts}
        style={{ gap: 10, marginLeft: 10, marginRight: 10 }}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        getItemLayout={(_, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        renderItem={({ item }) =>
          <CardPost
            post={item}
            aoClicarEmPost={() => {
              router.push({
                pathname: '/post/[id]',
                params: { id: item.id.toString() || 0 }
              });
            }} />
        }
        keyExtractor={(item) => item.id.toString() + item.titulo}
        ListEmptyComponent={<Text>{Environment.LISTAGEM_VAZIA}</Text>}
        onEndReached={(info: { distanceFromEnd: number }) => {

          if (info.distanceFromEnd != 0) {
            setPage(prev => prev + 1)
            loadMoreData();
          };

        }}
        onEndReachedThreshold={0.5}
      />
      {loading && (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}


    </View>
  );
}
