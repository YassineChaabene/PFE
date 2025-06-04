  import { Application } from "./application.model";
  import { Client } from "./client.model";

  export interface Convention {
    id?: number;
    code: string;
    status: string;
    startDate: string;
    endDate?: string;
    client: Client;  
    application: Application;
    uuid?: string;  
  }
