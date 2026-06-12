
export interface IChangeRequest {
  ID?: number;
  Title?: string;                          // Mr/Ms/Dr
  First_x0020_Name?: string;               // First Name
  Last_x0020_Name?: string;                // Last Name
  Staff_x0020_No?: string;                 // Staff Number
  Department?: string;                     // Department
  System?: string;                         // System (T24, Swift, etc.)
  User_x0020_Requirement?: string;         // User Requirement (short)
  User_x0020_Requirement_x0020_Pri?: string; // Priority (Low/Medium/High)
  User_x0020_Requirements?: string;        // User Requirements (detailed)
  Date?: string;                           // Effective Date
  Submission_x0020_Date?: string;          // Submission Date
  Change_x0020_Request_x0020_ID?: string;  // Change Request ID
  ApprovalStatus?: string;                 // Status
  Employee_x0020_Signature?: string;       // Base64 signature image
  HODComment?: string;
  HODITComment?: string;
  ITStaffComment?: string;
  HODDate?: string;
  HODITDate?: string;
  ITStaffDate?: string;
  
  // Person/Group fields (expanded)
  HODApprovarName?: {
    Id: number;
    Title: string;
    EMail: string;
  };
  HODITApprovarName?: {
    Id: number;
    Title: string;
    EMail: string;
  };
  ITStaffApprovarName?: {
    Id: number;
    Title: string;
    EMail: string;
  };
  
  // Attachments
  Attachments?: any[];
  
  // System fields
  Created?: string;
  Modified?: string;
}