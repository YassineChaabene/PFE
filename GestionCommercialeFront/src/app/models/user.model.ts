export interface User {
    id?: number;
    name: string;
    uuid: string;
    email: string;
    password?: string;  
    role: 'USER' | 'ADMIN'  | 'SUPERUSER';
    showPassword?: boolean;
  }
  