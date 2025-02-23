require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;

const app = express();
const PORT = 5000;


app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );
  
  
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("GitHub OAuth Success - Token:", accessToken);
        profile.accessToken = accessToken;
        profile.username = profile._json.login;
        console.log("GitHub User Profile:", profile); // Debugging

        return done(null, profile);
      }
    )
);

  

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, username: user.username, accessToken: user.accessToken }); // Store username
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });  
  
// Authentication Routes
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["repo"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.FRONTEND_URL,
    successRedirect: process.env.FRONTEND_URL,
  })
);

app.get("/auth/user", (req, res) => {
    console.log("User Session Data:", req.user); // Debugging
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  });   

app.get("/auth/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(process.env.FRONTEND_URL);
    });
  });
  


const axios = require("axios");

app.get("/api/repositories", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    res.json({ repositories: response.data });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
});

app.get("/api/branches/:repoName", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const { repoName } = req.params;
    console.log("Fetching branches for:", req.user.username, repoName); // Debugging
  
    try {
        const response = await axios.get(`https://api.github.com/repos/${req.user.username}/${repoName}/branches`, {
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
  
      res.json({ branches: response.data });
    } catch (error) {
      console.error("Error fetching branches:", error.response?.data || error.message);
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });
  
app.get("/api/pull-requests/:repoName", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { repoName } = req.params;
  console.log("Fetching PRs for:", req.user.username, repoName); // Debugging

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${req.user.username}/${repoName}/pulls?state=all`,
      {
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    res.json({ pullRequests: response.data });
  } catch (error) {
    console.error("Error fetching pull requests:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch pull requests" });
  }
});


app.get("/api/issues/:repoName", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const { repoName } = req.params;
    console.log("Fetching issues for:", req.user.username, repoName); // Debugging
  
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${req.user.username}/${repoName}/issues?state=all`,
        {
          headers: {
            Authorization: `Bearer ${req.user.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
  
      res.json({ issues: response.data });
    } catch (error) {
      console.error("Error fetching issues:", error.response?.data || error.message);
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });
  
  
// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
