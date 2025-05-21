export interface Artigo {
  id: number;
  nome: string;
  tipo: string;
  categoriaId: number;
  categoria?: { id: number; nome: string };
  impostoAplicado: number;
  preco: number;
  dataCriacao: string;
  descricao: string;
}
