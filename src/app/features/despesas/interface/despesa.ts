export interface Despesa {
  id: number;
  nome: string;
  CriadoPor: string;
  fornecedorId?: { id: number; nome: string };
  valor: number;
  retencaoFonte: boolean;
  motivo: string;
  dataCriacao: string;
  descricao: string;
  atualizadoPor?: string;
}
