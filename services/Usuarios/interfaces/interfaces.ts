
export interface IDataToken {
    accessToken: string;
    id: number;
    regras: string[];
    permissoes: string[];
}

export interface IUsuario {
    id: number,
    nome: string,
    bloqueado: boolean,
    sobrenome: string,
    email: string,
    data_criacao: Date,
    data_atualizacao: Date,
    ultimo_login: Date,
    usuario_atualizador: string,
    usuario_cadastrador: string
}

export interface IUsuarioComTotalCount {
    data: IUsuarioCompleto[];
    totalCount: number;
}

export interface IFoto {
    id: number;
    nome: string;
    originalname: string;
    tipo: string;
    tamanho: number;
    local: string;
    url: string;
    data_criacao: string;
    data_atualizacao: string;
}
export interface IPermissao {
    id: number;
    nome: string;
    descricao: string;
    data_criacao: Date,
    data_atualizacao: Date,
}
export interface IRegra {
    id: number;
    nome: string;
    descricao: string;
    data_criacao: Date,
    data_atualizacao: Date,
    permissao: IPermissao[];
}

export interface IUsuarioCompleto extends IUsuario {
    foto: IFoto
}