// import { getSP, isSPInitialized } from "./spConfig";
// import { ITaskItem } from "../models/ITaskItem";

// // Import required PnP modules
// import "@pnp/sp/site-users/web";

// export default class TaskService {
//   // Task list name (spelling from your list - ChageRequest_TasksList)
//   private static listName: string = "ChageRequest_TasksList";

//   /**
//    * Get all tasks for current user based on role
//    * Shows tasks where AssignedTo = current user and ApprovalStatus != "Completed"
//    */
//   public static async getMyTasks(): Promise<ITaskItem[]> {
//     try {
//       console.log("=== getMyTasks START ===");

//       if (!isSPInitialized()) {
//         console.error("SP is not initialized!");
//         return [];
//       }

//       const sp = getSP();
//       const currentUser = await sp.web.currentUser();

//       // Get tasks assigned to current user where not completed
//       const items = await sp.web.lists.getByTitle(this.listName)
//         .items
//         .filter(`AssignedToId eq ${currentUser.Id} and ApprovalStatus ne 'Completed'`)
//         .select(
//           "ID",
//           "Title",
//           "EmployeeName",
//           "Department",
//           "StaffNo",
//           "Date",
//           "RequestID",
//           "RoleLevel",
//           "ApprovalStatus",
//           "ChangeRequestID",
//           "UserRequirement",
//           "UserRequirementPriority",
//           "System",
//           "Comments",
//           "ApproverComment"
//         )
//         .orderBy("ID", false)();

//       console.log("Tasks fetched:", items.length);
//       return items as ITaskItem[];
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       return [];
//     }
//   }

//   /**
//    * Get single task by ID for approval view
//    */
//   public static async getTaskById(id: number): Promise<ITaskItem | null> {
//     try {
//       console.log("=== getTaskById START === ID:", id);

//       const sp = getSP();

//       const item = await sp.web.lists.getByTitle(this.listName)
//         .items.getById(id)
//         .select(
//           "ID",
//           "Title",
//           "EmployeeName",
//           "Department",
//           "StaffNo",
//           "Date",
//           "RequestID",
//           "RoleLevel",
//           "ApprovalStatus",
//           "ChangeRequestID",
//           "UserRequirement",
//           "UserRequirementPriority",
//           "System",
//           "Comments",
//           "ApproverComment",
//           "AssignedTo/Id",
//           "AssignedTo/Title",
//           "AssignedTo/EMail"
//         )
//         .expand("AssignedTo")();

//       // Get the original Change Request details
//       const changeRequest = await sp.web.lists.getByTitle("Change Request Form")
//         .items.getById(item.RequestID)
//         .select(
//           "ID",
//           "First_x0020_Name",
//           "Staff_x0020_No",
//           "Department",
//           "System",
//           "User_x0020_Requirement",
//           "User_x0020_Requirement_x0020_Pri",
//           "User_x0020_Requirements",
//           "Employee_x0020_Signature",
//           "ApprovalStatus",
//           "HODComment",
//           "HODITComment",
//           "ITStaffComment"
//         )();

//       return { ...item, ChangeRequestDetail: changeRequest } as unknown as ITaskItem;
//     } catch (error) {
//       console.error("Error fetching task:", error);
//       return null;
//     }
//   }

//   /**
//    * Search for users by name or email (People Picker)
//    * Uses siteUsers collection - simpler and works without Search API
//    */
//   public static async searchUsers(searchTerm: string): Promise<any[]> {
//     try {
//       console.log("=== searchUsers START === Term:", searchTerm);

//       if (!searchTerm || searchTerm.length < 2) {
//         return [];
//       }

//       const sp = getSP();
//       const term = searchTerm.toLowerCase();

//       // Get all site users and filter client-side
//       const allUsers = await sp.web.siteUsers
//         .select("Id", "Title", "Email")
//         .filter("PrincipalType eq 1")(); // Only users, not groups

//       // Filter users by name or email containing search term
//       const filteredUsers = allUsers.filter(user =>
//         user.Title?.toLowerCase().includes(term) ||
//         user.Email?.toLowerCase().includes(term)
//       );

//       // Return top 20 results
//       return filteredUsers.slice(0, 20).map(user => ({
//         Id: user.Id,
//         Title: user.Title,
//         Email: user.Email
//       }));
//     } catch (error) {
//       console.error("Error searching users:", error);
//       return [];
//     }
//   }

//   /**
//    * Get all site users (for People Picker fallback)
//    */
//   public static async getAllSiteUsers(): Promise<any[]> {
//     try {
//       console.log("=== getAllSiteUsers START ===");

//       const sp = getSP();
//       const users = await sp.web.siteUsers
//         .select("Id", "Title", "Email")
//         .filter("PrincipalType eq 1")();

//       return users.map(user => ({
//         Id: user.Id,
//         Title: user.Title,
//         Email: user.Email
//       }));
//     } catch (error) {
//       console.error("Error fetching site users:", error);
//       return [];
//     }
//   }

//   /**
//    * Approve as Head of Department (Level 1)
//    */
//   public static async approveAsHOD(
//     taskId: number,
//     changeRequestId: number,
//     comment: string,
//     currentUser: any
//   ): Promise<void> {
//     try {
//       console.log("=== approveAsHOD START ===");
//       const sp = getSP();

//       // 1. Update Change Request Form
//       await sp.web.lists.getByTitle("Change Request Form")
//         .items.getById(changeRequestId)
//         .update({
//           HODComment: comment,
//           HODDate: new Date().toISOString(),
//           ApprovalStatus: "Pending with HODIT",
//           HODApprovarNameId: currentUser.Id
//         });

//       // 2. Update Task as Completed
//       await sp.web.lists.getByTitle(this.listName)
//         .items.getById(taskId)
//         .update({
//           ApprovalStatus: "Completed",
//           ApproverComment: comment
//         });

//       console.log("HOD approval completed");
//     } catch (error) {
//       console.error("Error in HOD approval:", error);
//       throw error;
//     }
//   }

//   /**
//    * Reject as Head of Department (Level 1)
//    */
//   public static async rejectAsHOD(
//     taskId: number,
//     changeRequestId: number,
//     comment: string,
//     currentUser: any
//   ): Promise<void> {
//     try {
//       console.log("=== rejectAsHOD START ===");
//       const sp = getSP();

//       // 1. Update Change Request Form
//       await sp.web.lists.getByTitle("Change Request Form")
//         .items.getById(changeRequestId)
//         .update({
//           HODComment: comment,
//           HODDate: new Date().toISOString(),
//           ApprovalStatus: "Rejected by HOD",
//           HODApprovarNameId: currentUser.Id
//         });

//       // 2. Update Task as Completed
//       await sp.web.lists.getByTitle(this.listName)
//         .items.getById(taskId)
//         .update({
//           ApprovalStatus: "Completed",
//           ApproverComment: comment
//         });

//       console.log("HOD rejection completed");
//     } catch (error) {
//       console.error("Error in HOD rejection:", error);
//       throw error;
//     }
//   }

//   /**
//    * Submit as Head of IT Department (Level 2)
//    */
//   public static async submitAsHODIT(
//     taskId: number,
//     changeRequestId: number,
//     comment: string,
//     selectedITStaff: any,
//     currentUser: any
//   ): Promise<void> {
//     try {
//       console.log("=== submitAsHODIT START ===");
//       const sp = getSP();

//       // 1. Update Change Request Form
//       await sp.web.lists.getByTitle("Change Request Form")
//         .items.getById(changeRequestId)
//         .update({
//           HODITComment: comment,
//           HODITDate: new Date().toISOString(),
//           ApprovalStatus: "Pending with ITStaff",
//           HODITApprovarNameId: currentUser.Id,
//           StaffMembersId: selectedITStaff.Id
//         });

//       // 2. Update current Task as Completed
//       await sp.web.lists.getByTitle(this.listName)
//         .items.getById(taskId)
//         .update({
//           ApprovalStatus: "Completed",
//           ApproverComment: comment
//         });

//       // 3. Create new task for IT Staff
//       const changeRequest = await sp.web.lists.getByTitle("Change Request Form")
//         .items.getById(changeRequestId)
//         .select(
//           "Title",
//           "First_x0020_Name",
//           "Staff_x0020_No",
//           "Department",
//           "System",
//           "User_x0020_Requirement",
//           "User_x0020_Requirement_x0020_Pri",
//           "User_x0020_Requirements"
//         )();

//       await sp.web.lists.getByTitle(this.listName)
//         .items.add({
//           Title: changeRequest.Title || "Mr",
//           EmployeeName: changeRequest.First_x0020_Name || "",
//           StaffNo: changeRequest.Staff_x0020_No || "",
//           Department: changeRequest.Department || "",
//           RequestID: changeRequestId,
//           RoleLevel: "ITStaff",
//           ApprovalStatus: "Pending",
//           AssignedToId: selectedITStaff.Id,
//           ChangeRequestID: `CR-${changeRequestId}`,
//           FormName: "ChangeRequest",
//           UserRequirement: changeRequest.User_x0020_Requirement || "",
//           UserRequirementPriority: changeRequest.User_x0020_Requirement_x0020_Pri || "Low",
//           System: changeRequest.System || "",
//           Comments: changeRequest.User_x0020_Requirements || ""
//         });

//       console.log("HODIT submission completed, task assigned to IT Staff");
//     } catch (error) {
//       console.error("Error in HODIT submission:", error);
//       throw error;
//     }
//   }

//   /**
//    * Close as IT Staff (Level 3)
//    */
//   public static async closeAsITStaff(
//     taskId: number,
//     changeRequestId: number,
//     comment: string,
//     currentUser: any
//   ): Promise<void> {
//     try {
//       console.log("=== closeAsITStaff START ===");
//       const sp = getSP();

//       // 1. Update Change Request Form
//       await sp.web.lists.getByTitle("Change Request Form")
//         .items.getById(changeRequestId)
//         .update({
//           ITStaffComment: comment,
//           ITStaffDate: new Date().toISOString(),
//           ApprovalStatus: "Request Completed",
//           ITStaffApprovarNameId: currentUser.Id
//         });

//       // 2. Update Task as Completed
//       await sp.web.lists.getByTitle(this.listName)
//         .items.getById(taskId)
//         .update({
//           ApprovalStatus: "Completed",
//           ApproverComment: comment
//         });

//       console.log("IT Staff closure completed");
//     } catch (error) {
//       console.error("Error in IT Staff closure:", error);
//       throw error;
//     }
//   }
// }
import { getSP, isSPInitialized } from "./spConfig";
import { ITaskItem } from "../models/ITaskItem";

export default class TaskService {
  private static listName: string = "ChageRequest_TasksList";

  public static async getMyTasks(): Promise<ITaskItem[]> {
    try {
      console.log("=== getMyTasks START ===");

      if (!isSPInitialized()) {
        console.error("SP is not initialized!");
        return [];
      }

      const sp = getSP();
      const currentUser = await sp.web.currentUser();

      const items = await sp.web.lists
        .getByTitle(this.listName)
        .items.filter(
          `AssignedToId eq ${currentUser.Id} and ApprovalStatus ne 'Completed'`,
        )
        .select(
          "ID",
          "Title",
          "EmployeeName",
          "Department",
          "StaffNo",
          "Date",
          "RequestID",
          "RoleLevel",
          "ApprovalStatus",
          "ChangeRequestID",
          "UserRequirement",
          "UserRequirementPriority",
          "System",
          "Comments",
          "ApproverComment",
        )
        .orderBy("ID", false)();

      return items as ITaskItem[];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  public static async getTaskById(id: number): Promise<ITaskItem | null> {
    try {
      const sp = getSP();
      const item = await sp.web.lists
        .getByTitle(this.listName)
        .items.getById(id)
        .select(
          "ID",
          "Title",
          "EmployeeName",
          "Department",
          "StaffNo",
          "Date",
          "RequestID",
          "RoleLevel",
          "ApprovalStatus",
          "ChangeRequestID",
          "UserRequirement",
          "UserRequirementPriority",
          "System",
          "Comments",
          "ApproverComment",
          "AssignedTo/Id",
          "AssignedTo/Title",
          "AssignedTo/EMail",
        )
        .expand("AssignedTo")();

      const changeRequest = await sp.web.lists
        .getByTitle("Change Request Form")
        .items.getById(item.RequestID)
        .select(
          "ID",
          "First_x0020_Name",
          "Staff_x0020_No",
          "Department",
          "System",
          "User_x0020_Requirement",
          "User_x0020_Requirement_x0020_Pri",
          "User_x0020_Requirements",
          "Employee_x0020_Signature",
          "ApprovalStatus",
          "HODComment",
          "HODITComment",
          "ITStaffComment",
        )();

      return {
        ...item,
        ChangeRequestDetail: changeRequest,
      } as unknown as ITaskItem;
    } catch (error) {
      console.error("Error fetching task:", error);
      return null;
    }
  }

  public static async searchUsers(searchTerm: string): Promise<any[]> {
    try {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      const sp = getSP();
      const term = searchTerm.toLowerCase();
      const allUsers = await sp.web.siteUsers
        .select("Id", "Title", "Email")
        .filter("PrincipalType eq 1")();

      return allUsers
        .filter(
          (user) =>
            user.Title?.toLowerCase().includes(term) ||
            user.Email?.toLowerCase().includes(term),
        )
        .slice(0, 20);
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  // ========== FIXED: Added null checks for currentUser ==========

  public static async approveAsHOD(
    taskId: number,
    changeRequestId: number,
    comment: string,
    currentUser: any,
  ): Promise<void> {
    try {
      const sp = getSP();
      const userId = currentUser?.Id || 0; // ✅ Fixed with null check

      await sp.web.lists
        .getByTitle("Change Request Form")
        .items.getById(changeRequestId)
        .update({
          HODComment: comment,
          HODDate: new Date().toISOString(),
          ApprovalStatus: "Pending with HODIT",
          HODApprovarNameId: userId,
        });

      await sp.web.lists
        .getByTitle(this.listName)
        .items.getById(taskId)
        .update({
          ApprovalStatus: "Completed",
          ApproverComment: comment,
        });
    } catch (error) {
      console.error("Error in HOD approval:", error);
      throw error;
    }
  }

  public static async rejectAsHOD(
    taskId: number,
    changeRequestId: number,
    comment: string,
    currentUser: any,
  ): Promise<void> {
    try {
      const sp = getSP();
      const userId = currentUser?.Id || 0; // ✅ Fixed with null check

      await sp.web.lists
        .getByTitle("Change Request Form")
        .items.getById(changeRequestId)
        .update({
          HODComment: comment,
          HODDate: new Date().toISOString(),
          ApprovalStatus: "Rejected by HOD",
          HODApprovarNameId: userId,
        });

      await sp.web.lists
        .getByTitle(this.listName)
        .items.getById(taskId)
        .update({
          ApprovalStatus: "Completed",
          ApproverComment: comment,
        });
    } catch (error) {
      console.error("Error in HOD rejection:", error);
      throw error;
    }
  }

  public static async submitAsHODIT(
    taskId: number,
    changeRequestId: number,
    comment: string,
    selectedITStaff: any,
    currentUser: any,
  ): Promise<void> {
    try {
      const sp = getSP();
      const userId = currentUser?.Id || 0; // ✅ Fixed with null check
      const staffId = selectedITStaff?.Id || 0;

      await sp.web.lists
        .getByTitle("Change Request Form")
        .items.getById(changeRequestId)
        .update({
          HODITComment: comment,
          HODITDate: new Date().toISOString(),
          ApprovalStatus: "Pending with ITStaff",
          HODITApprovarNameId: userId,
          StaffMembersId: staffId,
        });

      await sp.web.lists
        .getByTitle(this.listName)
        .items.getById(taskId)
        .update({
          ApprovalStatus: "Completed",
          ApproverComment: comment,
        });

      const changeRequest = await sp.web.lists
        .getByTitle("Change Request Form")
        .items.getById(changeRequestId)
        .select(
          "Title",
          "First_x0020_Name",
          "Staff_x0020_No",
          "Department",
          "System",
          "User_x0020_Requirement",
          "User_x0020_Requirement_x0020_Pri",
          "User_x0020_Requirements",
        )();

      await sp.web.lists.getByTitle(this.listName).items.add({
        Title: changeRequest.Title || "Mr",
        EmployeeName: changeRequest.First_x0020_Name || "",
        StaffNo: changeRequest.Staff_x0020_No || "",
        Department: changeRequest.Department || "",
        RequestID: changeRequestId,
        RoleLevel: "ITStaff",
        ApprovalStatus: "Pending",
        AssignedToId: staffId,
        ChangeRequestID: `CR-${changeRequestId}`,
        FormName: "ChangeRequest",
        UserRequirement: changeRequest.User_x0020_Requirement || "",
        UserRequirementPriority:
          changeRequest.User_x0020_Requirement_x0020_Pri || "Low",
        System: changeRequest.System || "",
        Comments: changeRequest.User_x0020_Requirements || "",
      });
    } catch (error) {
      console.error("Error in HODIT submission:", error);
      throw error;
    }
  }

  public static async closeAsITStaff(
    taskId: number,
    changeRequestId: number,
    comment: string,
    currentUser: any,
  ): Promise<void> {
    try {
      const sp = getSP();
      const userId = currentUser?.Id || 0; // ✅ Fixed with null check

      await sp.web.lists
        .getByTitle("Change Request Form")
        .items.getById(changeRequestId)
        .update({
          ITStaffComment: comment,
          ITStaffDate: new Date().toISOString(),
          ApprovalStatus: "Request Completed",
          ITStaffApprovarNameId: userId,
        });

      await sp.web.lists
        .getByTitle(this.listName)
        .items.getById(taskId)
        .update({
          ApprovalStatus: "Completed",
          ApproverComment: comment,
        });
    } catch (error) {
      console.error("Error in IT Staff closure:", error);
      throw error;
    }
  }
}
