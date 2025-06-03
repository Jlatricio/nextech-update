import { Artigo } from "../../artigo/interface/artigo";

export interface ItemProforma {
 categoriaId: number | null;
  artigoId: number | null;
  artigoSelecionado: Artigo | null;
  quantidade: number;
  total: number;
    imposto: number;
}
