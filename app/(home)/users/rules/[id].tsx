import CardUserRoles from "@/components/Cards/CardUserRoles";
import UserPermission from "@/components/UserPermission";
import { useAppThemeContext } from "@/contexts/ThemeContext";
import { IThemeMaximized } from "@/globalInterfaces/interfaces";
import { RegrasService } from "@/services/Regras/regrasService";
import { IRegra, IUsuarioCompleto } from "@/services/Usuarios/interfaces/interfaces";
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Checkbox } from "react-native-paper";

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

export default function RulesManagement() {

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);
    const { id } = useLocalSearchParams();
    const [error, setError] = useState<INovoUsuarioAction | undefined>(undefined);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [user, setUser] = useState<IUsuarioCompleto | undefined>(undefined);
    const [userRole, setUserRole] = useState<IRegra[] | undefined>();
    const [role, setRole] = useState<IRegra[] | undefined>();
    const [openbottomSheetRef, setOpenBottomSheetRef] = useState<boolean>(false);
    const [ruleOptions, setRuleOptions] = useState<IRegra | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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
                setUser(data);
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

    const fetchRoles = async () => {

        try {
            const data = await RegrasService.getAll();

            if (data instanceof AxiosError) {
                setLoading(false);
                const errors = (data as IActionNovoUsuario).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                    }
                });

                return;
            } else {
                setRole(data);
            }

        } catch (error) {
            setError({
                errors: {
                    default: 'Erro ao carregar informações do post',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRoles = async () => {

        try {
            const data = await RegrasService.getRegrasByIdUser(Number(id));

            if (data instanceof AxiosError) {
                setLoading(false);
                const errors = (data as IActionNovoUsuario).response?.data.errors;

                setError({
                    errors: {
                        default: errors?.default,
                    }
                });

                return;
            } else {
                setUserRole(data);
            }

        } catch (error) {
            setError({
                errors: {
                    default: 'Erro ao carregar informações do post',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSheetChanges = useCallback((index: number,) => {
        if (index === 0) {
            setOpenBottomSheetRef(true);
        } else {
            setOpenBottomSheetRef(false)
        }
    }, []);

    // Função para abrir o BottomSheet
    const openBottomSheet = (rule: IRegra) => {
        setRuleOptions(rule);
        if (openbottomSheetRef) {
            bottomSheetRef.current?.close(); // Fecha a folha completamente

        } else {
            bottomSheetRef.current?.expand(); // Abre a folha completamente (ou use snapToIndex para controlar o estado)
        }
    };

    const HandleFormatarString = (input: string): string => {
        return input.replace(/_/g, ' ');
    };

    const capturarAcaoPermissao = (rule: string): string => {
        const nomeRegra = rule.split('_')[2];
        return nomeRegra.toLowerCase();
    };

    const capturarTipoPermissao = (rule: string): string => {
        const nomeRegra = rule.split('_')[1];
        return nomeRegra.toLowerCase();
    };

    const typeIcon = (rule: string): React.JSX.Element => {
        const nomeRegra = rule.split('_')[1];
        if (nomeRegra === 'CRIAR') {
            return <MaterialIcons name="add" size={25} color={DefaultTheme.colors.primary} />;
        } else if (nomeRegra === 'ATUALIZAR') {
            return <MaterialIcons name="edit" size={25} color={DefaultTheme.colors.primary} />;
        } else if (nomeRegra === 'DELETAR') {
            return <MaterialIcons name="delete" size={25} color={DefaultTheme.colors.primary} />;
        } else {
            return <MaterialCommunityIcons name="eye" size={25} color={DefaultTheme.colors.primary} />;
        }
    };

    function capitalizeWords(text: string): string {
        return text
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    const HandleVerificarIds = (ids: number[], id: number) => {
        // Verifica se o id já está presente no array
        const isIdPresente = ids.includes(id);

        if (isIdPresente) {
            // Se o id já estiver presente, remove-o do array
            const novosIdsRegras = ids.filter((regraId) => regraId !== id);

            return novosIdsRegras;

        } else {
            // Se o id não estiver presente, adiciona-o ao array
            return [...ids, id];
        }
    };

    const [checkboxStatePermissoes, setCheckboxStatePermissoes] = useState<number[]>([]);
    const [checkboxStateRegras, setCheckboxStateRegras] = useState<number[]>([]);

    const handleFindRuleByIdsPermissions = (regras: IRegra[], ids: number[]): number[] => {

        const regrasEncontradas: Map<number, IRegra> = new Map();

        for (const id of ids) {
            for (const regra of regras) {
                for (const permissao of regra.permissao) {
                    if (permissao.id === id) {
                        regrasEncontradas.set(regra.id, regra);
                        break;
                    }
                }
            }
        }

        return Array.from(regrasEncontradas.values()).map((regra) => regra.id);

    };

    const handleCheckboxChangePermissoes = (ids: number[]) => {

        setCheckboxStatePermissoes(() => ids);

        if (role) {
            const regrasChecadas = handleFindRuleByIdsPermissions(role, ids);

            if (!regrasChecadas.every(regra => checkboxStateRegras.includes(regra))) {

                const regrasFaltando = regrasChecadas.filter(regra => !checkboxStateRegras.includes(regra));

                setCheckboxStateRegras([...checkboxStateRegras, ...regrasFaltando]);

            }
        }


    };

    useEffect(() => {
        if (id) {
            fetchUser();
            fetchRoles();
            fetchUserRoles();
        }
    }, [id]);

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
                {user && (
                    <UserPermission nome={`${user.nome} ${user.sobrenome}`} url={user.foto.url} />
                )}

                <View style={styles.containerMain}>

                    {(role && userRole) && role.map((role) => (
                        <CardUserRoles key={role.id} role={role} userRole={userRole} aoClicarNoCard={openBottomSheet} />
                    ))}

                    {(ruleOptions && userRole) && (
                        <BottomSheet
                            ref={bottomSheetRef}
                            snapPoints={['60%']}
                            onChange={handleSheetChanges}
                            enablePanDownToClose={true}
                            onClose={() => setOpenBottomSheetRef(false)}
                            handleStyle={{
                                backgroundColor: DefaultTheme.colors.background,
                                borderTopStartRadius: 15,
                                borderTopEndRadius: 15,
                                borderBottomColor: DefaultTheme.colors.border,
                                borderBottomWidth: 1,
                            }}
                            backgroundStyle={{ backgroundColor: DefaultTheme.colors.background }}
                            handleIndicatorStyle={{ backgroundColor: DefaultTheme.colors.primary }}
                        >
                            <BottomSheetView style={styles.contentContainer}>
                                <Text style={styles.ruleName}>{HandleFormatarString(ruleOptions.nome)}</Text>

                                <View style={styles.permissionsContainer}>

                                    <View style={styles.permissionItem}>
                                        <Checkbox
                                            status={'checked'}
                                            onPress={() => {/* Função para atualizar o valor da permissão */ }}
                                            color={DefaultTheme.colors.primary}
                                        />
                                        <Text style={styles.permissionText}>{capitalizeWords(`Visualizar ${ruleOptions.nome == 'REGRA_USUARIO' ? 'Usuário' : 'Postagem'}`)}</Text>
                                        <MaterialCommunityIcons name="eye" size={25} color={DefaultTheme.colors.primary} />

                                    </View>

                                    {ruleOptions.permissao.map((permission) => {

                                        return (
                                            <View key={permission.id} style={styles.permissionItem}>
                                                <Checkbox
                                                    color={DefaultTheme.colors.primary}
                                                    status={checkboxStatePermissoes.some(permissaoUsuario => permissaoUsuario === permission.id) ? 'checked' : 'unchecked'}
                                                    onPress={() => handleCheckboxChangePermissoes(HandleVerificarIds(checkboxStatePermissoes, permission.id))}
                                                />
                                                <Text style={styles.permissionText}>{capitalizeWords(`${capturarTipoPermissao(permission.nome)} ${capturarAcaoPermissao(permission.nome)}`)}</Text>
                                                {typeIcon(permission.nome)}
                                            </View>
                                        )
                                    }

                                    )}
                                </View>
                            </BottomSheetView>
                        </BottomSheet>
                    )}


                </View>

            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>

    )
}


const stylesTeste = (theme: IThemeMaximized) => {

    return StyleSheet.create({
        ruleName: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 12,
            color: theme.colors.text,
        },
        permissionsContainer: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%',
            paddingHorizontal: 16,
        },
        permissionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 8,
            width: '100%',
            marginBottom: 12,
            justifyContent: 'space-between',
            padding: 8,
        },
        permissionText: {
            marginLeft: 8,
            fontSize: 16,
            color: '#666',
        },
        contentContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            flexDirection: 'column',
            paddingBottom: 27
        },
        container: {
            flex: 1,
        },
        profileImage: {
            width: 200,
            height: 200,
            borderRadius: 25, // Redonda
            marginBottom: 16,
            borderColor: theme.colors.primary,
            borderWidth: 2,
        },
        containerMain: {
            flex: 1,
            gap: 16,
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: theme.colors.background,
        }
    });
}