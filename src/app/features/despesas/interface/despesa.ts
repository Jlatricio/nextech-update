export interface Despesa {
  id: number;
  nome: string;
  criadoPor: string;
  fornecedor?: { id: number; nome: string };
  valor: number;
  retencaoFonte: boolean;
  motivo: string;
  dataCriacao: string;
  descricao: string;
  atualizadoPor?: string;
}
