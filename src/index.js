const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Configurar multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded");
    return;
  }

  const inputPath = `uploads/${Date.now()}_${req.file.originalname}`;
  const outputPath = `transcoded/${Date.now()}_transcoded.mp4`;

  // Guardar archivo en el servidor
  fs.writeFileSync(inputPath, req.file.buffer);

  // Ejecutar FFmpeg para transcodificar el video
  exec(
    `ffmpeg -i ${inputPath} -c:v libx264 -preset veryfast -c:a aac -strict experimental ${outputPath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing FFmpeg: ${error}`);
        res.status(500).send("Transcoding failed");
        return;
      }
      console.log(`Transcoding successful. Output file: ${outputPath}`);
      res.status(200).sendFile(outputPath);
    }
  );
});

app.get("/", (req, res) => {
  return res.json({ message: "active" });
});
