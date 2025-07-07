const express = require("express"); // 使用 Express.js 建立 API 伺服器
const pool = require("./config"); // 從 config.js 匯入 MySQL 連線池
const router = express.Router(); // 使用 Express 路由

// 定義路由：處理活動資訊的查詢
router.get("/", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(
                "SELECT activity_name, activity_date, activity_time FROM 活動資訊"
            );

            // 印出取得的資料到伺服器控制台
            console.log("取得的活動資料：", results);


            // 將資料轉換為 JSON 格式
            const events = results.map((row) => {
                // 確保 activity_date 是字串，並組合為 ISO 格式
                const activityDate = new Date(row.activity_date).toISOString().split("T")[0]; // 確保日期部分
                const startDateTime = `${activityDate}T${row.activity_time}`; // 組合日期和時間
                return {
                    title: row.activity_name,
                    start: new Date(startDateTime).toISOString(), // 確保格式正確
                };
            });

            res.json(events); // 回傳 JSON
        } finally {
            connection.release(); // 釋放連線
        }
    } catch (err) {
        console.error("查詢活動資料失敗：", err.message);
        res.status(500).json({ error: "伺服器錯誤" });
    }
});

module.exports = router;