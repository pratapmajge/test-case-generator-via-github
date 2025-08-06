const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// GitHub auth route setup
require("./auth/githubAuth")(app);

// Dummy test generation route
app.post("/api/generate-tests", async (req, res) => {
  const { repo, files, token } = req.body;

  if (!repo || !files || !Array.isArray(files)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Placeholder logic to simulate test case generation
  const testCases = files.map((filePath) => ({
    file: filePath,
    test: `// Auto-generated test for ${filePath}\nconsole.log('Test for ${filePath}');`,
  }));

  return res.json({ success: true, testCases });
});

// Start server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
