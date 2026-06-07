import { getSP } from "./spConfig";
import { IITEquipment } from "../models/IITEquipments";

export default class ITEquipmentService {
  public static async getITEquipmentData(): Promise<IITEquipment[]> {
    try {
      const items = await getSP()
        .web.lists.getByTitle("ITEquipmentRequest")
        .items.select(
          "ID",
          "ITEquipmentRequestID",
          "FirstName",
          "StaffNo",
          "Department",
          "Date",
          "RequestType",
          "ApprovalStatus",
        )
        .orderBy("ID", false)();

      return items as IITEquipment[];
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public static async getITEquipmentById(
    id: number,
  ): Promise<IITEquipment | null> {
    try {
      const item = await getSP()
        .web.lists.getByTitle("ITEquipmentRequest")
        .items.getById(id)
        .select(
          "ID",
          "ITEquipmentRequestID",
          "Title",
          "FirstName",
          "StaffNo",
          "Department",
          "Date",
          "RequestType",
          "ApprovalStatus",
          "EmployeeSignature",
          "Attachments",
          "Reason",
          "HODApprovarName/Id",
          "HODApprovarName/Title",
          "HODApprovarName/EMail",
          "HODDate",
          "HODComment",
          "HODITApprovarName/Id",
          "HODITApprovarName/Title",
          "HODITApprovarName/EMail",
          "HODITDate",
          "HODITComment",
          "StaffMembers/Id",
          "StaffMembers/Title",
          "StaffMembers/EMail",
          "ITStaffApprovarName/Id",
          "ITStaffApprovarName/Title",
          "ITStaffApprovarName/EMail",
          "ITStaffDate",
          "ITStaffComment"
        ).expand("HODApprovarName", "HODITApprovarName", "StaffMembers", "ITStaffApprovarName")();

        const attachments = await getSP().web.lists
      .getByTitle("ITEquipmentRequest")
      .items.getById(id)
      .attachmentFiles();

    console.log("Attachments fetched:", attachments);
    console.log("Attachments count:", attachments?.length);

    return { ...item, Attachments: attachments } as IITEquipment;

    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
