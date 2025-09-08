<div dir="rtl" align="right">

# ⚡️ قالب اشتراک XUI Panel ⚡️

> **این یک قالب اشتراک سفارشی برای XUI Panel است که نمای روشنی از جزئیات سرویس از جمله میزان مصرف، تاریخ انقضا و موارد دیگر ارائه می‌دهد.**  

**ما نیازی به حمایت مالی نداریم، تنها یک ستاره (⭐) کافی است. سپاسگزاریم.**  

## نصب و بروزرسانی  

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mzydev/3x-ui-template/refs/heads/master/main.sh )
```  

## فایل پیکربندی  

```bash
nano /opt/sixtininelearn/sixtininelearn.config
```  
پس از تغییر فایل پیکربندی، باید سرویس را مجدداً راه‌اندازی کنید.  

```bash
systemctl restart sixtininelearn_template
systemctl status sixtininelearn_template
```  
**شما نباید از پورت‌های 2082 و 2083 استفاده کنید.**  

## فایل قالب  

```bash
nano /opt/sixtininelearn/views/sub.ejs
```  
اگر می‌خواهید قالب خود را ایجاد کنید، از این مسیر استفاده کنید.  

## 🪚 پیش‌نمایش  


## متغیرهای پویا  

<details>
  <summary>کلیک کنید برای جزئیات متغیرهای پویا</summary>  

این قالب از متغیرهای پویا زیر برای نمایش اطلاعات کاربران استفاده می‌کند:  

| متغیر                   | توضیح                              |
|-------------------------|-----------------------------------|
| `<%= data.id %>`        | شناسه کاربر یا اشتراک.           |
| `<%= data.email %>`     | آدرس ایمیل کاربر.                |
| `<%= data.suburl %>`    | لینک اشتراک.                     |
| `<%= data.enable %>`    | وضعیت اشتراک (true/false).       |
| `<%= data.up %>`        | داده آپلود شده (بایت).           |
| `<%= data.down %>`      | داده دانلود شده (بایت).          |
| `<%= data.total %>`     | مجموع داده مجاز (بایت).          |
| `<%= data.expiryTime %>`| زمان انقضا (timestamp).          |
| `<%= data.inboundId %>` | شناسه اتصال ورودی.               |

از مدیریت اشتراک ساده و کاربرپسند با این قالب لذت ببرید!  
</details>  

## 🙏 پشتیبانی با کریپتو  



## 📧 عضویت در کانال تلگرام  


[![Telegram](https://img.shields.io/badge/Telegram--0088CC?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/+txKWAI5Y5dI3NTg0) 
[![YouTube](https://img.shields.io/badge/YouTube--FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@sixtininelearn/videos)
</div>
```
