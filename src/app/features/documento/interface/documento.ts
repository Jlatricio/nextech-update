export interface Documento {
  id: number;
  clienteId: number;
  empresaId: number;
  dataEmissao: Date;
  produtoServicoId: number;
  precoUnitario: number;
  quantidade: number;
  totalLiquido: number;
  totalImpostos: number;
  impostosRetidos: number;
  total: number;
  descontoPercentual: number;
  dataCriacao: Date;
  dataActualizacao: Date;
  criadoPor: string;
}