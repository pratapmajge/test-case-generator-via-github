import React, { useEffect, useState } from "react";
import { useRepo } from "../context/RepoContext";

const RepoFiles = () => {
  const { selectedRepo } = useRepo();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submittedFilePaths, setSubmittedFilePaths] = useState([]);
  const [generatedTests, setGeneratedTests] = useState([]);
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          repo: selectedRepo,
          files: selectedPaths,
          token,
        }),
      });

      const result = await response.json();
      console.log("🧪 Generated test cases:", result);

      if (result.success && result.testCases) {
        setGeneratedTests(result.testCases);
      } else {
        setGeneratedTests([
          {
            file: "ExampleFile.java",
            summary: "This is a sample summary of generated test cases.",
            test: "it('should return true', () => { expect(true).toBe(true); });",
          },
        ]);
      }

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

          {generatedTests.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h4 style={{ color: "#1E90FF" }}>🧪 Generated Test Cases:</h4>
              {generatedTests.map((test, index) => (
                <div
                  key={index}
                  style={{
                    background: "#1e1e1e",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    color: "#f8f8f2",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* File name */}
                  <strong style={{ color: "#FFD700" }}>{test.file}</strong>

                  {/* Summary */}
                  {test.summary && (
                    <p
                      style={{
                        marginTop: "10px",
                        background: "#2d2d2d",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        color: "#dcdcdc",
                      }}
                    >
                      {test.summary}
                    </p>
                  )}

                  {/* Test code */}
                  <pre
                    style={{
                      background: "#282c34",
                      padding: "10px",
                      borderRadius: "6px",
                      overflowX: "auto",
                      fontSize: "14px",
                      color: "#98c379",
                      marginTop: "10px",
                    }}
                  >
                    {test.test}
                  </pre>
                </div>
              ))}
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default RepoFiles;
