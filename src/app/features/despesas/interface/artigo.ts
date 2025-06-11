export interface Artigo {
  id: number;
  nome: string;
  CriadoPor: string;
  fornecedorId: number;
  valor: number;
  retencaoFonte: boolean;
  motivo: string;
  categoriaId: number;
  categoria?: { id: number; nome: string };
  dataCriacao: string;
  descricao: string;
  atualizadoPor?: string;
}
