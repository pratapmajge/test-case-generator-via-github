import React from 'react';

export default function GitHubLoginButton() {
  const handleLogin = () => {
    // Updated backend URL for OAuth
    window.location.href = "https://test-case-generator-via-github.onrender.com/auth/github";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <button className="btn btn-primary" onClick={handleLogin}>
        Login with GitHub
      </button>
    </div>
  );
}
