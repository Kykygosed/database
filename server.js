const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Dossier pour stocker les fichiers
const BASE_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });

// Multer pour gérer les uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, BASE_DIR),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Upload de fichiers
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Fichier uploadé !', filename: req.file.originalname });
});

// Création de dossiers
app.post('/mkdir', (req, res) => {
  const { name } = req.body;
  const folderPath = path.join(BASE_DIR, name);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
  res.json({ message: 'Dossier créé !', folder: name });
});

// Liste des fichiers/dossiers
app.get('/files', (req, res) => {
  const files = fs.readdirSync(BASE_DIR);
  res.json({ files });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
