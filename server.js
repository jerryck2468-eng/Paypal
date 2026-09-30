const express = require("express");
const path = require("path");

const app = express();

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Demo Admin"');
    return res.status(401).send("Admin login required.");
  }

  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
  const separator = decoded.indexOf(":");

  if (separator === -1) {
    return res.status(401).send("Unauthorized.");
  }

  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    res.set("WWW-Authenticate", 'Basic realm="Demo Admin"');
    return res.status(401).send("Unauthorized.");
  }

  next();
}

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

app.get("/api/demo-submissions", requireAdmin, (req, res) => {
  res.json({
    count: submissions.length,
    submissions
  });
});

app.get("/admin", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.delete("/api/demo-submissions/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);

  const index = submissions.findIndex((submission) => submission.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Submission not found."
    });
  }

  const deleted = submissions.splice(index, 1)[0];

  res.json({
    success: true,
    deleted
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
