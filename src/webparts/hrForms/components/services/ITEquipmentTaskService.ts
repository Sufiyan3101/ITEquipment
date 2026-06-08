import { getSP } from "./spConfig";
import { IITEquipmentTask } from "../models/IITEquipments";

export default class ITEquipmentService {
  public static async getITEquipmentTaskData(): Promise<IITEquipmentTask[]> {
    try {
      const items = await getSP()
        .web.lists.getByTitle("TasksList")
        .items.select(
          "RequestID",
          "ITEquipmentRequestID",
          "EmployeeName",
          "StaffNo",
          "Department",
          "Date",
          "RequestType",
          "Reason",
          "ApprovalStatus",
          "RoleLevel",
          "Title"
        )
        .orderBy("ID", false)();

      return items as IITEquipmentTask[];
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public static async getITEquipmentTaskById(
    id: number,
  ): Promise<IITEquipmentTask | null> {
    try {
      const item = await getSP()
        .web.lists.getByTitle("TasksList")
        .items.getById(id)
        .select(
          "RequestID",
          "ITEquipmentRequestID",
          "EmployeeName",
          "StaffNo",
          "Department",
          "Date",
          "RequestType",
          "Reason",
          "ApprovalStatus",
          "RoleLevel",
          "Title"
        )();

      return item  as IITEquipmentTask;
    } catch (error) {
      console.error(error);

      return null;
    }
  }

 
}
