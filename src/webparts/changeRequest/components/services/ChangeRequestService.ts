// import { getSP } from "./spConfig";
// import { IChangeRequest } from "../models/IChangeRequest";

// export default class ChangeRequestService {
//   private static listName: string = "Change Request Form";

//   public static async getAllRequests(): Promise<IChangeRequest[]> {
//     try {
//       const items = await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.select(
//           "ID",
//           "Change_x0020_Request_x0020_ID",
//           "Title",
//           "First_x0020_Name",
//           "Staff_x0020_No",
//           "Department",
//           "System",
//           "User_x0020_Requirement",
//           "User_x0020_Requirement_x0020_Pri",
//           "ApprovalStatus",
//           "Date",
//           "Submission_x0020_Date"
//         )
//         .orderBy("ID", false)();
      
//       return items as IChangeRequest[];
//     } catch (error) {
//       console.error("Error fetching change requests:", error);
//       return [];
//     }
//   }

//   public static async getRequestById(id: number): Promise<IChangeRequest | null> {
//     try {
//       const item = await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.getById(id)
//         .select(
//           "ID",
//           "Title",
//           "First_x0020_Name",
//           "Last_x0020_Name",
//           "Staff_x0020_No",
//           "Department",
//           "System",
//           "User_x0020_Requirement",
//           "User_x0020_Requirement_x0020_Pri",
//           "User_x0020_Requirements",
//           "IT_x0020_DEPARTMENT_x0020_ANALYSIS",
//           "IT_x0020_DEPARTMENT_x0020_TESTING_x002f_REPORT",
//           "USER_x0020_ACCEPTANCE",
//           "Date",
//           "Submission_x0020_Date",
//           "Change_x0020_Request_x0020_ID",
//           "ApprovalStatus",
//           "Employee_x0020_Signature",
//           "HODComment",
//           "HODITComment",
//           "ITStaffComment",
//           "HODDate",
//           "HODITDate",
//           "ITStaffDate",
//           "HODApprovarName/Id",
//           "HODApprovarName/Title",
//           "HODApprovarName/EMail",
//           "HODITApprovarName/Id",
//           "HODITApprovarName/Title",
//           "HODITApprovarName/EMail",
//           "ITStaffApprovarName/Id",
//           "ITStaffApprovarName/Title",
//           "ITStaffApprovarName/EMail",
//           "StaffMembers/Id",
//           "StaffMembers/Title",
//           "StaffMembers/EMail",
//           "SubmitterName/Id",
//           "SubmitterName/Title",
//           "SubmitterName/EMail"
//         )
//         .expand(
//           "HODApprovarName", 
//           "HODITApprovarName", 
//           "ITStaffApprovarName", 
//           "StaffMembers",
//           "SubmitterName"
//         )();

//       const attachments = await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.getById(id)
//         .attachmentFiles();

//       return { ...item, Attachments: attachments } as IChangeRequest;
//     } catch (error) {
//       console.error("Error fetching request by ID:", error);
//       return null;
//     }
//   }

//   public static async createRequest(data: Partial<IChangeRequest>): Promise<number> {
//     try {
//       const item = await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.add({
//           Title: data.Title || "Mr",
//           First_x0020_Name: data.First_x0020_Name,
//           Staff_x0020_No: data.Staff_x0020_No,
//           Department: data.Department,
//           System: data.System,
//           User_x0020_Requirement: data.User_x0020_Requirement,
//           User_x0020_Requirement_x0020_Pri: data.User_x0020_Requirement_x0020_Pri,
//           User_x0020_Requirements: data.User_x0020_Requirements,
//           Date: data.Date,
//           Submission_x0020_Date: new Date().toISOString(),
//           Employee_x0020_Signature: data.Employee_x0020_Signature,
//           ApprovalStatus: "Pending with HOD"
//         });
      
//       const newId = item.data.Id;
      
//       const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
//       const changeRequestId = `${dateStr}-CRQ-${newId.toString().padStart(3, "0")}`;
      
//       await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.getById(newId)
//         .update({
//           Change_x0020_Request_x0020_ID: changeRequestId
//         });
      
//       return newId;
//     } catch (error) {
//       console.error("Error creating request:", error);
//       throw error;
//     }
//   }

//   public static async updateRequest(id: number, data: Partial<IChangeRequest>): Promise<void> {
//     try {
//       await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.getById(id)
//         .update(data);
//     } catch (error) {
//       console.error("Error updating request:", error);
//       throw error;
//     }
//   }

//   public static async addAttachment(itemId: number, file: File): Promise<void> {
//     try {
//       await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.getById(itemId)
//         .attachmentFiles.add(file.name, file);
//     } catch (error) {
//       console.error("Error adding attachment:", error);
//       throw error;
//     }
//   }

//   public static async deleteAttachment(itemId: number, fileName: string): Promise<void> {
//     try {
//       await getSP()
//         .web.lists.getByTitle(this.listName)
//         .items.getById(itemId)
//         .attachmentFiles.getByName(fileName)
//         .delete();
//     } catch (error) {
//       console.error("Error deleting attachment:", error);
//       throw error;
//     }
//   }
// }



import { getSP, isSPInitialized } from "./spConfig";
import { IChangeRequest } from "../models/IChangeRequest";

// Import required PnP modules
import "@pnp/sp/site-users/web";

export default class ChangeRequestService {
  // ✅ CORRECT LIST NAME
  private static listName: string = "Change Request Form";

  /**
   * Get all change requests for dashboard
   */
  public static async getAllRequests(): Promise<IChangeRequest[]> {
    try {
      console.log("=== getAllRequests START ===");
      console.log("List Name:", this.listName);
      
      if (!isSPInitialized()) {
        console.error("SP is not initialized!");
        return [];
      }
      
      const sp = getSP();
      
      const items = await sp.web.lists.getByTitle(this.listName)
        .items
        .select(
          "ID",
          "Change_x0020_Request_x0020_ID",
          "Title",
          "First_x0020_Name",
          "Staff_x0020_No",
          "Department",
          "System",
          "User_x0020_Requirement",
          "User_x0020_Requirement_x0020_Pri",
          "ApprovalStatus",
          "Date",
          "Submission_x0020_Date"
        )
        .orderBy("ID", false)();
      
      console.log("Items fetched:", items.length);
      return items as IChangeRequest[];
    } catch (error) {
      console.error("Error fetching change requests:", error);
      return [];
    }
  }

  /**
   * Get single change request by ID with all fields
   */
  public static async getRequestById(id: number): Promise<IChangeRequest | null> {
    try {
      console.log("=== getRequestById START === ID:", id);
      
      const sp = getSP();
      
      // ONLY fields that exist in your list
      const item = await sp.web.lists.getByTitle(this.listName)
        .items.getById(id)
        .select(
          "ID",
          "Title",
          "First_x0020_Name",
          "Last_x0020_Name",
          "Staff_x0020_No",
          "Department",
          "System",
          "User_x0020_Requirement",
          "User_x0020_Requirement_x0020_Pri",
          "User_x0020_Requirements",
          "Date",
          "Submission_x0020_Date",
          "Change_x0020_Request_x0020_ID",
          "ApprovalStatus",
          "Employee_x0020_Signature",
          "HODComment",
          "HODITComment",
          "ITStaffComment",
          "HODDate",
          "HODITDate",
          "ITStaffDate",
          "HODApprovarName/Id",
          "HODApprovarName/Title",
          "HODApprovarName/EMail",
          "HODITApprovarName/Id",
          "HODITApprovarName/Title",
          "HODITApprovarName/EMail",
          "ITStaffApprovarName/Id",
          "ITStaffApprovarName/Title",
          "ITStaffApprovarName/EMail"
          // REMOVED: StaffMembers, SubmitterName (don't exist in your list)
        )
        .expand(
          "HODApprovarName", 
          "HODITApprovarName", 
          "ITStaffApprovarName"
          // REMOVED: StaffMembers, SubmitterName
        )();

      console.log("Item fetched:", item ? "Yes" : "No");
      console.log("Item data:", item);
      
      // Fetch attachments separately
      const attachments = await sp.web.lists.getByTitle(this.listName)
        .items.getById(id)
        .attachmentFiles();

      console.log("Attachments count:", attachments.length);

      return { ...item, Attachments: attachments } as IChangeRequest;
    } catch (error) {
      console.error("Error fetching request by ID:", error);
      return null;
    }
  }

  /**
   * Get current user info
   */
  public static async getCurrentUser(): Promise<{ Id: number; Title: string; Email: string }> {
    try {
      const sp = getSP();
      const user = await sp.web.currentUser();
      console.log("Current user:", user.Title, user.Email);
      return {
        Id: user.Id,
        Title: user.Title,
        Email: user.Email
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { Id: 0, Title: "", Email: "" };
    }
  }

  /**
   * Create new change request
   */
  public static async createRequest(data: Partial<IChangeRequest>): Promise<number> {
    try {
      console.log("=== createRequest START ===");
      
      const sp = getSP();
    //   const currentUser = await this.getCurrentUser();
      
      const itemData: any = {
        Title: data.Title || "Mr",
        First_x0020_Name: data.First_x0020_Name || "",
        Staff_x0020_No: data.Staff_x0020_No || "",
        Department: data.Department || "",
        System: data.System || "",
        User_x0020_Requirement: data.User_x0020_Requirement || "",
        User_x0020_Requirement_x0020_Pri: data.User_x0020_Requirement_x0020_Pri || "Low",
        User_x0020_Requirements: data.User_x0020_Requirements || "",
        Date: data.Date || new Date().toISOString(),
        Submission_x0020_Date: new Date().toISOString(),
        Employee_x0020_Signature: data.Employee_x0020_Signature || "",
        ApprovalStatus: "Pending with HOD"
        // REMOVED: SubmitterNameId (field doesn't exist)
      };
      
      const item = await sp.web.lists.getByTitle(this.listName)
        .items.add(itemData);
      
      const newId = item.data.Id;
      
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const changeRequestId = `${dateStr}-CRQ-${newId.toString().padStart(3, "0")}`;
      
      await sp.web.lists.getByTitle(this.listName)
        .items.getById(newId)
        .update({
          Change_x0020_Request_x0020_ID: changeRequestId
        });
      
      return newId;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  }

  /**
   * Update existing change request
   */
  public static async updateRequest(id: number, data: Partial<IChangeRequest>): Promise<void> {
    try {
      const sp = getSP();
      
      const updateData: any = {};
      Object.keys(data).forEach(key => {
        const value = data[key as keyof IChangeRequest];
        if (value !== undefined && value !== null) {
          updateData[key] = value;
        }
      });
      
      await sp.web.lists.getByTitle(this.listName)
        .items.getById(id)
        .update(updateData);
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  }

  /**
   * Add attachment to change request
   */
  public static async addAttachment(itemId: number, file: File): Promise<string> {
    try {
      const sp = getSP();
      
      const result = await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles.add(file.name, file);
      
      return result.data.name || file.name;
    } catch (error) {
      console.error("Error adding attachment:", error);
      throw error;
    }
  }

  /**
   * Delete attachment from change request
   */
  public static async deleteAttachment(itemId: number, fileName: string): Promise<void> {
    try {
      const sp = getSP();
      
      await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles.getByName(fileName)
        .delete();
    } catch (error) {
      console.error("Error deleting attachment:", error);
      throw error;
    }
  }

  /**
   * Get all attachments for a change request
   */
  public static async getAttachments(itemId: number): Promise<any[]> {
    try {
      const sp = getSP();
      
      const attachments = await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles();
      
      return attachments;
    } catch (error) {
      console.error("Error fetching attachments:", error);
      return [];
    }
  }
}