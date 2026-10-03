// pages/components/spinner.jsx
import React from "react";

export default function LoadingSpinner() {
  return (
    <>
      <div className="route-spinner">
        <div className="main-loading-spinner" />
      </div>

      <style>{`
        .route-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
          background: #F8F8F8;
        }
        .main-loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E8E8E8;
          border-top-color: #2B2B2B;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}