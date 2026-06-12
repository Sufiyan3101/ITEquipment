import * as React from "react";
import styles from "./CRTaskViewForm.module.scss";

import { useParams, useNavigate } from "react-router-dom";
import TaskService from "../services/TaskService";
import { ITaskItem } from "../models/ITaskItem";

// import { formatDate } from "../helpers/dateHelper";

const CRTaskViewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = React.useState<ITaskItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [comment, setComment] = React.useState("");
  const [selectedStaff, setSelectedStaff] = React.useState<any>(null);
  const [staffList, setStaffList] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [changeRequestDetail, setChangeRequestDetail] = React.useState<any>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;
        const data = await TaskService.getTaskById(Number(id));
        setTask(data);
        
        // Load change request details
        if (data?.RequestID) {
          const sp = (await import("../services/spConfig")).getSP();
          const cr = await sp.web.lists.getByTitle("Change Request Form")
            .items.getById(data.RequestID)
            .select(
              "First_x0020_Name",
              "Staff_x0020_No",
              "Department",
              "System",
              "User_x0020_Requirement",
              "User_x0020_Requirement_x0020_Pri",
              "User_x0020_Requirements",
              "Employee_x0020_Signature",
              "ApprovalStatus"
            )();
          setChangeRequestDetail(cr);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Search for IT Staff users
  const handleSearchUsers = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      setSearching(true);
      try {
        const users = await TaskService.searchUsers(term);
        setStaffList(users);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setSearching(false);
      }
    } else {
      setStaffList([]);
    }
  };

  const cleanSignatureUrl = (url: string): string => {
    if (!url) return "";
    return url.replace(/^"|"$/g, "").trim();
  };

  // Level 1: Head of Department - Approve
  const handleApprove = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    
    setSubmitting(true);
    try {
      const sp = (await import("../services/spConfig")).getSP();
      const currentUser = await sp.web.currentUser();
      
      await TaskService.approveAsHOD(
        Number(id),
        task?.RequestID || 0,
        comment,
        currentUser
      );
      
      alert("Task approved successfully!");
      navigate("/task-dashboard");
    } catch (error) {
      console.error(error);
      alert("Error approving task");
    } finally {
      setSubmitting(false);
    }
  };

  // Level 1: Head of Department - Reject
  const handleReject = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    
    setSubmitting(true);
    try {
      const sp = (await import("../services/spConfig")).getSP();
      const currentUser = await sp.web.currentUser();
      
      await TaskService.rejectAsHOD(
        Number(id),
        task?.RequestID || 0,
        comment,
        currentUser
      );
      
      alert("Task rejected successfully!");
      navigate("/task-dashboard");
    } catch (error) {
      console.error(error);
      alert("Error rejecting task");
    } finally {
      setSubmitting(false);
    }
  };

  // Level 2: Head of IT Department - Submit
  const handleSubmit = async () => {
    if (!selectedStaff) {
      alert("Please select IT Staff member");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    
    setSubmitting(true);
    try {
      const sp = (await import("../services/spConfig")).getSP();
      const currentUser = await sp.web.currentUser();
      
      await TaskService.submitAsHODIT(
        Number(id),
        task?.RequestID || 0,
        comment,
        selectedStaff,
        currentUser
      );
      
      alert("Task submitted successfully!");
      navigate("/task-dashboard");
    } catch (error) {
      console.error(error);
      alert("Error submitting task");
    } finally {
      setSubmitting(false);
    }
  };

  // Level 3: IT Staff - Close
  const handleClose = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    
    setSubmitting(true);
    try {
      const sp = (await import("../services/spConfig")).getSP();
      const currentUser = await sp.web.currentUser();
      
      await TaskService.closeAsITStaff(
        Number(id),
        task?.RequestID || 0,
        comment,
        currentUser
      );
      
      alert("Request completed successfully!");
      navigate("/task-dashboard");
    } catch (error) {
      console.error(error);
      alert("Error completing request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!task) return <div className={styles.notFound}>Task not found.</div>;

  const roleLevel = task.RoleLevel;

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Change Request Task Approval</h2>

        {/* User Information Section */}
        <div className={styles.section}>
          <h3>User Information</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Title :</label>
              <span>{task.Title || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>Employee Name :</label>
              <span>{changeRequestDetail?.First_x0020_Name || task.EmployeeName || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>Staff No :</label>
              <span>{changeRequestDetail?.Staff_x0020_No || task.StaffNo || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>Department :</label>
              <span>{changeRequestDetail?.Department || task.Department || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>System :</label>
              <span>{changeRequestDetail?.System || task.System || "N/A"}</span>
            </div>
            <div className={styles.field}>
              <label>Status :</label>
              <span className={styles.statusValue}>
                {roleLevel === "HeadOfDepartment" ? "HeadOfDepartment" :
                 roleLevel === "HODIT" ? "HODIT" : "ITStaff"}
              </span>
            </div>
            <div className={styles.field}>
              <label>Priority :</label>
              <span>{changeRequestDetail?.User_x0020_Requirement_x0020_Pri || task.UserRequirementPriority || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Request Details Section */}
        <div className={styles.section}>
          <h3>User Requirement</h3>
          <div className={styles.fieldFull}>
            <span>{changeRequestDetail?.User_x0020_Requirement || task.UserRequirement || "N/A"}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3>User Requirements</h3>
          <div className={styles.fieldFull}>
            <span>{changeRequestDetail?.User_x0020_Requirements || task.Comments || "N/A"}</span>
          </div>
          <div className={styles.fieldFull}>
            <label>Comments :</label>
            <span>{task.Comments || changeRequestDetail?.User_x0020_Requirements || "N/A"}</span>
          </div>
        </div>

        {/* Signature Section */}
        {changeRequestDetail?.Employee_x0020_Signature && (
          <div className={styles.section}>
            <h3>Signature</h3>
            <div className={styles.fieldFull}>
              <img 
                src={cleanSignatureUrl(changeRequestDetail.Employee_x0020_Signature)} 
                alt="Signature"
                className={styles.signature}
              />
            </div>
          </div>
        )}

        {/* Approval Section - Different UI based on role level */}
        <div className={styles.section}>
          <h3>Approver</h3>
          
          {/* Level 1: Head of Department */}
          {roleLevel === "HeadOfDepartment" && (
            <div className={styles.approvalSection}>
              <div className={styles.formGroup}>
                <label>Comment <span className={styles.required}>*</span></label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Enter your comments.."
                />
              </div>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.approveBtn} 
                  onClick={handleApprove}
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Approve"}
                </button>
                <button 
                  className={styles.rejectBtn} 
                  onClick={handleReject}
                  disabled={submitting}
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Level 2: Head of IT Department */}
          {roleLevel === "HODIT" && (
            <div className={styles.approvalSection}>
              <div className={styles.formGroup}>
                <label>Staff Name <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  placeholder="Search for IT Staff by name or email..."
                  className={styles.input}
                  value={searchTerm}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                />
                {searching && <div className={styles.searching}>Searching...</div>}
                {staffList.length > 0 && (
                  <div className={styles.searchResults}>
                    {staffList.map(staff => (
                      <div 
                        key={staff.Id}
                        className={`${styles.searchResultItem} ${selectedStaff?.Id === staff.Id ? styles.selected : ""}`}
                        onClick={() => {
                          setSelectedStaff(staff);
                          setSearchTerm(staff.Title);
                          setStaffList([]);
                        }}
                      >
                        <div className={styles.staffName}>{staff.Title}</div>
                        <div className={styles.staffEmail}>{staff.Email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Comment <span className={styles.required}>*</span></label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Enter your comments.."
                />
              </div>
              <div className={styles.infoBox}>
                <span>Approval 2 approved</span>
              </div>
              <button 
                className={styles.submitBtn} 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          )}

          {/* Level 3: IT Staff */}
          {roleLevel === "ITStaff" && (
            <div className={styles.approvalSection}>
              <div className={styles.formGroup}>
                <label>Comment <span className={styles.required}>*</span></label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Enter your comments.."
                />
              </div>
              <button 
                className={styles.closeBtn} 
                onClick={handleClose}
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Close"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRTaskViewForm;