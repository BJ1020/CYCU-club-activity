const express = require("express"); // 使用 Express.js 建立 API 伺服器
const pool = require("./config"); // 從 config.js 匯入 MySQL 連線池
const router = express.Router(); // 使用 Express 路由

console.log("login_user_server.js 已載入");
router.post('/', async (req, res) => {
    const { account, password } = req.body;
    console.log('收到帳號:', account, '密碼:', password);

    try {
        
        
        const [results] = await pool.query(
            'SELECT * FROM `cycu_activity`.`一般使用者註冊帳密` WHERE `帳號` = ?',
            [account]
        );


         console.log('查詢結果:', results);

        if (results.length === 0)  // 查無帳號
            return res.json({ success: false, message: '您尚未註冊過帳號' });

        // 檢查密碼是否正確(results[0] 就是那一筆資料的物件，results[0].密碼 就是那筆資料的「密碼」)
        if (results[0].密碼 === password) 
            return res.json({ success: true, message: '密碼正確，登入成功' });
        else 
            return res.json({ success: false, message: '密碼錯誤，請重新輸入' });
        

    } // try
    catch (err) {
        console.error('資料庫連線失敗:', err);
        return res.status(500).json({ success: false, message: '資料庫發生錯誤' });
    } // catch
});

module.exports = router; // 匯出路由