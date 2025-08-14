import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RepoPicker from "../components/RepoPicker.jsx";
import RepoFiles from "../components/RepoFiles.jsx";

function Dashboard({ darkMode }) {
  const [token, setToken] = useState(null);
  const [generatedTests, setGeneratedTests] = useState([]);
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

  return (
    <div className={`container-fluid mt-4 ${darkMode ? 'bg-dark text-white' : ''}`}>
      <h2 className="text-center mb-4">✅ Logged in with GitHub!</h2>
      {token && (
        <div className="row">
          {/* Left Side */}
          <div className="col-md-6">
            <RepoPicker darkMode={darkMode} />
            <RepoFiles darkMode={darkMode} setGeneratedTests={setGeneratedTests} />
          </div>

          {/* Right Side */}
          <div className="col-md-6">
            {generatedTests.length > 0 && (
              <>
                <h4 className="text-info">🧪 Generated Test Cases</h4>
                {generatedTests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded shadow mb-3 ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                  >
                    <h5 className="text-primary">{test.file}</h5>
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
