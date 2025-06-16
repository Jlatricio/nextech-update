export interface ItemFactura {
  quantidade: number;
  artigoId: number;
  total: number;
  categoriaId?: number;
    precoUnitario?: number;
  artigoSelecionado?: {
    nome: string;
    preco: number;
    tipo?: string;
    categoriaId?: number;
  };

  nomeArtigo?: string;
  tipoArtigo?: string;
}


export interface factura {
   referenciaDocumentoId?: number;
  motivo?: string;
  tipo: string;
  numero: string;
  clienteId: number;
   dataValidade: string | null;
  subTotal: number;
  totalDescontos: number;
  totalImpostos: number;
  total: number;
  descontoPercentual: number;
  criadoPor: string;
  itensFactura: ItemFactura[];
}
