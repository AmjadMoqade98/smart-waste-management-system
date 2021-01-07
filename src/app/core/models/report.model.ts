export interface Report {
  id:	number;
  binId: number;
  body:	string;
  subject: string;
  userId:	number;
  date: Date;
  userRole?: UserRole;
}

export enum UserRole {
  'Employee', 'Citizen'
}
