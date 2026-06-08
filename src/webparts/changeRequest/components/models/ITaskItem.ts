// Model for Task List Items (ChageRequest_TasksList)
export interface ITaskItem {
  ID?: number;
  Title?: string;                    // Mr/Ms
  EmployeeName?: string;             // Employee full name
  Department?: string;               // Department
  StaffNo?: string;                  // Staff number
  Date?: string;                     // Task date
  AssignedTo?: {                     // Person assigned to task
    Id: number;
    Title: string;
    EMail: string;
  };
  RequestID?: number;                // Linked Change Request ID
  ApproverComment?: string;          // Comment from approver
  RoleLevel?: string;                // HeadOfDepartment, HODIT, ITStaff
  FormName?: string;                 // Form type (ChangeRequest)
  ApprovalStatus?: string;           // Pending, Completed
  Comments?: string;                 // User comments from original request
  ChangeRequestID?: string;          // CR-20260601-001
  UserRequirement?: string;          // User Requirement text
  UserRequirementPriority?: string;  // Low/Medium/High
  System?: string;                   // T24/Swift/Others
  Created?: string;
  Modified?: string;
  CreatedBy?: any;
  ModifiedBy?: any;
}