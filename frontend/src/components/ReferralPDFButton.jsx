import React, { useState } from "react";
import { DocxTemplateProcessor } from "../services/wordTemplateService";

const ReferralButton = ({ visit, patient }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrintReferral = async () => {
    if (!patient || !patient.name) {
      alert("⚠️ Patient information is missing");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Generating referral for:", patient.name);

      // Just download the document - no preview
      await DocxTemplateProcessor.downloadReferralDocument(patient.name);
    } catch (error) {
      console.error("Error generating referral:", error);
      alert("❌ Failed to generate referral document: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <button
        onClick={handlePrintReferral}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#fed7d7" : "#fed7d7",
          color: "#742a2a",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: isLoading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "600",
          width: "100%",
          height: "100%",

          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.backgroundColor = "#fed7d7";
            e.target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.target.style.backgroundColor = "#fed7d7";
            e.target.style.transform = "translateY(0)";
          }
        }}
        title='Download referral document'
      >
        {isLoading ? (
          <>
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            Generating...
          </>
        ) : (
          <>
            <span style={{ fontSize: "16px" }}></span>
            Print
          </>
        )}
      </button>
    </div>
  );
};

export default ReferralButton;
