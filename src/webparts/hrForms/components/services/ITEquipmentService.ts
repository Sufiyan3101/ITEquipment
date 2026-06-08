import { getSP } from "./spConfig";
import { IITEquipment } from "../models/IITEquipments";
import { IFormData } from "../models/IFormData";

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
          "ITStaffComment",
        )
        .expand(
          "HODApprovarName",
          "HODITApprovarName",
          "StaffMembers",
          "ITStaffApprovarName",
        )();

      const attachments = await getSP()
        .web.lists.getByTitle("ITEquipmentRequest")
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

  public static async createITEquipment(formData: IFormData): Promise<void> {
    const sp = getSP();

    const item = await sp.web.lists.getByTitle("ITEquipmentRequest").items.add({
      Title: formData.Title,
      FirstName: formData.FirstName,
      StaffNo: formData.StaffNo,
      Department: formData.Department,
      Date: formData.Date,
      RequestType: formData.RequestType,
      Reason: formData.Reason,
      EmployeeSignature: JSON.stringify(formData.EmployeeSignature),
    });

    const itemId = item.ID;

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

    const RequestID = `${year}${month}${day}-ITE-${leftPad(itemId, 3)}`;

    await sp.web.lists
      .getByTitle("ITEquipmentRequest")
      .items.getById(itemId)
      .update({
        ITEquipmentRequestID: RequestID,
      });

    if (formData.Attachment) {

      console.log("File Name:", formData.Attachment.name);
  console.log("File Size:", formData.Attachment.size);

      const buffer = await formData.Attachment.arrayBuffer();

      await sp.web.lists
        .getByTitle("ITEquipmentRequest")
        .items.getById(itemId)
        .attachmentFiles.add(formData.Attachment.name, buffer);
    }
  }
}
