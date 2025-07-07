const express = require("express"); // 使用 Express.js 建立 API 伺服器
const pool = require("./config"); // 從 config.js 匯入 MySQL 連線池
const router = express.Router(); // 使用 Express 路由


router.post('/', async (req, res) => {
    const { account, password, email, avatar, nickname } = req.body; // 確保解構所有必要欄位

    try {

        if (!account || !password || !email || !avatar || !nickname) 
            return res.status(400).json({ success: false, message: '缺少必要的欄位' });

        const [results] = await pool.query(
            'SELECT * FROM `cycu_activity`.`一般使用者註冊帳密` WHERE `帳號` = ?',
            [account]
        );

        if (results.length > 0)  // 如果查詢有結果，代表帳號已經存在
            return res.json({ success: false, message: '您已經註冊過帳號' });
        else {

            // 若帳號不存在，新增到資料庫
            await pool.query(
                'INSERT INTO `cycu_activity`.`一般使用者註冊帳密` (`帳號`, `密碼`, `Email`, `頭貼路徑`, `暱稱`) VALUES ( ?, ?, ?, ?, ?)',
                [account, password, email, avatar, nickname]
            );
            return res.json({ success: true, message: '註冊帳號成功' });

        } // else

    } // try
    catch (err) {
        console.error('資料庫連線失敗:', err);
        return res.status(500).json({ success: false, message: '資料庫發生錯誤' });
    } // catch
});

module.exports = router; // 匯出路由