# **LWS Job Board Backend API**

**LWS Job Board অ্যাসাইনমেন্টের** প্রয়োজনীয় ডকুমেন্টেশন ও ইমপ্লিমেন্টেশন গাইডলাইন নিম্নের লিংকে প্রদান করা হয়েছে:
➡️ **[API Documentation](https://documenter.getpostman.com/view/9649334/2sB3dQup5e)**

ডকুমেন্টেশনে বর্ণিত নির্দেশনা অনুযায়ী API ব্যবহার করার জন্য প্রথমে **ব্যাকএন্ড সার্ভার চালু** করতে হবে। তাই নিচের **স্টেপ ১** অনুসরণ করে ব্যাকএন্ড সার্ভার রান করুন এবং এরপর Postman ব্যবহার করে অ্যাসাইনমেন্টের API গুলো টেস্ট করুন।

> **গুরুত্বপূর্ণ:**
> সার্ভার ডিফল্টভাবে **9000 পোর্টে** রান করবে।
> **অ্যাসাইনমেন্টের ক্ষেত্রে এই পোর্ট পরিবর্তন করা যাবে না।**

---

## **স্টেপ ১: Backend Setup**

### **1. রিপোজিটরি ক্লোন করুন**

ধরে নেওয়া হচ্ছে, আপনি ইতোমধ্যে GitHub থেকে প্রজেক্টটি ক্লোন করেছেন। এখন টার্মিনাল ওপেন করে নিশ্চিত করুন যে আপনি **backend** ফোল্ডারের **রুট লেভেলে** অবস্থান করছেন।

### **2. প্রয়োজনীয় ডিপেনডেন্সি ইনস্টল করুন**

সার্ভার চালানোর আগে Node.js এর প্রয়োজনীয় ডিপেনডেন্সি ইনস্টল করতে হবে:

```bash
npm install
```

### **3. সার্ভার চালু করুন**

ডিপেনডেন্সি ইনস্টল সম্পন্ন হলে নিচের কমান্ডটি চালিয়ে সার্ভার শুরু করুন:

```bash
npm run dev
```

সার্ভার সফলভাবে রান হলে এটি অ্যাক্সেসযোগ্য হবে:

```
http://localhost:9000
```

---

# ✅ **অতিরিক্ত তথ্য (ইউজার ও কোম্পানি প্রোফাইল)**

অ্যাসাইনমেন্ট সহজে টেস্ট করার জন্য সিস্টেমে কয়েকটি **User Profile** এবং **Company Profile** আগে থেকেই তৈরি করে রাখা হয়েছে।
সমস্ত ইউজারের পাসওয়ার্ড একই:

### 🔐 **ডিফল্ট পাসওয়ার্ড:**

```
SecurePass123!
```

---

# 👤 **User List (All users use the same password)**

| Email                                                           | Name           | Title                     |
| --------------------------------------------------------------- | -------------- | ------------------------- |
| [john.carter@example.com](mailto:john.carter@example.com)       | John Carter    | Full Stack Developer      |
| [emma.johnson@example.com](mailto:emma.johnson@example.com)     | Emma Johnson   | Frontend Developer        |
| [liam.matthews@example.com](mailto:liam.matthews@example.com)   | Liam Matthews  | Backend Engineer          |
| [olivia.bennett@example.com](mailto:olivia.bennett@example.com) | Olivia Bennett | Data Analyst              |
| [aiden.clarke@example.com](mailto:aiden.clarke@example.com)     | Aiden Clarke   | Full Stack Developer      |
| [bella.harmon@example.com](mailto:bella.harmon@example.com)     | Bella Harmon   | UI/UX Designer            |
| [caleb.jennings@example.com](mailto:caleb.jennings@example.com) | Caleb Jennings | Backend Engineer          |
| [daisy.monroe@example.com](mailto:daisy.monroe@example.com)     | Daisy Monroe   | Product Designer          |
| [evan.parker@example.com](mailto:evan.parker@example.com)       | Evan Parker    | Data Analyst              |
| [fiona.gray@example.com](mailto:fiona.gray@example.com)         | Fiona Gray     | Mobile Developer          |
| [gavin.stone@example.com](mailto:gavin.stone@example.com)       | Gavin Stone    | DevOps Engineer           |
| [hannah.reed@example.com](mailto:hannah.reed@example.com)       | Hannah Reed    | Content Designer          |
| [ian.foster@example.com](mailto:ian.foster@example.com)         | Ian Foster     | Machine Learning Engineer |
| [jenna.wells@example.com](mailto:jenna.wells@example.com)       | Jenna Wells    | Product Manager           |
| [kellan.rhodes@example.com](mailto:kellan.rhodes@example.com)   | Kellan Rhodes  | Software Engineer         |
| [lena.brooks@example.com](mailto:lena.brooks@example.com)       | Lena Brooks    | Digital Marketer          |
| [mason.cole@example.com](mailto:mason.cole@example.com)         | Mason Cole     | Full Stack Engineer       |
| [nora.ellis@example.com](mailto:nora.ellis@example.com)         | Nora Ellis     | Data Scientist            |
| [oscar.tate@example.com](mailto:oscar.tate@example.com)         | Oscar Tate     | Cloud Engineer            |
| [piper.lane@example.com](mailto:piper.lane@example.com)         | Piper Lane     | Frontend Developer        |
| [quinn.hayes@example.com](mailto:quinn.hayes@example.com)       | Quinn Hayes    | SEO Specialist            |
| [riley.summers@example.com](mailto:riley.summers@example.com)   | Riley Summers  | Business Analyst          |
| [sasha.porter@example.com](mailto:sasha.porter@example.com)     | Sasha Porter   | Cybersecurity Analyst     |
| [troy.maddox@example.com](mailto:troy.maddox@example.com)       | Troy Maddox    | Software Engineer         |

---

# 🏢 **Company List**

| Email                                                                   | Company Name   |
| ----------------------------------------------------------------------- | -------------- |
| [contact@google-example.com](mailto:contact@google-example.com)         | Google         |
| [contact@meta-example.com](mailto:contact@meta-example.com)             | Meta           |
| [contact@netflix-example.com](mailto:contact@netflix-example.com)       | Netflix        |
| [contact@amazon-example.com](mailto:contact@amazon-example.com)         | Amazon         |
| [admin@microsoft.com](mailto:admin@microsoft.com)                       | Microsoft Inc. |
| [contact@apple-example.com](mailto:contact@apple-example.com)           | Apple          |
| [contact@tesla-example.com](mailto:contact@tesla-example.com)           | Tesla          |
| [contact@ibm-example.com](mailto:contact@ibm-example.com)               | IBM            |
| [contact@spotify-example.com](mailto:contact@spotify-example.com)       | Spotify        |
| [contact@adobe-example.com](mailto:contact@adobe-example.com)           | Adobe          |
| [contact@oracle-example.com](mailto:contact@oracle-example.com)         | Oracle         |
| [contact@salesforce-example.com](mailto:contact@salesforce-example.com) | Salesforce     |
| [contact@intel-example.com](mailto:contact@intel-example.com)           | Intel          |
| [contact@cisco-example.com](mailto:contact@cisco-example.com)           | Cisco          |
| [contact@sap-example.com](mailto:contact@sap-example.com)               | SAP            |
| [contact@slack-example.com](mailto:contact@slack-example.com)           | Slack          |
| [contact@zoom-example.com](mailto:contact@zoom-example.com)             | Zoom           |
| [contact@shopify-example.com](mailto:contact@shopify-example.com)       | Shopify        |
| [contact@airbnb-example.com](mailto:contact@airbnb-example.com)         | Airbnb         |
| [contact@twitter-example.com](mailto:contact@twitter-example.com)       | Twitter        |
| [contact@tiktok-example.com](mailto:contact@tiktok-example.com)         | TikTok         |
| [contact@reddit-example.com](mailto:contact@reddit-example.com)         | Reddit         |
| [contact@dropbox-example.com](mailto:contact@dropbox-example.com)       | Dropbox        |
| [contact@nvidia-example.com](mailto:contact@nvidia-example.com)         | NVIDIA         |
| [contact@amd-example.com](mailto:contact@amd-example.com)               | AMD            |
| [contact@paypal-example.com](mailto:contact@paypal-example.com)         | PayPal         |
| [contact@stripe-example.com](mailto:contact@stripe-example.com)         | Stripe         |
| [contact@uber-example.com](mailto:contact@uber-example.com)             | Uber           |
| [contact@lyft-example.com](mailto:contact@lyft-example.com)             | Lyft           |
| [contact@pinterest-example.com](mailto:contact@pinterest-example.com)   | Pinterest      |
