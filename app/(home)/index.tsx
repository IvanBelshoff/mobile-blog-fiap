import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, VirtualizedList, FlatList, Platform } from 'react-native';
import { AxiosError } from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { EXPO_LISTAGEM_VAZIA, EXPO_LISTAGEM_DE_POSTS } from '@env';
import { IPosts, PostsService } from '@/services/Posts/postsService';
import CardPost from '@/components/Cards/CardPost';
import { ILoginProps } from '@/contexts/interfaces/interfaces';


export default function Index() {

  const [posts, setPosts] = useState<IPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useLocalSearchParams<{ filter: string }>();
  const [page, setPage] = useState<number>(1);

  const fetchData = async () => {

    setLoading(true);

    setError(null);

    const result = await PostsService.getAll(page.toString(), params.filter, EXPO_LISTAGEM_DE_POSTS); // Página 1, sem filtro, limite de 10 posts

    if (result instanceof AxiosError) {
      setError(result.message);
      setLoading(false);
      return;
    } else {
      setPosts(result.data);
    }

    setLoading(false);

  };


  const loadPageDataFinal = () => {

    setPage((oldPage) => oldPage + 1);

  };

  useEffect(() => {
    if(Platform.OS === 'web') {
      const teste = localStorage.getItem('session');
      if (teste) {
        const sessionProps = JSON.parse(teste) as ILoginProps;

        console.log(sessionProps.token)
      }

    }
    fetchData();
  }, [params.filter, page]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {posts && (
        <FlatList
          data={posts}
          style={{ gap: 10, marginLeft: 10, marginRight: 10 }}
          initialNumToRender={4}
          renderItem={({ item }) => <CardPost post={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>{EXPO_LISTAGEM_VAZIA}</Text>}
          onEndReached={loadPageDataFinal}
        />
      )}

    </View>
  );
}
