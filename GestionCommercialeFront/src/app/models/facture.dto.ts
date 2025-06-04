export interface FactureDto {
    id: number;
    uuid: string;
    reference: string;
    dateEmission: string;
    dateEcheance: string;
    montant: number;
    status: string;
    conventionUuid: string;
  }