

const mysql = require("mysql2/promise") ; // mysql2是Node.js的MySQL資料庫驅動比mysql更高效


// 建立MySQL連線池
const pool = mysql.createPool({
  host: "localhost",
  user: "11127109",
  password: "0000",
  database: "cycu_activity",
  waitForConnections: true,   // 若所有連線都在使用中，是否等待可用連線（true表示等候，避免錯誤）
  connectionLimit: 100,        // 最大同時連線數量
  queueLimit: 0,              // 排隊請求上限（0 代表不限制）
  charset: "utf8mb4",         // 設定MySQL編碼格式
});


module.exports = pool ;