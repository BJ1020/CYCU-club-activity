// gmail API: 將接收的gmial資訊存至資料庫中

const express = require("express"); // 使用 Express.js 建立 API 伺服器
const pool = require("./config"); // 從 config.js 匯入 MySQL 連線池
const router = express.Router(); // 使用 Express 路由

// 定義 API 端點來處理 Gmail 表單提交
router.post("/", async (req, res) => {


    try {
        console.log("收到請求:", req.body);// ✅ 檢查請求是否有收到資料
        const { Activity_name, Email } = req.body ;  // 從請求體中獲取表單資料

        let errors = [] ;
        if ( !Activity_name) errors.push("* 尚未輸入社團名稱" ) ;
        if ( !Email ) errors.push("* 尚未輸入電子郵件") ;

        else if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email) ) 
            errors.push( "* 電子郵件格式不正確" ) ;

        if ( errors.length > 0 )   // 如果有錯誤 回傳錯誤訊息
            return res.status(400).json({ success: false, errors }) ;


        // 插入資料到 MySQL
        await pool.execute(
            "INSERT INTO Gmail (Activity_name, Email) VALUES (?, ?)",
            [Activity_name, Email]
        );

        
        // 僅回傳成功狀態
        res.status(200).json({ success: true, message: "資料已成功存入資料庫" });
    
    } catch (error) {

        console.error("資料插入失敗", error) ;
        res.status(500).json({ success: false, message: "資料插入失敗" }) ;

    } // try

});

module.exports = router; // 匯出路由
