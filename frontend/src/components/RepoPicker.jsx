import React, { useEffect, useState } from "react";
import { useRepo } from "../context/RepoContext.jsx";

const RepoPicker = () => {
  const [repos, setRepos] = useState([]);
  const { selectedRepo, setSelectedRepo } = useRepo();

  const token = localStorage.getItem("github_token");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `token ${token}`,
          },
        });

        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Failed to fetch repos", error);
      }
    };

    if (token) fetchRepos();
  }, [token]);

  const handleSelect = (e) => {
    const selected = e.target.value;
    setSelectedRepo(selected);
    console.log("Selected Repo:", selected);
  };

  return (
    <div>
      <h2>Select a Repository</h2>
      <select onChange={handleSelect} value={selectedRepo}>
        <option value="">-- Select Repo --</option>
        {repos.map((repo) => (
          <option key={repo.id} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RepoPicker;
