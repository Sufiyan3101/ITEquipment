

// import { getSP, isSPInitialized } from "./spConfig";
// import { IChangeRequest } from "../models/IChangeRequest";

// export default class ChangeRequestService {
//   private static listName: string = "Change Request Form";

//   /**
//    * Get all change requests for dashboard
//    */
//   public static async getAllRequests(): Promise<IChangeRequest[]> {
//     try {
//       console.log("=== getAllRequests START ===");
//       console.log("List Name:", this.listName);
      
//       if (!isSPInitialized()) {
//         console.error("SP is not initialized!");
//         return [];
//       }
      
//       const sp = getSP();
      
//       const items = await sp.web.lists.getByTitle(this.listName)
//         .items
//         .select(
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
      
//       console.log("Items fetched:", items.length);
//       return items as IChangeRequest[];
//     } catch (error) {
//       console.error("Error fetching change requests:", error);
//       return [];
//     }
//   }

//   /**
//    * Get single change request by ID
//    */
//   public static async getRequestById(id: number): Promise<IChangeRequest | null> {
//     try {
//       console.log("=== getRequestById START === ID:", id);
      
//       const sp = getSP();
      
//       const item = await sp.web.lists.getByTitle(this.listName)
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
//           "ITStaffApprovarName/EMail"
//         )
//         .expand(
//           "HODApprovarName",
//           "HODITApprovarName",
//           "ITStaffApprovarName"
//         )();
      
//       console.log("Item fetched:", item ? "Yes" : "No");
      
//       const attachments = await sp.web.lists.getByTitle(this.listName)
//         .items.getById(id)
//         .attachmentFiles();
      
//       console.log("Attachments count:", attachments.length);
      
//       return { ...item, Attachments: attachments } as IChangeRequest;
//     } catch (error) {
//       console.error("Error fetching request by ID:", error);
//       return null;
//     }
//   }

//   /**
//    * CREATE NEW CHANGE REQUEST
//    * Step 1: Create item with basic data
//    * Step 2: Generate Change Request ID using internal field name: Change_x0020_Request_x0020_ID
//    * Step 3: Update the item with the generated ID
//    */
//   public static async createRequest(data: Partial<IChangeRequest>): Promise<number> {
//     let newId = 0;
    
//     try {
//       console.log("╔══════════════════════════════════════════════════════════════╗");
//       console.log("║              CREATE REQUEST - START                          ║");
//       console.log("╚══════════════════════════════════════════════════════════════╝");
//       console.log("Data received:", JSON.stringify(data, null, 2));
      
//       const sp = getSP();
      
//       // ========== STEP 1: Create the item ==========
//       console.log("\n📌 STEP 1: Creating item in SharePoint list...");
//       console.log("List Name:", this.listName);
      
//       const itemData: any = {
//         Title: data.Title || "Mr",
//         First_x0020_Name: data.First_x0020_Name || "",
//         Staff_x0020_No: data.Staff_x0020_No || "",
//         Department: data.Department || "",
//         System: data.System || "",
//         User_x0020_Requirement: data.User_x0020_Requirement || "",
//         User_x0020_Requirement_x0020_Pri: data.User_x0020_Requirement_x0020_Pri || "Low",
//         User_x0020_Requirements: data.User_x0020_Requirements || "",
//         Date: data.Date || new Date().toISOString(),
//         Submission_x0020_Date: new Date().toISOString(),
//         Employee_x0020_Signature: data.Employee_x0020_Signature || "",
//         ApprovalStatus: "Pending with HOD"
//       };
      
//       console.log("Item data being sent:", JSON.stringify(itemData, null, 2));
      
//       const item = await sp.web.lists.getByTitle(this.listName).items.add(itemData);
//       newId = item.data.Id;
//       console.log("✅ STEP 1 COMPLETE: Item created with ID:", newId);
      
//       // ========== STEP 2: Generate Change Request ID ==========
//       console.log("\n📌 STEP 2: Generating Change Request ID...");
      
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = String(today.getMonth() + 1).padStart(2, "0");
//       const day = String(today.getDate()).padStart(2, "0");
//       const dateStr = `${year}${month}${day}`;
//       const changeRequestId = `${dateStr}-CRQ-${String(newId).padStart(3, "0")}`;
      
//       console.log("Generated Change Request ID:", changeRequestId);
//       console.log("Internal field name: Change_x0020_Request_x0020_ID");
      
//       // ========== STEP 3: Update item with Change Request ID ==========
//       console.log("\n📌 STEP 3: Updating item with Change Request ID...");
      
//       await sp.web.lists.getByTitle(this.listName)
//         .items.getById(newId)
//         .update({
//           Change_x0020_Request_x0020_ID: changeRequestId
//         });
      
//       console.log("✅ STEP 3 COMPLETE: Change Request ID updated successfully!");
      
//       console.log("\n╔══════════════════════════════════════════════════════════════╗");
//       console.log("║              CREATE REQUEST - SUCCESS                        ║");
//       console.log(`║              New Item ID: ${newId}                              ║`);
//       console.log(`║              Change Request ID: ${changeRequestId}            ║`);
//       console.log("╚══════════════════════════════════════════════════════════════╝");
      
//       return newId;
      
//     } catch (error) {
//       console.error("\n❌ ERROR in createRequest:");
//       console.error("Error details:", error);
//       console.error("New ID created before error:", newId);
//       throw error;
//     }
//   }

//   /**
//    * ADD ATTACHMENT TO CHANGE REQUEST - FIXED (removed ServerRelativeUrl)
//    */
//   public static async addAttachment(itemId: number, file: File): Promise<string> {
//     try {
//       console.log("\n╔══════════════════════════════════════════════════════════════╗");
//       console.log("║              ADD ATTACHMENT - START                          ║");
//       console.log("╚══════════════════════════════════════════════════════════════╝");
//       console.log("Item ID:", itemId);
//       console.log("File Name:", file.name);
//       console.log("File Size:", file.size, "bytes");
//       console.log("File Type:", file.type);
      
//       const sp = getSP();
      
//       const result = await sp.web.lists.getByTitle(this.listName)
//         .items.getById(itemId)
//         .attachmentFiles.add(file.name, file);
      
//       console.log("✅ Attachment added successfully!");
//       console.log("Attachment name:", result.data.name);
      
//       console.log("\n╔══════════════════════════════════════════════════════════════╗");
//       console.log("║              ADD ATTACHMENT - SUCCESS                         ║");
//       console.log("╚══════════════════════════════════════════════════════════════╝");
      
//       return result.data.name || file.name;
//     } catch (error) {
//       console.error("\n❌ ERROR in addAttachment:");
//       console.error("Error details:", error);
//       return "";
//     }
//   }

//   /**
//    * DELETE ATTACHMENT
//    */
//   public static async deleteAttachment(itemId: number, fileName: string): Promise<void> {
//     try {
//       console.log("=== deleteAttachment START === Item ID:", itemId, "File:", fileName);
      
//       const sp = getSP();
      
//       await sp.web.lists.getByTitle(this.listName)
//         .items.getById(itemId)
//         .attachmentFiles.getByName(fileName)
//         .delete();
      
//       console.log("Attachment deleted:", fileName);
//     } catch (error) {
//       console.error("Error deleting attachment:", error);
//       throw error;
//     }
//   }

//   /**
//    * GET ALL ATTACHMENTS
//    */
//   public static async getAttachments(itemId: number): Promise<any[]> {
//     try {
//       console.log("=== getAttachments START === Item ID:", itemId);
      
//       const sp = getSP();
      
//       const attachments = await sp.web.lists.getByTitle(this.listName)
//         .items.getById(itemId)
//         .attachmentFiles();
      
//       console.log("Attachments found:", attachments.length);
//       return attachments;
//     } catch (error) {
//       console.error("Error fetching attachments:", error);
//       return [];
//     }
//   }

//   /**
//    * UPDATE EXISTING REQUEST
//    */
//   public static async updateRequest(id: number, data: Partial<IChangeRequest>): Promise<void> {
//     try {
//       console.log("=== updateRequest START === ID:", id);
      
//       const sp = getSP();
      
//       const updateData: any = {};
//       Object.keys(data).forEach(key => {
//         const value = data[key as keyof IChangeRequest];
//         if (value !== undefined && value !== null) {
//           updateData[key] = value;
//         }
//       });
      
//       await sp.web.lists.getByTitle(this.listName)
//         .items.getById(id)
//         .update(updateData);
      
//       console.log("Update successful for ID:", id);
//     } catch (error) {
//       console.error("Error updating request:", error);
//       throw error;
//     }
//   }
// }



import { getSP, isSPInitialized } from "./spConfig";
import { IChangeRequest } from "../models/IChangeRequest";

export default class ChangeRequestService {
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
   * Get single change request by ID
   */
  public static async getRequestById(id: number): Promise<IChangeRequest | null> {
    try {
      console.log("=== getRequestById START === ID:", id);
      
      const sp = getSP();
      
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
        )
        .expand(
          "HODApprovarName",
          "HODITApprovarName",
          "ITStaffApprovarName"
        )();
      
      console.log("Item fetched:", item ? "Yes" : "No");
      
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
   * CREATE NEW CHANGE REQUEST - FIXED
   * Step 1: Create item with basic data
   * Step 2: Generate Change Request ID
   * Step 3: Update the item with the generated ID
   */
  public static async createRequest(data: Partial<IChangeRequest>): Promise<number> {
    let newId = 0;
    
    try {
      console.log("╔══════════════════════════════════════════════════════════════╗");
      console.log("║              CREATE REQUEST - START                          ║");
      console.log("╚══════════════════════════════════════════════════════════════╝");
      console.log("Data received:", JSON.stringify(data, null, 2));
      
      const sp = getSP();
      
      // ========== STEP 1: Create the item ==========
      console.log("\n📌 STEP 1: Creating item in SharePoint list...");
      console.log("List Name:", this.listName);
      
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
      };
      
      console.log("Item data being sent:", JSON.stringify(itemData, null, 2));
      
      // ✅ FIXED: Correct way to get ID from PnPjs response
      const addResult = await sp.web.lists.getByTitle(this.listName).items.add(itemData);
      
      // The ID can be accessed from the result object
      newId = addResult.id || addResult.data?.Id || addResult.data?.id || 0;
      
      if (!newId || newId === 0) {
        throw new Error("Failed to get ID from create response. Response: " + JSON.stringify(addResult));
      }
      
      console.log("✅ STEP 1 COMPLETE: Item created with ID:", newId);
      console.log("Full response:", JSON.stringify(addResult, null, 2));
      
      // ========== STEP 2: Generate Change Request ID ==========
      console.log("\n📌 STEP 2: Generating Change Request ID...");
      
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;
      const changeRequestId = `${dateStr}-CRQ-${String(newId).padStart(3, "0")}`;
      
      console.log("Generated Change Request ID:", changeRequestId);
      console.log("Internal field name: Change_x0020_Request_x0020_ID");
      
      // ========== STEP 3: Update item with Change Request ID ==========
      console.log("\n📌 STEP 3: Updating item with Change Request ID...");
      
      await sp.web.lists.getByTitle(this.listName)
        .items.getById(newId)
        .update({
          Change_x0020_Request_x0020_ID: changeRequestId
        });
      
      console.log("✅ STEP 3 COMPLETE: Change Request ID updated successfully!");
      
      console.log("\n╔══════════════════════════════════════════════════════════════╗");
      console.log("║              CREATE REQUEST - SUCCESS                        ║");
      console.log(`║              New Item ID: ${newId}                              ║`);
      console.log(`║              Change Request ID: ${changeRequestId}            ║`);
      console.log("╚══════════════════════════════════════════════════════════════╝");
      
      return newId;
      
    } catch (error) {
      console.error("\n❌ ERROR in createRequest:");
      console.error("Error details:", error);
      console.error("New ID created before error:", newId);
      throw error;
    }
  }

  /**
   * ADD ATTACHMENT TO CHANGE REQUEST
   */
  public static async addAttachment(itemId: number, file: File): Promise<string> {
    try {
      console.log("\n╔══════════════════════════════════════════════════════════════╗");
      console.log("║              ADD ATTACHMENT - START                          ║");
      console.log("╚══════════════════════════════════════════════════════════════╝");
      console.log("Item ID:", itemId);
      console.log("File Name:", file.name);
      console.log("File Size:", file.size, "bytes");
      console.log("File Type:", file.type);
      
      const sp = getSP();
      
      const result = await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles.add(file.name, file);
      
      console.log("✅ Attachment added successfully!");
      console.log("Attachment name:", result.data?.name || file.name);
      
      console.log("\n╔══════════════════════════════════════════════════════════════╗");
      console.log("║              ADD ATTACHMENT - SUCCESS                         ║");
      console.log("╚══════════════════════════════════════════════════════════════╝");
      
      return result.data?.name || file.name;
    } catch (error) {
      console.error("\n❌ ERROR in addAttachment:");
      console.error("Error details:", error);
      return "";
    }
  }

  /**
   * DELETE ATTACHMENT
   */
  public static async deleteAttachment(itemId: number, fileName: string): Promise<void> {
    try {
      console.log("=== deleteAttachment START === Item ID:", itemId, "File:", fileName);
      
      const sp = getSP();
      
      await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles.getByName(fileName)
        .delete();
      
      console.log("Attachment deleted:", fileName);
    } catch (error) {
      console.error("Error deleting attachment:", error);
      throw error;
    }
  }

  /**
   * GET ALL ATTACHMENTS
   */
  public static async getAttachments(itemId: number): Promise<any[]> {
    try {
      console.log("=== getAttachments START === Item ID:", itemId);
      
      const sp = getSP();
      
      const attachments = await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles();
      
      console.log("Attachments found:", attachments.length);
      return attachments;
    } catch (error) {
      console.error("Error fetching attachments:", error);
      return [];
    }
  }

  /**
   * UPDATE EXISTING REQUEST
   */
  public static async updateRequest(id: number, data: Partial<IChangeRequest>): Promise<void> {
    try {
      console.log("=== updateRequest START === ID:", id);
      
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
      
      console.log("Update successful for ID:", id);
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  }
}