import * as React from "react";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "./InputForm.module.scss";
import ITEquipmentService from "../services/ITEquipmentService";
import { useNavigate } from "react-router-dom";
import { IFormData, IFormErrors } from '../models/IFormData'
import { getSP } from "../services/spConfig";

const Dashboard = () => {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const navigate = useNavigate();
  const [user, setCurrentUser] = React.useState("")


  React.useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const sp = getSP();
        const user = await sp.web.currentUser();

        setFormData(prev => ({
          ...prev,
          FirstName: user.Title
        }));

        setCurrentUser(user.Title)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  const [formData, setFormData] = useState<IFormData>({
    Title: "Mr.",
    FirstName: user,
    StaffNo: "",
    Department: "",
    Date: new Date().toLocaleDateString("en-GB"),
    RequestType: "",
    Reason: "",
    EmployeeSignature: "",
    Attachment: null,
  });

  const [errors, setErrors] = useState<IFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // ── Handlers ──────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, Attachment: file }));
    setErrors((prev) => ({ ...prev, Attachment: "" }));
  };

  const clearSignature = (): void => {
    sigCanvasRef.current?.clear();
    setFormData((prev) => ({ ...prev, EmployeeSignature: "" }));
  };

  // ── Validation ────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: IFormErrors = {};

    if (!formData.StaffNo.trim())
      newErrors.Department = "StaffNo is required.";
    if (!formData.Department.trim())
      newErrors.Department = "Department is required.";
    if (!formData.RequestType)
      newErrors.RequestType = "Request Type is required.";
    if (!formData.Reason.trim())
      newErrors.Reason = "Reason is required.";
    if (sigCanvasRef.current?.isEmpty())
      newErrors.EmployeeSignature = "Signature is required.";
    if (!formData.Attachment)
      newErrors.Attachment = "Attachment is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      Title: "Mr.",
      FirstName: user,
      StaffNo: "",
      Department: "",
      Date: new Date().toLocaleDateString("en-GB"),
      RequestType: "",
      Reason: "",
      EmployeeSignature: "",
      Attachment: null,
    });

    // Clear signature canvas
    sigCanvasRef.current?.clear();
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      // Convert signature canvas to base64
      console.log("sigCanvasRef", sigCanvasRef.current);
      const signatureBase64 = sigCanvasRef.current?.toDataURL("image/png") || "";
      await ITEquipmentService.createITEquipment({
        ...formData,
        EmployeeSignature: signatureBase64,
      });

      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className={styles.container}>

      {/* User Information Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>User Information</h2>

        <div className={styles.grid}>

          <div className={styles.field}>
            <label>Title :</label>
            <select
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Employee Name :</label>
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName}
              className={`${styles.input} ${styles.readOnly}`}
              readOnly
            />
          </div>

          <div className={styles.field}>
            <label>* Staff No :</label>
            <input
              type="text"
              name="StaffNo"
              value={formData.StaffNo}
              onChange={handleChange}
              className={`${styles.input}`}
            />
          </div>

          <div className={styles.field}>
            <label>* Department :</label>
            <input
              type="text"
              name="Department"
              placeholder="Enter Department..."
              value={formData.Department}
              onChange={handleChange}
              className={`${styles.input} ${errors.Department ? styles.errorInput : ""}`}
            />
            {errors.Department && (
              <span className={styles.errorText}>{errors.Department}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Date :</label>
            <input
              type="text"
              name="Date"
              value={formData.Date}
              className={`${styles.input} ${styles.readOnly}`}
              readOnly
            />
          </div>

        </div>
      </div>

      {/* User Request Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>User Request</h2>

        <div className={styles.requestGrid}>

          {/* Left Column */}
          <div className={styles.leftCol}>

            <div className={styles.field}>
              <label>* Request Type :</label>
              <select
                name="RequestType"
                value={formData.RequestType}
                onChange={handleChange}
                className={`${styles.input} ${errors.RequestType ? styles.errorInput : ""}`}
              >
                <option value="">Select...</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Other">Other</option>
              </select>
              {errors.RequestType && (
                <span className={styles.errorText}>{errors.RequestType}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>* Signature :</label>
              <div className={`${styles.signatureWrapper} ${errors.EmployeeSignature ? styles.errorBorder : ""}`}>
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="black"
                  canvasProps={{
                    className: styles.signatureCanvas,
                  }}
                  onEnd={() =>
                    setErrors((prev) => ({ ...prev, EmployeeSignature: "" }))
                  }
                />
                <div className={styles.signatureActions}>
                  <button type="button" onClick={clearSignature} className={styles.clearBtn}>
                    ✕ Clear
                  </button>
                </div>
              </div>
              {errors.EmployeeSignature && (
                <span className={styles.errorText}>{errors.EmployeeSignature}</span>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className={styles.rightCol}>

            <div className={styles.field}>
              <label>* Reason :</label>
              <textarea
                name="Reason"
                placeholder="Enter reason for that request type..."
                value={formData.Reason}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.Reason ? styles.errorInput : ""}`}
                rows={4}
              />
              {errors.Reason && (
                <span className={styles.errorText}>{errors.Reason}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>* Attach :</label>
              <div className={`${styles.attachBox} ${errors.Attachment ? styles.errorBorder : ""}`}>
                {formData.Attachment ? (
                  <span className={styles.fileName}>
                    📎 {formData.Attachment.name}
                  </span>
                ) : (
                  <span className={styles.noAttach}>There is nothing attached.</span>
                )}
                <label className={styles.attachLabel}>
                  📎 Attach file
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                </label>
              </div>
              {errors.Attachment && (
                <span className={styles.errorText}>{errors.Attachment}</span>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Submit */}
      <div className={styles.actionBar}>
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

    </div>
  );
};

export default Dashboard;