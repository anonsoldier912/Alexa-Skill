import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

app.get("/resolve", (req, res) => {
  // 🔐 simple auth
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${SECRET}`) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing query" });
  }

  // yt-dlp search + extract audio stream
  exec(
    `yt-dlp -f bestaudio -g "ytsearch1:${q}"`,
    { timeout: 15000 },
    (err, stdout, stderr) => {
      if (err || !stdout) {
        return res.status(500).json({
          error: "yt-dlp failed",
          details: stderr
        });
      }

      res.json({
        streamUrl: stdout.trim()
      });
    }
  );
});

app.get("/", (_, res) => {
  res.send("yt-dlp resolver running ✅");
});

app.listen(PORT, () =>
  console.log(`yt-dlp server running on port ${PORT}`)
);
