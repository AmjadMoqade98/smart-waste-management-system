export interface Report {
  id:	number;
  binId: number;
  body:	string;
  subject: string;
  userId:	number;
  imageUrl: string;
  created: string;
  userRole?: UserRole;
}

export enum UserRole {
  'Employee', 'Citizen'
}
