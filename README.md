# 86Rent 租屋媒合服務

86Rent是一個以租屋服務為主的網站，其主要內容包含：
1. 任何人都可以搜尋尚未出租的房子，並查看其詳細資料
2. 若註冊身份為房東，可以上架想出租的房子，並在上架後進行管理及出租後可為房客開立房租帳單
3. 若註冊身份為房客，可以預約看尚未出租的房子，並在出租後可進行房租線上付款

## Demo
Demo Link：https://86-rent.com <br>

Londload Test Account：guava1234@abc.com <br>
Londload Test Password：guavatest <br>

Tanant Test Account：orange1234@abc.com <br>
Tanant Test Password：orangetest <br>
CreditCard Number：4242-4242-4242-4242 <br>
CreditCard Valid Date：01/23 <br>
CreditCard CVV：123 <br>

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

### 首頁搜尋
可以選擇縣市及搜尋關鍵字(根據案名及地址)來尋找合適租屋，都不輸入按找房子則會跳出所有結果
![Imgur](https://i.imgur.com/HwrYiH6.png)
### 搜尋結果
搜尋頁面可以篩選條件、條件排序，點選查看詳情可以看該房屋的詳情
![Imgur](https://i.imgur.com/gi2zXaS.png)
### 房屋詳情&房客預約
房屋詳情頁面可以查看有關該房屋的詳細資料，房客轉到最下方可以預約該房子的看屋時間
![Imgur](https://i.imgur.com/uXSCsFe.png)
![Imgur](https://i.imgur.com/Kbqrs1V.png)
### 註冊功能(表單以房客為例)
註冊頁面可選擇房東身份或房客身份，一個email只能申請其中一種身份，註冊表單則有reCAPTCHA驗證是否為機器人
![Imgur](https://i.imgur.com/ToA2WPt.png)
![Imgur](https://i.imgur.com/F4Ln4kU.png)
### 房客會員系統
房客系統分為兩大功能，一為出租後的租屋管理，二為確認預約房屋的資料
![Imgur](https://i.imgur.com/hqc1VOC.png)
![Imgur](https://i.imgur.com/gKFIUov.png)