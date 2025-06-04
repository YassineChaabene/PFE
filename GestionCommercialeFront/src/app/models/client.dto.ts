export interface ClientDto {
    id: number;
    uuid: string;
    code: string;
    intitule: string;
    telephone: string;
    email: string;
    adresse: string;
    gouvernorat: string;
    totalInvoiced?: number; 
  }