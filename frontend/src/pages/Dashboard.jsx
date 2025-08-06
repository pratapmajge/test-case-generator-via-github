import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RepoPicker from "../components/RepoPicker.jsx";
import RepoFiles from "../components/RepoFiles.jsx";

function Dashboard() {
  const [token, setToken] = useState(null);
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>✅ Logged in with GitHub!</h2>
      {token && (
        <>
          <RepoPicker />
          <RepoFiles />
        </>
      )}
    </div>
  );
}

export default Dashboard;
