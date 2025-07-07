
// 後端API: 處理前都請求，將資料存進資料庫，把查詢到的資料回傳JSON給前端

const express = require("express");  // 引入 Express 框架
const cors = require("cors");   // 允許跨來源請求

const gmailRoutes = require("./gmail_insert.js"); // 引入 gamil API 路由
const activityRoutes = require("./activity_insert.js"); // 引入 Activity API 路由
const calendarRoutes = require("./callevent_toCalendar.js"); // 引入 Calendar API 路由
const register_clubRoutes = require("./register_club_server.js"); // 引入註冊社團API 路由
const register_userRoutes = require("./register_user_server.js"); // 引入註冊一般使用者API 路由
const login_userRoutes = require("./login_user_server.js");  // 引入登入社團API 路由
const login_clubRoutes = require("./login_club_server.js");  // 引入登入一般使用者API 路由

const app = express();  // 建立 Express 伺服器
app.use(express.json()); // 解析 JSON 格式的請求
app.use(express.urlencoded({ extended: true }));  // 解析 URL 編碼的請求
app.use(cors());  // 允許跨域請求（讓前端能夠請求 API）

app.use('/submit', gmailRoutes);  // Gmail 表單路由
app.use('/activity', activityRoutes);  // Activity 表單路由
app.use('/events', calendarRoutes);  // Calendar 表單路由
app.use('/register_club', register_clubRoutes);  // 註冊社團表單路由
app.use('/register_user', register_userRoutes);  // 註冊使用者表單路由
app.use('/login_club', login_clubRoutes);  // 登入社團表單路由
app.use('/login_user', login_userRoutes);  // 登入使用者表單路由


// 啟動伺服器，監聽 8080 port
const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
