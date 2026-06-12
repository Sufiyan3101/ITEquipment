

import { getSP,  } from "./spConfig";
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
      
    //   if (!isSPInitialized()) {
    //     console.error("SP is not initialized!");
    //     return [];
    //   }
      
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
   * CREATE NEW CHANGE REQUEST - Based on working IT Equipment pattern
   */
  public static async createRequest(formData: any): Promise<number> {
    try {
      console.log("=== createRequest START ===");
      console.log("Form data received:", {
        ...formData,
        Employee_x0020_Signature: formData.Employee_x0020_Signature ? "Signature present" : "No signature",
        Attachment: formData.Attachment ? formData.Attachment.name : "No attachment"
      });
      
      const sp = getSP();
      
      // STEP 1: Create the item (like working ITEquipment pattern)
      const item = await sp.web.lists.getByTitle(this.listName).items.add({
        Title: formData.Title || "Mr",
        First_x0020_Name: formData.First_x0020_Name || "",
        Staff_x0020_No: formData.Staff_x0020_No || "",
        Department: formData.Department || "",
        System: formData.System || "",
        User_x0020_Requirement: formData.User_x0020_Requirement || "",
        User_x0020_Requirement_x0020_Pri: formData.User_x0020_Requirement_x0020_Pri || "Low",
        User_x0020_Requirements: formData.User_x0020_Requirements || "",
        Date: formData.Date || new Date().toISOString(),
        Submission_x0020_Date: new Date().toISOString(),
        Employee_x0020_Signature: formData.Employee_x0020_Signature || "",
        ApprovalStatus: "Pending with HOD"
      });
      
      // Get the item ID (using item.ID like working pattern)
      const itemId = item.ID;
      console.log("✅ Item created with ID:", itemId);
      
      // STEP 2: Generate Change Request ID (like working ITEquipment pattern)
      const today = new Date();
      
      const leftPad = (value: number, length: number): string => {
        let str = value.toString();
        while (str.length < length) {
          str = "0" + str;
        }
        return str;
      };
      
      const year = today.getFullYear();
      const month = leftPad(today.getMonth() + 1, 2);
      const day = leftPad(today.getDate(), 2);
      
      const changeRequestId = `${year}${month}${day}-CRQ-${leftPad(itemId, 3)}`;
      console.log("Generated Change Request ID:", changeRequestId);
      
      // STEP 3: Update the item with Change Request ID
      await sp.web.lists
        .getByTitle(this.listName)
        .items.getById(itemId)
        .update({
          Change_x0020_Request_x0020_ID: changeRequestId
        });
      
      console.log("✅ Change Request ID updated successfully");
      
      // STEP 4: Add attachment if provided (like working ITEquipment pattern)
      if (formData.Attachment) {
        console.log("📎 Adding attachment:", formData.Attachment.name);
        console.log("File size:", formData.Attachment.size, "bytes");
        
        const buffer = await formData.Attachment.arrayBuffer();
        
        await sp.web.lists
          .getByTitle(this.listName)
          .items.getById(itemId)
          .attachmentFiles.add(formData.Attachment.name, buffer);
        
        console.log("✅ Attachment added successfully");
      }
      
      console.log(`🎉 Create request completed! ID: ${itemId}, Change ID: ${changeRequestId}`);
      return itemId;
      
    } catch (error) {
      console.error("❌ Error creating request:", error);
      throw error;
    }
  }

  /**
   * ADD ATTACHMENT (alternative method)
   */
  public static async addAttachment(itemId: number, file: File): Promise<string> {
    try {
      console.log("=== addAttachment START ===", { itemId, fileName: file.name });
      
      const sp = getSP();
      const buffer = await file.arrayBuffer();
      
      const result = await sp.web.lists
        .getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles.add(file.name, buffer);
      
      console.log("✅ Attachment added successfully");
      return result.data?.name || file.name;
    } catch (error) {
      console.error("❌ Error adding attachment:", error);
      return "";
    }
  }

  /**
   * DELETE ATTACHMENT
   */
  public static async deleteAttachment(itemId: number, fileName: string): Promise<void> {
    try {
      const sp = getSP();
      await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles.getByName(fileName)
        .delete();
      console.log("Attachment deleted:", fileName);
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  }

  /**
   * GET ALL ATTACHMENTS
   */
  public static async getAttachments(itemId: number): Promise<any[]> {
    try {
      const sp = getSP();
      return await sp.web.lists.getByTitle(this.listName)
        .items.getById(itemId)
        .attachmentFiles();
    } catch (error) {
      console.error("Error fetching attachments:", error);
      return [];
    }
  }
}