<div dir="rtl" align="right">

# ⚡️ قالب اشتراک XUI Panel ⚡️

> **اگر به توضیحات انگلیسی نیاز دارید، فایل [Readme for English](readme.md) را ببینید.**

> **این یک قالب اشتراک سفارشی برای XUI Panel است که نمای روشنی از جزئیات سرویس از جمله میزان مصرف، تاریخ انقضا و موارد دیگر ارائه می‌دهد.**  

**ما نیازی به حمایت مالی نداریم، تنها یک ستاره (⭐) کافی است. سپاسگزاریم.**  

## نصب و بروزرسانی  

```bash
bash <(curl -Ls https://raw.githubusercontent.com/dev-ir/xui-subscription-template/refs/heads/master/main.sh )
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

<p align="right">
    <img width="100%" src="https://github.com/user-attachments/assets/629f455d-58c8-4b9b-b722-2948b39a9511" alt="تصویر">
</p>  

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

- USDT (TRC20): `TVUqVMoCEe5DVUoxmPg8MwmgcHvZLqLjr4`  

## 📧 عضویت در کانال تلگرام  

TG : [https://t.me/+EpErnDsDPhw3ZThk](https://t.me/+EpErnDsDPhw3ZThk)  

## تعداد ستاره‌ها در طول زمان  
[![Stargazers over time](https://starchart.cc/dev-ir/XUI-Subscription-Template.svg?variant=adaptive)](https://starchart.cc/dev-ir/XUI-Subscription-Template)  

</div>
```
