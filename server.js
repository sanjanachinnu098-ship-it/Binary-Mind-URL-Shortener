const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = 3000;

const urls = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/shorten", (req, res) => {
    const { longUrl } = req.body;

    try {
        const parsedUrl = new URL(longUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        const shortCode = crypto.randomBytes(3).toString("hex");

        urls[shortCode] = {
            longUrl,
            clicks: 0
        };

        res.json({
            shortUrl: `http://localhost:${PORT}/${shortCode}`
        });

    } catch {
        res.status(400).json({ error: "Invalid URL" });
    }
});

app.get("/:code", (req, res) => {
    const link = urls[req.params.code];

    if (!link) {
        return res.status(404).send("Short URL not found");
    }

    link.clicks++;
    res.redirect(link.longUrl);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});