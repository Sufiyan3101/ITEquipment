
// import * as React from "react";
// import styles from "./CRInputForm.module.scss";
// import { useNavigate } from "react-router-dom";
// import ChangeRequestService from "../services/ChangeRequestService";

// const CRInputForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = React.useState(false);
//   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
//   // Signature pad refs
//   const canvasRef = React.useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = React.useState(false);
//   const [hasSignature, setHasSignature] = React.useState(false);
  
//   // System checkbox dropdown states
//   const [selectedSystems, setSelectedSystems] = React.useState<string[]>([]);
//   const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
//   const dropdownRef = React.useRef<HTMLDivElement>(null);
  
//   const [formData, setFormData] = React.useState({
//     Title: "Mr.",
//     First_x0020_Name: "",
//     Staff_x0020_No: "",
//     Department: "",
//     User_x0020_Requirement: "",
//     User_x0020_Requirement_x0020_Pri: "Low",
//     User_x0020_Requirements: "",
//     Date: new Date().toISOString().split('T')[0],
//     Employee_x0020_Signature: ""
//   });

//   const systemOptions = [
//     { id: "T24", label: "T24" },
//     { id: "Swift", label: "Swift" },
//     { id: "Others", label: "Others" }
//   ];

//   const userRequirementOptions = [
//     "NEW DEVELOPMENT",
//     "MODIFYING THE EXISTING DEVELOPMENT",
//     "PROFILE CLOSURE",
//     "SYSTEM UPGRADE",
//     "BUG FIX"
//   ];

//   React.useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleChange = (field: string, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSystemCheckboxChange = (systemId: string, checked: boolean) => {
//     if (checked) {
//       setSelectedSystems(prev => [...prev, systemId]);
//     } else {
//       setSelectedSystems(prev => prev.filter(s => s !== systemId));
//     }
//   };

//   const removeSystem = (systemId: string) => {
//     setSelectedSystems(prev => prev.filter(s => s !== systemId));
//   };

//   // ========== SIGNATURE PAD FUNCTIONS ==========
  
//   const initCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     canvas.width = 500;
//     canvas.height = 200;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
    
//     ctx.strokeStyle = '#000000';
//     ctx.lineWidth = 2;
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };

//   React.useEffect(() => {
//     initCanvas();
//   }, []);

//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !canvas) return;
    
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
    
//     let clientX, clientY;
//     if ('touches' in e) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }
    
//     const x = (clientX - rect.left) * scaleX;
//     const y = (clientY - rect.top) * scaleY;
    
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//   };

//   const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!ctx || !canvas) return;
    
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;
    
//     let clientX, clientY;
//     if ('touches' in e) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }
    
//     const x = (clientX - rect.left) * scaleX;
//     const y = (clientY - rect.top) * scaleY;
    
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const signatureData = canvas.toDataURL("image/png");
//       setHasSignature(true);
//       handleChange("Employee_x0020_Signature", signatureData);
//       console.log("Signature saved");
//     }
//   };

//   const clearSignature = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
    
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     setHasSignature(false);
//     handleChange("Employee_x0020_Signature", "");
//   };

//   const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//       console.log("File selected:", e.target.files[0].name);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     console.log("\n========== FORM SUBMISSION START ==========");
    
//     // Validation
//     if (!formData.First_x0020_Name.trim()) {
//       alert("Please enter Employee Name");
//       return;
//     }
//     if (!formData.Staff_x0020_No.trim()) {
//       alert("Please enter Staff No");
//       return;
//     }
//     if (!formData.Department.trim()) {
//       alert("Please enter Department");
//       return;
//     }
//     if (selectedSystems.length === 0) {
//       alert("Please select at least one System");
//       return;
//     }
//     if (!formData.User_x0020_Requirement) {
//       alert("Please select User Requirement");
//       return;
//     }
//     if (!formData.Employee_x0020_Signature) {
//       alert("Please draw your signature");
//       return;
//     }

//     setLoading(true);
    
//     try {
//       const systemsString = selectedSystems.join(", ");
      
//       // IMPORTANT: Include the attachment file in submitData
//       const submitData = {
//         Title: formData.Title,
//         First_x0020_Name: formData.First_x0020_Name,
//         Staff_x0020_No: formData.Staff_x0020_No,
//         Department: formData.Department,
//         System: systemsString,
//         User_x0020_Requirement: formData.User_x0020_Requirement,
//         User_x0020_Requirement_x0020_Pri: formData.User_x0020_Requirement_x0020_Pri,
//         User_x0020_Requirements: formData.User_x0020_Requirements,
//         Date: formData.Date,
//         Employee_x0020_Signature: formData.Employee_x0020_Signature,
//         Attachment: selectedFile  // ✅ This is critical - includes the file
//       };
      
//       console.log("Submitting data:", {
//         ...submitData,
//         Employee_x0020_Signature: submitData.Employee_x0020_Signature ? "Present" : "Missing",
//         Attachment: submitData.Attachment ? submitData.Attachment.name : "None"
//       });
      
//       // Create the change request (attachment handled inside service)
//       const newId = await ChangeRequestService.createRequest(submitData);
//       console.log("✅ Request created with ID:", newId);
      
//       alert(`Change Request submitted successfully!\nID: ${newId}`);
//       navigate("/");
//     } catch (error) {
//       console.error("❌ Error submitting form:", error);
//       alert("Error submitting form. Please try again.\nCheck console for details.");
//     } finally {
//       setLoading(false);
//       console.log("========== FORM SUBMISSION END ==========\n");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.formCard}>
//         <h2 className={styles.formTitle}>Change Request</h2>
        
//         <form onSubmit={handleSubmit}>
//           {/* User Information Section */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>User Information</h3>
            
//             <div className={styles.formRow}>
//               <div className={styles.formGroup}>
//                 <label>Title</label>
//                 <select 
//                   value={formData.Title}
//                   onChange={(e) => handleChange("Title", e.target.value)}
//                   className={styles.select}
//                 >
//                   <option value="Mr.">Mr.</option>
//                   <option value="Ms.">Ms.</option>
//                   <option value="Mrs.">Mrs.</option>
//                   <option value="Dr.">Dr.</option>
//                 </select>
//               </div>
              
//               <div className={styles.formGroup}>
//                 <label>Employee Name <span className={styles.required}>*</span></label>
//                 <input 
//                   type="text"
//                   value={formData.First_x0020_Name}
//                   onChange={(e) => handleChange("First_x0020_Name", e.target.value)}
//                   className={styles.input}
//                   placeholder="Enter employee name"
//                 />
//               </div>
//             </div>

//             <div className={styles.formRow}>
//               <div className={styles.formGroup}>
//                 <label>Staff No <span className={styles.required}>*</span></label>
//                 <input 
//                   type="text"
//                   value={formData.Staff_x0020_No}
//                   onChange={(e) => handleChange("Staff_x0020_No", e.target.value)}
//                   className={styles.input}
//                   placeholder="Enter staff number"
//                 />
//               </div>
              
//               <div className={styles.formGroup}>
//                 <label>Department <span className={styles.required}>*</span></label>
//                 <input 
//                   type="text"
//                   value={formData.Department}
//                   onChange={(e) => handleChange("Department", e.target.value)}
//                   className={styles.input}
//                   placeholder="Enter department"
//                 />
//               </div>
//             </div>

//             <div className={styles.formRow}>
//               <div className={styles.formGroup}>
//                 <label>System <span className={styles.required}>*</span></label>
//                 <div className={styles.dropdownContainer} ref={dropdownRef}>
//                   <div className={styles.dropdownHeader} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
//                     <div className={styles.selectedItems}>
//                       {selectedSystems.length === 0 ? (
//                         <span className={styles.placeholder}>Select systems...</span>
//                       ) : (
//                         selectedSystems.map(system => (
//                           <span key={system} className={styles.selectedTag}>
//                             {system}
//                             <button type="button" className={styles.removeTag} onClick={(e) => { e.stopPropagation(); removeSystem(system); }}>×</button>
//                           </span>
//                         ))
//                       )}
//                     </div>
//                     <span className={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</span>
//                   </div>
//                   {isDropdownOpen && (
//                     <div className={styles.dropdownList}>
//                       {systemOptions.map(option => (
//                         <label key={option.id} className={styles.dropdownItem}>
//                           <input type="checkbox" checked={selectedSystems.includes(option.id)} onChange={(e) => handleSystemCheckboxChange(option.id, e.target.checked)} className={styles.checkbox} />
//                           {option.label}
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className={styles.formGroup}>
//                 <label>Effective Date</label>
//                 <input type="date" value={formData.Date} onChange={(e) => handleChange("Date", e.target.value)} className={styles.input} />
//               </div>
//             </div>
//           </div>

//           {/* Change Request Section */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Change Request</h3>
//             <div className={styles.formRow}>
//               <div className={`${styles.formGroup} ${styles.fullWidth}`}>
//                 <label>User Requirement <span className={styles.required}>*</span></label>
//                 <select value={formData.User_x0020_Requirement} onChange={(e) => handleChange("User_x0020_Requirement", e.target.value)} className={styles.select}>
//                   <option value="">Select user requirement...</option>
//                   {userRequirementOptions.map(option => (<option key={option} value={option}>{option}</option>))}
//                 </select>
//               </div>
//             </div>
//             <div className={styles.formRow}>
//               <div className={styles.formGroup}>
//                 <label>Priority</label>
//                 <select value={formData.User_x0020_Requirement_x0020_Pri} onChange={(e) => handleChange("User_x0020_Requirement_x0020_Pri", e.target.value)} className={styles.select}>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* User Requirements Section */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>User Requirements</h3>
//             <div className={styles.formGroup}>
//               <label>Comments <span className={styles.required}>*</span></label>
//               <textarea value={formData.User_x0020_Requirements} onChange={(e) => handleChange("User_x0020_Requirements", e.target.value)} className={styles.textarea} rows={3} placeholder="Enter your comments here" />
//             </div>
//           </div>

//           {/* Signature Section */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Signature <span className={styles.required}>*</span></h3>
//             <div className={styles.signatureArea}>
//               <div className={styles.signaturePadContainer}>
//                 <canvas ref={canvasRef} className={styles.signatureCanvas} width={500} height={200} style={{ width: '100%', maxWidth: '500px', height: '200px', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}
//                   onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
//                   onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
//               </div>
//               <div className={styles.signatureInstructions}>Draw your signature above using mouse or touch</div>
//               <div className={styles.signatureButtons}>
//                 <button type="button" className={styles.clearSignatureBtn} onClick={clearSignature}>Clear Signature</button>
//                 {hasSignature && <span className={styles.signatureSaved}>✓ Signature saved</span>}
//               </div>
//             </div>
//           </div>

//           {/* Attachment Section */}
//           <div className={styles.section}>
//             <h3 className={styles.sectionTitle}>Attachment</h3>
//             <div className={styles.attachmentArea}>
//               {selectedFile ? (
//                 <div className={styles.fileInfo}>
//                   <span className={styles.fileName}>📎 {selectedFile.name}</span>
//                   <button type="button" className={styles.removeFileBtn} onClick={() => { setSelectedFile(null); const fileInput = document.getElementById('fileInput') as HTMLInputElement; if (fileInput) fileInput.value = ''; }}>Remove</button>
//                 </div>
//               ) : (
//                 <div className={styles.attachmentUpload}>
//                   <label className={styles.attachmentLabel}>
//                     <input id="fileInput" type="file" onChange={handleFileAttach} className={styles.hiddenInput} />
//                     <span className={styles.attachmentButton}>Attach file</span>
//                   </label>
//                   <p className={styles.attachmentHint}>There is nothing attached.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className={styles.actionBar}>
//             <button type="button" className={styles.cancelBtn} onClick={() => navigate("/")}>Cancel</button>
//             <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CRInputForm;



import * as React from "react";
import { useRef, useState, useEffect } from "react";
import styles from "./CRInputForm.module.scss";
import { useNavigate } from "react-router-dom";
import ChangeRequestService from "../services/ChangeRequestService";

// Interface for form data
interface IFormData {
  Title: string;
  First_x0020_Name: string;
  Staff_x0020_No: string;
  Department: string;
  System: string;
  User_x0020_Requirement: string;
  User_x0020_Requirement_x0020_Pri: string;
  User_x0020_Requirements: string;
  Date: string;
  Employee_x0020_Signature: string;
  Attachment: File | null;
}

// Interface for errors
interface IFormErrors {
  First_x0020_Name?: string;
  Staff_x0020_No?: string;
  Department?: string;
  System?: string;
  User_x0020_Requirement?: string;
  Employee_x0020_Signature?: string;
}

const CRInputForm = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // System multi-select state
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Form data
  const [formData, setFormData] = useState<IFormData>({
    Title: "Mr.",
    First_x0020_Name: "",
    Staff_x0020_No: "",
    Department: "",
    System: "",
    User_x0020_Requirement: "",
    User_x0020_Requirement_x0020_Pri: "Low",
    User_x0020_Requirements: "",
    Date: new Date().toISOString().split('T')[0],
    Employee_x0020_Signature: "",
    Attachment: null
  });

  // Errors state
  const [errors, setErrors] = useState<IFormErrors>({});

  const systemOptions = [
    { id: "T24", label: "T24" },
    { id: "Swift", label: "Swift" },
    { id: "Others", label: "Others" }
  ];

  const userRequirementOptions = [
    "NEW DEVELOPMENT",
    "MODIFYING THE EXISTING DEVELOPMENT",
    "OTHERS",
    
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle form field changes
  const handleChange = (field: keyof IFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof IFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSystemCheckboxChange = (systemId: string, checked: boolean) => {
    if (checked) {
      setSelectedSystems(prev => [...prev, systemId]);
    } else {
      setSelectedSystems(prev => prev.filter(s => s !== systemId));
    }
    // Clear system error
    if (errors.System) {
      setErrors(prev => ({ ...prev, System: undefined }));
    }
  };

  const removeSystem = (systemId: string) => {
    setSelectedSystems(prev => prev.filter(s => s !== systemId));
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    handleChange("Attachment", file);
  };

  // ========== SIGNATURE PAD FUNCTIONS ==========
  
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 500;
    canvas.height = 120;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL("image/png");
      handleChange("Employee_x0020_Signature", signatureData);
      // Clear signature error
      if (errors.Employee_x0020_Signature) {
        setErrors(prev => ({ ...prev, Employee_x0020_Signature: undefined }));
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleChange("Employee_x0020_Signature", "");
  };

  const isSignatureEmpty = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < pixelData.length; i += 4) {
      if (pixelData[i] !== 255 || pixelData[i+1] !== 255 || pixelData[i+2] !== 255) {
        return false;
      }
    }
    return true;
  };

  // ========== VALIDATION ==========
  const validate = (): boolean => {
    const newErrors: IFormErrors = {};

    if (!formData.First_x0020_Name.trim()) {
      newErrors.First_x0020_Name = "Employee Name is required.";
    }
    if (!formData.Staff_x0020_No.trim()) {
      newErrors.Staff_x0020_No = "Staff No is required.";
    }
    if (!formData.Department.trim()) {
      newErrors.Department = "Department is required.";
    }
    if (selectedSystems.length === 0) {
      newErrors.System = "System is required.";
    }
    if (!formData.User_x0020_Requirement) {
      newErrors.User_x0020_Requirement = "User Requirement is required.";
    }
    if (isSignatureEmpty()) {
      newErrors.Employee_x0020_Signature = "Signature is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      Title: "Mr.",
      First_x0020_Name: "",
      Staff_x0020_No: "",
      Department: "",
      System: "",
      User_x0020_Requirement: "",
      User_x0020_Requirement_x0020_Pri: "Low",
      User_x0020_Requirements: "",
      Date: new Date().toISOString().split('T')[0],
      Employee_x0020_Signature: "",
      Attachment: null
    });
    setSelectedSystems([]);
    setSelectedFile(null);
    setErrors({});
    clearSignature();
    
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // ========== SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);
    
    try {
      const systemsString = selectedSystems.join(", ");
      
      const submitData = {
        Title: formData.Title,
        First_x0020_Name: formData.First_x0020_Name,
        Staff_x0020_No: formData.Staff_x0020_No,
        Department: formData.Department,
        System: systemsString,
        User_x0020_Requirement: formData.User_x0020_Requirement,
        User_x0020_Requirement_x0020_Pri: formData.User_x0020_Requirement_x0020_Pri,
        User_x0020_Requirements: formData.User_x0020_Requirements,
        Date: formData.Date,
        Employee_x0020_Signature: formData.Employee_x0020_Signature,
        Attachment: selectedFile
      };
      
      const newId = await ChangeRequestService.createRequest(submitData);
      
      alert(`Change Request submitted successfully!\nID: ${newId}`);
      resetForm();
      navigate("/change-request");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Change Request Title */}
      <h1 className={styles.pageTitle}>Change Request</h1>

      {/* ========== USER INFORMATION SECTION ========== */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>User Information</h2>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Title :</label>
            <select
              value={formData.Title}
              onChange={(e) => handleChange("Title", e.target.value)}
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
              value={formData.First_x0020_Name}
              onChange={(e) => handleChange("First_x0020_Name", e.target.value)}
              className={`${styles.input} ${errors.First_x0020_Name ? styles.errorInput : ""}`}
              placeholder="Enter employee name"
            />
            {errors.First_x0020_Name && (
              <span className={styles.errorText}>{errors.First_x0020_Name}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Staff No :</label>
            <input
              type="text"
              value={formData.Staff_x0020_No}
              onChange={(e) => handleChange("Staff_x0020_No", e.target.value)}
              className={`${styles.input} ${errors.Staff_x0020_No ? styles.errorInput : ""}`}
              placeholder="Enter StaffNo..."
            />
            {errors.Staff_x0020_No && (
              <span className={styles.errorText}>{errors.Staff_x0020_No}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Department :</label>
            <input
              type="text"
              value={formData.Department}
              onChange={(e) => handleChange("Department", e.target.value)}
              className={`${styles.input} ${errors.Department ? styles.errorInput : ""}`}
              placeholder="Enter Department..."
            />
            {errors.Department && (
              <span className={styles.errorText}>{errors.Department}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>System :</label>
            <div className={`${styles.dropdownContainer} ${errors.System ? styles.errorBorder : ""}`} ref={dropdownRef}>
              <div className={styles.dropdownHeader} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className={styles.selectedItems}>
                  {selectedSystems.length === 0 ? (
                    <span className={styles.placeholder}>Select your system type...</span>
                  ) : (
                    selectedSystems.map(system => (
                      <span key={system} className={styles.selectedTag}>
                        {system}
                        <button type="button" className={styles.removeTag} onClick={(e) => { e.stopPropagation(); removeSystem(system); }}>×</button>
                      </span>
                    ))
                  )}
                </div>
                <span className={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</span>
              </div>
              {isDropdownOpen && (
                <div className={styles.dropdownList}>
                  {systemOptions.map(option => (
                    <label key={option.id} className={styles.dropdownItem}>
                      <input
                        type="checkbox"
                        checked={selectedSystems.includes(option.id)}
                        onChange={(e) => handleSystemCheckboxChange(option.id, e.target.checked)}
                        className={styles.checkbox}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.System && (
              <span className={styles.errorText}>{errors.System}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Effective Date :</label>
            <input
              type="date"
              value={formData.Date}
              onChange={(e) => handleChange("Date", e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldFullWidth}>
            <label>User Requirement :</label>
            <select
              value={formData.User_x0020_Requirement}
              onChange={(e) => handleChange("User_x0020_Requirement", e.target.value)}
              className={`${styles.input} ${errors.User_x0020_Requirement ? styles.errorInput : ""}`}
            >
              <option value="">Select user requirement...</option>
              {userRequirementOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.User_x0020_Requirement && (
              <span className={styles.errorText}>{errors.User_x0020_Requirement}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Priority :</label>
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
        </div>
      </div>

      {/* ========== USER REQUIREMENTS SECTION ========== */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>User Requirements</h2>

        <div className={styles.field}>
          <label>Comments :</label>
          <textarea
            value={formData.User_x0020_Requirements}
            onChange={(e) => handleChange("User_x0020_Requirements", e.target.value)}
            className={styles.textarea}
            rows={3}
            placeholder="Enter your comments based on your above selection..."
          />
        </div>

        {/* Signature & Attachment - Same Row */}
        <div className={styles.twoColumnRow}>
          {/* Signature Column */}
          <div className={styles.signatureColumn}>
            <label>Signature :</label>
            <div className={`${styles.signatureWrapper} ${errors.Employee_x0020_Signature ? styles.errorBorder : ""}`}>
              <canvas
                ref={canvasRef}
                className={styles.signatureCanvas}
                width={500}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <div className={styles.signatureActions}>
                <button type="button" onClick={clearSignature} className={styles.clearBtn}>
                  ✕ Clear
                </button>
              </div>
            </div>
            {errors.Employee_x0020_Signature && (
              <span className={styles.errorText}>{errors.Employee_x0020_Signature}</span>
            )}
          </div>

          {/* Attachment Column */}
          <div className={styles.attachmentColumn}>
            <label>Attach :</label>
            <div className={styles.attachBox}>
              {selectedFile ? (
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>
                    📎 {selectedFile.name}
                  </span>
                  <button 
                    type="button" 
                    className={styles.removeFileBtn}
                    onClick={() => {
                      setSelectedFile(null);
                      handleChange("Attachment", null);
                      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <span className={styles.noAttach}>There is nothing attached.</span>
                  <label className={styles.attachLabel}>
                    📎 Attach file
                    <input
                      id="fileInput"
                      type="file"
                      onChange={handleFileAttach}
                      className={styles.fileInput}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
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

export default CRInputForm;