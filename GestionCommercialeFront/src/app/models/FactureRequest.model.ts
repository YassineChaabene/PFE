export interface FactureRequest {
    reference: string;
    dateEmission: string;
    dateEcheance: string;
    montant: number;
    status: string;
    conventionUuid: string;
  }
  