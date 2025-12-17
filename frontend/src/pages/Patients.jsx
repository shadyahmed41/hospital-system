import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Patients.css";
import { t } from "../locales";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCustomSection, setIsCustomSection] = useState(false);
  const [nameError, setNameError] = useState("");
  const [newPatientForm, setNewPatientForm] = useState({
    name: "",
    nationalId: "",
    section: "",
    MedicalConditions: "",
    BloodType: "",
    JoiningDate: "",
    OutDate: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showCustomCondition, setShowCustomCondition] = useState(false);

  const [uploadMode, setUploadMode] = useState("single");
  const [bulkData, setBulkData] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [uploadingBulk, setUploadingBulk] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [uniqueSections, setUniqueSections] = useState([]);
  const [uniqueConditions, setUniqueConditions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create a timeout to debounce the search
    const timeoutId = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, selectedSection, selectedCondition]);

  useEffect(() => {
    if (patients.length > 0) {
      // Get conditions from patients and combine with predefined
      const patientConditions = [
        ...new Set(patients.map((p) => p.MedicalConditions).filter(Boolean)),
      ];

      // Combine with predefined, remove duplicates
      const allConditions = [
        ...new Set([...patientConditions, ...predefinedConditions]),
      ].sort();

      setUniqueConditions(allConditions);
    } else {
      // If no patients yet, just use predefined
      setUniqueConditions(predefinedConditions);
    }
  }, [patients]);

  // useEffect(() => {
  //   if (patients.length > 0) {
  //     // Extract unique sections
  //     const sections = [
  //       ...new Set(patients.map((p) => p.section).filter(Boolean)),
  //     ].sort();
  //     setUniqueSections(sections);

  //     // Extract unique medical conditions
  //     const conditions = [
  //       ...new Set(patients.map((p) => p.MedicalConditions).filter(Boolean)),
  //     ].sort();
  //     setUniqueConditions(conditions);
  //   }
  // }, [patients]);

  const predefinedSections = [
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

  const predefinedConditions = [
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

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // Add filters only if they have values
      if (searchTerm) params.append("search", searchTerm);
      if (selectedSection) params.append("section", selectedSection);
      if (selectedCondition) params.append("condition", selectedCondition);

      const response = await api.get(`/patient?${params.toString()}`);
      console.log(response.data);

      if (response.data && response.data.data) {
        setPatients(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
        setCurrentPage(response.data.pagination?.currentPage || 1);
      } else {
        // Handle unexpected response structure
        setPatients([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load patients. Please try again."
      );
      setPatients([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };


  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "MedicalConditions") {
    if (value === "other") {
      setShowCustomCondition(true);
      setNewPatientForm((prev) => ({
        ...prev,
        MedicalConditions: "",
      }));
    } else {
      setShowCustomCondition(false);
      setNewPatientForm((prev) => ({
        ...prev,
        MedicalConditions: value,
      }));
    }
  } else if (name === "section") {
    if (value === "other") {
      // Show custom input
      setIsCustomSection(true);
      setNewPatientForm((prev) => ({
        ...prev,
        section: "", // Start with empty for custom input
      }));
    } else {
      // Hide custom input, use selected value
      setIsCustomSection(false);
      setNewPatientForm((prev) => ({
        ...prev,
        section: value,
      }));
    }
  } else {
    setNewPatientForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setCurrentPage(1);
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
    setCurrentPage(1);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNewPatientForm((prev) => ({
      ...prev,
      name: value,
    }));

    if (nameError && validateName(value)) {
      setNameError("");
    }
  };

  const handleCreatePatient = async () => {
    if (!validateName(newPatientForm.name)) {
setNameError(t("patients.nameRequired"));
      return;
    }

    if (!newPatientForm.name.trim()) {
      setCreateError(t("patients.nameRequiredError"));
      return;
    }

    if (!newPatientForm.section.trim()) {
      setCreateError(t("patients.sectionRequired"));
      return;
    }

    if (newPatientForm.nationalId && newPatientForm.nationalId.length !== 14) {
      setCreateError(t("patients.nationalIdError"));
      return;
    }

    if (newPatientForm.JoiningDate && newPatientForm.OutDate) {
      const joinDate = new Date(newPatientForm.JoiningDate);
      const outDate = new Date(newPatientForm.OutDate);
      if (outDate < joinDate) {
        setCreateError(t("patients.dateError"));
        return;
      }
    }

    try {
      setCreating(true);
      setCreateError("");

      const patientData = {
        name: newPatientForm.name.trim(),
        section: newPatientForm.section.trim(),
        nationalId: newPatientForm.nationalId.trim() || undefined,
        MedicalConditions: newPatientForm.MedicalConditions.trim() || undefined,
        BloodType: newPatientForm.BloodType.trim() || undefined,
        JoiningDate: newPatientForm.JoiningDate || undefined,
        OutDate: newPatientForm.OutDate || undefined,
      };

      const patientResponse = await api.post("/patient", patientData);
      const newPatient = patientResponse.data;

      try {
        const visitData = {
          patientId: newPatient.id,
          reason: "كشف مستجد",
          highBloodPressure: "120",
          lowBloodPressure: "80",
          oxygenLevel: "98%",
          temprature: "36.8",
          heartBeat: "72",
          result: "No Action",
          note: "",
        };

        await api.post("/visit", visitData);
      } catch (visitErr) {
        console.warn("Failed to create automatic visit:", visitErr);
      }

      setPatients((prev) => [newPatient, ...prev]);
      setShowAddModal(false);
      resetNewPatientForm();

           alert(t("patients.patientCreated"));

    } catch (err) {
      console.error("Error creating patient:", err);
      setCreateError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          t("patients.createError")
      );
    } finally {
      setCreating(false);
    }
  };

  const resetNewPatientForm = () => {
    setNewPatientForm({
      name: "",
      nationalId: "",
      section: "",
      MedicalConditions: "",
      BloodType: "",
      JoiningDate: "",
      OutDate: "",
    });
    setShowCustomCondition(false);
    setIsCustomSection(false); 
    setCreateError("");
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const validateName = (name) => {
    const nameParts = name
      .trim()
      .split(/\s+/)
      .filter((n) => n.length > 0);
    return nameParts.length >= 3;
  };

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) {
      setBulkError(t("patients.bulkError"));
      return;
    }

    try {
      setUploadingBulk(true);
      setBulkError("");

      let patientsData;
      try {
        patientsData = JSON.parse(bulkData);
      } catch (err) {
        setBulkError(t("patients.invalidJsonError"));
        return;
      }

      if (!Array.isArray(patientsData)) {
        setBulkError(t("patients.jsonArrayError"));
        return;
      }

      if (patientsData.length === 0) {
        setBulkError(t("patients.noDataError"));
        return;
      }

      const validPatients = [];
      const errors = [];

      patientsData.forEach((patient, index) => {
        if (!validateName(patient.name || "")) {
          errors.push(`Patient ${index + 1}: Name must have at least 3 parts`);
          return;
        }

        if (!patient.name || !patient.section) {
          errors.push(`Patient ${index + 1}: Name and section are required`);
          return;
        }

        if (patient.nationalId && patient.nationalId.length !== 14) {
          errors.push(
            `Patient ${index + 1}: National ID must be 14 digits if provided`
          );
          return;
        }

        if (patient.JoiningDate && patient.OutDate) {
          const joinDate = new Date(patient.JoiningDate);
          const outDate = new Date(patient.OutDate);
          if (outDate < joinDate) {
            errors.push(
              `Patient ${index + 1}: Out date cannot be before joining date`
            );
            return;
          }
        }

        validPatients.push({
          name: patient.name.trim(),
          section: patient.section.trim(),
          nationalId: patient.nationalId?.trim() || undefined,
          MedicalConditions: patient.MedicalConditions?.trim() || undefined,
          BloodType: patient.BloodType?.trim() || undefined,
          JoiningDate: patient.JoiningDate?.trim() || undefined,
          OutDate: patient.OutDate?.trim() || undefined,
        });
      });

      if (errors.length > 0) {
        setBulkError(
          `Validation errors:\n${errors.slice(0, 5).join("\n")}${
            errors.length > 5 ? `\n...and ${errors.length - 5} more errors` : ""
          }`
        );
        return;
      }

      const createdPatients = [];
      const failedPatients = [];
      const visitsCreated = [];
      const visitsFailed = [];

      for (const patientData of validPatients) {
        try {
          const patientResponse = await api.post("/patient", patientData);
          const newPatient = patientResponse.data;
          createdPatients.push(newPatient);

          try {
            const visitData = {
              patientId: newPatient.id,
              reason: "كشف مستجد",
              highBloodPressure: "120",
              lowBloodPressure: "80",
              oxygenLevel: "98%",
              temprature: "36.8",
              heartBeat: "72",
              result: "No Action",
              note: "",
            };

            await api.post("/visit", visitData);
            visitsCreated.push(newPatient.name);
          } catch (visitErr) {
            console.warn(
              `Failed to create visit for ${newPatient.name}:`,
              visitErr
            );
            visitsFailed.push(newPatient.name);
          }
        } catch (err) {
          console.error(`Error creating patient ${patientData.name}:`, err);
          failedPatients.push(patientData.name);
        }
      }

      if (createdPatients.length > 0) {
        setPatients((prev) => [...createdPatients, ...prev]);
      }

      let message = `Successfully created ${createdPatients.length} patients.`;
      if (visitsCreated.length > 0) {
        message += `\nInitial visits created for ${visitsCreated.length} patients.`;
      }
      if (visitsFailed.length > 0) {
        message += `\nFailed to create visits for ${visitsFailed.length} patients.`;
      }
      if (failedPatients.length > 0) {
        message += `\nFailed to create ${
          failedPatients.length
        } patients: ${failedPatients.slice(0, 3).join(", ")}${
          failedPatients.length > 3 ? "..." : ""
        }`;
      }

      setShowAddModal(false);
      resetBulkForm();
      alert(message);
    } catch (err) {
      setBulkError(t("patients.bulkUploadError"));
    } finally {
      setUploadingBulk(false);
    }
  };

  const resetBulkForm = () => {
    setBulkData("");
    setBulkError("");
    setUploadMode("single");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setBulkData(event.target.result);
        setBulkError("");
      } catch (err) {
        setBulkError("Failed to read file");
      }
    };
    reader.readAsText(file);
  };

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

  if (isLoading && patients.length === 0) {
    return (
      <div className='patients-page'>
        <div className='page-header'>
          <h1 className='page-title'>{t("patients.pageTitle")}</h1>
          <p className='page-subtitle'>{t("patients.pageSubtitle")}</p>
        </div>
        <div className='loading-state'>
          <div className='loading-spinner'></div>
          <p>{t("patients.loading")}</p>
        </div>
      </div>
    );
  }

  if (error && patients.length === 0) {
    return (
      <div className='patients-page'>
        <div className='page-header'>
          <h1 className='page-title'>{t("patients.pageTitle")}</h1>
          <p className='page-subtitle'>{t("patients.pageSubtitle")}</p>
        </div>
        <div className='error-state'>
          <p>{error}</p>
          <button onClick={fetchPatients} className='btn btn-secondary'>
            {t("patients.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='patients-page'>
      <div className='page-header'>
        <div className='header-left'>
          <h1 className='page-title'>{t("patients.pageTitle")}</h1>
          <p className='page-subtitle'>{t("patients.pageSubtitle")}</p>
        </div>
        <div className='header-actions'>
          <button
            className='btn btn-primary'
            onClick={() => setShowAddModal(true)}
          >
            {t("patients.addPatient")}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className='filters-section'>
        <div className='filters-header'>
          <h3>{t("patients.filters")}</h3>
          <button
            className='btn btn-link btn-clear-filters'
            onClick={() => {
              setSearchTerm("");
              setSelectedSection("");
              setSelectedCondition("");
              setCurrentPage(1);
            }}
            disabled={!searchTerm && !selectedSection && !selectedCondition}
          >
            {t("patients.clearAll")}
          </button>
        </div>

        <div className='filters-grid'>
          <div className='filter-group'>
            <label htmlFor='search-name'>{t("patients.searchByName")}</label>
            <input
              type='text'
              id='search-name'
              placeholder={t("patients.searchPlaceholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className='filter-input'
            />
          </div>

          {/* Filter by section */}
          <div className='filter-group'>
            <label htmlFor='filter-section'>{t("patients.section")}</label>
            <select
              id='filter-section'
              value={selectedSection}
              onChange={handleSectionChange}
              className='filter-select'
            >
              <option value=''>{t("patients.allSections")}</option>
              {predefinedSections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by medical condition */}
          <div className='filter-group'>
            <label htmlFor='filter-condition'>{t("patients.medicalCondition")}</label>
            <select
              id='filter-condition'
              value={selectedCondition}
              onChange={handleConditionChange}
              className='filter-select'
            >
              <option value=''>{t("patients.allConditions")}</option>
              {uniqueConditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className='patients-grid'>
        {patients.map((patient) => (
          <div key={patient.id} className='patient-card'>
            <div className='patient-header'>
              <h3 className='patient-name'>{patient.name}</h3>
              <span className='patient-section'>
                {t("patients.sectionColon")} {patient.section}
              </span>
            </div>

            <div className='patient-info'>
              <div className='patient-tags'>
                <span className='badge badge-section'>{patient.section}</span>
                <span className='badge badge-visits'>
                  {t("patients.visitsColon")} {patient._count?.visits || 0}
                </span>
                {patient.nationalId && (
                  <span className='badge badge-id'>
                    {t("patients.idColon")} {patient.nationalId}
                  </span>
                )}
                {patient.BloodType && (
                  <span className='badge badge-blood'>
                    {t("patients.bloodColon")} {patient.BloodType}
                  </span>
                )}
                {patient.MedicalConditions && (
                  <span className='badge badge-condition'>
                    {t("patients.conditionColon")} {patient.MedicalConditions}
                  </span>
                )}
                {patient.JoiningDate && (
                  <span className='badge badge-date'>
                    {t("patients.joined")} {new Date(patient.JoiningDate).toLocaleDateString()}
                  </span>
                )}
                {patient.OutDate && (
                  <span className='badge badge-out'>
                    {t("patients.out")} {new Date(patient.OutDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className='patient-visits'>
                <span className='visits-label'>{t("patients.totalVisits")}</span>
                <span className='visits-count'>
                  {patient._count?.visits || 0}
                </span>
              </div>
            </div>

            <div className='patient-actions'>
              <Link
                to={`/patients/${patient.id}`}
                className='btn btn-secondary btn-view'
              >
                {t("patients.viewProfile")}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {patients.length === 0 && !isLoading && (
        <div className='empty-state'>
          {error ? (
            <>
              <p>{error}</p>
              <button onClick={fetchPatients} className='btn btn-secondary'>
                {t("patients.tryAgain")}
              </button>
            </>
          ) : (
            <>
              <p>{t("patients.noPatients")}</p>
              <button
                className='btn btn-primary'
                onClick={() => setShowAddModal(true)}
              >
                {t("patients.addFirstPatient")}
              </button>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='pagination'>
          <button
            className='pagination-btn'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            {t("patients.previous")}
          </button>

          <div className='pagination-info'>
            <span className='page-info'>
              {t("patients.page")} {currentPage} {t("patients.of")} {totalPages}
            </span>
            <span className='items-info'>
              {t("patients.showing")}{" "}
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
              {Math.min(currentPage * itemsPerPage, totalItems)} {t("patients.of")} {totalItems}{" "}
              {t("patients.patients")}
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
            {t("patients.next")}
          </button>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>{t("patients.addNewPatient")}</h2>
              <button
                className='modal-close'
                onClick={() => {
                  setShowAddModal(false);
                  uploadMode === "single"
                    ? resetNewPatientForm()
                    : resetBulkForm();
                }}
              >
                ×
              </button>
            </div>

            <div className='modal-body'>
              <div className='mode-selection'>
                <div className='mode-options'>
                  <label className='mode-option'>
                    <input
                      type='radio'
                      name='uploadMode'
                      value='single'
                      checked={uploadMode === "single"}
                      onChange={(e) => setUploadMode(e.target.value)}
                    />
                    <span>{t("patients.addSinglePatient")}</span>
                  </label>
                  <label className='mode-option'>
                    <input
                      type='radio'
                      name='uploadMode'
                      value='bulk'
                      checked={uploadMode === "bulk"}
                      onChange={(e) => setUploadMode(e.target.value)}
                    />
                    <span>{t("patients.bulkUpload")}</span>
                  </label>
                </div>
              </div>

              {uploadMode === "single" ? (
                <div className='new-patient-form'>
                  {createError && (
                    <div className='error-message'>{createError}</div>
                  )}

                  <div className='form-group'>
                    <label htmlFor='name'>
                      {t("patients.patientName")} <span className='required-indicator'>{t("common.requiredIndicator")}</span>
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={newPatientForm.name}
                      onChange={handleNameChange}
                      placeholder={t("patients.namePlaceholder")}
                      required
                      className={nameError ? "error-border" : ""}
                    />
                    {nameError && (
                      <div className='field-error'>{nameError}</div>
                    )}
                  </div>

                  <div className='form-row'>
                    <div className='form-group'>
                      <label htmlFor='nationalId'>{t("patients.nationalId")}</label>
                      <input
                        type='text'
                        id='nationalId'
                        name='nationalId'
                        value={newPatientForm.nationalId}
                        onChange={handleInputChange}
                        placeholder={t("patients.nationalIdPlaceholder")}
                        maxLength={14}
                      />
                      <small className='form-hint'>
                        {t("patients.nationalIdHint")}
                      </small>
                    </div>

                    <div className='form-group'>
                      <label htmlFor='section'>
                        {t("patients.section")} <span className='required-indicator'>{t("common.requiredIndicator")}</span>
                      </label>
                      <select
                        id='section'
                        name='section'
                        value={
                          isCustomSection ? "other" : newPatientForm.section
                        }
                        onChange={handleInputChange}
                        required
                      >
                        <option value=''>{t("patients.selectSection")}</option>
                        {predefinedSections.map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                        <option value='other'>{t("patients.otherSpecify")}</option>
                      </select>

                      {/* Show custom input when "other" is selected */}
                      {isCustomSection && (
                        <input
                          type='text'
                          placeholder={t("patients.enterCustomSection")}
                          value={newPatientForm.section}
                          onChange={(e) =>
                            setNewPatientForm((prev) => ({
                              ...prev,
                              section: e.target.value,
                            }))
                          }
                          style={{ marginTop: "8px" }}
                          autoFocus
                          required
                        />
                      )}
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className='form-group'>
                      <label htmlFor='JoiningDate'>{t("patients.joiningDate")}</label>
                      <input
                        type='date'
                        id='JoiningDate'
                        name='JoiningDate'
                        value={newPatientForm.JoiningDate}
                        onChange={handleInputChange}
                      />
                      <small className='form-hint'>
                        {t("patients.joiningDateHint")}
                      </small>
                    </div>

                    <div className='form-group'>
                      <label htmlFor='OutDate'>{t("patients.outDate")}</label>
                      <input
                        type='date'
                        id='OutDate'
                        name='OutDate'
                        value={newPatientForm.OutDate}
                        onChange={handleInputChange}
                        min={newPatientForm.JoiningDate || undefined}
                      />
                      <small className='form-hint'>
                        {t("patients.outDateHint")}
                      </small>
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className='form-group'>
                      <label htmlFor='BloodType'>{t("patients.bloodType")}</label>
                      <select
                        id='BloodType'
                        name='BloodType'
                        value={newPatientForm.BloodType}
                        onChange={handleInputChange}
                      >
                        <option value=''>{t("patients.selectBloodType")}</option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='form-group'>
                      <label htmlFor='MedicalConditions'>
                        {t("patients.medicalConditions")}
                      </label>
                      <select
                        id='MedicalConditions'
                        name='MedicalConditions'
                        value={
                          showCustomCondition
                            ? "other"
                            : newPatientForm.MedicalConditions
                        }
                        onChange={handleInputChange}
                      >
                        <option value=''>{t("patients.selectCondition")}</option>
                        {commonConditions.map((condition) => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                        <option value='other'>{t("patients.other")}</option>
                      </select>
                    </div>
                  </div>

                  {showCustomCondition && (
                    <div className='form-group'>
                      <label htmlFor='customCondition'>{t("patients.specifyCondition")}</label>
                      <input
                        type='text'
                        id='customCondition'
                        name='MedicalConditions'
                        value={newPatientForm.MedicalConditions}
                        onChange={(e) =>
                          setNewPatientForm((prev) => ({
                            ...prev,
                            MedicalConditions: e.target.value,
                          }))
                        }
                        placeholder={t("patients.enterCondition")}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className='bulk-upload-form'>
                  {bulkError && (
                    <div
                      className='error-message'
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {bulkError}
                    </div>
                  )}

                  <div className='form-group'>
                    <label htmlFor='jsonFile'>
                      {t("patients.uploadJsonFile")}{" "}
                      <span className='required-indicator'>{t("common.requiredIndicator")}</span>
                    </label>
                    <input
                      type='file'
                      id='jsonFile'
                      accept='.json,.txt'
                      onChange={handleFileUpload}
                      className='file-input'
                    />
                    <small className='form-hint'>
                      {t("patients.jsonHint")}
                    </small>
                  </div>

                  <div className='form-group'>
                    <label>{t("patients.filePreview")}</label>
                    <div className='file-preview'>
                      {bulkData ? (
                        <pre className='json-preview'>
                          {bulkData.length > 500
                            ? bulkData.substring(0, 500) + "..."
                            : bulkData}
                        </pre>
                      ) : (
                        <div className='empty-preview'>
                          {t("patients.noFileSelected")}
                        </div>
                      )}
                    </div>
                  </div>

                  {bulkData && (
                    <div className='file-info'>
                      <div className='info-item'>
                        <span className='info-label'>{t("patients.fileSize")}</span>
                        <span className='info-value'>
                          {new Blob([bulkData]).size} {t("patients.bytes")}
                        </span>
                      </div>
                      <div className='info-item'>
                        <span className='info-label'>{t("patients.patientsFound")}</span>
                        <span className='info-value'>
                          {(() => {
                            try {
                              const data = JSON.parse(bulkData);
                              return Array.isArray(data)
                                ? data.length
                                : t("patients.invalidFormat");
                            } catch {
                              return t("patients.invalidJson");
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='modal-footer'>
              <button
                className='btn btn-secondary'
                onClick={() => {
                  setShowAddModal(false);
                  uploadMode === "single"
                    ? resetNewPatientForm()
                    : resetBulkForm();
                }}
                disabled={creating || uploadingBulk}
              >
                {t("patients.cancel")}
              </button>

              {uploadMode === "single" ? (
                <button
                  className='btn btn-primary'
                  onClick={handleCreatePatient}
                  disabled={
                    creating ||
                    !newPatientForm.name ||
                    !newPatientForm.section ||
                    nameError
                  }
                >
                  {creating ? t("patients.creating") : t("patients.createPatient")}
                </button>
              ) : (
                <button
                  className='btn btn-primary'
                  onClick={handleBulkUpload}
                  disabled={uploadingBulk || !bulkData.trim()}
                >
                  {uploadingBulk ? t("patients.uploading") : t("patients.uploadPatients")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;