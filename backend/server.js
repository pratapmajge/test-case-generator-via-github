const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const fetch = require('node-fetch'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// GitHub authentication setup
require("./auth/githubAuth")(app);

// ----------- Test Case Generation Route -----------
app.post("/api/generate-tests", async (req, res) => {
  const { repo, files, token } = req.body;

  if (!repo || !files || !Array.isArray(files)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const fileContents = [];
    for (const filePath of files) {
      const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3.raw"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
      }

      const content = await response.text();
      fileContents.push({ filePath, content });
    }

    // Generate tests using OpenAI
    const allTests = [];
    for (const { filePath, content } of fileContents) {
      const extension = filePath.split('.').pop().toLowerCase();

      // Language-specific prompt
      let testInstructions = "";
      if (extension === "java") {
        testInstructions = "Generate clean, minimal, and working JUnit 5 test cases for this Java file. Use assertEquals where needed.";
      } else if (extension === "py") {
        testInstructions = "Generate clean, minimal, and working Python unittest test cases for this Python file.";
      } else if (extension === "js") {
        testInstructions = "Generate clean, minimal, and working JavaScript test cases using Jest.";
      } else {
        testInstructions = "Generate clean, minimal, and working unit tests for this file based on its programming language.";
      }

      const prompt = `
You are an AI that writes unit tests.
${testInstructions}

File: ${filePath}
Code:
${content}

Write only the test code.
`;

      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful AI that writes professional unit tests." },
            { role: "user", content: prompt }
          ],
          temperature: 0
        })
      });

      if (!aiResponse.ok) {
        throw new Error(`OpenAI API error: ${aiResponse.statusText}`);
      }

      const aiData = await aiResponse.json();
      const testCode = aiData.choices?.[0]?.message?.content || "// No test generated";

      allTests.push({ file: filePath, test: testCode });
    }

    return res.json({ success: true, testCases: allTests });

  } catch (error) {
    console.error("❌ Error generating tests:", error);
    return res.status(500).json({ error: "Failed to generate tests", details: error.message });
  }
});

// Start server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
