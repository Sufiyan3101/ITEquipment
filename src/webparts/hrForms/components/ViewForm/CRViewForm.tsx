import * as React from 'react';
import styles from './CRViewForm.module.scss';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import ChangeRequestService from "../services/ChangeRequestService";
import { IChangeRequest } from "../models/IChangeRequest";
import { formatDate } from "../helpers/dateHelper";

const CRViewForm = () => {
  // ========== REFS FOR PDF GENERATION ==========
  // Ref for the entire form content (what will be captured as PDF)
  const formRef = React.useRef<HTMLDivElement>(null);
  // Ref for action buttons (hidden during PDF capture)
  const actionBarRef = React.useRef<HTMLDivElement>(null);

  // ========== STATE VARIABLES ==========
  const { id } = useParams(); // Get ID from URL parameter
  const [data, setData] = React.useState<IChangeRequest | null>(null);
  const [loading, setLoading] = React.useState(true);

  // ========== LOAD DATA WHEN COMPONENT MOUNTS ==========
  React.useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;
        // Fetch change request by ID from SharePoint
        const response = await ChangeRequestService.getRequestById(Number(id));
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

  // ========== HELPER FUNCTION: Clean signature URL ==========
  // Removes quotes from the signature image URL
  const cleanSignatureUrl = (url: string | undefined): string => {
    if (!url) return "";
    return url.replace(/^"|"$/g, "").trim();
  };

  // ========== PDF GENERATION FUNCTION ==========
  // Converts the form to PDF and downloads it
  const handlePrint = async (): Promise<void> => {
    if (!formRef.current) return;

    try {
      // STEP 1: Hide action buttons (so they don't appear in PDF)
      if (actionBarRef.current) actionBarRef.current.style.display = "none";

      // STEP 2: Capture the form as image using html2canvas
      const canvas = await html2canvas(formRef.current, {
        scale: 2,           // Higher quality
        useCORS: true,      // Allow cross-origin images
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // STEP 3: Restore action buttons
      if (actionBarRef.current) actionBarRef.current.style.display = "";

      // STEP 4: Convert canvas to image and create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // STEP 5: Calculate image dimensions for PDF
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // STEP 6: Add image to PDF (handle multi-page if needed)
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // STEP 7: Save PDF with filename
      pdf.save(`ChangeRequest_${data?.Change_x0020_Request_x0020_ID || data?.ID}.pdf`);

    } catch (error) {
      // Restore buttons if error occurs
      if (actionBarRef.current) actionBarRef.current.style.display = "";
      console.error("Error generating PDF:", error);
    }
  };

  // ========== LOADING STATE ==========
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // ========== NO DATA STATE ==========
  if (!data) {
    return <div className={styles.notFound}>Record not found.</div>;
  }

  // ========== MAIN RENDER ==========
  return (
    // Main container with ref for PDF capture
    <div className={styles.container} ref={formRef}>
      
      {/* ===== SECTION 1: USER INFORMATION ===== */}
      <div className={styles.section}>
        <h2>User Information</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Request ID :</label>
            <span>{data.Change_x0020_Request_x0020_ID || "N/A"}</span>
          </div>
          <div className={styles.field}>
            <label>Title :</label>
            <span>{data.Title || "N/A"}</span>
          </div>
          <div className={styles.field}>
            <label>First Name :</label>
            <span>{data.First_x0020_Name || "N/A"}</span>
          </div>
          <div className={styles.field}>
            <label>Staff No :</label>
            <span>{data.Staff_x0020_No || "N/A"}</span>
          </div>
          <div className={styles.field}>
            <label>Department :</label>
            <span>{data.Department || "N/A"}</span>
          </div>
          <div className={styles.field}>
            <label>System :</label>
            <span>{data.System || "N/A"}</span>
          </div>
          <div className={styles.field}>
            <label>Effective Date :</label>
            <span>{formatDate(data.Date)}</span>
          </div>
        </div>
      </div>

      {/* ===== SECTION 2: CHANGE REQUEST DETAILS ===== */}
      <div className={styles.section}>
        <h2>Change Request</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Priority :</label>
            <span className={`${styles.priorityValue} ${
              data.User_x0020_Requirement_x0020_Pri === "High" ? styles.priorityHigh :
              data.User_x0020_Requirement_x0020_Pri === "Medium" ? styles.priorityMedium :
              styles.priorityLow
            }`}>
              {data.User_x0020_Requirement_x0020_Pri || "N/A"}
            </span>
          </div>
          <div className={styles.fieldFull}>
            <label>User Requirement :</label>
            <span>{data.User_x0020_Requirement || "N/A"}</span>
          </div>
          <div className={styles.fieldFull}>
            <label>User Requirements :</label>
            <span>{data.User_x0020_Requirements || "N/A"}</span>
          </div>
          <div className={styles.fieldFull}>
            <label>Signature :</label>
            {data.Employee_x0020_Signature ? (
              <img 
                src={cleanSignatureUrl(data.Employee_x0020_Signature)} 
                alt="Signature"
                className={styles.signature}
              />
            ) : (
              <span>N/A</span>
            )}
          </div>
          <div className={styles.fieldFull}>
            <label>Attachment :</label>
            <div>
              {data.Attachments && data.Attachments.length > 0 ? (
                <ul className={styles.attachmentList}>
                  {data.Attachments.map((file: any) => (
                    <li key={file.FileName}>
                      <a href={file.ServerRelativeUrl} target="_blank" rel="noreferrer">
                        📎 {file.FileName}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span>No attachments</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 3: APPROVALS ===== */}
      <div className={styles.section}>
        <h2>Approved By</h2>
        
        {/* Head of Department Approval */}
        <div className={styles.approvalBlock}>
          <h3>Head of Department</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Name :</label>
              <span>{data.HODApprovarName?.Title || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>Date :</label>
              <span>{formatDate(data.HODDate)}</span>
            </div>
          </div>
          {data.HODComment && (
            <div className={styles.fieldFull}>
              <label>Comment :</label>
              <span>{data.HODComment}</span>
            </div>
          )}
        </div>

        {/* Head of IT Department Approval */}
        <div className={styles.approvalBlock}>
          <h3>Head of IT Department</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Name :</label>
              <span>{data.HODITApprovarName?.Title || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>Date :</label>
              <span>{formatDate(data.HODITDate)}</span>
            </div>
          </div>
          {data.HODITComment && (
            <div className={styles.fieldFull}>
              <label>Comment :</label>
              <span>{data.HODITComment}</span>
            </div>
          )}
        </div>

        {/* IT Staff Approval */}
        <div className={styles.approvalBlock}>
          <h3>IT Staff</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Name :</label>
              <span>{data.ITStaffApprovarName?.Title || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>Date :</label>
              <span>{formatDate(data.ITStaffDate)}</span>
            </div>
          </div>
          {data.ITStaffComment && (
            <div className={styles.fieldFull}>
              <label>Comment :</label>
              <span>{data.ITStaffComment}</span>
            </div>
          )}
        </div>
      </div>

      {/* ===== ACTION BUTTONS (PDF Download) ===== */}
      {/* Ref added to hide these buttons during PDF capture */}
      <div className={styles.actionBar} ref={actionBarRef}>
        <button
          className={styles.printBtn}
          onClick={handlePrint}
        >
          🖨️ Download PDF
        </button>
      </div>

    </div>
  );
};

export default CRViewForm;