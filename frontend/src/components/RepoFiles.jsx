import React, { useEffect, useState } from "react";
import { useRepo } from "../context/RepoContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFolderOpen, FaPaperPlane } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RepoFiles = ({ darkMode, setGeneratedTests }) => {
  const { selectedRepo } = useRepo();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submittedFilePaths, setSubmittedFilePaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const token = localStorage.getItem("github_token");

  useEffect(() => {
    if (!selectedRepo) return;

    const fetchFiles = async (path = "") => {
      const url = `https://api.github.com/repos/${selectedRepo}/contents/${path}`;
      const response = await fetch(url, {
        headers: { Authorization: `token ${token}` },
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
    setGenerating(true);

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

      if (result.success && result.testCases) {
        setGeneratedTests(result.testCases);
      } else {
        setGeneratedTests([
          {
            file: "ExampleFile.java",
            summary: "Sample generated test case summary.",
            test: "it('should return true', () => { expect(true).toBe(true); });",
          },
        ]);
      }

      setSelectedFiles([]);
    } catch (error) {
      console.error("Error generating test cases:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={`p-3 rounded ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold d-flex align-items-center gap-2">
          <FaFolderOpen className="text-info" /> Repository:{" "}
          <span className="text-info">{selectedRepo}</span>
        </h5>
      </div>

      {/* Files Section */}
      {loading ? (
        <div className="text-center p-4">
          <AiOutlineLoading3Quarters className="spinner-border-sm animate-spin" /> Loading files...
        </div>
      ) : files.length === 0 ? (
        <p>No files found in this repository.</p>
      ) : (
        <div className="d-flex flex-wrap gap-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
          {files.map((file) => (
            <div
              key={file.path}
              className={`p-2 rounded border shadow-sm ${
                selectedFiles.some((f) => f.path === file.path)
                  ? "border-info bg-info text-dark"
                  : darkMode
                  ? "bg-dark text-white border-secondary"
                  : "bg-light border"
              }`}
              style={{ flex: "1 0 45%", cursor: "pointer" }}
              onClick={() => handleCheckboxChange(file)}
            >
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={selectedFiles.some((f) => f.path === file.path)}
                readOnly
              />
              {file.path}
            </div>
          ))}
        </div>
      )}

      {/* Button */}
      <button
        className={`btn mt-3 w-100 fw-bold ${darkMode ? "btn-outline-light" : "btn-info"}`}
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? "Generating Test Cases..." : "⚡ Generate Test Cases"}
      </button>

      {/* Files Sent */}
      {submittedFilePaths.length > 0 && (
        <div className={`mt-4 p-3 rounded ${darkMode ? "bg-secondary text-white" : "bg-info text-dark"}`}>
          <h6 className="d-flex align-items-center gap-2">
            <FaPaperPlane /> Files Sent:
          </h6>
          <ul className="mb-0">
            {submittedFilePaths.map((path, idx) => (
              <li key={idx}>{path}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepoFiles;
