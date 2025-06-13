export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  dataCriacao?: string;
   senha?: string;
  isActive: boolean;
  isOwner: boolean;
}
