
import React, { useState, useRef } from "react";
import axios from "axios";

const UploadForm = ({ setParsedData, setAnalyzedCount, setLastFileName }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const validTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFile = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setError("No file selected.");
      return;
    }

    if (!validTypes.includes(selectedFile.type)) {
      setFile(null);
      setError("Only PDF or DOCX files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("File is too large. Max size is 2 MB.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post("https://resume-analyzer-backend-sr9f.onrender.com/api/upload", formData);
      const result = response.data;

      if (result.success) {
        setParsedData(result.data);
        localStorage.setItem("parsedData", JSON.stringify(result.data));

        setAnalyzedCount((prev) => {
          const updated = prev + 1;
          localStorage.setItem("analyzedCount", updated);
          return updated;
        });

        localStorage.setItem("lastUploadedFileName", file.name);
        if (setLastFileName) setLastFileName(file.name);

        setError("");
      } else {
        setError("Parsing failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

      <div
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition ${
          isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300"
        }`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-blue-600 font-medium">Drag & drop your resume here</p>
        <p className="text-sm text-gray-500">or click to browse</p>
        <p className="mt-2 text-xs text-gray-500">Accepted formats: .pdf, .docx (Max: 2MB)</p>
      </div>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {file && (
        <p className="mt-4 text-green-700 text-sm font-medium">
          Selected file: {file.name}
        </p>
      )}

      {error && (
        <p className="text-red-600 mt-2 font-medium">{error}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload & Analyze"}
      </button>
    </div>
  );
};

export default UploadForm;

