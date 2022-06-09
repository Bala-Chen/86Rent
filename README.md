# 86Rent 租屋媒合服務

86Rent是一個以租屋服務為主的網站，其主要內容包含：
1. 任何人都可以搜尋尚未出租的房子，並查看其詳細資料
2. 若註冊身份為房東，可以上架想出租的房子，並在上架後進行管理及出租後可為房客開立房租帳單
3. 若註冊身份為房客，可以預約看尚未出租的房子，並在出租後可進行房租線上付款

## Demo
Demo Link：https://86-rent.com

Londload Test Account：guava1234@abc.com
Londload Test Password：guavatest

Tanant Test Account：orange1234@abc.com
Tanant Test Password：orangetest
CreditCard Number：4242-4242-4242-4242
CreditCard Valid Date：01/23
CreditCard CVV：123

## 使用技術
- Node.js Express
- RESTful API架構實現專案功能
- 利用Redis儲存session中的數據
- 利用Nginx設定HTTPS網頁透過SSL憑證加密連線
- 專案建構於AWS EC2
- 房屋照片儲存於AWS S3，並搭配cloudfront做CDN加速圖片的讀取速度
- MySQL儲存網站會員資料及房屋資料
- 串接TapPay SDK實現租金繳款功能
- 串接Google reCAPTCHA驗證是否為機器人

## 功能介紹

#### 首頁搜尋
可以選擇縣市及搜尋關鍵字(根據案名及地址)來尋找合適租屋，都不輸入按找房子則會跳出所有結果
![Imgur](https://i.imgur.com/HwrYiH6.png)