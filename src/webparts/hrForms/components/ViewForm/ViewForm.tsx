import * as  React from 'react'
import styles from './ViewForm.module.scss';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useParams } from "react-router-dom";

import ITEquipmentService from "../services/ITEquipmentService";
import { IITEquipment } from "../models/IITEquipments";

const ViewForm = () => {
    // Add ref at top of your component
    const formRef = React.useRef<HTMLDivElement>(null);
    const actionBarRef = React.useRef<HTMLDivElement>(null);

    const { id } = useParams();
    const [data, setData] = React.useState<IITEquipment | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) return;

                const response =
                    await ITEquipmentService.getITEquipmentById(
                        Number(id)
                    );
                console.log("Response:", response);

                setData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Record not found.</div>;
    }



    // Add print function
    const handlePrint = async (): Promise<void> => {
  if (!formRef.current) return;

  try {
    // ✅ Hide via ref
    if (actionBarRef.current) actionBarRef.current.style.display = "none";

    const canvas = await html2canvas(formRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // ✅ Restore via ref
    if (actionBarRef.current) actionBarRef.current.style.display = "";

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`ITEquipmentRequest_${data?.ITEquipmentRequestID || data?.ID}.pdf`);

  } catch (error) {
    if (actionBarRef.current) actionBarRef.current.style.display = "";
    console.error("Error generating PDF:", error);
  }
};

    return (
        <div className={styles.container} ref={formRef}>
            <div className={styles.firstSection}>
                <h2>Employee Information</h2>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Title : </label>
                        <span>{data?.Title || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Employee Name : </label>
                        <span>{data?.FirstName || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Staff No : </label>
                        <span>{data?.StaffNo || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Department : </label>
                        <span>{data?.Department || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data?.Date || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Status : </label>
                        <span>{data?.ApprovalStatus || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Request Type : </label>
                        <span>{data?.RequestType || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Reason : </label>
                        <span>{data?.Reason || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Attachments : </label>
                        <div>
                            {data?.Attachments && data.Attachments.length > 0 ? (
                                <ul className={styles.attachmentList}>
                                    {data.Attachments.map((file) => (
                                        <li key={file.FileName}>
                                            <a
                                                href={file.ServerRelativeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                📎 {file.FileName}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Signature : </label>
                        <img
                            className={styles.sigImage}
                            src={data?.EmployeeSignature?.replace(/^"|"$/g, "").trim()}
                            alt="Signature"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Approved By Head of Department</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Name : </label>
                        <span>{data.HODApprovarName?.Title || "N/A"}</span>
                    </div>
                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data.HODDate || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Approved By Head of IT Department</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Name : </label>
                        <span>{data.HODITApprovarName?.Title || "N/A"}</span>
                    </div>
                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data.HODITDate || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Approved By IT Staff Member</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Name : </label>
                        <span>{data.ITStaffApprovarName?.Title || "N/A"}</span>
                    </div>
                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data.ITStaffDate || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className={styles.actionBar} ref={actionBarRef}>
                <button
                    className={styles.printBtn}
                    onClick={handlePrint}
                >
                    🖨️ Download PDF
                </button>
            </div>
        </div>
    )
}

export default ViewForm