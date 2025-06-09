export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  tipo: string;
  email: string;
  endereco: string;
  empresaId: number;
  dataCriacao: string;
}

export interface Anexo {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  criadoPor: string | null;
  uploadedAt: string;
}

export interface Empresa {
  id: number;
  nome: string;
  dataCriacao: string;
  dataActualizacao: string;
  dataUltimoAcesso: string;
  email: string;
  logoURL: string;
  nif: string;
  telefone: string;
  logoId: number | null;
  endereco: string;
  proprietarioId: number;
  subscricaoAtiva: boolean;
  subscricaoId: number | null;
  regimeIVAId: number | null;
  logo: any;
}

export interface Artigo {
  id: number;
  nome: string;
  preco: number;
  categoriaId: number;
  impostoAplicado: number;
  tipo: string;
  descricao: string;
  imagemUrl: string | null;
  imagemId: number | null;
  empresaId: number;
  dataCriacao: string;
  dataActualizacao: string;
  criadoPor: string;
}

export interface ItemFactura {
  id: number;
  quantidade: number;
  artigoId: number;
  empresaId: number;
  total: number;
  documentoId: number;
  artigo: Artigo;
}

export interface DadosDocumento {
  id: number;
  tipo: string;
  numero: string;
  clienteId: number;
  empresaId: number;
  dataValidade: string | null;
  dataEmissao: string;
  subTotal: number;
  totalImpostos: number;
  totalDescontos: number;
  total: number;
  descontoPercentual: number;
  dataCriacao: string;
  dataActualizacao: string;
  criadoPor: string;
  anexoId: number;
  cliente: Cliente;
  anexo: Anexo;
  empresa: Empresa;
  itensFactura: ItemFactura[];
}
