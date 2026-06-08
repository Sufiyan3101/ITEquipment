export interface IFormData {
  Title: string;
  FirstName: string;
  StaffNo: string;
  Department: string;
  Date: string;
  RequestType: string;
  Reason: string;
  EmployeeSignature: string;
  Attachment: File | null;
}

export interface IFormErrors {
    StaffNo?: string;
  Department?: string;
  RequestType?: string;
  Reason?: string;
  EmployeeSignature?: string;
  Attachment?: string;
}