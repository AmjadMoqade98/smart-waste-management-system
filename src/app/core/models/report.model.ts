export interface Report {
  id:	number;
  binId: number;
  body:	string;
  subject: string;
  userId:	number;
  imageUrl: string;
  created: string;
  userRole?: UserRole;
  status: 'SENT'|'REVIEWED'|'PENDING'|'SOLVED';
}

export enum UserRole {
  'Employee', 'Citizen'
}
