export interface ConventionRequest {
  id?: number;
    uuid?: string;
    code: string;
    status: string;
    startDate: string;
    endDate: string | null;
    clientId: number;
    applicationId: number;
  }
  