import * as React from "react";
import styles from "./InputForm.module.scss";
import { useNavigate } from "react-router-dom";
import ChangeRequestService from "../services/ChangeRequestService";

const InputForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    Title: "Mr",
    First_x0020_Name: "",
    Staff_x0020_No: "",
    Department: "",
    System: "",
    User_x0020_Requirement: "",
    User_x0020_Requirement_x0020_Pri: "Low",
    User_x0020_Requirements: "",
    Date: "",
    Employee_x0020_Signature: ""
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.First_x0020_Name || !formData.Staff_x0020_No || !formData.Department || 
        !formData.System || !formData.User_x0020_Requirement || !formData.Date) {
      alert("Please fill all mandatory fields");
      return;
    }

    setLoading(true);
    
    try {
      const newId = await ChangeRequestService.createRequest(formData);
      
      if (selectedFile) {
        await ChangeRequestService.addAttachment(newId, selectedFile);
      }
      
      alert("Change Request submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>Create Change Request</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Title <span className={styles.required}>*</span></label>
              <select 
                value={formData.Title}
                onChange={(e) => handleChange("Title", e.target.value)}
                className={styles.input}
              >
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>First Name <span className={styles.required}>*</span></label>
              <input 
                type="text"
                value={formData.First_x0020_Name}
                onChange={(e) => handleChange("First_x0020_Name", e.target.value)}
                className={styles.input}
                placeholder="Enter first name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Staff No <span className={styles.required}>*</span></label>
              <input 
                type="text"
                value={formData.Staff_x0020_No}
                onChange={(e) => handleChange("Staff_x0020_No", e.target.value)}
                className={styles.input}
                placeholder="Enter staff number"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Department <span className={styles.required}>*</span></label>
              <input 
                type="text"
                value={formData.Department}
                onChange={(e) => handleChange("Department", e.target.value)}
                className={styles.input}
                placeholder="Enter department"
              />
            </div>

            <div className={styles.formGroup}>
              <label>System <span className={styles.required}>*</span></label>
              <select 
                value={formData.System}
                onChange={(e) => handleChange("System", e.target.value)}
                className={styles.input}
              >
                <option value="">Select System</option>
                <option value="T24">T24</option>
                <option value="Swift">Swift</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Priority <span className={styles.required}>*</span></label>
              <select 
                value={formData.User_x0020_Requirement_x0020_Pri}
                onChange={(e) => handleChange("User_x0020_Requirement_x0020_Pri", e.target.value)}
                className={styles.input}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Effective Date <span className={styles.required}>*</span></label>
              <input 
                type="date"
                value={formData.Date}
                onChange={(e) => handleChange("Date", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>User Requirement <span className={styles.required}>*</span></label>
              <textarea 
                value={formData.User_x0020_Requirement}
                onChange={(e) => handleChange("User_x0020_Requirement", e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Enter user requirement"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>User Requirements</label>
              <textarea 
                value={formData.User_x0020_Requirements}
                onChange={(e) => handleChange("User_x0020_Requirements", e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Enter detailed user requirements"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Attachment</label>
              <input 
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className={styles.fileInput}
              />
            </div>
          </div>

          <div className={styles.actionBar}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;