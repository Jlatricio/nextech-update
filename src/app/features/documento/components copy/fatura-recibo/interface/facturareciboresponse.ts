import { DadosDocumento } from "../../../interface/dadosdocumentos";

export interface facturaReciboResponse {
  data: DadosDocumento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
