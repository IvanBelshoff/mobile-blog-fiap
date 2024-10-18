import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Header from '@/components/Headers/Header';

import { router } from "expo-router";
import DrawerContent from '@/components/Drawer/DrawerContent';
import { useAuth } from '@/contexts/AuthContext';
import { useDebouncedCallback } from 'use-debounce';
import { Environment } from '@/environment';

export default function HomeLayout() {

    const { signOut, session } = useAuth();

    const handleSearchParams = useDebouncedCallback((filter: string) => {
        router.setParams({ filter: filter });
    }, parseInt(Environment.TIME_DEBOUNCE));

    return (
        <GestureHandlerRootView style={{ flex: 1 }} >
            <Drawer
                initialRouteName='/'
                backBehavior='initialRoute'
                
                screenOptions={{
                    drawerPosition: 'right',
                    drawerType: 'front',
                }}
                drawerContent={(props) => (
                    <DrawerContent
                        state={props.state}
                        navigation={props.navigation}
                        aoClicarEmAcessarConta={() => {
                            router.push('/login')
                        }}
                        aoClicarEmMinhaConta={() => {
                            router.push({
                                pathname: '/profile/[id]',
                                params: { id: session?.userId || 0 }
                            });
                        }}
                        aoClicarEmSair={() => {
                            signOut();
                            router.push('/')
                        }}
                        aoClicarEmConfiguracoes={() => {
                            router.push('/settings')
                        }}
                    />
                )}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        header: (props) => (
                            <Header
                                props={props}
                                onSearch={(filter) => handleSearchParams(filter)} // Passa a função para atualizar o estado da pesquisa
                            />
                        )
                    }}
                />

                <Drawer.Screen
                    name="profile/[id]"
                    options={{
                        header: (props) => (
                            <Header
                                props={props}
                                onSearch={(filter) => handleSearchParams(filter)} // Passa a função para atualizar o estado da pesquisa
                            />
                        )
                    }}
                />

                <Drawer.Screen
                    name="post/[id]"
                    options={{
                        header: (props) => (
                            <Header
                                props={props}
                                onSearch={(filter) => handleSearchParams(filter)} // Passa a função para atualizar o estado da pesquisa
                            />
                        )
                    }}
                />

                <Drawer.Screen
                    name="settings/index"
                    options={{
                        header: (props) => (
                            <Header
                                props={props}
                                onSearch={(filter) => handleSearchParams(filter)} // Passa a função para atualizar o estado da pesquisa
                            />
                        )
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
