export interface ItemFactura {
  quantidade: number;
  artigoId: number;
  total: number;
}

export interface factura {
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
