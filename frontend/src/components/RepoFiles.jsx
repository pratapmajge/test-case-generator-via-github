import React, { useEffect, useState } from "react";
import { useRepo } from "../context/RepoContext";

const RepoFiles = () => {
  const { selectedRepo } = useRepo();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submittedFilePaths, setSubmittedFilePaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("github_token");

  useEffect(() => {
    if (!selectedRepo) return;

    const fetchFiles = async (path = "") => {
      const url = `https://api.github.com/repos/${selectedRepo}/contents/${path}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();

      let allFiles = [];

      for (const item of data) {
        if (item.type === "file") {
          allFiles.push(item);
        } else if (item.type === "dir") {
          const nested = await fetchFiles(item.path);
          allFiles = allFiles.concat(nested);
        }
      }

      return allFiles;
    };

    const loadFiles = async () => {
      setLoading(true);
      try {
        const allFiles = await fetchFiles();
        setFiles(allFiles);
      } catch (err) {
        console.error("Failed to fetch files", err);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [selectedRepo, token]);

  const handleCheckboxChange = (file) => {
    setSelectedFiles((prev) =>
      prev.some((f) => f.path === file.path)
        ? prev.filter((f) => f.path !== file.path)
        : [...prev, file]
    );
  };

  const handleGenerate = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const selectedPaths = selectedFiles.map((f) => f.path);
    setSubmittedFilePaths(selectedPaths);

    try {
      const response = await fetch("http://localhost:5000/api/generate-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Optional
        },
        body: JSON.stringify({
          repo: selectedRepo,
          files: selectedPaths,
          token,
        }),
      });

      const result = await response.json();
      console.log("🧪 Generated test cases:", result);

      // Only reset selected files after success
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error generating test cases:", error);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📁 Files in {selectedRepo}</h3>

      {loading ? (
        <p>Loading files...</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {files.map((file) => (
              <li key={`${file.path}-${file.sha}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFiles.some((f) => f.path === file.path)}
                    onChange={() => handleCheckboxChange(file)}
                  />
                  {file.path}
                </label>
              </li>
            ))}
          </ul>

          <button onClick={handleGenerate} style={{ marginTop: "20px" }}>
            ✅ Generate Test Cases
          </button>

          {submittedFilePaths.length > 0 && (
            <div style={{ marginTop: "30px", color: "green" }}>
              <h4>✅ Selected Files Sent to Backend:</h4>
              <ul>
                {submittedFilePaths.map((path, idx) => (
                  <li key={idx}>{path}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RepoFiles;
