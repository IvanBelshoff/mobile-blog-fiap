import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, FlatList } from 'react-native';
import { AxiosError } from 'axios';
import { useLocalSearchParams } from 'expo-router';

import { EXPO_LISTAGEM_VAZIA, EXPO_LISTAGEM_DE_POSTS } from '@env';
import { IPosts, PostsService } from '@/services/Posts/postsService';
import CardPost from '@/components/Cards/CardPost';

export default function Index() {

  const [posts, setPosts] = useState<IPosts[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const params = useLocalSearchParams<{ filter: string }>();

  const fetchData = async (): Promise<IPosts[] | AxiosError> => {

    setLoading(true);

    const result = await PostsService.getAll(page.toString(), params.filter, EXPO_LISTAGEM_DE_POSTS); // Página 1, sem filtro, limite de 10 posts

    if (result instanceof AxiosError) {
      setLoading(false);
      return result;

    } else {
      setLoading(false);
      return result.data
    }

  };

  const loadMoreData = () => {

    setPage((oldPage) => oldPage += 1);
    fetchData().then((data) => {
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
    fetchData().then((data) => {
      if (data instanceof AxiosError) {
        setError(data.message);

      } else {
        setPosts(data);
      }
    });
  }, [params.filter]);

  return (
    <View style={{ flex: 1 }}>

      <Text>{page}</Text>

      <FlatList
        data={posts}
        style={{ gap: 10, marginLeft: 10, marginRight: 10 }}
        initialNumToRender={10}
        renderItem={({ item }) => <CardPost post={item} />}
        keyExtractor={(item) => item.id.toString() + item.titulo}
        ListEmptyComponent={<Text>{EXPO_LISTAGEM_VAZIA}</Text>}
        onEndReached={loadMoreData}
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
