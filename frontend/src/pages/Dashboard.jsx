import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RepoPicker from "../components/RepoPicker.jsx";
import RepoFiles from "../components/RepoFiles.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Dashboard({ darkMode }) {
  const [token, setToken] = useState(null);
  const [generatedTests, setGeneratedTests] = useState([]);
  const [generating, setGenerating] = useState(false); // added to show loader
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const githubToken = urlParams.get("token");

    if (githubToken) {
      setToken(githubToken);
      localStorage.setItem("github_token", githubToken);
      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      const storedToken = localStorage.getItem("github_token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  // Copy test case content to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Test case copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className={`container-fluid mt-4 ${darkMode ? 'bg-dark text-white' : ''}`}>
      <h2 className="text-center mb-4">✅ Logged in with GitHub!</h2>
      {token && (
        <div className="row">
          {/* Left Side */}
          <div className="col-md-6">
            <RepoPicker darkMode={darkMode} />
            <RepoFiles 
              darkMode={darkMode} 
              setGeneratedTests={setGeneratedTests} 
              setGenerating={setGenerating} // pass setter for loader
            />
          </div>

          {/* Right Side */}
          <div className="col-md-6">
            {generating ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <AiOutlineLoading3Quarters className="spinner-border animate-spin" style={{ fontSize: "2rem" }} />
              </div>
            ) : generatedTests.length > 0 && (
              <>
                <h4 className="text-info">🧪 Generated Test Cases</h4>
                {generatedTests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded shadow mb-3 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="text-primary mb-0">{test.file}</h5>
                      <button
                        className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-info'}`}
                        onClick={() => handleCopy(test.test)}
                      >
                        📋 Copy
                      </button>
                    </div>

                    {test.summary && (
                      <p className={`p-2 rounded ${darkMode ? 'bg-dark text-white' : 'bg-secondary text-dark'}`}>
                        {test.summary}
                      </p>
                    )}
                    <pre className={`p-3 rounded ${darkMode ? 'bg-dark text-info' : 'bg-white text-dark'}`}>
                      {test.test}
                    </pre>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
