<!DOCTYPE html>  <!-- 宣告此檔案型態 -->
<html lang="zh-TW"> <!-- 設定語言為英文 -->
<head>  <!-- head標籤，這裡放的是不直接顯示在頁面上的設定，如標題/樣式/meta 資訊等 -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- 設定響應式網頁視窗，讓頁面在手機等不同裝置上正常顯示 -->
    <title>一般使用者註冊頁面</title>

    <style>
        /* 從 Google Fonts 載入「Huninn（和風雲黑體）」這個網頁字型 */
        @import url('https://fonts.googleapis.com/css2?family=Huninn&display=swap');  

        body {
            font-family: "Huninn", sans-serif;  /* 使用 Huninn 字型 */
            background-color: white; /* 白色背景 */
        }

        header {
            background-color: #5f5656; /* 深灰色背景 */
            color: white; /* 白色文字 */  
            font-size: 30px; /* 標題字體大小 */
            padding: 1rem; /* 內部邊距 */
            text-align: center; /* 文字置中 */
        }

        .a2 {
            color: #bbbbbb; /* 淺灰色文字 */
            text-decoration: none; /* 去除下劃線 */
            text-align: center; /* 文字置中 */
            display: inline-block; /* 讓 padding 生效 */
        }


        .center-box {
            background: f4f4f4; /* 淺灰色背景 */
            border-radius: 12px; /* 圓角邊框 */
            box-shadow: 0 0 25px rgba(0,0,0,0.1); /* 陰影效果 */
            padding: 4rem 4rem; /* 上下左右內邊距 */
            max-height: 1000px; /* 最大高度 */
            max-width: 500px; /* 最大寬度 */
            margin: 60px auto;  /* 水平置中並與上方有距離 */
            text-align: center; /* 文字置中 */
            font-size: 20px;
            color: #000000 /* 黑色文字 */
        }

        button {
            width: 100%;
            font-size: 20px; /* 按鈕字體大小 */     
            padding: 0.7rem;
            background-color: #938888;
            color: white;
            border: none;
            border-radius: 5px;
        }
    
        main { margin: 2rem;}

        input {
            width: 100%; /* 輸入框寬度 */
            padding: 0.3rem; /* 輸入框內部邊距 */
            margin: 0.5rem 0.5rem; /* 輸入框上下邊距 */
            font-size: 20px; /* 輸入框字體大小 */
            padding-left: 1rem;  /* 增加左側內邊距 */
            padding-right: 1rem; /* 增加右側內邊距 */
            box-sizing: border-box;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
        }


    </style>

</head>

<body> <!-- body標籤，這裡的內容會顯示在瀏覽器畫面上 -->
    <header>
        <h1>一般使用者註冊</h1>
    </header>
    <main class="center-box">
        <form id="register_user_form"> 

            <div class="form-group" style="text-align: center;">
                <label for="account">帳號:</label>
                <input type="text" id="account" name="account" required>
                <span id="accountError" style="color: rgb(183, 44, 44); margin-left: 10px;"></span>

                <label for="password">密碼:</label>
                <input type="text" id="password" name="password" required>
                <span id="passwordError" style="color: rgb(183, 44, 44); margin-left: 10px;"></span>

                <label for="email">Email:</label>
                <input type="text" id="email" name="email" required>
                <span id="emailError" style="color: rgb(183, 44, 44); margin-left: 10px;"></span><br><br>


            </div>

            <button type="submit">下一步</button>

        </form>


        <script>
            function validate() {
                let valid = true; // 變數用來判斷是否有錯誤
                let account = document.getElementById("account").value.trim();
                let password = document.getElementById("password").value.trim();
                let email = document.getElementById("email").value.trim();

                let accountError = document.getElementById("accountError");
                let passwordError = document.getElementById("passwordError");
                let emailError = document.getElementById("emailError");

                accountError.innerHTML = ""; // 清除舊的錯誤訊息
                passwordError.innerHTML = "";
                emailError.innerHTML = "";

                if (account === "") {
                    accountError.innerHTML = "您尚未填寫";
                    valid = false;
                } // if
                if (password === "") {
                    passwordError.innerHTML = "您尚未填寫";
                    valid = false;
                } // if
                if (email === "") {
                    emailError.innerHTML = "您尚未填寫";
                    valid = false;
                } else {
                    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailPattern.test(email)) {
                        emailError.innerHTML = "<span style='font-size: 16px;'>* 電子郵件格式不正確</span>";
                        
                        valid = false;
                    } // if
                } // else

                return valid; // 若 valid 為 false，表單不會提交
            } // 表單驗證函數



            
            document.getElementById("register_user_form").addEventListener("submit", function(e) {
                if (!validate()) {
                    e.preventDefault(); // 阻止表單提交
                } else {
                    const form = e.target;
                    const formData = new FormData(form);
                    fetch("http://localhost:8080/register_user", {
                        method: 'POST', // 使用 POST 方法
                        headers: { 'Content-Type': 'application/json'}, // 設定請求頭為 JSON
                        body: JSON.stringify({  // 將表單資料轉換為 JSON 字串
                            account: document.getElementById('account').value,
                            password: document.getElementById('password').value,
                            email: document.getElementById('email').value,
                        })
                    })

                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                        return res.json();  // 這裡不會拋錯，除非伺服器真的回傳 JSON
                    })
                    
                    .then(data => {
                        if(data.success) {
                            alert("註冊成功！");
                            window.location.href = "login_user.html"; // 跳轉到登入頁
                        } // if
                        else
                            alert(data.message || "您已經註冊過帳號，請直接登入。");
                    });
                }
            });


            document.getElementById("email").addEventListener("input", function() {
                const email = document.getElementById("email").value.trim();
                const emailError = document.getElementById("emailError");
                const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

                if (email === "") 
                    emailError.innerHTML = "<span style='font-size: 16px;'>* 必填</span>";
                else if (!emailPattern.test(email)) 
                    emailError.innerHTML = "<span style='font-size: 16px;'>* 電子郵件格式不正確</span>";
                else 
                    emailError.innerHTML = "";
                
            });
        </script>

        <div style="margin-top: 1.5rem;">         
            <a class="a2">還沒登入使用者帳號嗎?</a>
            <a class="a2" href="login_user.html" style="text-decoration: underline;">快點我登入吧!</a>
            <a class="a2" href="R&L_index.html" style="text-decoration: underline";>回首頁</a>
        </div>  
    </main>

</body>
</html>