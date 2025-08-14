import React from 'react';

export default function GitHubLoginButton() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <button className="btn btn-primary" onClick={handleLogin}>
        Login with GitHub
      </button>
    </div>
  );
}
