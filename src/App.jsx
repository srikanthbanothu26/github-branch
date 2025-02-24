import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const App = () => {
  const { user, repositories, selectedRepo, branches, pullRequests, issues, fetchRepoDetails } = useAuth();
  const [showPRs, setShowPRs] = useState(true);
  const [showIssues, setShowIssues] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", fontFamily: "Arial, sans-serif", background: "#121212", color: "white" }}>
      {/* Sidebar for repositories */}
      <div style={{ width: "300px", background: "#1e1e1e", padding: "20px", overflowY: "auto" }}>
        <h2 style={{ borderBottom: "2px solid #3498db", paddingBottom: "10px" }}>Repositories</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {repositories.length > 0 ? (
            repositories.map((repo) => (
              <li
                key={repo.id}
                onClick={() => fetchRepoDetails(repo.name)}
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  background: selectedRepo === repo.name ? "#3498db" : "#2c2c2c",
                  borderRadius: "5px",
                  marginBottom: "8px",
                  transition: "0.3s",
                }}
              >
                {repo.name}
              </li>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", overflowY: "auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "#3498db" }}>GitHub Branch Explorer</h1>
          {user && (
            <a href="http://localhost:5000/auth/logout">
              <button style={{ padding: "10px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
            </a>
          )}
        </div>

        {user ? (
          <div>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>Welcome, <strong>{user.username}</strong>!</p>
            {selectedRepo && (
              <div style={{ textAlign: "left", maxWidth: "900px", margin: "auto", background: "#1e1e1e", padding: "20px", borderRadius: "8px" }}>
                <h2 style={{ color: "#f1c40f" }}>Branches for {selectedRepo}:</h2>
                <ul>
                  {branches.length > 0 ? (
                    branches.map((branch) => <li key={branch.name}>{branch.name}</li>)
                  ) : (
                    <p>No branches found.</p>
                  )}
                </ul>

                {/* Collapsible Pull Requests Section */}
                <div style={{ marginTop: "20px" }}>
                  <h2 style={{ cursor: "pointer", color: "#27ae60" }} onClick={() => setShowPRs(!showPRs)}>
                    Pull Requests {showPRs ? "▲" : "▼"}
                  </h2>
                  {showPRs && (
                    <ul>
                      {pullRequests.length > 0 ? (
                        pullRequests.map((pr) => <li key={pr.id}><strong>{pr.title}</strong> (#{pr.number}) - {pr.state}</li>)
                      ) : (
                        <p>No pull requests found.</p>
                      )}
                    </ul>
                  )}
                </div>

                {/* Collapsible Issues Section */}
                <div style={{ marginTop: "20px" }}>
                  <h2 style={{ cursor: "pointer", color: "#c0392b" }} onClick={() => setShowIssues(!showIssues)}>
                    Issues {showIssues ? "▲" : "▼"}
                  </h2>
                  {showIssues && (
                    <ul>
                      {issues.length > 0 ? (
                        issues.map((issue) => <li key={issue.id}><strong>{issue.title}</strong> (#{issue.number}) - {issue.state}</li>)
                      ) : (
                        <p>No issues found.</p>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <a href="http://localhost:5000/auth/github">
            <button style={{ padding: "12px", background: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>Login with GitHub</button>
          </a>
        )}
      </div>
    </div>
  );
};

export default App;
