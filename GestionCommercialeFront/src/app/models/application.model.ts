import { Responsable } from './responsable.model';

export interface Application {
  uuid: string;
    id: number;
    intitule: string;
    description: string;
    dateExploitation: Date;
    abreviation: string;
    responsable: Responsable;
  }
  