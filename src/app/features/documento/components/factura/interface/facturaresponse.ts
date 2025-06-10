import { DadosDocumento } from "../../../interface/dadosdocumentos";

export interface facturaResponse {
  data: DadosDocumento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
