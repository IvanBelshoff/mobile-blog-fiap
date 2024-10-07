import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Header from '@/components/Header';

import { router } from "expo-router";
import DrawerContent from '@/components/Drawer/DrawerContent';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeLayout() {

    const { setPermissoes, setRegras, setToken, setUserId, userId } = useAuth();

    const handleSearchParams = (filter: string) => {
        router.setParams({ filter: filter });
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }} >
            <Drawer
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
                                params: { id: userId || 0 }
                            });
                        }}

                        aoClicarEmSair={() => {
                            setToken('');
                            setUserId('');
                            setPermissoes('');
                            setRegras('');
                            router.push('/')
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
            </Drawer>
        </GestureHandlerRootView>
    );
}
