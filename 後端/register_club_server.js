const express = require("express"); // 使用 Express.js 建立 API 伺服器
const pool = require("./config"); // 從 config.js 匯入 MySQL 連線池
const router = express.Router(); // 使用 Express 路由

const multer = require("multer"); // 引入multer庫


const path = require("path"); // 引入path模組，用於處理檔案路徑



// 設定 multer 儲存圖片的位置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/club_photo/'); // 圖片會存在 public/uploads 資料夾
  },
  filename: function (req, file, cb) {
    // 用時間戳記+原始檔名避免重複
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 限制上傳的檔案類型只允許 .jpg 和 .png
const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') 
    cb(null, true);
  else 
    cb(new Error('只允許上傳 .jpg 或 .png 檔案'), false);
  
};

const upload = multer({ storage: storage, fileFilter: fileFilter }); // 初始化 multer，設定儲存位置和檔案過濾器




router.post('/', (req, res) => {
  upload.single('club_image')(req, res, async function (err) {
    if (err) {
      if (req.file && req.file.path) { // 嘗試刪除已經上傳的檔案（如果有的話）
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) 
            console.error('刪除錯誤檔案失敗:', unlinkErr);
        });
      } // if
      return res.status(400).json({ success: false, message: err.message }); // 檔案格式錯誤時回傳自訂訊息
    } // if (err)

    const { account, password } = req.body;
    const clubImagePath = req.file ? '/club_photo/' + req.file.filename : null;

    try {
      const [results] = await pool.query(
        'SELECT * FROM `cycu_activity`.`社團註冊帳密` WHERE `帳號` = ? AND `密碼` = ?',
        [account, password]
      );
      if (results.length > 0) {
        await pool.query(
          'UPDATE `cycu_activity`.`社團註冊帳密` SET `圖片路徑` = ? WHERE `帳號` = ? AND `密碼` = ?',
          [clubImagePath, account, password]
        );
        return res.json({ success: true });
      } else {
        return res.json({ success: false, message: '帳號或密碼錯誤' });
      }
    } catch (err) {
      console.error('資料庫連線失敗:', err);
      return res.status(500).json({ success: false, message: '資料庫發生錯誤' });
    }
  });
});

module.exports = router; // 匯出路由