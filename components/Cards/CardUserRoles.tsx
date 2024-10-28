import { useAppThemeContext } from "@/contexts/ThemeContext";
import { IThemeMaximized } from "@/globalInterfaces/interfaces";
import { IRegra } from "@/services/Usuarios/interfaces/interfaces";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ICardUserRoles {
    role: IRegra;
    userRole: IRegra[];
    aoClicarNoCard: (rule: IRegra) => void;
}

export default function CardUserRoles({ role, userRole, aoClicarNoCard }: ICardUserRoles) {
    const { DefaultTheme } = useAppThemeContext();
    const styles = stylesTeste(DefaultTheme);

    // Função para verificar se o usuário possui determinada permissão
    const usuarioPossuiPermissao = (permissaoId: number, userRole: IRegra[]) => {
        return userRole.some((userRole) =>
            userRole.permissao.some((p) => p.id === permissaoId)
        );
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
            return <MaterialIcons name="add" size={20} color="#FFF" />;
        } else if (nomeRegra === 'ATUALIZAR') {
            return <MaterialIcons name="edit" size={20} color="#FFF" />;
        } else if (nomeRegra === 'DELETAR') {
            return <MaterialIcons name="delete" size={20} color="#FFF" />;
        } else {
            return <MaterialCommunityIcons name="eye" size={20} color="#FFF" />;
        }
    };

    return (
        <TouchableOpacity onPress={() => aoClicarNoCard(role)} style={styles.cardContainer}>
            <View style={styles.sectiontitleRule}>
                <Text style={styles.titleRule}>{HandleFormatarString(role.nome)}</Text>
            </View>

            <View style={{ flexDirection: 'column', width: '100%' }}>
                {role.nome == 'REGRA_ADMIN' ? (

                    userRole.some((userRole) => userRole.nome == 'REGRA_ADMIN') ? (
                        < View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                            marginHorizontal: 8,
                        }}>
                            <View
                                style={[
                                    styles.iconRule,
                                    styles.iconRuleActive
                                ]}
                            >
                                <MaterialIcons name="admin-panel-settings" size={20} color="#FFF" />
                                <Text style={styles.iconText}>
                                    Administrador
                                </Text>
                            </View>
                        </View>
                    ) : (
                        < View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 8,
                            marginHorizontal: 8,
                        }}>
                            <View
                                style={[
                                    styles.iconRule,
                                    styles.iconRuleInactive
                                ]}
                            >
                                <MaterialIcons name="admin-panel-settings" size={20} color="#FFF" />
                                <Text style={styles.iconText}>
                                    Administrador
                                </Text>
                            </View>
                        </View>
                    )



                ) : (
                    <View style={styles.sectionIconsRules}>

                        {userRole.some((userRole) => userRole.nome == role.nome) ? (
                            <View
                                style={[
                                    styles.iconRule,
                                    styles.iconRuleActive
                                ]}
                            >
                                {typeIcon(role.nome)}
                                <Text style={styles.iconText}>
                                    Visualizar {role.nome == 'REGRA_USUARIO' ? 'usuario' : 'postagem'}
                                </Text>
                            </View>
                        ) : (
                            <View
                                style={[
                                    styles.iconRule,
                                    styles.iconRuleInactive
                                ]}
                            >
                                {typeIcon(role.nome)}
                                <Text style={styles.iconText}>
                                    Visualizar {role.nome == 'REGRA_USUARIO' ? 'usuario' : 'postagem'}
                                </Text>
                            </View>
                        )}
                        {role.permissao.map((permission) => {


                            const possuiPermissao = usuarioPossuiPermissao(permission.id, userRole);
                            return (
                                <View
                                    key={permission.id}
                                    style={[
                                        styles.iconRule,
                                        possuiPermissao ? styles.iconRuleActive : styles.iconRuleInactive
                                    ]}
                                >
                                    {typeIcon(permission.nome)}
                                    <Text style={styles.iconText}>
                                        {capturarTipoPermissao(permission.nome)} {capturarAcaoPermissao(permission.nome)}
                                    </Text>
                                </View>
                            );
                        })}

                    </View>
                )}

            </View>
        </TouchableOpacity >
    );
}

const stylesTeste = (theme: IThemeMaximized) => {
    return StyleSheet.create({
        cardContainer: {
            borderColor: theme.colors.primary,
            borderWidth: 2,
            borderRadius: 8,
            paddingBottom: 16,
        },
        sectiontitleRule: {
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: 16,
            marginTop: 16,
            marginBottom: 8,
            flexDirection: 'row',
        },
        titleRule: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: 4,
            color: theme.colors.text,
        },
        sectionIconsRules: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 8,
            marginHorizontal: 8,
        },
        iconRule: {
            borderRadius: 8,
            width: '48%',
            flexDirection: 'row',
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        iconRuleActive: {
            backgroundColor: theme.colors.primary,
        },
        iconRuleInactive: {
            backgroundColor: '#CCC', // Cor acinzentada para permissões inativas
        },
        iconText: {
            marginLeft: 8,
            fontSize: 12,
            fontWeight: 'bold',
            color: '#FFF',
        },
    });
};
