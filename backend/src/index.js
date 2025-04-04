const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/notifications/email", (req, res) => {
    const { to, subject, message } = req.body;
    console.log(`Email to: ${to}, subject: ${subject}, message: ${message}`);
    res.status(200).json({ message: "Email sent (simulated)" });
});

app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});
