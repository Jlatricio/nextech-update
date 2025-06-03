export interface Despesa {
  id?: number;
  nome: string;
  valor: number;
  criadoPor: string;
  dataCriacao: Date;
  motivo: string;
  comprovativo?: string;
  fornecedorId?: number;
  retencaoFonte: boolean;
}
