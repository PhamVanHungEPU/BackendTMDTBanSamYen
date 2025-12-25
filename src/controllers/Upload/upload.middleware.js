const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const idBoDe = req.params.idBoDe;
    const dir = path.join(__dirname, `../../public/excel/`);
    require('fs').mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'uploaded' + ext);
  },
});

module.exports = multer({ storage });
