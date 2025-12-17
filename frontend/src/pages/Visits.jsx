// import { useEffect, useState } from "react";
// import api from "../services/api";
// import ReferralButton from "../components/ReferralPDFButton";
// import "./Visits.css";
// import ReferralButtonHospital from "../components/ReferralPrintHospital";

// const Visits = () => {
//   const [visits, setVisits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVisit, setSelectedVisit] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [resultFilter, setResultFilter] = useState("all visits");
//   const [searchTimeout, setSearchTimeout] = useState(null);
//   const [showNewVisitModal, setShowNewVisitModal] = useState(false);
//   const [newVisitForm, setNewVisitForm] = useState({
//     patientName: "",
//     patientId: "",
//     reason: "",
//     highBloodPressure: "",
//     lowBloodPressure: "",
//     oxygenLevel: "",
//     temprature: "",
//     heartBeat: "",
//     result: "Pending",
//     note: "",
//      medicineName: "",
//   medicineDosage: "",
//   });
//   const [searchResults, setSearchResults] = useState([]);
//   const [searching, setSearching] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [createError, setCreateError] = useState("");
//   // Add these state variables near your existing state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPatient, setSelectedPatient] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [uniquePatients, setUniquePatients] = useState([]);
//   const [uniqueDepartments, setUniqueDepartments] = useState([]);

//   const filterOptions = [
//     { value: "no action", label: "No Action" },
//     { value: "all visits", label: "All Visits" },
//     { value: "midicens", label: "Midicens" },
//     { value: "rest in room", label: "Rest in Room" },
//     { value: "rest in home", label: "Rest in Home" },
//     { value: "forward to mobark", label: "Forward to Mobark" },
//     { value: "forward to hospital", label: "Forward to hospital" },
//     { value: "exemption", label: "exemption" },
//   ];
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [itemsPerPage] = useState(20);
//   const [isLoading, setIsLoading] = useState(true);
//   const userRole = localStorage.getItem("user_role") || "Medical Staff";
//   const isAdmin = userRole === "ADMIN" || userRole === "admin";
//   // Add this near your other constants
//   const predefinedDepartments = [
//     "السرية الأولي",
//     "السرية الثانية",
//     "السرية الثالثة",
//     "السرية الرابعة",
//     "السرية الخامسة",
//     "السرية السادسة",
//     "السرية السابعة",
//     "السرية الثامنة",
//     "السرية التاسعة",
//     "السرية العاشرة",
//     "السرية الحادية عشر",
//     "السرية الثانية عشر",
//     "المديرية",
//     "قسم مطروح",
//     "قسم براني",
//     "قسم السلوم",
//     "قسم النجيلة",
//     "فرقة السلوم",
//     "المرور",
//     "قسم الحمام",
//     "فرع البحث بالسلوم",
//     "حماية مدنية",
//     "قسم سيوة",
//     "قسم الضبعة",
//     "ادارة الطاقة",
//     "قسم مارينا",
//     "قسم المرافق",
//     "قطاع العلمين",
//     "فرع ب الحمام",
//     "تامين الطرق",
//     "المركبات",
//     "امن وطني",
//     "قسم المخازن",
//     "النجدة",
//     "الترحيلات",
//     "إدارة البحث",
//     "الامن العام",
//     "إدارة التدريب",
//     "قسم العلمين",
//     "فرقة الحمام",
//   ];

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchVisits();
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [
//     currentPage,
//     resultFilter,
//     searchTerm,
//     selectedPatient,
//     selectedDepartment,
//   ]);

//   useEffect(() => {
//     return () => {
//       if (searchTimeout) {
//         clearTimeout(searchTimeout);
//       }
//     };
//   }, [searchTimeout]);

//   useEffect(() => {
//     if (selectedVisit && isEditing) {
//       setEditForm({
//         reason: selectedVisit.reason || "",
//         highBloodPressure: selectedVisit.highBloodPressure || "",
//         lowBloodPressure: selectedVisit.lowBloodPressure || "",
//         oxygenLevel: selectedVisit.oxygenLevel || "",
//         temprature: selectedVisit.temprature || "",
//         heartBeat: selectedVisit.heartBeat || "",
//         result: selectedVisit.result || "Pending",
//         note: selectedVisit.note || "",
//          medicineName: selectedVisit.medicineName || "",
//       medicineDosage: selectedVisit.medicineDosage || "",
//       });
//     }
//   }, [selectedVisit, isEditing]);

//   // Add this useEffect to extract unique values
//   useEffect(() => {
//     if (visits.length > 0) {
//       // Extract unique patient names
//       const patients = [
//         ...new Set(visits.map((v) => v.patient?.name).filter(Boolean)),
//       ].sort();
//       setUniquePatients(patients);

//       // Extract unique departments/sections
//       const departments = [
//         ...new Set(visits.map((v) => v.patient?.section).filter(Boolean)),
//       ].sort();
//       setUniqueDepartments(departments);
//     }
//   }, [visits]);

//   // Replace your existing fetchVisits function with this:
//   const fetchVisits = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // Build query parameters
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//       });

//       // Add filters only if they have values
//       if (resultFilter !== "all visits") params.append("result", resultFilter);
//       if (searchTerm) params.append("patientName", searchTerm);
//       if (selectedPatient) params.append("patient", selectedPatient);
//       if (selectedDepartment) params.append("department", selectedDepartment);

//       const response = await api.get(`/visit?${params.toString()}`);

//       if (response.data && response.data.data) {
//         setVisits(response.data.data);
//         setTotalPages(response.data.pagination?.totalPages || 1);
//         setTotalItems(response.data.pagination?.totalItems || 0);
//         setCurrentPage(response.data.pagination?.currentPage || 1);

//         // Extract unique patients and departments for filters
//         const patients = [
//           ...new Set(
//             response.data.data.map((v) => v.patient?.name).filter(Boolean)
//           ),
//         ].sort();
//         setUniquePatients(patients);

//         const departments = [
//           ...new Set(
//             response.data.data.map((v) => v.patient?.section).filter(Boolean)
//           ),
//         ].sort();
//         setUniqueDepartments(departments);
//       } else {
//         setVisits([]);
//         setTotalPages(1);
//         setTotalItems(0);
//       }
//     } catch (err) {
//       console.error("Error fetching visits:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to load visits. Please try again."
//       );
//       setVisits([]);
//       setTotalPages(1);
//       setTotalItems(0);
//     } finally {
//       setIsLoading(false);
//       setLoading(false);
//     }
//   };

//   // Add these handler functions:
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handlePatientChange = (e) => {
//     setSelectedPatient(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleDepartmentChange = (e) => {
//     setSelectedDepartment(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleResultFilterChange = (e) => {
//     setResultFilter(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleDeleteVisit = async (visitId) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this visit? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       setDeleting(true);
//       await api.delete(`/visit/${visitId}`);

//       setVisits((prev) => prev.filter((visit) => visit.id !== visitId));

//       if (selectedVisit && selectedVisit.id === visitId) {
//         handleCloseModal();
//       }

//       alert("Visit deleted successfully!");
//     } catch (err) {
//       alert(
//         err.response?.data?.message ||
//           "Failed to delete visit. Only admins can delete visits."
//       );
//     } finally {
//       setDeleting(false);
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
//       });
//     } catch (e) {
//       return "Invalid date";
//     }
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString("en-US", {
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

//   const normalizeResult = (result) => {
//     if (!result) return "unknown";

//     const lowerResult = result.toLowerCase();

//     if (lowerResult.includes("midicens") || lowerResult === "normal")
//       return "midicens";
//     if (lowerResult.includes("rest in room")) return "rest in room";
//     if (lowerResult.includes("rest in home") || lowerResult.includes("home"))
//       return "rest in home";
//     if (lowerResult.includes("forward") || lowerResult.includes("mobark"))
//       return "forward to mobark";

//     return lowerResult;
//   };

//   // Update your filteredVisits to include new filters
//   // const filteredVisits = visits.filter((visit) => {
//   //   // Filter by result (existing)
//   //   if (resultFilter !== "all visits" && visit.result !== resultFilter) {
//   //     return false;
//   //   }

//   //   // Filter by search term (patient name)
//   //   if (
//   //     searchTerm &&
//   //     !visit.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   //   ) {
//   //     return false;
//   //   }

//   //   // Filter by selected patient
//   //   if (selectedPatient && visit.patient?.name !== selectedPatient) {
//   //     return false;
//   //   }

//   //   // Filter by department
//   //   if (selectedDepartment && visit.patient?.section !== selectedDepartment) {
//   //     return false;
//   //   }

//   //   return true;
//   // });

//   const handlePatientSearch = async (name) => {
//     const nameParts = name
//       .trim()
//       .split(/\s+/)
//       .filter((n) => n.length > 0);

//     if (nameParts.length < 3) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       setSearching(true);

//       const encodedName = encodeURIComponent(name.trim());
//       const response = await api.get(`/patient/search/${encodedName}`);
//       console.log(response);

//       setSearchResults(response.data || []);
//     } catch (err) {
//       setSearchResults([]);

//       if (err.response?.status === 400) {
//         alert("Please enter at least 3 names for accurate search");
//       }
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handlePatientSelect = (patient) => {
//     setNewVisitForm((prevForm) => ({
//       ...prevForm,
//       patientName: patient.name,
//       patientId: patient.id,
//     }));

//     setSearchResults([]);
//   };

//   const handleCreateVisit = async () => {
//     const nameParts = newVisitForm.patientName.trim().split(/\s+/);
//     if (nameParts.length < 3) {
//       setCreateError("Please enter full patient name (at least 3 names)");
//       return;
//     }

//     if (!newVisitForm.patientId) {
//       setCreateError("Please select a patient from the search results");
//       return;
//     }

     
//   if (newVisitForm.result === "midicens") {
//     if (!newVisitForm.medicineName?.trim()) {
//       setCreateError("Please enter medicine name for Midicens");
//       return;
//     }
//     if (!newVisitForm.medicineDosage?.trim()) {
//       setCreateError("Please enter medicine dosage for Midicens");
//       return;
//     }
//   }

//     try {
//       setCreating(true);
//       setCreateError("");

//       const visitData = {
//         patientId: newVisitForm.patientId,
//         reason: newVisitForm.reason,
//         highBloodPressure: newVisitForm.highBloodPressure,
//         lowBloodPressure: newVisitForm.lowBloodPressure,
//         oxygenLevel: newVisitForm.oxygenLevel,
//         temprature: newVisitForm.temprature,
//         heartBeat: newVisitForm.heartBeat,
//         result: newVisitForm.result,
//         note: newVisitForm.note,
//         medicineName: newVisitForm.medicineName,
//         medicineDosage: newVisitForm.medicineDosage,
//       };

//       const response = await api.post("/visit", visitData);

//       setVisits((prev) => [response.data, ...prev]);
//       setShowNewVisitModal(false);
//       resetNewVisitForm();

//       alert("Visit created successfully!");
//       console.log("hhhhhhhh",visitData)
//     } catch (err) {
//       setCreateError(err.response?.data?.message || "Failed to create visit");
//     } finally {
//       setCreating(false);
//     }
//   };

//   const resetNewVisitForm = () => {
//     setNewVisitForm({
//       patientName: "",
//       patientId: "",
//       reason: "",
//       highBloodPressure: "",
//       lowBloodPressure: "",
//       oxygenLevel: "",
//       temprature: "",
//       heartBeat: "",
//       result: "Pending",
//       note: "",
//       medicineName: "",
//       medicineDosage: "",
//     });
//     setSearchResults([]);
//     setCreateError("");
//   };

//   const handleNewVisitInputChange = (e) => {
//     const { name, value } = e.target;
//      if (name === "result" && value !== "midicens") {
//     setNewVisitForm((prev) => ({
//       ...prev,
//       [name]: value,
//       medicineName: "",
//       medicineDosage: "",
//     }));
//   } else {
//     setNewVisitForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
//     if (name === "patientName") {
//       setNewVisitForm((prev) => ({
//         ...prev,
//         patientId: "",
//       }));
//       setSearchResults([]);
//     }

//     if (name === "patientName") {
//       if (searchTimeout) {
//         clearTimeout(searchTimeout);
//       }

//       const timeout = setTimeout(() => {
//         const nameParts = value.trim().split(/\s+/);
//         if (nameParts.length >= 3) {
//           handlePatientSearch(value);
//         }
//       }, 300);

//       setSearchTimeout(timeout);
//     }
//   };

//   const handleViewDetails = (visit) => {
//     setSelectedVisit(visit);
//     setShowDetailsModal(true);
//     setIsEditing(false);
//     setSaveError(null);
//   };

//   const handleCloseModal = () => {
//     setShowDetailsModal(false);
//     setSelectedVisit(null);
//     setIsEditing(false);
//     setSaveError(null);
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//     setSaveError(null);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setSaveError(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//       if (name === "result" && value !== "midicens") {
//     setEditForm((prev) => ({
//       ...prev,
//       [name]: value,
//       medicineName: "",
//       medicineDosage: "",
//     }));
//   } else {
//     setEditForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
//   };

//   const handleSaveEdit = async () => {
//     if (!selectedVisit) return;

//     try {
//       setSaving(true);
//       setSaveError(null);
//        // Prepare the data to send
//     const updateData = {
//       ...editForm,
//       // If result is not midicens, ensure medicine fields are cleared
//       medicineName: editForm.result === "midicens" ? editForm.medicineName : "",
//       medicineDosage: editForm.result === "midicens" ? editForm.medicineDosage : "",
//     };

//       const response = await api.patch(`/visit/${selectedVisit.id}`, editForm);

//       setVisits((prev) =>
//         prev.map((visit) =>
//           visit.id === selectedVisit.id ? response.data : visit
//         )
//       );

//       setSelectedVisit(response.data);
//       setIsEditing(false);

//       alert("Visit updated successfully!");
//     } catch (err) {
//       setSaveError(
//         err.response?.data?.message ||
//           "Failed to update visit. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (isLoading && visits.length === 0) {
//     return (
//       <div className='visits-page'>
//         <div className='page-header'>
//           <div className='header-left'>
//             <h1 className='page-title'>Visits</h1>
//             <p className='page-subtitle'>Manage and track patient visits</p>
//           </div>
//           {/* <div className='user-info-badge'>
//             <span className='user-role'>{userRole}</span>
//           </div> */}
//         </div>
//         <div className='loading-state'>
//           <div className='loading-spinner'></div>
//           <p>Loading visits...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && visits.length === 0) {
//     return (
//       <div className='visits-page'>
//         <div className='page-header'>
//           <div className='header-left'>
//             <h1 className='page-title'>Visits</h1>
//             <p className='page-subtitle'>Manage and track patient visits</p>
//           </div>
//           {/* <div className='user-info-badge'>
//             <span className='user-role'>{userRole}</span>
//           </div> */}
//         </div>
//         <div className='error-state'>
//           <p>{error}</p>
//           <button onClick={fetchVisits} className='btn btn-secondary'>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='visits-page'>
//       <div className='page-header'>
//         <div className='header-left'>
//           <h1 className='page-title'>Visits</h1>
//           <p className='page-subtitle'>Manage and track patient visits</p>
//         </div>
//         <div className='header-actions'>
//           <button
//             className='btn btn-primary'
//             onClick={() => setShowNewVisitModal(true)}
//           >
//             + New Visit
//           </button>
//           {/* <div className='user-info-badge'>
//             <span className='user-role'>{userRole}</span>
//           </div> */}
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className='filters-section'>
//         <div className='filters-header'>
//           <h3>Filters</h3>
//           <button
//             className='btn btn-link btn-clear-filters'
//             onClick={() => {
//               setSearchTerm("");
//               setSelectedPatient("");
//               setSelectedDepartment("");
//               setResultFilter("all visits");
//               setCurrentPage(1);
//             }}
//             disabled={
//               !searchTerm &&
//               !selectedPatient &&
//               !selectedDepartment &&
//               resultFilter === "all visits"
//             }
//           >
//             Clear All
//           </button>
//         </div>

//         <div className='filters-grid'>
//           {/* Search by patient name */}
//           <div className='filter-group'>
//             <label htmlFor='search-patient'>Search Patient</label>
//             <input
//               type='text'
//               id='search-patient'
//               placeholder='Type patient name...'
//               value={searchTerm}
//               onChange={handleSearchChange} // Updated handler
//               className='filter-input'
//             />
//           </div>

//           {/* Filter by specific patient - UNCOMMENT THIS
//           <div className='filter-group'>
//             <label htmlFor='filter-patient'>Patient</label>
//             <select
//               id='filter-patient'
//               value={selectedPatient}
//               onChange={handlePatientChange} // Updated handler
//               className='filter-select'
//             >
//               <option value=''>All Patients</option>
//               {uniquePatients.map((patient) => (
//                 <option key={patient} value={patient}>
//                   {patient.length > 25
//                     ? `${patient.substring(0, 25)}...`
//                     : patient}
//                 </option>
//               ))}
//             </select>
//           </div> */}

//           {/* Filter by department - Use predefinedDepartments */}
//           <div className='filter-group'>
//             <label htmlFor='filter-department'>Department</label>
//             <select
//               id='filter-department'
//               value={selectedDepartment}
//               onChange={handleDepartmentChange} // Updated handler
//               className='filter-select'
//             >
//               <option value=''>All Departments</option>
//               {predefinedDepartments.map((dept) => (
//                 <option key={dept} value={dept}>
//                   {dept.length > 25 ? `${dept.substring(0, 25)}...` : dept}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Filter by result */}
//           <div className='filter-group'>
//             <label htmlFor='result-filter'>Visit Result</label>
//             <select
//               id='result-filter'
//               className='filter-select'
//               value={resultFilter}
//               onChange={handleResultFilterChange} // Updated handler
//             >
//               {filterOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Results count - UNCOMMENT AND UPDATE */}
//         {/* <div className='filter-results'>
//         <span className='results-count'>
//         Showing {visits.length} of {totalItems} visits 
//         </span>
//         {(searchTerm || selectedPatient || selectedDepartment || resultFilter !== "all visits") && (
//           <span className='active-filters'>
//         Active filters: 
//         {searchTerm && ` Search: "${searchTerm}"`}
//         {selectedPatient && ` Patient: ${selectedPatient}`}
//         {selectedDepartment && ` Department: ${selectedDepartment}`}
//         {resultFilter !== "all visits" && ` Result: ${filterOptions.find(o => o.value === resultFilter)?.label}`}
//           </span>
//          )}
//        </div> */}
//       </div>

//       <div className='visits-list'>
//         {visits.length > 0 ? (
//           visits.map((visit) => {
//             const resultClass =
//               visit.result === "Normal" ||
//               visit.result?.toLowerCase().includes("midicens")
//                 ? "result-normal"
//                 : "result-not-normal";

//             return (
//               <div key={visit.id} className='visit-item-card'>
//                 <div className='visit-header'>
//                   <div className='visit-patient'>
//                     <h3 className='patient-name'>
//                       {visit.patient?.name || "Unknown Patient"}
//                     </h3>
//                     <div className='patient-meta'>
//                       <span className='department'>
//                         {visit.patient?.section || "N/A"}
//                       </span>
//                       {visit.patient?.MedicalConditions && (
//                         <span className='condition-badge'>
//                           {visit.patient.MedicalConditions}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className={`result-badge ${resultClass}`}>
//                     {visit.result || "Pending"}

//                     {visit.result &&
//                       visit.result.toLowerCase() === "forward to mobark" && (
//                         <div>
//                           <ReferralButton
//                             visit={visit}
//                             patient={visit.patient}
//                           />
//                         </div>
//                       )}
//                     {visit.result &&
//                       visit.result.toLowerCase() === "forward to hospital" && (
//                         <div>
//                           <ReferralButtonHospital
//                             visit={visit}
//                             patient={visit.patient}
//                           />
//                         </div>
//                       )}
//                   </div>
//                 </div>

//                 <div className='visit-summary'>
//                   <div className='summary-item'>
//                     <span className='summary-label'>Date & Time:</span>
//                     <span className='summary-value'>
//                       {formatDateTime(visit.createdAt)}
//                     </span>
//                   </div>
//                   <div className='summary-item'>
//                     <span className='summary-label'>Reason:</span>
//                     <span className='summary-value'>
//                       {visit.reason || "N/A"}
//                     </span>
//                   </div>
//                   <div className='summary-item'>
//                     <span className='summary-label'>Patient ID:</span>
//                     <span className='summary-value patient-id'>
//                       {visit.patientId?.substring(0, 8)}...
//                     </span>
//                   </div>
//                 </div>

//                 <div className='visit-actions'>
//                   {isAdmin && (
//                     <button
//                       className='btn btn-danger btn-icon-danger'
//                       onClick={() => handleDeleteVisit(visit.id)}
//                       disabled={deleting}
//                       title='Delete Visit'
//                     >
//                       <span className='delete-icon'>🗑️</span>
//                       <span className='delete-text'>Delete</span>
//                     </button>
//                   )}
//                   <button
//                     className='btn btn-primary'
//                     onClick={() => handleViewDetails(visit)}
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className='no-visits'>
//             <p>
//               No visits found{" "}
//               {searchTerm ||
//               selectedPatient ||
//               selectedDepartment ||
//               resultFilter !== "all visits"
//                 ? `with the selected filters`
//                 : ""}
//             </p>
//             {(searchTerm ||
//               selectedPatient ||
//               selectedDepartment ||
//               resultFilter !== "all visits") && (
//               <button
//                 className='btn btn-secondary'
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedPatient("");
//                   setSelectedDepartment("");
//                   setResultFilter("all visits");
//                   setCurrentPage(1);
//                 }}
//               >
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//         )}
//         {/* Add this before the closing </div> */}
//         {totalPages > 1 && (
//           <div className='pagination'>
//             <button
//               className='pagination-btn'
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1 || isLoading}
//             >
//               ← Previous
//             </button>

//             <div className='pagination-info'>
//               <span className='page-info'>
//                 Page {currentPage} of {totalPages}
//               </span>
//               <span className='items-info'>
//                 Showing{" "}
//                 {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
//                 {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
//                 {totalItems} visits
//               </span>
//             </div>

//             <div className='page-numbers'>
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }

//                 return (
//                   <button
//                     key={pageNum}
//                     className={`page-number ${
//                       currentPage === pageNum ? "active" : ""
//                     }`}
//                     onClick={() => setCurrentPage(pageNum)}
//                     disabled={isLoading}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}

//               {totalPages > 5 && currentPage < totalPages - 2 && (
//                 <>
//                   <span className='page-dots'>...</span>
//                   <button
//                     className='page-number'
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={isLoading}
//                   >
//                     {totalPages}
//                   </button>
//                 </>
//               )}
//             </div>

//             <button
//               className='pagination-btn'
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages || isLoading}
//             >
//               Next →
//             </button>
//           </div>
//         )}
//       </div>

//       {/* DETAILS/EDIT MODAL */}
//       {showDetailsModal && selectedVisit && (
//         <div className='modal-overlay'>
//           <div className='modal-content'>
//             <div className='modal-header'>
//               <h2>{isEditing ? "Edit Visit" : "Visit Details"}</h2>
//               <button className='modal-close' onClick={handleCloseModal}>
//                 ×
//               </button>
//             </div>

//             <div className='modal-body'>
//               {saveError && <div className='error-message'>{saveError}</div>}

//               <div className='details-section'>
//                 <h3>Patient Information</h3>
//                 <div className='details-grid'>
//                   <div className='detail-item'>
//                     <span className='detail-label'>Patient Name:</span>
//                     <span className='detail-value'>
//                       {selectedVisit.patient?.name}
//                     </span>
//                   </div>
//                   <div className='detail-item'>
//                     <span className='detail-label'>Section:</span>
//                     <span className='detail-value'>
//                       {selectedVisit.patient?.section}
//                     </span>
//                   </div>
//                   <div className='detail-item'>
//                     <span className='detail-label'>National ID:</span>
//                     <span className='detail-value'>
//                       {selectedVisit.patient?.nationalId}
//                     </span>
//                   </div>
//                   <div className='detail-item'>
//                     <span className='detail-label'>Blood Type:</span>
//                     <span className='detail-value'>
//                       {selectedVisit.patient?.BloodType || "N/A"}
//                     </span>
//                   </div>
//                   <div className='detail-item'>
//                     <span className='detail-label'>Medical Conditions:</span>
//                     <span className='detail-value'>
//                       {selectedVisit.patient?.MedicalConditions || "None"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className='details-section'>
//                 <h3>Visit Information</h3>
//                 <div className='details-grid'>
//                   <div className='detail-item'>
//                     <span className='detail-label'>Visit ID:</span>
//                     <span className='detail-value'>{selectedVisit.id}</span>
//                   </div>
//                   <div className='detail-item'>
//                     <span className='detail-label'>Created:</span>
//                     <span className='detail-value'>
//                       {formatDateTime(selectedVisit.createdAt)}
//                     </span>
//                   </div>
//                   <div className='detail-item'>
//                     <span className='detail-label'>Updated:</span>
//                     <span className='detail-value'>
//                       {formatDateTime(selectedVisit.updatedAt)}
//                     </span>
//                   </div>

//                   {isEditing ? (
//                     <>
//                       <div className='detail-item'>
//                         <label className='detail-label'>Reason:</label>
//                         <input
//                           type='text'
//                           name='reason'
//                           value={editForm.reason}
//                           onChange={handleInputChange}
//                           className='edit-input'
//                           placeholder='Enter visit reason'
//                         />
//                       </div>
//                       <div className='detail-item'>
//                         <label className='detail-label'>Result:</label>
//                         <select
//                           name='result'
//                           value={editForm.result}
//                           onChange={handleInputChange}
//                           className='edit-select'
//                         >
//                           <option value='No Action'>No Action</option>
//                           <option value='midicens'>Midicens</option>
//                           <option value='rest in room'>Rest in Room</option>
//                           <option value='rest in home'>Rest in Home</option>
//                           <option value='forward to mobark'>
//                             Forward to Mobark
//                           </option>
//                             <option value='forward to hospital'>
//                         forward to hospital
//                       </option>
//                          <option value='exemption'>exemption</option>
//                         </select>
//                       </div>
//                       {editForm.result === "midicens" && (
//       <>
//         <div className='detail-item'>
//           <label className='detail-label'>Medicine Name:</label>
//           <input
//             type='text'
//             name='medicineName'
//             value={editForm.medicineName}
//             onChange={handleInputChange}
//             className='edit-input'
//             placeholder='Enter medicine name'
//           />
//         </div>
//         <div className='detail-item'>
//           <label className='detail-label'>Medicine Dosage:</label>
//           <input
//             type='text'
//             name='medicineDosage'
//             value={editForm.medicineDosage}
//             onChange={handleInputChange}
//             className='edit-input'
//             placeholder='e.g., 500mg twice daily'
//           />
//         </div>
//       </>
//     )}
//                     </>
//                   ) : (
//                     <>
//                       <div className='detail-item'>
//                         <span className='detail-label'>Reason:</span>
//                         <span className='detail-value'>
//                           {selectedVisit.reason}
//                         </span>
//                       </div>
//                       <div className='detail-item'>
//                         <span className='detail-label'>Result:</span>
//                         <span
//                           className={`detail-value ${
//                             selectedVisit.result === "Normal" ||
//                             selectedVisit.result
//                               ?.toLowerCase()
//                               .includes("midicens")
//                               ? "result-normal"
//                               : "result-not-normal"
//                           }`}
//                         >
//                           {selectedVisit.result || "Pending"}
//                         </span>
//                       </div>
//                       {selectedVisit.result?.toLowerCase() === "midicens" && (
//       <>
       
//               <div className='detail-item'>
//                 <span className='detail-label'>Medicine:</span>
//                 <span className='detail-value'>
//                   {selectedVisit.medicineName || "Not specified"}
//                 </span>
//               </div>
//               <div className='detail-item'>
//                 <span className='detail-label'>Dosage:</span>
//                 <span className='detail-value'>
//                   {selectedVisit.medicineDosage || "Not specified"}
//                 </span>
//               </div>
//             </>
       
       
      
//     )}
  
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div className='details-section'>
//                 <h3>Vital Signs {isEditing && "(Editable)"}</h3>
//                 {isEditing ? (
//                   <div className='edit-vitals-grid'>
//                     <div className='edit-vital-item'>
//                       <label className='edit-vital-label'>High BP:</label>
//                       <input
//                         type='text'
//                         name='highBloodPressure'
//                         value={editForm.highBloodPressure}
//                         onChange={handleInputChange}
//                         className='edit-input small'
//                         placeholder='e.g., 130'
//                       />
//                       <span className='edit-vital-unit'>mmHg</span>
//                     </div>
//                     <div className='edit-vital-item'>
//                       <label className='edit-vital-label'>Low BP:</label>
//                       <input
//                         type='text'
//                         name='lowBloodPressure'
//                         value={editForm.lowBloodPressure}
//                         onChange={handleInputChange}
//                         className='edit-input small'
//                         placeholder='e.g., 85'
//                       />
//                       <span className='edit-vital-unit'>mmHg</span>
//                     </div>
//                     <div className='edit-vital-item'>
//                       <label className='edit-vital-label'>Oxygen:</label>
//                       <input
//                         type='text'
//                         name='oxygenLevel'
//                         value={editForm.oxygenLevel}
//                         onChange={handleInputChange}
//                         className='edit-input small'
//                         placeholder='e.g., 98%'
//                       />
//                       <span className='edit-vital-unit'>SpO₂</span>
//                     </div>
//                     <div className='edit-vital-item'>
//                       <label className='edit-vital-label'>Temp:</label>
//                       <input
//                         type='text'
//                         name='temprature'
//                         value={editForm.temprature}
//                         onChange={handleInputChange}
//                         className='edit-input small'
//                         placeholder='e.g., 37.1'
//                       />
//                       <span className='edit-vital-unit'>°C</span>
//                     </div>
//                     <div className='edit-vital-item'>
//                       <label className='edit-vital-label'>Heart Rate:</label>
//                       <input
//                         type='text'
//                         name='heartBeat'
//                         value={editForm.heartBeat}
//                         onChange={handleInputChange}
//                         className='edit-input small'
//                         placeholder='e.g., 75'
//                       />
//                       <span className='edit-vital-unit'>BPM</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className='vitals-grid'>
//                     <div className='vital-card'>
//                       <span className='vital-label'>Blood Pressure</span>
//                       <span className='vital-value'>
//                         {selectedVisit.highBloodPressure}/
//                         {selectedVisit.lowBloodPressure}
//                       </span>
//                       <span className='vital-unit'>mmHg</span>
//                     </div>
//                     <div className='vital-card'>
//                       <span className='vital-label'>Oxygen Level</span>
//                       <span className='vital-value'>
//                         {selectedVisit.oxygenLevel}
//                       </span>
//                       <span className='vital-unit'>SpO₂</span>
//                     </div>
//                     <div className='vital-card'>
//                       <span className='vital-label'>Temperature</span>
//                       <span className='vital-value'>
//                         {selectedVisit.temprature}
//                       </span>
//                       <span className='vital-unit'>°C</span>
//                     </div>
//                     <div className='vital-card'>
//                       <span className='vital-label'>Heart Rate</span>
//                       <span className='vital-value'>
//                         {selectedVisit.heartBeat}
//                       </span>
//                       <span className='vital-unit'>BPM</span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className='details-section'>
//                 <h3>Doctor's Notes {isEditing && "(Editable)"}</h3>
//                 {isEditing ? (
//                   <textarea
//                     name='note'
//                     value={editForm.note}
//                     onChange={handleInputChange}
//                     className='edit-notes'
//                     placeholder="Enter doctor's notes here..."
//                     rows='4'
//                   />
//                 ) : (
//                   <div className='notes-content'>
//                     {selectedVisit.note || "No notes recorded"}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className='modal-footer'>
//               {isEditing ? (
//                 <>
//                   <button
//                     className='btn btn-secondary'
//                     onClick={handleCancelEdit}
//                     disabled={saving}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className='btn btn-primary'
//                     onClick={handleSaveEdit}
//                     disabled={saving}
//                   >
//                     {saving ? "Saving..." : "Save Changes"}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     className='btn btn-secondary'
//                     onClick={handleCloseModal}
//                   >
//                     Close
//                   </button>
//                   {isAdmin && (
//                     <>
//                       <button
//                         className='btn btn-primary'
//                         onClick={handleEditClick}
//                       >
//                         Edit Visit
//                       </button>
//                       <button
//                         className='btn btn-danger'
//                         onClick={() => handleDeleteVisit(selectedVisit.id)}
//                         disabled={deleting}
//                       >
//                         {deleting ? "Deleting..." : "Delete Visit"}
//                       </button>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* New Visit Modal */}
//       {showNewVisitModal && (
//         <div className='modal-overlay'>
//           <div className='modal-content'>
//             <div className='modal-header'>
//               <h2>Create New Visit</h2>
//               <button
//                 className='modal-close'
//                 onClick={() => {
//                   setShowNewVisitModal(false);
//                   resetNewVisitForm();
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <div className='modal-body'>
//               {createError && (
//                 <div className='error-message'>{createError}</div>
//               )}

//               <div className='new-visit-form'>
//                 {/* Patient Search */}
//                 <div className='form-group'>
//                   <label htmlFor='patientName'>
//                     Patient Name (Full Name){" "}
//                     <span className='required-indicator'>*</span>
//                   </label>
//                   <input
//                     type='text'
//                     id='patientName'
//                     name='patientName'
//                     value={newVisitForm.patientName}
//                     onChange={handleNewVisitInputChange}
//                     placeholder='Enter at least 3 names (e.g., shady ahmed mohamed)'
//                     required
//                   />

//                   {searching && (
//                     <div className='search-loading'>Searching patients...</div>
//                   )}

//                   {searchResults.length > 0 && !searching && (
//                     <div className='search-results'>
//                       {searchResults.map((patient) => (
//                         <div
//                           key={patient.id}
//                           className='search-result-item'
//                           onClick={() => handlePatientSelect(patient)}
//                         >
//                           <div className='patient-name'>{patient.name}</div>
//                           <div className='patient-details'>
//                             Section: {patient.section} | ID:{" "}
//                             {patient.nationalId}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* {!searching && 
//                     newVisitForm.patientName && 
//                     newVisitForm.patientName.trim().split(/\s+/).length >= 3 && 
//                     searchResults.length === 0 && (
//                     <div className="no-search-results">
//                       No patients found. Please check the name or create a new patient.
//                     </div>
//                   )} */}

//                   {newVisitForm.patientName &&
//                     newVisitForm.patientName.trim().split(/\s+/).length < 3 && (
//                       <div className='name-requirements'>
//                         Please enter at least 3 names for accurate search
//                       </div>
//                     )}
//                 </div>

//                 {/* Selected Patient Info */}
//                 {newVisitForm.patientId && (
//                   <div className='selected-patient-info'>
//                     <strong>Selected Patient:</strong>{" "}
//                     {newVisitForm.patientName}
//                   </div>
//                 )}

//                 {/* Visit Details */}
//                 <div className='form-row'>
//                   <div className='form-group'>
//                     <label htmlFor='reason'>Reason</label>
//                     <input
//                       type='text'
//                       id='reason'
//                       name='reason'
//                       value={newVisitForm.reason}
//                       onChange={handleNewVisitInputChange}
//                       placeholder='e.g., Routine checkup'
//                     />
//                   </div>
//                   <div className='form-group'>
//                     <label htmlFor='result'>Result</label>
//                     <select
//                       id='result'
//                       name='result'
//                       value={newVisitForm.result}
//                       onChange={handleNewVisitInputChange}
//                     >
//                       <option value='No Action'>No Action</option>
//                       <option value='midicens'>Midicens</option>
//                       <option value='rest in room'>Rest in Room</option>
//                       <option value='rest in home'>Rest in Home</option>
//                       <option value='forward to hospital'>
//                         forward to hospital
//                       </option>
//                       <option value='forward to mobark'>
//                         Forward to Mobark
//                       </option>
//                       <option value='exemption'>exemption</option>
//                     </select>
//                   </div>
//                 </div>
//                 {newVisitForm.result === "midicens" && (
//   <>
//     <h3 className='section-title'>Medicine Details</h3>
//     <div className='form-row'>
//       <div className='form-group'>
//         <label htmlFor='medicineName'>
//           Medicine Name <span className='required-indicator'>*</span>
//         </label>
//         <input
//           type='text'
//           id='medicineName'
//           name='medicineName'
//           value={newVisitForm.medicineName}
//           onChange={handleNewVisitInputChange}
//           placeholder='e.g., Paracetamol, Amoxicillin'
//           required
//         />
//       </div>
//       <div className='form-group'>
//         <label htmlFor='medicineDosage'>
//           Dosage (per day) <span className='required-indicator'>*</span>
//         </label>
//         <input
//           type='text'
//           id='medicineDosage'
//           name='medicineDosage'
//           value={newVisitForm.medicineDosage}
//           onChange={handleNewVisitInputChange}
//           placeholder='e.g., 500mg twice daily'
//           required
//         />
//       </div>
//     </div>
//   </>
// )}

//                 {/* Vital Signs */}
//                 <h3 className='section-title'>Vital Signs</h3>
//                 <div className='form-row'>
//                   <div className='form-group'>
//                     <label htmlFor='highBloodPressure'>High BP</label>
//                     <input
//                       type='text'
//                       id='highBloodPressure'
//                       name='highBloodPressure'
//                       value={newVisitForm.highBloodPressure}
//                       onChange={handleNewVisitInputChange}
//                       placeholder='e.g., 130'
//                     />
//                   </div>
//                   <div className='form-group'>
//                     <label htmlFor='lowBloodPressure'>Low BP</label>
//                     <input
//                       type='text'
//                       id='lowBloodPressure'
//                       name='lowBloodPressure'
//                       value={newVisitForm.lowBloodPressure}
//                       onChange={handleNewVisitInputChange}
//                       placeholder='e.g., 85'
//                     />
//                   </div>
//                   <div className='form-group'>
//                     <label htmlFor='oxygenLevel'>Oxygen Level</label>
//                     <input
//                       type='text'
//                       id='oxygenLevel'
//                       name='oxygenLevel'
//                       value={newVisitForm.oxygenLevel}
//                       onChange={handleNewVisitInputChange}
//                       placeholder='e.g., 98%'
//                     />
//                   </div>
//                 </div>

//                 <div className='form-row'>
//                   <div className='form-group'>
//                     <label htmlFor='temprature'>Temperature</label>
//                     <input
//                       type='text'
//                       id='temprature'
//                       name='temprature'
//                       value={newVisitForm.temprature}
//                       onChange={handleNewVisitInputChange}
//                       placeholder='e.g., 37.1'
//                     />
//                   </div>
//                   <div className='form-group'>
//                     <label htmlFor='heartBeat'>Heart Rate</label>
//                     <input
//                       type='text'
//                       id='heartBeat'
//                       name='heartBeat'
//                       value={newVisitForm.heartBeat}
//                       onChange={handleNewVisitInputChange}
//                       placeholder='e.g., 75'
//                     />
//                   </div>
//                 </div>

//                 {/* Notes */}
//                 <div className='form-group'>
//                   <label htmlFor='note'>Doctor's Notes</label>
//                   <textarea
//                     id='note'
//                     name='note'
//                     value={newVisitForm.note}
//                     onChange={handleNewVisitInputChange}
//                     placeholder='Enter notes...'
//                     rows='3'
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className='modal-footer'>
//               <button
//                 className='btn btn-secondary'
//                 onClick={() => {
//                   setShowNewVisitModal(false);
//                   resetNewVisitForm();
//                 }}
//                 disabled={creating}
//               >
//                 Cancel
//               </button>
//               <button
//                 className='btn btn-primary'
//                 onClick={handleCreateVisit}
//                 disabled={creating || !newVisitForm.patientId}
//               >
//                 {creating ? "Creating..." : "Create Visit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Visits;

import { useEffect, useState } from "react";
import api from "../services/api";
import ReferralButton from "../components/ReferralPDFButton";
import "./Visits.css";
import ReferralButtonHospital from "../components/ReferralPrintHospital";
import { t } from "../locales";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [resultFilter, setResultFilter] = useState("all visits");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);
  const [newVisitForm, setNewVisitForm] = useState({
    patientName: "",
    patientId: "",
    reason: "",
    highBloodPressure: "",
    lowBloodPressure: "",
    oxygenLevel: "",
    temprature: "",
    heartBeat: "",
    result: "Pending",
    note: "",
     medicineName: "",
  medicineDosage: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  // Add these state variables near your existing state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [uniquePatients, setUniquePatients] = useState([]);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);

  const filterOptions = [
    { value: "no action", label: t("visits.noAction") },
    { value: "all visits", label: t("visits.allVisits") },
    { value: "midicens", label: t("visits.midicens") },
    { value: "rest in room", label: t("visits.restInRoom") },
    { value: "rest in home", label: t("visits.restInHome") },
    { value: "forward to mobark", label: t("visits.forwardToMobark") },
    { value: "forward to hospital", label: t("visits.forwardToHospital") },
    { value: "exemption", label: t("visits.exemption") },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const userRole = localStorage.getItem("user_role") || "Medical Staff";
  const isAdmin = userRole === "ADMIN" || userRole === "admin";
  // Add this near your other constants
  const predefinedDepartments = [
    "السرية الأولي",
    "السرية الثانية",
    "السرية الثالثة",
    "السرية الرابعة",
    "السرية الخامسة",
    "السرية السادسة",
    "السرية السابعة",
    "السرية الثامنة",
    "السرية التاسعة",
    "السرية العاشرة",
    "السرية الحادية عشر",
    "السرية الثانية عشر",
    "المديرية",
    "قسم مطروح",
    "قسم براني",
    "قسم السلوم",
    "قسم النجيلة",
    "فرقة السلوم",
    "المرور",
    "قسم الحمام",
    "فرع البحث بالسلوم",
    "حماية مدنية",
    "قسم سيوة",
    "قسم الضبعة",
    "ادارة الطاقة",
    "قسم مارينا",
    "قسم المرافق",
    "قطاع العلمين",
    "فرع ب الحمام",
    "تامين الطرق",
    "المركبات",
    "امن وطني",
    "قسم المخازن",
    "النجدة",
    "الترحيلات",
    "إدارة البحث",
    "الامن العام",
    "إدارة التدريب",
    "قسم العلمين",
    "فرقة الحمام",
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVisits();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    currentPage,
    resultFilter,
    searchTerm,
    selectedPatient,
    selectedDepartment,
  ]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    if (selectedVisit && isEditing) {
      setEditForm({
        reason: selectedVisit.reason || "",
        highBloodPressure: selectedVisit.highBloodPressure || "",
        lowBloodPressure: selectedVisit.lowBloodPressure || "",
        oxygenLevel: selectedVisit.oxygenLevel || "",
        temprature: selectedVisit.temprature || "",
        heartBeat: selectedVisit.heartBeat || "",
        result: selectedVisit.result || "Pending",
        note: selectedVisit.note || "",
         medicineName: selectedVisit.medicineName || "",
      medicineDosage: selectedVisit.medicineDosage || "",
      });
    }
  }, [selectedVisit, isEditing]);

  // Add this useEffect to extract unique values
  useEffect(() => {
    if (visits.length > 0) {
      // Extract unique patient names
      const patients = [
        ...new Set(visits.map((v) => v.patient?.name).filter(Boolean)),
      ].sort();
      setUniquePatients(patients);

      // Extract unique departments/sections
      const departments = [
        ...new Set(visits.map((v) => v.patient?.section).filter(Boolean)),
      ].sort();
      setUniqueDepartments(departments);
    }
  }, [visits]);

  // Replace your existing fetchVisits function with this:
  const fetchVisits = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // Add filters only if they have values
      if (resultFilter !== "all visits") params.append("result", resultFilter);
      if (searchTerm) params.append("patientName", searchTerm);
      if (selectedPatient) params.append("patient", selectedPatient);
      if (selectedDepartment) params.append("department", selectedDepartment);

      const response = await api.get(`/visit?${params.toString()}`);

      if (response.data && response.data.data) {
        setVisits(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
        setCurrentPage(response.data.pagination?.currentPage || 1);

        // Extract unique patients and departments for filters
        const patients = [
          ...new Set(
            response.data.data.map((v) => v.patient?.name).filter(Boolean)
          ),
        ].sort();
        setUniquePatients(patients);

        const departments = [
          ...new Set(
            response.data.data.map((v) => v.patient?.section).filter(Boolean)
          ),
        ].sort();
        setUniqueDepartments(departments);
      } else {
        setVisits([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching visits:", err);
      setError(
        err.response?.data?.message ||
          t("visits.error")
      );
      setVisits([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Add these handler functions:
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePatientChange = (e) => {
    setSelectedPatient(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  const handleResultFilterChange = (e) => {
    setResultFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteVisit = async (visitId) => {
    if (
      !window.confirm(
        t("visits.deleteConfirm")
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/visit/${visitId}`);

      setVisits((prev) => prev.filter((visit) => visit.id !== visitId));

      if (selectedVisit && selectedVisit.id === visitId) {
        handleCloseModal();
      }

      alert(t("visits.visitDeleted"));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          t("visits.deleteError")
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const normalizeResult = (result) => {
    if (!result) return "unknown";

    const lowerResult = result.toLowerCase();

    if (lowerResult.includes("midicens") || lowerResult === "normal")
      return "midicens";
    if (lowerResult.includes("rest in room")) return "rest in room";
    if (lowerResult.includes("rest in home") || lowerResult.includes("home"))
      return "rest in home";
    if (lowerResult.includes("forward") || lowerResult.includes("mobark"))
      return "forward to mobark";

    return lowerResult;
  };

  const handlePatientSearch = async (name) => {
    const nameParts = name
      .trim()
      .split(/\s+/)
      .filter((n) => n.length > 0);

    if (nameParts.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);

      const encodedName = encodeURIComponent(name.trim());
      const response = await api.get(`/patient/search/${encodedName}`);
      console.log(response);

      setSearchResults(response.data || []);
    } catch (err) {
      setSearchResults([]);

      if (err.response?.status === 400) {
        alert(t("visits.nameRequirements"));
      }
    } finally {
      setSearching(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setNewVisitForm((prevForm) => ({
      ...prevForm,
      patientName: patient.name,
      patientId: patient.id,
    }));

    setSearchResults([]);
  };

  const handleCreateVisit = async () => {
    const nameParts = newVisitForm.patientName.trim().split(/\s+/);
    if (nameParts.length < 3) {
      setCreateError(t("visits.enterFullName"));
      return;
    }

    if (!newVisitForm.patientId) {
      setCreateError(t("visits.selectPatient"));
      return;
    }

     
  if (newVisitForm.result === "midicens") {
    if (!newVisitForm.medicineName?.trim()) {
      setCreateError(t("visits.enterMedicineName"));
      return;
    }
    if (!newVisitForm.medicineDosage?.trim()) {
      setCreateError(t("visits.enterMedicineDosage"));
      return;
    }
  }

    try {
      setCreating(true);
      setCreateError("");

      const visitData = {
        patientId: newVisitForm.patientId,
        reason: newVisitForm.reason,
        highBloodPressure: newVisitForm.highBloodPressure,
        lowBloodPressure: newVisitForm.lowBloodPressure,
        oxygenLevel: newVisitForm.oxygenLevel,
        temprature: newVisitForm.temprature,
        heartBeat: newVisitForm.heartBeat,
        result: newVisitForm.result,
        note: newVisitForm.note,
        medicineName: newVisitForm.medicineName,
        medicineDosage: newVisitForm.medicineDosage,
      };

      const response = await api.post("/visit", visitData);

      setVisits((prev) => [response.data, ...prev]);
      setShowNewVisitModal(false);
      resetNewVisitForm();

      alert(t("visits.visitCreated"));
      console.log("hhhhhhhh",visitData)
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create visit");
    } finally {
      setCreating(false);
    }
  };

  const resetNewVisitForm = () => {
    setNewVisitForm({
      patientName: "",
      patientId: "",
      reason: "",
      highBloodPressure: "",
      lowBloodPressure: "",
      oxygenLevel: "",
      temprature: "",
      heartBeat: "",
      result: "Pending",
      note: "",
      medicineName: "",
      medicineDosage: "",
    });
    setSearchResults([]);
    setCreateError("");
  };

  const handleNewVisitInputChange = (e) => {
    const { name, value } = e.target;
     if (name === "result" && value !== "midicens") {
    setNewVisitForm((prev) => ({
      ...prev,
      [name]: value,
      medicineName: "",
      medicineDosage: "",
    }));
  } else {
    setNewVisitForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
    if (name === "patientName") {
      setNewVisitForm((prev) => ({
        ...prev,
        patientId: "",
      }));
      setSearchResults([]);
    }

    if (name === "patientName") {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        const nameParts = value.trim().split(/\s+/);
        if (nameParts.length >= 3) {
          handlePatientSearch(value);
        }
      }, 300);

      setSearchTimeout(timeout);
    }
  };

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setShowDetailsModal(true);
    setIsEditing(false);
    setSaveError(null);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedVisit(null);
    setIsEditing(false);
    setSaveError(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      if (name === "result" && value !== "midicens") {
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
      medicineName: "",
      medicineDosage: "",
    }));
  } else {
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  };

  const handleSaveEdit = async () => {
    if (!selectedVisit) return;

    try {
      setSaving(true);
      setSaveError(null);
       // Prepare the data to send
    const updateData = {
      ...editForm,
      // If result is not midicens, ensure medicine fields are cleared
      medicineName: editForm.result === "midicens" ? editForm.medicineName : "",
      medicineDosage: editForm.result === "midicens" ? editForm.medicineDosage : "",
    };

      const response = await api.patch(`/visit/${selectedVisit.id}`, editForm);

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === selectedVisit.id ? response.data : visit
        )
      );

      setSelectedVisit(response.data);
      setIsEditing(false);

      alert(t("visits.visitUpdated"));
    } catch (err) {
      setSaveError(
        err.response?.data?.message ||
          "Failed to update visit. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && visits.length === 0) {
    return (
      <div className='visits-page'>
        <div className='page-header'>
          <div className='header-left'>
            <h1 className='page-title'>{t("visits.pageTitle")}</h1>
            <p className='page-subtitle'>{t("visits.pageSubtitle")}</p>
          </div>
        </div>
        <div className='loading-state'>
          <div className='loading-spinner'></div>
          <p>{t("visits.loading")}</p>
        </div>
      </div>
    );
  }

  if (error && visits.length === 0) {
    return (
      <div className='visits-page'>
        <div className='page-header'>
          <div className='header-left'>
            <h1 className='page-title'>{t("visits.pageTitle")}</h1>
            <p className='page-subtitle'>{t("visits.pageSubtitle")}</p>
          </div>
        </div>
        <div className='error-state'>
          <p>{error}</p>
          <button onClick={fetchVisits} className='btn btn-secondary'>
            {t("visits.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='visits-page'>
      <div className='page-header'>
        <div className='header-left'>
          <h1 className='page-title'>{t("visits.pageTitle")}</h1>
          <p className='page-subtitle'>{t("visits.pageSubtitle")}</p>
        </div>
        <div className='header-actions'>
          <button
            className='btn btn-primary'
            onClick={() => setShowNewVisitModal(true)}
          >
            {t("visits.newVisit")}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className='filters-section'>
        <div className='filters-header'>
          <h3>{t("visits.filters")}</h3>
          <button
            className='btn btn-link btn-clear-filters'
            onClick={() => {
              setSearchTerm("");
              setSelectedPatient("");
              setSelectedDepartment("");
              setResultFilter("all visits");
              setCurrentPage(1);
            }}
            disabled={
              !searchTerm &&
              !selectedPatient &&
              !selectedDepartment &&
              resultFilter === "all visits"
            }
          >
            {t("visits.clearAll")}
          </button>
        </div>

        <div className='filters-grid'>
          {/* Search by patient name */}
          <div className='filter-group'>
            <label htmlFor='search-patient'>{t("visits.searchPatient")}</label>
            <input
              type='text'
              id='search-patient'
              placeholder={t("visits.searchPatientPlaceholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className='filter-input'
            />
          </div>

          {/* Filter by department - Use predefinedDepartments */}
          <div className='filter-group'>
            <label htmlFor='filter-department'>{t("visits.department")}</label>
            <select
              id='filter-department'
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className='filter-select'
            >
              <option value=''>{t("visits.allDepartments")}</option>
              {predefinedDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept.length > 25 ? `${dept.substring(0, 25)}...` : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by result */}
          <div className='filter-group'>
            <label htmlFor='result-filter'>{t("visits.visitResult")}</label>
            <select
              id='result-filter'
              className='filter-select'
              value={resultFilter}
              onChange={handleResultFilterChange}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='visits-list'>
        {visits.length > 0 ? (
          visits.map((visit) => {
            const resultClass =
              visit.result === "Normal" ||
              visit.result?.toLowerCase().includes("midicens")
                ? "result-normal"
                : "result-not-normal";

            return (
              <div key={visit.id} className='visit-item-card'>
                <div className='visit-header'>
                  <div className='visit-patient'>
                    <h3 className='patient-name'>
                      {visit.patient?.name || t("visits.unknownPatient")}
                    </h3>
                    <div className='patient-meta'>
                      <span className='department'>
                        {visit.patient?.section || t("visits.na")}
                      </span>
                      {visit.patient?.MedicalConditions && (
                        <span className='condition-badge'>
                          {visit.patient.MedicalConditions}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`result-badge ${resultClass}`}>
                    {visit.result || t("visits.pending")}

                    {visit.result &&
                      visit.result.toLowerCase() === "forward to mobark" && (
                        <div>
                          <ReferralButton
                            visit={visit}
                            patient={visit.patient}
                          />
                        </div>
                      )}
                    {visit.result &&
                      visit.result.toLowerCase() === "forward to hospital" && (
                        <div>
                          <ReferralButtonHospital
                            visit={visit}
                            patient={visit.patient}
                          />
                        </div>
                      )}
                  </div>
                </div>

                <div className='visit-summary'>
                  <div className='summary-item'>
                    <span className='summary-label'>{t("visits.dateTime")}</span>
                    <span className='summary-value'>
                      {formatDateTime(visit.createdAt)}
                    </span>
                  </div>
                  <div className='summary-item'>
                    <span className='summary-label'>{t("visits.reason")}</span>
                    <span className='summary-value'>
                      {visit.reason || t("visits.na")}
                    </span>
                  </div>
                  <div className='summary-item'>
                    <span className='summary-label'>{t("visits.patientId")}</span>
                    <span className='summary-value patient-id'>
                      {visit.patientId?.substring(0, 8)}...
                    </span>
                  </div>
                </div>

                <div className='visit-actions'>
                  {isAdmin && (
                    <button
                      className='btn btn-danger btn-icon-danger'
                      onClick={() => handleDeleteVisit(visit.id)}
                      disabled={deleting}
                      title={t("visits.deleteVisit")}
                    >
                      <span className='delete-icon'>🗑️</span>
                      <span className='delete-text'>{t("visits.delete")}</span>
                    </button>
                  )}
                  <button
                    className='btn btn-primary'
                    onClick={() => handleViewDetails(visit)}
                  >
                    {t("visits.viewDetails")}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className='no-visits'>
            <p>
              {t("visits.noVisits")}{" "}
              {searchTerm ||
              selectedPatient ||
              selectedDepartment ||
              resultFilter !== "all visits"
                ? t("visits.withSelectedFilters")
                : ""}
            </p>
            {(searchTerm ||
              selectedPatient ||
              selectedDepartment ||
              resultFilter !== "all visits") && (
              <button
                className='btn btn-secondary'
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPatient("");
                  setSelectedDepartment("");
                  setResultFilter("all visits");
                  setCurrentPage(1);
                }}
              >
                {t("visits.clearAllFilters")}
              </button>
            )}
          </div>
        )}
        {/* Add this before the closing </div> */}
        {totalPages > 1 && (
          <div className='pagination'>
            <button
              className='pagination-btn'
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              {t("visits.previous")}
            </button>

            <div className='pagination-info'>
              <span className='page-info'>
                {t("visits.page")} {currentPage} {t("visits.of")} {totalPages}
              </span>
              <span className='items-info'>
                {t("visits.showing")}{" "}
                {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
                {Math.min(currentPage * itemsPerPage, totalItems)} {t("visits.of")}{" "}
                {totalItems} {t("visits.visits")}
              </span>
            </div>

            <div className='page-numbers'>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`page-number ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={isLoading}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className='page-dots'>...</span>
                  <button
                    className='page-number'
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={isLoading}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              className='pagination-btn'
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isLoading}
            >
              {t("visits.next")}
            </button>
          </div>
        )}
      </div>

      {/* DETAILS/EDIT MODAL */}
      {showDetailsModal && selectedVisit && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>{isEditing ? t("visits.editVisit") : t("visits.visitDetails")}</h2>
              <button className='modal-close' onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className='modal-body'>
              {saveError && <div className='error-message'>{saveError}</div>}

              <div className='details-section'>
                <h3>{t("visits.patientInfo")}</h3>
                <div className='details-grid'>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.patientName")}</span>
                    <span className='detail-value'>
                      {selectedVisit.patient?.name}
                    </span>
                  </div>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.section")}</span>
                    <span className='detail-value'>
                      {selectedVisit.patient?.section}
                    </span>
                  </div>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.nationalId")}</span>
                    <span className='detail-value'>
                      {selectedVisit.patient?.nationalId}
                    </span>
                  </div>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.bloodType")}</span>
                    <span className='detail-value'>
                      {selectedVisit.patient?.BloodType || t("visits.na")}
                    </span>
                  </div>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.medicalConditions")}</span>
                    <span className='detail-value'>
                      {selectedVisit.patient?.MedicalConditions || t("visits.none")}
                    </span>
                  </div>
                </div>
              </div>

              <div className='details-section'>
                <h3>{t("visits.visitInfo")}</h3>
                <div className='details-grid'>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.visitId")}</span>
                    <span className='detail-value'>{selectedVisit.id}</span>
                  </div>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.created")}</span>
                    <span className='detail-value'>
                      {formatDateTime(selectedVisit.createdAt)}
                    </span>
                  </div>
                  <div className='detail-item'>
                    <span className='detail-label'>{t("visits.updated")}</span>
                    <span className='detail-value'>
                      {formatDateTime(selectedVisit.updatedAt)}
                    </span>
                  </div>

                  {isEditing ? (
                    <>
                      <div className='detail-item'>
                        <label className='detail-label'>{t("visits.reasonLabel")}</label>
                        <input
                          type='text'
                          name='reason'
                          value={editForm.reason}
                          onChange={handleInputChange}
                          className='edit-input'
                          placeholder={t("visits.reasonPlaceholder")}
                        />
                      </div>
                      <div className='detail-item'>
                        <label className='detail-label'>{t("visits.result")}</label>
                        <select
                          name='result'
                          value={editForm.result}
                          onChange={handleInputChange}
                          className='edit-select'
                        >
                          <option value='No Action'>{t("visits.noAction")}</option>
                          <option value='midicens'>{t("visits.midicens")}</option>
                          <option value='rest in room'>{t("visits.restInRoom")}</option>
                          <option value='rest in home'>{t("visits.restInHome")}</option>
                          <option value='forward to mobark'>
                            {t("visits.forwardToMobark")}
                          </option>
                            <option value='forward to hospital'>
                        {t("visits.forwardToHospital")}
                      </option>
                         <option value='exemption'>{t("visits.exemption")}</option>
                        </select>
                      </div>
                      {editForm.result === "midicens" && (
      <>
        <div className='detail-item'>
          <label className='detail-label'>{t("visits.medicineName")}</label>
          <input
            type='text'
            name='medicineName'
            value={editForm.medicineName}
            onChange={handleInputChange}
            className='edit-input'
            placeholder={t("visits.medicinePlaceholder")}
          />
        </div>
        <div className='detail-item'>
          <label className='detail-label'>{t("visits.medicineDosage")}</label>
          <input
            type='text'
            name='medicineDosage'
            value={editForm.medicineDosage}
            onChange={handleInputChange}
            className='edit-input'
            placeholder={t("visits.dosagePlaceholder")}
          />
        </div>
      </>
    )}
                    </>
                  ) : (
                    <>
                      <div className='detail-item'>
                        <span className='detail-label'>{t("visits.reasonLabel")}</span>
                        <span className='detail-value'>
                          {selectedVisit.reason}
                        </span>
                      </div>
                      <div className='detail-item'>
                        <span className='detail-label'>{t("visits.result")}</span>
                        <span
                          className={`detail-value ${
                            selectedVisit.result === "Normal" ||
                            selectedVisit.result
                              ?.toLowerCase()
                              .includes("midicens")
                              ? "result-normal"
                              : "result-not-normal"
                          }`}
                        >
                          {selectedVisit.result || t("visits.pending")}
                        </span>
                      </div>
                      {selectedVisit.result?.toLowerCase() === "midicens" && (
      <>
       
              <div className='detail-item'>
                <span className='detail-label'>{t("visits.medicineName")}</span>
                <span className='detail-value'>
                  {selectedVisit.medicineName || t("visits.notSpecified")}
                </span>
              </div>
              <div className='detail-item'>
                <span className='detail-label'>{t("visits.medicineDosage")}</span>
                <span className='detail-value'>
                  {selectedVisit.medicineDosage || t("visits.notSpecified")}
                </span>
              </div>
            </>
       
      
    )}
  
                    </>
                  )}
                </div>
              </div>

              <div className='details-section'>
                <h3>{t("visits.vitalSigns")} {isEditing && t("visits.editable")}</h3>
                {isEditing ? (
                  <div className='edit-vitals-grid'>
                    <div className='edit-vital-item'>
                      <label className='edit-vital-label'>{t("visits.highBP")}</label>
                      <input
                        type='text'
                        name='highBloodPressure'
                        value={editForm.highBloodPressure}
                        onChange={handleInputChange}
                        className='edit-input small'
                        placeholder={t("visits.highBPPlaceholder")}
                      />
                      <span className='edit-vital-unit'>{t("visits.mmhg")}</span>
                    </div>
                    <div className='edit-vital-item'>
                      <label className='edit-vital-label'>{t("visits.lowBP")}</label>
                      <input
                        type='text'
                        name='lowBloodPressure'
                        value={editForm.lowBloodPressure}
                        onChange={handleInputChange}
                        className='edit-input small'
                        placeholder={t("visits.lowBPPlaceholder")}
                      />
                      <span className='edit-vital-unit'>{t("visits.mmhg")}</span>
                    </div>
                    <div className='edit-vital-item'>
                      <label className='edit-vital-label'>{t("visits.oxygen")}</label>
                      <input
                        type='text'
                        name='oxygenLevel'
                        value={editForm.oxygenLevel}
                        onChange={handleInputChange}
                        className='edit-input small'
                        placeholder={t("visits.oxygenPlaceholder")}
                      />
                      <span className='edit-vital-unit'>{t("visits.spo2")}</span>
                    </div>
                    <div className='edit-vital-item'>
                      <label className='edit-vital-label'>{t("visits.temp")}</label>
                      <input
                        type='text'
                        name='temprature'
                        value={editForm.temprature}
                        onChange={handleInputChange}
                        className='edit-input small'
                        placeholder={t("visits.tempPlaceholder")}
                      />
                      <span className='edit-vital-unit'>{t("visits.celsius")}</span>
                    </div>
                    <div className='edit-vital-item'>
                      <label className='edit-vital-label'>{t("visits.heartRate")}</label>
                      <input
                        type='text'
                        name='heartBeat'
                        value={editForm.heartBeat}
                        onChange={handleInputChange}
                        className='edit-input small'
                        placeholder={t("visits.heartRatePlaceholder")}
                      />
                      <span className='edit-vital-unit'>{t("visits.bpm")}</span>
                    </div>
                  </div>
                ) : (
                  <div className='vitals-grid'>
                    <div className='vital-card'>
                      <span className='vital-label'>{t("visits.bloodPressure")}</span>
                      <span className='vital-value'>
                        {selectedVisit.highBloodPressure}/
                        {selectedVisit.lowBloodPressure}
                      </span>
                      <span className='vital-unit'>{t("visits.mmhg")}</span>
                    </div>
                    <div className='vital-card'>
                      <span className='vital-label'>{t("visits.oxygenLevel")}</span>
                      <span className='vital-value'>
                        {selectedVisit.oxygenLevel}
                      </span>
                      <span className='vital-unit'>{t("visits.spo2")}</span>
                    </div>
                    <div className='vital-card'>
                      <span className='vital-label'>{t("visits.temperature")}</span>
                      <span className='vital-value'>
                        {selectedVisit.temprature}
                      </span>
                      <span className='vital-unit'>{t("visits.celsius")}</span>
                    </div>
                    <div className='vital-card'>
                      <span className='vital-label'>{t("visits.heartBeat")}</span>
                      <span className='vital-value'>
                        {selectedVisit.heartBeat}
                      </span>
                      <span className='vital-unit'>{t("visits.bpm")}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className='details-section'>
                <h3>{t("visits.doctorsNotes")} {isEditing && t("visits.editable")}</h3>
                {isEditing ? (
                  <textarea
                    name='note'
                    value={editForm.note}
                    onChange={handleInputChange}
                    className='edit-notes'
                    placeholder={t("visits.enterNotes")}
                    rows='4'
                  />
                ) : (
                  <div className='notes-content'>
                    {selectedVisit.note || t("visits.noNotesRecorded")}
                  </div>
                )}
              </div>
            </div>

            <div className='modal-footer'>
              {isEditing ? (
                <>
                  <button
                    className='btn btn-secondary'
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    {t("visits.cancel")}
                  </button>
                  <button
                    className='btn btn-primary'
                    onClick={handleSaveEdit}
                    disabled={saving}
                  >
                    {saving ? t("visits.saving") : t("visits.saveChanges")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className='btn btn-secondary'
                    onClick={handleCloseModal}
                  >
                    {t("visits.close")}
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        className='btn btn-primary'
                        onClick={handleEditClick}
                      >
                        {t("visits.edit")}
                      </button>
                      <button
                        className='btn btn-danger'
                        onClick={() => handleDeleteVisit(selectedVisit.id)}
                        disabled={deleting}
                      >
                        {deleting ? t("visits.deleting") : t("visits.deleteVisit")}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Visit Modal */}
      {showNewVisitModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>{t("visits.createNewVisit")}</h2>
              <button
                className='modal-close'
                onClick={() => {
                  setShowNewVisitModal(false);
                  resetNewVisitForm();
                }}
              >
                ×
              </button>
            </div>

            <div className='modal-body'>
              {createError && (
                <div className='error-message'>{createError}</div>
              )}

              <div className='new-visit-form'>
                {/* Patient Search */}
                <div className='form-group'>
                  <label htmlFor='patientName'>
                    {t("visits.patientNameFull")}{" "}
                    <span className='required-indicator'>{t("common.requiredIndicator")}</span>
                  </label>
                  <input
                    type='text'
                    id='patientName'
                    name='patientName'
                    value={newVisitForm.patientName}
                    onChange={handleNewVisitInputChange}
                    placeholder={t("visits.enterThreeNames")}
                    required
                  />

                  {searching && (
                    <div className='search-loading'>{t("visits.searchingPatients")}</div>
                  )}

                  {searchResults.length > 0 && !searching && (
                    <div className='search-results'>
                      {searchResults.map((patient) => (
                        <div
                          key={patient.id}
                          className='search-result-item'
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className='patient-name'>{patient.name}</div>
                          <div className='patient-details'>
                            {t("visits.section")}: {patient.section} | ID:{" "}
                            {patient.nationalId}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {newVisitForm.patientName &&
                    newVisitForm.patientName.trim().split(/\s+/).length < 3 && (
                      <div className='name-requirements'>
                        {t("visits.nameRequirements")}
                      </div>
                    )}
                </div>

                {/* Selected Patient Info */}
                {newVisitForm.patientId && (
                  <div className='selected-patient-info'>
                    <strong>{t("visits.selectedPatient")}</strong>{" "}
                    {newVisitForm.patientName}
                  </div>
                )}

                {/* Visit Details */}
                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor='reason'>{t("visits.reasonLabel")}</label>
                    <input
                      type='text'
                      id='reason'
                      name='reason'
                      value={newVisitForm.reason}
                      onChange={handleNewVisitInputChange}
                      placeholder={t("visits.reasonPlaceholder")}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='result'>{t("visits.result")}</label>
                    <select
                      id='result'
                      name='result'
                      value={newVisitForm.result}
                      onChange={handleNewVisitInputChange}
                    >
                      <option value='No Action'>{t("visits.noAction")}</option>
                      <option value='midicens'>{t("visits.midicens")}</option>
                      <option value='rest in room'>{t("visits.restInRoom")}</option>
                      <option value='rest in home'>{t("visits.restInHome")}</option>
                      <option value='forward to hospital'>
                        {t("visits.forwardToHospital")}
                      </option>
                      <option value='forward to mobark'>
                        {t("visits.forwardToMobark")}
                      </option>
                      <option value='exemption'>{t("visits.exemption")}</option>
                    </select>
                  </div>
                </div>
                {newVisitForm.result === "midicens" && (
  <>
    <h3 className='section-title'>{t("visits.medicineDetails")}</h3>
    <div className='form-row'>
      <div className='form-group'>
        <label htmlFor='medicineName'>
          {t("visits.medicineNameRequired")} <span className='required-indicator'>{t("common.requiredIndicator")}</span>
        </label>
        <input
          type='text'
          id='medicineName'
          name='medicineName'
          value={newVisitForm.medicineName}
          onChange={handleNewVisitInputChange}
          placeholder={t("visits.medicinePlaceholder")}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='medicineDosage'>
          {t("visits.dosageRequired")} <span className='required-indicator'>{t("common.requiredIndicator")}</span>
        </label>
        <input
          type='text'
          id='medicineDosage'
          name='medicineDosage'
          value={newVisitForm.medicineDosage}
          onChange={handleNewVisitInputChange}
          placeholder={t("visits.dosagePlaceholder")}
          required
        />
      </div>
    </div>
  </>
)}

                {/* Vital Signs */}
                <h3 className='section-title'>{t("visits.vitalSignsTitle")}</h3>
                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor='highBloodPressure'>{t("visits.highBP")}</label>
                    <input
                      type='text'
                      id='highBloodPressure'
                      name='highBloodPressure'
                      value={newVisitForm.highBloodPressure}
                      onChange={handleNewVisitInputChange}
                      placeholder={t("visits.highBPPlaceholder")}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='lowBloodPressure'>{t("visits.lowBP")}</label>
                    <input
                      type='text'
                      id='lowBloodPressure'
                      name='lowBloodPressure'
                      value={newVisitForm.lowBloodPressure}
                      onChange={handleNewVisitInputChange}
                      placeholder={t("visits.lowBPPlaceholder")}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='oxygenLevel'>{t("visits.oxygen")}</label>
                    <input
                      type='text'
                      id='oxygenLevel'
                      name='oxygenLevel'
                      value={newVisitForm.oxygenLevel}
                      onChange={handleNewVisitInputChange}
                      placeholder={t("visits.oxygenPlaceholder")}
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor='temprature'>{t("visits.temp")}</label>
                    <input
                      type='text'
                      id='temprature'
                      name='temprature'
                      value={newVisitForm.temprature}
                      onChange={handleNewVisitInputChange}
                      placeholder={t("visits.tempPlaceholder")}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='heartBeat'>{t("visits.heartRate")}</label>
                    <input
                      type='text'
                      id='heartBeat'
                      name='heartBeat'
                      value={newVisitForm.heartBeat}
                      onChange={handleNewVisitInputChange}
                      placeholder={t("visits.heartRatePlaceholder")}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className='form-group'>
                  <label htmlFor='note'>{t("visits.doctorsNotes")}</label>
                  <textarea
                    id='note'
                    name='note'
                    value={newVisitForm.note}
                    onChange={handleNewVisitInputChange}
                    placeholder={t("visits.notesPlaceholder")}
                    rows='3'
                  />
                </div>
              </div>
            </div>

            <div className='modal-footer'>
              <button
                className='btn btn-secondary'
                onClick={() => {
                  setShowNewVisitModal(false);
                  resetNewVisitForm();
                }}
                disabled={creating}
              >
                {t("visits.cancel")}
              </button>
              <button
                className='btn btn-primary'
                onClick={handleCreateVisit}
                disabled={creating || !newVisitForm.patientId}
              >
                {creating ? t("visits.creating") : t("visits.createVisit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visits;