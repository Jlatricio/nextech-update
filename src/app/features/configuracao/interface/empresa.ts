export interface Empresa{
   nome?: string;
 dataCriacao?: string;

 email?: string;
 logoURL?: string;
 nif?: string;
 telefone?: string;
 endereco?: string;

}
export interface ArquivoUpload {
  savedFile: {
    id: number;
    nomeArquivo: string;
    url: string;
    tipo: string;
    tamanho: number;
    empresaId: number;
    dataUpload: string;
  };
  url: string; 
}
