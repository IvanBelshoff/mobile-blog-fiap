const validaRegraPermissaoComponents = (regras: string[] | null, regrasRequisitadas: string[], permissoes?: string[] | null, permissoesRequisitas?: string[]): boolean => {

    const permissaoRegra = regrasRequisitadas?.every(regra => regras?.includes(regra));

    const permissaoPermissao = permissoesRequisitas?.every(permissao => permissoes?.includes(permissao));

    const regraAdmin = regras?.every(() => regras?.includes(Environment.REGRAS.REGRA_ADMIN));

    if (regras && regras.length == 0 && regrasRequisitadas.length > 0) {
        return false;
    }

    if (regraAdmin == true) {
        return true;
    }

    if (regras?.length == 0) {
        return false;
    }

    if (regrasRequisitadas && !permissaoRegra) {
        return false;
    }

    if (regrasRequisitadas && permissaoRegra && !permissoesRequisitas) {
        return true;
    }

    if (regrasRequisitadas && permissaoRegra && permissoesRequisitas && !permissaoPermissao) {
        return false;
    }

    if (regrasRequisitadas && permissaoRegra == true && permissoesRequisitas && permissaoPermissao == true) {
        return true;
    }

    return false;
};

export const Environment = {

    BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,

    LISTAGEM_VAZIA: process.env.EXPO_PUBLIC_LISTAGEM_VAZIA,

    LIMITE_DE_POSTS: process.env.EXPO_PUBLIC_LIMITE_DE_POSTS,

    LIMITE_DE_USUARIOS: process.env.EXPO_PUBLIC_LIMITE_DE_USUARIOS,

    INPUT_DE_BUSCA: process.env.EXPO_PUBLIC_INPUT_DE_BUSCA,

    TIME_DEBOUNCE: process.env.EXPO_PUBLIC_TIME_DEBOUNCE || 300,

    FILE_SIZE_LIMIT: process.env.EXPO_PUBLIC_FILE_SIZE_LIMIT || 4,

    REGRAS: {
        REGRA_ADMIN: 'REGRA_ADMIN',
        REGRA_USUARIO: 'REGRA_USUARIO',
        REGRA_PROFESSOR: 'REGRA_PROFESSOR'
    },

    PERMISSOES: {
        PERMISSAO_DELETAR_USUARIO: 'PERMISSAO_DELETAR_USUARIO',
        PERMISSAO_ATUALIZAR_USUARIO: 'PERMISSAO_ATUALIZAR_USUARIO',
        PERMISSAO_CRIAR_USUARIO: 'PERMISSAO_CRIAR_USUARIO',
        PERMISSAO_DELETAR_POSTAGEM: 'PERMISSAO_DELETAR_POSTAGEM',
        PERMISSAO_ATUALIZAR_POSTAGEM: 'PERMISSAO_ATUALIZAR_POSTAGEM',
        PERMISSAO_CRIAR_POSTAGEM: 'PERMISSAO_CRIAR_POSTAGEM'
    },

    validaRegraPermissaoComponents

};