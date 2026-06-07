export interface IITEquipment {
  ID: number;
  ITEquipmentRequestID: string;
  Title: string;
  FirstName : string;
  StaffNo: string;
  Department: string;
  Date: Date;
  RequestType: string;
  ApprovalStatus: string;
  EmployeeSignature: string;
  Reason: string;
  HODApprovarName: IPerson;
  HODDate: Date;
  HODComment: string;
  HODITApprovarName: IPerson;
  HODITDate: Date;
  HODITComment: string;
  StaffMembers: IPerson;
  ITStaffApprovarName: IPerson;
  ITStaffDate: Date;
  ITStaffComment: string;
}

export interface IPerson {
  Id: number;
  Title: string;
  EMail: string;
}