import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const App = () => {
  const { user, repositories, selectedRepo, branches, pullRequests, issues, fetchRepoDetails } = useAuth();
  const [showPRs, setShowPRs] = useState(true);
  const [showIssues, setShowIssues] = useState(true);

  return (
    <div style={{ display: "flex", height: "", fontFamily: "Arial, sans-serif", background: "#1c1e21", color: "white" ,width:'100%'}}>
      {/* Sidebar for repositories */}
      <div style={{ width: "300px", background: "#2c3e50", padding: "15px" }}>
        <h2 style={{ borderBottom: "2px solid #ecf0f1", paddingBottom: "10px" }}>Repositories</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {repositories.length > 0 ? (
            repositories.map((repo) => (
              <li
                key={repo.id}
                onClick={() => fetchRepoDetails(repo.name)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  background: selectedRepo === repo.name ? "#34495e" : "transparent",
                  borderRadius: "5px",
                  marginBottom: "5px",
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

      {/* Main Content - Centered Content */}
      <div style={{ flex: 1, padding: "20px", background: "#1c1e21", overflowY: "auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "#ecf0f1", textAlign: "center" }}>GitHub Branch Explorer</h1>
          {user && (
            <a href="http://localhost:5000/auth/logout">
              <button style={{ padding: "10px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Logout
              </button>
            </a>
          )}
        </div>

        {user ? (
          <div>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>Welcome, <strong>User</strong>!</p>

            {selectedRepo && (
              <div style={{ textAlign: "left", maxWidth: "800px", margin: "auto", background: "#2c3e50", padding: "20px", borderRadius: "8px" }}>
                <h2 style={{ color: "#3498db" }}>Branches for {selectedRepo}:</h2>
                <ul>
                  {branches.length > 0 ? (
                    branches.map((branch) => (
                      <li key={branch.name}>{branch.name}</li>
                    ))
                  ) : (
                    <p>No branches found.</p>
                  )}
                </ul>

                {/* Collapsible Pull Requests Section */}
                <div style={{ marginTop: "20px" }}>
                  <h2
                    style={{ cursor: "pointer", color: "#27ae60" }}
                    onClick={() => setShowPRs(!showPRs)}
                  >
                    Pull Requests {showPRs ? "▲" : "▼"}
                  </h2>
                  {showPRs && (
                    <ul>
                      {pullRequests.length > 0 ? (
                        pullRequests.map((pr) => (
                          <li key={pr.id}>
                            <strong>{pr.title}</strong> (#{pr.number}) - {pr.state}
                          </li>
                        ))
                      ) : (
                        <p>No pull requests found.</p>
                      )}
                    </ul>
                  )}
                </div>

                {/* Collapsible Issues Section */}
                <div style={{ marginTop: "20px" }}>
                  <h2
                    style={{ cursor: "pointer", color: "#c0392b" }}
                    onClick={() => setShowIssues(!showIssues)}
                  >
                    Issues {showIssues ? "▲" : "▼"}
                  </h2>
                  {showIssues && (
                    <ul>
                      {issues.length > 0 ? (
                        issues.map((issue) => (
                          <li key={issue.id}>
                            <strong>{issue.title}</strong> (#{issue.number}) - {issue.state}
                          </li>
                        ))
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
            <button style={{ padding: "10px", background: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Login with GitHub
            </button>
          </a>
        )}
      </div>
    </div>
  );
};

export default App;
