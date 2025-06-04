import React from "react";

const ParsedResult = ({ data }) => {
  if (!data) return null;
  const { name, email, phone, skills, experience, education } = data;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-blue-700 border-b pb-2">
        Parsed Resume Data
      </h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {name || "N/A"}</p>
        <p><strong>Email:</strong> {email || "N/A"}</p>
        <p><strong>Phone:</strong> {phone || "N/A"}</p>
      </div>

      <div className="mt-6">
        <strong className="text-lg text-blue-600">Skills:</strong>
        <div className="flex flex-wrap gap-3 mt-3">
          {skills && skills.length > 0 ? (
            skills.map((skill, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-500">N/A</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <strong className="text-lg text-blue-600">Work Experience:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
          {experience && experience.length > 0 ? (
            experience.map((exp, i) => <li key={i}>{exp}</li>)
          ) : (
            <li className="text-gray-500">N/A</li>
          )}
        </ul>
      </div>

      <div className="mt-6">
        <strong className="text-lg text-blue-600">Education:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
          {education && education.length > 0 ? (
            education.map((edu, i) => <li key={i}>{edu}</li>)
          ) : (
            <li className="text-gray-500">N/A</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ParsedResult;
