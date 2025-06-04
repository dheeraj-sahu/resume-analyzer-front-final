import React, { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import ParsedResult from "./components/ParsedResult";
import "./index.css";

const App = () => {
  const [parsedData, setParsedData] = useState(null);
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [lastFileName, setLastFileName] = useState("");

  useEffect(() => {
    const savedCount = localStorage.getItem("analyzedCount");
    if (savedCount) setAnalyzedCount(Number(savedCount));

    const savedFileName = localStorage.getItem("lastUploadedFileName");
    if (savedFileName) setLastFileName(savedFileName);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-gray-50">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gradient bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          📄 Resume Analyzer
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Upload a resume to get instant analysis
        </p>
      </div>

      <UploadForm
        setParsedData={setParsedData}
        setAnalyzedCount={setAnalyzedCount}
        setLastFileName={setLastFileName} // <-- pass this to update filename from UploadForm
      />

      {lastFileName && (
        <div className="mt-4 text-sm text-gray-600">
          Previously uploaded file was: <strong>{lastFileName}</strong>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        Resumes analyzed this session: <span className="font-semibold">{analyzedCount}</span>
      </div>

      {parsedData && <ParsedResult data={parsedData} />}
    </div>
  );
};

export default App;
