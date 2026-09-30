const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory storage for this demo.
// Data is cleared whenever the server restarts.
const submissions = [];

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/demo-submissions", (req, res) => {
  const { demoEmail, demoMessage } = req.body || {};

  if (typeof demoEmail !== "string" || typeof demoMessage !== "string") {
    return res.status(400).json({
      error: "Both demoEmail and demoMessage are required."
    });
  }

  const email = demoEmail.trim();
  const message = demoMessage.trim();

  if (!email || !message) {
    return res.status(400).json({
      error: "Both demo fields must contain test information."
    });
  }

  if (email.length > 160 || message.length > 1000) {
    return res.status(400).json({
      error: "Demo fields exceed the allowed length."
    });
  }

  const submission = {
    id: submissions.length + 1,
    demoEmail: email,
    demoMessage: message,
    submittedAt: new Date().toISOString()
  };

  submissions.push(submission);

  res.status(201).json({
    success: true,
    submission
  });
});

app.get("/api/demo-submissions", (req, res) => {
  res.json({
    count: submissions.length,
    submissions
  });
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/") || req.path === "/health") {
    return next();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Demo Name server running on port ${PORT}`);
});
