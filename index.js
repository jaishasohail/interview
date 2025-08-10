const express = require('express');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const logger = require('./middleware/logger');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const app = express();
app.use(express.json());
app.use(logger);
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
