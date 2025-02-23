import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user || null);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user) {
      axios.get("http://localhost:5000/api/repositories", { withCredentials: true })
        .then((response) => setRepositories(response.data.repositories))
        .catch(() => setRepositories([]));
    }
  }, [user]);

  const fetchRepoDetails = (repoName) => {
    setSelectedRepo(repoName);
    setBranches([]);
    setPullRequests([]);
    setIssues([]);

    // Fetch branches
    axios.get(`http://localhost:5000/api/branches/${repoName}`, { withCredentials: true })
      .then((response) => setBranches(response.data.branches))
      .catch(() => setBranches([]));

    // Fetch pull requests
    axios.get(`http://localhost:5000/api/pull-requests/${repoName}`, { withCredentials: true })
      .then((response) => setPullRequests(response.data.pullRequests))
      .catch(() => setPullRequests([]));

    // Fetch issues
    axios.get(`http://localhost:5000/api/issues/${repoName}`, { withCredentials: true })
      .then((response) => setIssues(response.data.issues))
      .catch(() => setIssues([]));
  };

  return (
    <AuthContext.Provider value={{ user, repositories, selectedRepo, branches, pullRequests, issues, fetchRepoDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
