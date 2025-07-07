// 將輸入的活動表單資訊存入資料庫中

const express = require("express"); // 使用 Express.js 建立 API 伺服器
const pool = require("./config"); // 從 config.js 匯入 MySQL 連線池
const router = express.Router(); // 使用 Express 路由



// API路由：接收表單資料，插入到資料庫
router.post("/", async (req, res) => {
  console.log("收到請求:", req.body);
  const { department, introduction, location, ig, activities } = req.body;

  if (!department || !introduction || !location || !ig || !Array.isArray(activities)) {
      return res.status(400).json({ success: false, message: "缺少必要的參數或活動資料格式不正確" });
  }

  try {
      // 插入社團資訊
      const [Club_msn] = await pool.execute(
          "INSERT INTO `社團帳號登錄` (`department`, `introduction`, `location`, `ig`) VALUES (?, ?, ?, ?)",
          [department, introduction, location, ig]
      );

      console.log("社團帳號插入成功:", Club_msn);


      // 插入活動資訊
      const Activity_msn = activities.map(async activity => {
          try {
              await pool.execute(
                  "INSERT INTO `活動資訊` (`activity_name`, `activity_date`, `activity_time`, `activity_venue`, `activity_cost`, `activity_details`) VALUES (?, ?, ?, ?, ?, ?)",
                  [
                      activity.name,
                      activity.date,
                      activity.time,
                      activity.venue,
                      activity.cost,
                      activity.details,
                  ]
              );
              console.log(`活動插入成功: ${activity.name}`);
          } catch (error) {
              console.error(`活動插入失敗: ${activity.name}`, error.message);
              throw error; // 如果需要中止操作，可以拋出錯誤
          }
      });

      await Promise.all(Activity_msn); // 等待所有活動插入完成
      console.log("所有活動資訊插入成功");
      console.log("回應資料:", { success: true, message: "資料插入成功！" });
      res.json({ success: true, message: "資料插入成功！" });
    } catch (error) {
        console.error("資料插入失敗:", error.message, error.stack);
        if (error.code === "ER_NO_SUCH_TABLE") {
            res.status(500).json({ success: false, message: "資料表不存在，請檢查資料庫結構。" });
        } else {
            res.status(500).json({ success: false, message: "資料插入失敗", error: error.message });
        }
    }
});

module.exports = router; // 匯出路由
