import React, { useState, useEffect, useRef } from "react";

const validTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedFileName = localStorage.getItem("lastUploadedFileName");
    if (savedFileName) {
      setFile({ name: savedFileName });
    }
  }, []);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!validTypes.includes(selectedFile.type)) {
      setError("Only PDF or DOCX files are allowed.");
      setFile(null);
      setSuccess("");
      return;
    }

    

    setFile(selectedFile);
    setError("");
    setSuccess("");
    localStorage.setItem("lastUploadedFileName", selectedFile.name);
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file) {
    setError("Please select a valid resume file.");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);

  try {
    setIsUploading(true);

    const response = await fetch("https://resume-analyzer-backend-0y71.onrender.com/api/upload", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Upload failed");
      } else {
        const text = await response.text();
        throw new Error(text || "Upload failed");
      }
    }

    const result = await response.json();
    setSuccess("Upload successful!");
    setError("");
    console.log("Server response:", result);
  } catch (err) {
    console.error(err);

    setError(err.message || "Failed to upload resume. Try again.");
    setSuccess("");
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Upload Your Resume
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div
          className="border-2 border-dashed border-blue-300 p-6 rounded-lg text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-blue-700 font-medium">Drag & drop your resume here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
          <p className="mt-2 text-xs text-gray-500">
            Accepted formats: .pdf, .docx | Max size: 2MB
          </p>
        </div>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {file && (
          <p className="text-sm text-green-600 font-medium">
            Selected file: {file.name}
          </p>
        )}

        {error && <p className="text-red-600 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;
