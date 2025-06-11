import { DadosDocumento } from "../../../interface/dadosdocumentos";

export interface ProformaResponse {
  data: DadosDocumento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
