// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import api from "../services/api";
// import "./PatientsProfile.css";

// const PatientProfile = () => {
//   const { id } = useParams();
//   const [patientData, setPatientData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   // Add this to your existing state hooks
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteError, setDeleteError] = useState("");
//   const [showCustomCondition, setShowCustomCondition] = useState(false);
//   const [editForm, setEditForm] = useState({
//     name: "",
//     section: "",
//     nationalId: "",
//     BloodType: "",
//     MedicalConditions: "",
//     JoiningDate: "", // Added field
//     OutDate: "", // Added field
//   });
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState("");

//   // Common blood types
//   const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//   // Common medical conditions
//   const commonConditions = [
//     "Diabetes",
//     "Hypertension",
//     "Asthma",
//     "Heart Disease",
//     "Allergies",
//     "Arthritis",
//     "Cancer",
//     "Kidney Disease",
//     "Liver Disease",
//     "Neurological Disorder",
//     "Respiratory Disease",
//     "None",
//   ];

//   const userRole = localStorage.getItem("user_role") || "Medical Staff";
//   const isAdmin = userRole === "ADMIN" || userRole === "admin";

//   useEffect(() => {
//     if (id) {
//       fetchPatientData();
//     }
//   }, [id]);

//   const fetchPatientData = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/patient/${id}`);

//       if (response.data) {
//         setPatientData(response.data);
//         // Format dates from backend (assuming they come as "YYYY-MM-DD" strings)
//         const formatDateForInput = (dateString) => {
//           if (!dateString) return "";
//           // If it's a full ISO string, extract the date part
//           if (dateString.includes("T")) {
//             return dateString.split("T")[0];
//           }
//           // If it's already in YYYY-MM-DD format, return as is
//           return dateString;
//         };

//         setEditForm({
//           name: response.data.name || "",
//           section: response.data.section || "",
//           nationalId: response.data.nationalId || "",
//           BloodType: response.data.BloodType || "",
//           MedicalConditions: response.data.MedicalConditions || "",
//           JoiningDate: formatDateForInput(response.data.JoiningDate) || "", // Added
//           OutDate: formatDateForInput(response.data.OutDate) || "", // Added
//         });
//         setError(null);
//       } else {
//         setError("Patient data not found");
//       }
//     } catch (err) {
//       console.error("Error fetching patient data:", err);
//       setError("Failed to load patient data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (e) {
//       return "Invalid date";
//     }
//   };

//   // Safe substring function
//   const getShortId = (id) => {
//     return id && typeof id === "string" && id.length > 8
//       ? `${id.substring(0, 8)}...`
//       : id || "N/A";
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//     setSaveError("");
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setSaveError("");
//     // Reset form to original data including dates
//     if (patientData) {
//       const formatDateForInput = (dateString) => {
//         if (!dateString) return "";
//         if (dateString.includes("T")) {
//           return dateString.split("T")[0];
//         }
//         return dateString;
//       };

//       setEditForm({
//         name: patientData.name || "",
//         section: patientData.section || "",
//         nationalId: patientData.nationalId || "",
//         BloodType: patientData.BloodType || "",
//         MedicalConditions: patientData.MedicalConditions || "",
//         JoiningDate: formatDateForInput(patientData.JoiningDate) || "", // Reset date
//         OutDate: formatDateForInput(patientData.OutDate) || "", // Reset date
//       });
//     }
//   };

//   // Also handle custom input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "MedicalConditions") {
//       if (value === "other") {
//         setShowCustomCondition(true);
//         setEditForm((prev) => ({
//           ...prev,
//           MedicalConditions: "",
//         }));
//       } else {
//         setShowCustomCondition(false);
//         setEditForm((prev) => ({
//           ...prev,
//           MedicalConditions: value,
//         }));
//       }
//     } else {
//       setEditForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleCustomConditionChange = (e) => {
//     setEditForm((prev) => ({
//       ...prev,
//       MedicalConditions: e.target.value,
//     }));
//   };

//   const handleSaveEdit = async () => {
//     // Validate required fields
//     if (!editForm.name.trim()) {
//       setSaveError("Patient name is required");
//       return;
//     }

//     if (!editForm.section.trim()) {
//       setSaveError("Section is required");
//       return;
//     }

//     // Validate name has at least 3 parts
//     const nameParts = editForm.name
//       .trim()
//       .split(/\s+/)
//       .filter((n) => n.length > 0);
//     if (nameParts.length < 3) {
//       setSaveError(
//         "Patient name must have at least 3 parts (e.g., shady ahmed mohamed)"
//       );
//       return;
//     }

//     // Validate national ID if provided
//     if (editForm.nationalId && editForm.nationalId.length !== 14) {
//       setSaveError("National ID must be 14 digits if provided");
//       return;
//     }
//     if (editForm.JoiningDate && editForm.OutDate) {
//       const joinDate = new Date(editForm.JoiningDate);
//       const OutDate = new Date(editForm.OutDate);
//       if (OutDate < joinDate) {
//         setSaveError("Out date cannot be before joining date");
//         return;
//       }
//     }

//     try {
//       setSaving(true);
//       setSaveError("");

//       const updateData = {
//         name: editForm.name.trim(),
//         section: editForm.section.trim(),
//         nationalId: editForm.nationalId.trim() || undefined,
//         BloodType: editForm.BloodType.trim() || undefined,
//         MedicalConditions: editForm.MedicalConditions.trim() || undefined,
//         JoiningDate: editForm.JoiningDate.trim() || undefined, // Added
//         OutDate: editForm.OutDate.trim() || undefined, // Added
//       };

//       const response = await api.patch(`/patient/${id}`, updateData);

//       // Update local state
//       setPatientData((prev) => ({
//         ...prev,
//         ...response.data,
//         // Ensure dates are displayed correctly
//         JoiningDate: editForm.JoiningDate || null,
//         OutDate: editForm.OutDate || null,
//       }));

//       setIsEditing(false);
//       setShowCustomCondition(false);
//       alert("Patient information updated successfully!");
//     } catch (err) {
//       console.error("Error updating patient:", err);
//       setSaveError(
//         err.response?.data?.message ||
//           err.response?.data?.error ||
//           "Failed to update patient. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className='patient-profile'>
//         <div className='back-link'>
//           <Link to='/patients' className='back-btn'>
//             ← Back to Patients
//           </Link>
//         </div>
//         <div className='loading-state'>
//           <div className='loading-spinner'></div>
//           <p>Loading patient data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !patientData) {
//     return (
//       <div className='patient-profile'>
//         <div className='back-link'>
//           <Link to='/patients' className='back-btn'>
//             ← Back to Patients
//           </Link>
//         </div>
//         <div className='error-state'>
//           <p>{error || "Patient not found"}</p>
//           <button onClick={fetchPatientData} className='btn btn-secondary'>
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Extract visits from patientData
//   const visits = patientData.visits || [];

//   const handleDeletePatient = async () => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete patient "${patientData.name}"? This action cannot be undone and will delete all visit records.`
//       )
//     ) {
//       return;
//     }

//     try {
//       setDeleting(true);
//       setDeleteError("");

//       await api.delete(`/patient/${id}`);

//       alert("Patient deleted successfully!");
//       // Redirect back to patients list
//       window.location.href = "/patients";
//     } catch (err) {
//       console.error("Error deleting patient:", err);
//       setDeleteError(
//         err.response?.data?.message ||
//           err.response?.data?.error ||
//           "Failed to delete patient. Please try again."
//       );
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className='patient-profile'>
//       <div className='back-link'>
//         <div className='back-section'>
//           <Link to='/patients' className='back-btn'>
//             ← Back to Patients
//           </Link>
//           {/* <div className='user-info-badge'>
//       <span className='user-role'>{userRole}</span>
//     </div> */}
//         </div>

//         <div className='header-right-actions'>
//           {!isEditing && isAdmin && (
//             <div className='patient-actions-row'>
//               <button className='btn btn-primary' onClick={handleEditClick}>
//                 Edit Patient
//               </button>
//               <button
//                 className='btn btn-danger'
//                 onClick={handleDeletePatient}
//                 disabled={deleting}
//               >
//                 {deleting ? "Deleting..." : "Delete Patient"}
//               </button>
//             </div>
//           )}
//           {isEditing && (
//             <div className='edit-actions'>
//               <button
//                 className='btn btn-secondary'
//                 onClick={handleCancelEdit}
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//               <button
//                 className='btn btn-primary'
//                 onClick={handleSaveEdit}
//                 disabled={saving}
//               >
//                 {saving ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className='profile-header'>
//         <div className='hospital-header'>
//           <h1>Military Hospital</h1>
//         </div>

//         <div className='patient-main-info'>
//           {isEditing ? (
//             <div className='edit-form'>
//               {saveError && <div className='error-message'>{saveError}</div>}

//               <div className='form-group'>
//                 <label htmlFor='name'>
//                   Patient Name <span className='required'>*</span>
//                 </label>
//                 <input
//                   type='text'
//                   id='name'
//                   name='name'
//                   value={editForm.name}
//                   onChange={handleInputChange}
//                   placeholder='Enter at least 3 names'
//                   required
//                 />
//               </div>

//               <div className='form-row'>
//                 <div className='form-group'>
//                   <label htmlFor='section'>
//                     Section <span className='required'>*</span>
//                   </label>
//                   <input
//                     type='text'
//                     id='section'
//                     name='section'
//                     value={editForm.section}
//                     onChange={handleInputChange}
//                     placeholder='e.g., Emergency, Cardiology'
//                     required
//                   />
//                 </div>

//                 <div className='form-group'>
//                   <label htmlFor='nationalId'>National ID</label>
//                   <input
//                     type='text'
//                     id='nationalId'
//                     name='nationalId'
//                     value={editForm.nationalId}
//                     onChange={handleInputChange}
//                     placeholder='14-digit national ID'
//                     maxLength={14}
//                   />
//                 </div>
//               </div>

//               <div className='form-row'>
//                 <div className='form-group'>
//                   <label htmlFor='BloodType'>Blood Type</label>
//                   <select
//                     id='BloodType'
//                     name='BloodType'
//                     value={editForm.BloodType}
//                     onChange={handleInputChange}
//                   >
//                     <option value=''>Select Blood Type</option>
//                     {bloodTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className='form-group'>
//                   <label htmlFor='MedicalConditions'>Medical Conditions</label>
//                   <select
//                     id='MedicalConditions'
//                     name='MedicalConditions'
//                     value={
//                       showCustomCondition ? "other" : editForm.MedicalConditions
//                     }
//                     onChange={handleInputChange}
//                   >
//                     <option value=''>Select Condition</option>
//                     {commonConditions.map((condition) => (
//                       <option key={condition} value={condition}>
//                         {condition}
//                       </option>
//                     ))}
//                     <option value='other'>Other</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Show custom input when "other" is selected */}
//               {showCustomCondition && (
//                 <div className='form-group'>
//                   <label htmlFor='customCondition'>Specify Condition</label>
//                   <input
//                     type='text'
//                     id='customCondition'
//                     value={editForm.MedicalConditions}
//                     onChange={handleCustomConditionChange}
//                     placeholder='Enter medical condition'
//                     autoFocus
//                   />
//                 </div>
//               )}
//               <div className='form-row'>
//                 <div className='form-group'>
//                   <label htmlFor='JoiningDate'>Joining Date</label>
//                   <input
//                     type='date'
//                     id='JoiningDate'
//                     name='JoiningDate'
//                     value={editForm.JoiningDate}
//                     onChange={handleInputChange}
//                   />
//                   <small className='form-hint'>
//                     Optional - When patient joined the hospital
//                   </small>
//                 </div>

//                 <div className='form-group'>
//                   <label htmlFor='OutDate'>Out Date</label>
//                   <input
//                     type='date'
//                     id='OutDate'
//                     name='OutDate'
//                     value={editForm.OutDate}
//                     onChange={handleInputChange}
//                     min={editForm.JoiningDate || undefined}
//                   />
//                   <small className='form-hint'>
//                     Optional - When patient left the hospital
//                   </small>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className='patient-basic'>
//                 <h2 className='patient-name-large'>{patientData.name}</h2>
//                 {patientData.MedicalConditions && (
//                   <div className='patient-condition'>
//                     {patientData.MedicalConditions}
//                   </div>
//                 )}
//                 <div className='patient-section'>
//                   Section: {patientData.section}
//                 </div>
//               </div>

//               <div className='patient-details-grid'>
//                 {patientData.BloodType && (
//                   <div className='detail-card'>
//                     <div className='detail-label'>Blood Type</div>
//                     <div className='detail-value blood-type'>
//                       {patientData.BloodType}
//                     </div>
//                   </div>
//                 )}

//                 <div className='detail-card'>
//                   <div className='detail-label'>National ID</div>
//                   <div className='detail-value'>{patientData.nationalId}</div>
//                 </div>

//                 <div className='detail-card'>
//                   <div className='detail-label'>Patient ID</div>
//                   <div className='detail-value id-value'>
//                     {getShortId(patientData.id)}
//                   </div>
//                 </div>

//                 <div className='detail-card'>
//                   <div className='detail-label'>Total Visits</div>
//                   <div className='detail-value visits-count'>
//                     {visits.length}
//                   </div>
//                 </div>
//                 {patientData.JoiningDate && (
//                   <div className='detail-card'>
//                     <div className='detail-label'>Joining Date</div>
//                     <div className='detail-value date-value'>
//                       {new Date(patientData.JoiningDate).toLocaleDateString(
//                         "en-US",
//                         {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         }
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {patientData.OutDate && (
//                   <div className='detail-card'>
//                     <div className='detail-label'>Out Date</div>
//                     <div className='detail-value date-value'>
//                       {new Date(patientData.OutDate).toLocaleDateString(
//                         "en-US",
//                         {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         }
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {!isEditing && (
//         <>
//           <div className='section-divider'>
//             <hr />
//           </div>

//           <div className='visit-history'>
//             <div className='section-header'>
//               <h3 className='section-title'>Visit History</h3>
//               <span className='total-visits'>
//                 Total: {visits.length} visits
//               </span>
//             </div>

//             {visits.length > 0 ? (
//               <div className='visits-list'>
//                 {visits.map((visit) => (
//                   <div key={visit.id} className='visit-card'>
//                     <div className='visit-header'>
//                       <div className='visit-main-info'>
//                         <h4 className='visit-title'>{visit.reason}</h4>
//                         <div
//                           className={`visit-result ${
//                             visit.result === "Normal" ? "normal" : "abnormal"
//                           }`}
//                         >
//                           {visit.result}
//                         </div>
//                       </div>
//                       <span className='visit-date'>
//                         {formatDate(visit.createdAt)}
//                       </span>
//                     </div>

//                     <div className='visit-vitals'>
//                       <div className='vitals-grid'>
//                         <div className='vital-item'>
//                           <span className='vital-label'>Blood Pressure</span>
//                           <span className='vital-value'>
//                             {visit.highBloodPressure}/{visit.lowBloodPressure}
//                           </span>
//                           <span className='vital-unit'>mmHg</span>
//                         </div>
//                         <div className='vital-item'>
//                           <span className='vital-label'>Oxygen Level</span>
//                           <span
//                             className={`vital-value ${
//                               parseInt(visit.oxygenLevel) < 90 ? "warning" : ""
//                             }`}
//                           >
//                             {visit.oxygenLevel}
//                           </span>
//                           <span className='vital-unit'>SpO₂</span>
//                         </div>
//                         <div className='vital-item'>
//                           <span className='vital-label'>Temperature</span>
//                           <span className='vital-value'>
//                             {visit.temprature}
//                           </span>
//                           <span className='vital-unit'>°C</span>
//                         </div>
//                         <div className='vital-item'>
//                           <span className='vital-label'>Heart Rate</span>
//                           <span className='vital-value'>{visit.heartBeat}</span>
//                           <span className='vital-unit'>BPM</span>
//                         </div>
//                       </div>
//                     </div>

//                     {visit.note && (
//                       <div className='visit-notes'>
//                         <span className='notes-label'>Doctor's Notes:</span>
//                         <p className='notes-content'>{visit.note}</p>
//                       </div>
//                     )}

//                     <div className='visit-footer'>
//                       <span className='visit-id'>
//                         Visit ID: {getShortId(visit.id)}
//                       </span>
//                       <span className='visit-time'>
//                         Updated: {formatDate(visit.updatedAt)}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className='no-visits'>
//                 <div className='no-visits-icon'>📋</div>
//                 <h4>No Visit History</h4>
//                 <p>This patient hasn't had any visits yet.</p>
//                 <Link to='/visits' className='btn btn-primary'>
//                   Add First Visit
//                 </Link>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PatientProfile;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./PatientsProfile.css";
import { t } from "../locales";

const PatientProfile = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // Add this to your existing state hooks
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showCustomCondition, setShowCustomCondition] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    section: "",
    nationalId: "",
    BloodType: "",
    MedicalConditions: "",
    JoiningDate: "", // Added field
    OutDate: "", // Added field
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Common blood types
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Common medical conditions
  const commonConditions = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Heart Disease",
    "Allergies",
    "Arthritis",
    "Cancer",
    "Kidney Disease",
    "Liver Disease",
    "Neurological Disorder",
    "Respiratory Disease",
    "None",
  ];

  const userRole = localStorage.getItem("user_role") || "Medical Staff";
  const isAdmin = userRole === "ADMIN" || userRole === "admin";

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/patient/${id}`);

      if (response.data) {
        setPatientData(response.data);
        // Format dates from backend (assuming they come as "YYYY-MM-DD" strings)
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          // If it's a full ISO string, extract the date part
          if (dateString.includes("T")) {
            return dateString.split("T")[0];
          }
          // If it's already in YYYY-MM-DD format, return as is
          return dateString;
        };

        setEditForm({
          name: response.data.name || "",
          section: response.data.section || "",
          nationalId: response.data.nationalId || "",
          BloodType: response.data.BloodType || "",
          MedicalConditions: response.data.MedicalConditions || "",
          JoiningDate: formatDateForInput(response.data.JoiningDate) || "", // Added
          OutDate: formatDateForInput(response.data.OutDate) || "", // Added
        });
        setError(null);
      } else {
        setError("Patient data not found");
      }
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to load patient data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("patientProfile.na");
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Safe substring function
  const getShortId = (id) => {
    return id && typeof id === "string" && id.length > 8
      ? `${id.substring(0, 8)}...`
      : id || t("patientProfile.na");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError("");
    // Reset form to original data including dates
    if (patientData) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        if (dateString.includes("T")) {
          return dateString.split("T")[0];
        }
        return dateString;
      };

      setEditForm({
        name: patientData.name || "",
        section: patientData.section || "",
        nationalId: patientData.nationalId || "",
        BloodType: patientData.BloodType || "",
        MedicalConditions: patientData.MedicalConditions || "",
        JoiningDate: formatDateForInput(patientData.JoiningDate) || "", // Reset date
        OutDate: formatDateForInput(patientData.OutDate) || "", // Reset date
      });
    }
  };

  // Also handle custom input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "MedicalConditions") {
      if (value === "other") {
        setShowCustomCondition(true);
        setEditForm((prev) => ({
          ...prev,
          MedicalConditions: "",
        }));
      } else {
        setShowCustomCondition(false);
        setEditForm((prev) => ({
          ...prev,
          MedicalConditions: value,
        }));
      }
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomConditionChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      MedicalConditions: e.target.value,
    }));
  };

  const handleSaveEdit = async () => {
    // Validate required fields
    if (!editForm.name.trim()) {
      setSaveError(t("patientProfile.nameRequired"));
      return;
    }

    if (!editForm.section.trim()) {
      setSaveError(t("patientProfile.sectionRequired"));
      return;
    }

    // Validate name has at least 3 parts
    const nameParts = editForm.name
      .trim()
      .split(/\s+/)
      .filter((n) => n.length > 0);
    if (nameParts.length < 3) {
      setSaveError(
        t("patientProfile.nameValidation")
      );
      return;
    }

    // Validate national ID if provided
    if (editForm.nationalId && editForm.nationalId.length !== 14) {
      setSaveError(t("patientProfile.nationalIdValidation"));
      return;
    }
    if (editForm.JoiningDate && editForm.OutDate) {
      const joinDate = new Date(editForm.JoiningDate);
      const OutDate = new Date(editForm.OutDate);
      if (OutDate < joinDate) {
        setSaveError(t("patientProfile.dateValidation"));
        return;
      }
    }

    try {
      setSaving(true);
      setSaveError("");

      const updateData = {
        name: editForm.name.trim(),
        section: editForm.section.trim(),
        nationalId: editForm.nationalId.trim() || undefined,
        BloodType: editForm.BloodType.trim() || undefined,
        MedicalConditions: editForm.MedicalConditions.trim() || undefined,
        JoiningDate: editForm.JoiningDate.trim() || undefined, // Added
        OutDate: editForm.OutDate.trim() || undefined, // Added
      };

      const response = await api.patch(`/patient/${id}`, updateData);

      // Update local state
      setPatientData((prev) => ({
        ...prev,
        ...response.data,
        // Ensure dates are displayed correctly
        JoiningDate: editForm.JoiningDate || null,
        OutDate: editForm.OutDate || null,
      }));

      setIsEditing(false);
      setShowCustomCondition(false);
      alert(t("patientProfile.updateSuccess"));
    } catch (err) {
      console.error("Error updating patient:", err);
      setSaveError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          t("patientProfile.updateError")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='patient-profile'>
        <div className='back-link'>
          <Link to='/patients' className='back-btn'>
            {t("patientProfile.backToPatients")}
          </Link>
        </div>
        <div className='loading-state'>
          <div className='loading-spinner'></div>
          <p>{t("patientProfile.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !patientData) {
    return (
      <div className='patient-profile'>
        <div className='back-link'>
          <Link to='/patients' className='back-btn'>
            {t("patientProfile.backToPatients")}
          </Link>
        </div>
        <div className='error-state'>
          <p>{error || t("patientProfile.notFound")}</p>
          <button onClick={fetchPatientData} className='btn btn-secondary'>
            {t("patientProfile.retry")}
          </button>
        </div>
      </div>
    );
  }

  // Extract visits from patientData
  const visits = patientData.visits || [];

  const handleDeletePatient = async () => {
    if (
      !window.confirm(
        t("patientProfile.deleteConfirm", { name: patientData.name })
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await api.delete(`/patient/${id}`);

      alert(t("patientProfile.deleteSuccess"));
      // Redirect back to patients list
      window.location.href = "/patients";
    } catch (err) {
      console.error("Error deleting patient:", err);
      setDeleteError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          t("patientProfile.deleteError")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className='patient-profile'>
      <div className='back-link'>
        <div className='back-section'>
          <Link to='/patients' className='back-btn'>
            {t("patientProfile.backToPatients")}
          </Link>
        </div>

        <div className='header-right-actions'>
          {!isEditing && isAdmin && (
            <div className='patient-actions-row'>
              <button className='btn btn-primary' onClick={handleEditClick}>
                {t("patientProfile.editPatient")}
              </button>
              <button
                className='btn btn-danger'
                onClick={handleDeletePatient}
                disabled={deleting}
              >
                {deleting ? t("patientProfile.deleting") : t("patientProfile.deletePatient")}
              </button>
            </div>
          )}
          {isEditing && (
            <div className='edit-actions'>
              <button
                className='btn btn-secondary'
                onClick={handleCancelEdit}
                disabled={saving}
              >
                {t("patientProfile.cancel")}
              </button>
              <button
                className='btn btn-primary'
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? t("patientProfile.saving") : t("patientProfile.saveChanges")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='profile-header'>
        <div className='hospital-header'>
          <h1>{t("patientProfile.hospitalName")}</h1>
        </div>

        <div className='patient-main-info'>
          {isEditing ? (
            <div className='edit-form'>
              {saveError && <div className='error-message'>{saveError}</div>}

              <div className='form-group'>
                <label htmlFor='name'>
                  {t("patientProfile.patientName")} <span className='required'>{t("common.requiredIndicator")}</span>
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder={t("patientProfile.nameValidation")}
                  required
                />
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='section'>
                    {t("patientProfile.section")} <span className='required'>{t("common.requiredIndicator")}</span>
                  </label>
                  <input
                    type='text'
                    id='section'
                    name='section'
                    value={editForm.section}
                    onChange={handleInputChange}
                    placeholder='e.g., Emergency, Cardiology'
                    required
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='nationalId'>{t("patientProfile.nationalId")}</label>
                  <input
                    type='text'
                    id='nationalId'
                    name='nationalId'
                    value={editForm.nationalId}
                    onChange={handleInputChange}
                    placeholder={t("patientProfile.nationalIdPlaceholder")}
                    maxLength={14}
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='BloodType'>{t("patientProfile.bloodType")}</label>
                  <select
                    id='BloodType'
                    name='BloodType'
                    value={editForm.BloodType}
                    onChange={handleInputChange}
                  >
                    <option value=''>{t("patientProfile.selectBloodType")}</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label htmlFor='MedicalConditions'>{t("patientProfile.medicalConditions")}</label>
                  <select
                    id='MedicalConditions'
                    name='MedicalConditions'
                    value={
                      showCustomCondition ? "other" : editForm.MedicalConditions
                    }
                    onChange={handleInputChange}
                  >
                    <option value=''>{t("patientProfile.selectCondition")}</option>
                    {commonConditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                    <option value='other'>{t("patientProfile.other")}</option>
                  </select>
                </div>
              </div>

              {/* Show custom input when "other" is selected */}
              {showCustomCondition && (
                <div className='form-group'>
                  <label htmlFor='customCondition'>{t("patientProfile.specifyCondition")}</label>
                  <input
                    type='text'
                    id='customCondition'
                    value={editForm.MedicalConditions}
                    onChange={handleCustomConditionChange}
                    placeholder={t("patientProfile.enterCondition")}
                    autoFocus
                  />
                </div>
              )}
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='JoiningDate'>{t("patientProfile.joiningDate")}</label>
                  <input
                    type='date'
                    id='JoiningDate'
                    name='JoiningDate'
                    value={editForm.JoiningDate}
                    onChange={handleInputChange}
                  />
                  <small className='form-hint'>
                    {t("patientProfile.joiningDateHint")}
                  </small>
                </div>

                <div className='form-group'>
                  <label htmlFor='OutDate'>{t("patientProfile.outDate")}</label>
                  <input
                    type='date'
                    id='OutDate'
                    name='OutDate'
                    value={editForm.OutDate}
                    onChange={handleInputChange}
                    min={editForm.JoiningDate || undefined}
                  />
                  <small className='form-hint'>
                    {t("patientProfile.outDateHint")}
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className='patient-basic'>
                <h2 className='patient-name-large'>{patientData.name}</h2>
                {patientData.MedicalConditions && (
                  <div className='patient-condition'>
                    {t("patientProfile.condition")}: {patientData.MedicalConditions}
                  </div>
                )}
                <div className='patient-section'>
                  {t("patientProfile.sectionLabel")} {patientData.section}
                </div>
              </div>

              <div className='patient-details-grid'>
                {patientData.BloodType && (
                  <div className='detail-card'>
                    <div className='detail-label'>{t("patientProfile.bloodTypeLabel")}</div>
                    <div className='detail-value blood-type'>
                      {patientData.BloodType}
                    </div>
                  </div>
                )}

                <div className='detail-card'>
                  <div className='detail-label'>{t("patientProfile.nationalId")}</div>
                  <div className='detail-value'>{patientData.nationalId}</div>
                </div>

                <div className='detail-card'>
                  <div className='detail-label'>{t("patientProfile.patientId")}</div>
                  <div className='detail-value id-value'>
                    {getShortId(patientData.id)}
                  </div>
                </div>

                <div className='detail-card'>
                  <div className='detail-label'>{t("patientProfile.totalVisits")}</div>
                  <div className='detail-value visits-count'>
                    {visits.length}
                  </div>
                </div>
                {patientData.JoiningDate && (
                  <div className='detail-card'>
                    <div className='detail-label'>{t("patientProfile.joiningDateLabel")}</div>
                    <div className='detail-value date-value'>
                      {new Date(patientData.JoiningDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                )}

                {patientData.OutDate && (
                  <div className='detail-card'>
                    <div className='detail-label'>{t("patientProfile.outDateLabel")}</div>
                    <div className='detail-value date-value'>
                      {new Date(patientData.OutDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <>
          <div className='section-divider'>
            <hr />
          </div>

          <div className='visit-history'>
            <div className='section-header'>
              <h3 className='section-title'>{t("patientProfile.visitHistory")}</h3>
              <span className='total-visits'>
                {t("patientProfile.total")} {visits.length} {t("patientProfile.visits")}
              </span>
            </div>

            {visits.length > 0 ? (
              <div className='visits-list'>
                {visits.map((visit) => (
                  <div key={visit.id} className='visit-card'>
                    <div className='visit-header'>
                      <div className='visit-main-info'>
                        <h4 className='visit-title'>{visit.reason}</h4>
                        <div
                          className={`visit-result ${
                            visit.result === "Normal" ? "normal" : "abnormal"
                          }`}
                        >
                          {visit.result}
                        </div>
                      </div>
                      <span className='visit-date'>
                        {formatDate(visit.createdAt)}
                      </span>
                    </div>

                    <div className='visit-vitals'>
                      <div className='vitals-grid'>
                        <div className='vital-item'>
                          <span className='vital-label'>{t("patientProfile.bloodPressure")}</span>
                          <span className='vital-value'>
                            {visit.highBloodPressure}/{visit.lowBloodPressure}
                          </span>
                          <span className='vital-unit'>mmHg</span>
                        </div>
                        <div className='vital-item'>
                          <span className='vital-label'>{t("patientProfile.oxygenLevel")}</span>
                          <span
                            className={`vital-value ${
                              parseInt(visit.oxygenLevel) < 90 ? "warning" : ""
                            }`}
                          >
                            {visit.oxygenLevel}
                          </span>
                          <span className='vital-unit'>SpO₂</span>
                        </div>
                        <div className='vital-item'>
                          <span className='vital-label'>{t("patientProfile.temperature")}</span>
                          <span className='vital-value'>
                            {visit.temprature}
                          </span>
                          <span className='vital-unit'>°C</span>
                        </div>
                        <div className='vital-item'>
                          <span className='vital-label'>{t("patientProfile.heartRate")}</span>
                          <span className='vital-value'>{visit.heartBeat}</span>
                          <span className='vital-unit'>BPM</span>
                        </div>
                      </div>
                    </div>

                    {visit.note && (
                      <div className='visit-notes'>
                        <span className='notes-label'>{t("patientProfile.doctorsNotes")}</span>
                        <p className='notes-content'>{visit.note}</p>
                      </div>
                    )}

                    <div className='visit-footer'>
                      <span className='visit-id'>
                        {t("patientProfile.visitId")} {getShortId(visit.id)}
                      </span>
                      <span className='visit-time'>
                        {t("patientProfile.updated")} {formatDate(visit.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='no-visits'>
                <div className='no-visits-icon'>📋</div>
                <h4>{t("patientProfile.noVisitHistory")}</h4>
                <p>{t("patientProfile.noVisitsMessage")}</p>
                <Link to='/visits' className='btn btn-primary'>
                  {t("patientProfile.addFirstVisit")}
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientProfile;