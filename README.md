# 🎯 رادار المستثمر | Investor Radar

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19.2-61DAFB)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**منصة احترافية لتحليل البيانات الاقتصادية والاستثمارية**

[العربية](#ar) • [English](#en)

</div>

---

## 🌟 نظرة عامة <a name="ar"></a>

**رادار المستثمر** هو منصة تحليلية شاملة توفر:
- 📊 لوحات بيانات تفاعلية
- 📈 إشارات السوق الذكية
- 🏛️ بيانات الجهات الرسمية السعودية
- 👥 متابعة الخبراء والمحللين
- 🤖 مساعد ذكي مدعوم بالـ AI

## ✨ الميزات الرئيسية

### 📊 **لوحات البيانات**
- لوحات رسمية من الجهات الحكومية
- إنشاء لوحات مخصصة
- مؤشرات تفاعلية متعددة الأنواع
- تحديث تلقائي للبيانات

### 🏛️ **الجهات الرسمية**
- وزارة الاستثمار
- الهيئة العامة للإحصاء
- البنك المركزي السعودي
- هيئة السوق المالية
- وزارة التجارة
- وزارة الطاقة

### 👥 **نظام المتابعة**
- متابعة الجهات الرسمية
- متابعة الخبراء والمحللين
- نظام توثيق متقدم
- مؤشرات التأثير

### 📈 **إشارات السوق**
- تنبيهات فورية
- تحليل AI
- مؤشرات الأداء
- توقعات ذكية

## 🏗️ البنية التقنية

### التقنيات المستخدمة:
```
Frontend:
├── React 19.2          # مكتبة الواجهة
├── TypeScript 5.8      # لغة البرمجة
├── Vite 6.2            # أداة البناء
├── TailwindCSS         # التنسيق
├── Lucide Icons        # الأيقونات
└── React Router 7.10   # التوجيه

State & Data:
├── React Hooks         # إدارة الحالة
├── LocalStorage        # التخزين المحلي
└── Context API         # البيانات المشتركة

Tools:
├── ESM                 # نظام الوحدات
└── TypeScript Strict   # وضع صارم
```

### البنية المعمارية:
```
src/
├── core/              # النواة الأساسية
│   ├── types/        # الأنواع المشتركة
│   ├── config/       # التكوينات
│   └── utils/        # الأدوات المساعدة
│
├── features/         # الميزات المستقلة
├── shared/           # المكونات المشتركة
├── services/         # الخدمات الخارجية
└── routes/           # التوجيه
```

## 🚀 البدء السريع

### المتطلبات:
- Node.js 18+ 
- npm 9+

### التثبيت:
```bash
# تحميل المشروع
git clone https://github.com/your-repo/investor-radar.git
cd investor-radar

# تثبيت الحزم
npm install

# تشغيل التطوير
npm run dev

# بناء الإنتاج
npm run build
```

### المتصفح:
```
افتح: http://localhost:3000
```

## 📁 هيكل المشروع

```
investor-radar/
├── src/                      # الكود المصدري
│   ├── core/                # النواة
│   │   ├── types/          # الأنواع
│   │   ├── config/         # التكوينات
│   │   └── utils/          # الأدوات
│   │
│   ├── features/           # الميزات
│   ├── shared/             # المشترك
│   ├── services/           # الخدمات
│   └── routes/             # التوجيه
│
├── components/             # المكونات (قديم)
├── dashboard/              # لوحة التحكم
├── public/                 # الملفات العامة
│
├── index.html             # HTML الرئيسي
├── index.tsx              # نقطة الدخول
├── App.tsx                # المكون الرئيسي
├── types.ts               # الأنواع (قديم)
├── constants.ts           # الثوابت (قديم)
│
├── package.json           # الحزم
├── tsconfig.json          # إعدادات TypeScript
├── vite.config.ts         # إعدادات Vite
├── tailwind.config.js     # إعدادات Tailwind
│
└── docs/                  # التوثيق
    ├── ARCHITECTURE_GUIDE.md
    ├── REFACTORING_PLAN.md
    └── FOLLOWERS_PAGE_UPDATES.md
```

## 📚 التوثيق

### الأدلة المتاحة:
- 📖 [دليل البنية المعمارية](./ARCHITECTURE_GUIDE.md)
- 🔧 [خطة إعادة البناء](./REFACTORING_PLAN.md)
- 👥 [تحديثات صفحة المتابعين](./FOLLOWERS_PAGE_UPDATES.md)

### الأدوات المساعدة:
```typescript
// التاريخ
import { formatDate, getRelativeTime } from '@/core/utils';

// التنسيق
import { formatCurrency, formatNumber } from '@/core/utils';

// التحقق
import { isValidEmail, validatePassword } from '@/core/utils';

// التخزين
import { setLocalStorage, getLocalStorage } from '@/core/utils';

// CSS Classes
import { cn, twMerge } from '@/core/utils';
```

## 🎨 التصميم

### نظام الألوان:
```css
Primary:   #3B82F6 (أزرق)
Secondary: #64748B (رمادي)
Success:   #10B981 (أخضر)
Warning:   #F59E0B (برتقالي)
Error:     #EF4444 (أحمر)
```

### الخطوط:
```css
Arabic:  IBM Plex Sans Arabic
English: Inter, Roboto
```

### المبادئ:
- ✅ RTL Support (دعم العربية)
- ✅ Responsive Design (تصميم متجاوب)
- ✅ Dark Mode Ready (جاهز للوضع الداكن)
- ✅ Accessibility (إمكانية الوصول)

## 🔧 الأوامر المتاحة

```bash
# التطوير
npm run dev          # تشغيل خادم التطوير
npm run build        # بناء الإنتاج
npm run preview      # معاينة البناء

# الجودة
npm run lint         # فحص الكود
npm run type-check   # فحص الأنواع
npm run format       # تنسيق الكود

# الاختبار (قريباً)
npm run test         # تشغيل الاختبارات
npm run test:watch   # وضع المراقبة
npm run test:coverage # تغطية الاختبارات
```

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

### معايير الكود:
- ✅ TypeScript Strict Mode
- ✅ ESLint Rules
- ✅ Prettier Formatting
- ✅ JSDoc Documentation
- ✅ Unit Tests (قريباً)

## 📊 الإحصائيات

```
الملفات:      200+
الأسطر:       15,000+
المكونات:     50+
الأدوات:      50+
الأنواع:      15+
```

## 🔐 الأمان

- ✅ Input Validation
- ✅ XSS Protection
- ✅ CSRF Protection
- ✅ Secure Storage
- ✅ API Authentication

## 📱 التوافق

### المتصفحات المدعومة:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### الأجهزة:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024+)
- ✅ Mobile (375x667+)

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

## 👨‍💻 الفريق

- **المطور الرئيسي**: Antigravity AI
- **التصميم**: Premium UI/UX Team
- **المحتوى**: Saudi Economic Data Team

## 📞 التواصل

- 🌐 الموقع: [investor-radar.sa](https://investor-radar.sa)
- 📧 البريد: support@investor-radar.sa
- 💬 الدعم: [support.investor-radar.sa](https://support.investor-radar.sa)

---

<div align="center">

**صُنع بـ ❤️ في المملكة العربية السعودية**

Made with ❤️ in Saudi Arabia

</div>

---

## 🌍 Overview <a name="en"></a>

**Investor Radar** is a comprehensive analytical platform providing:
- 📊 Interactive dashboards
- 📈 Smart market signals
- 🏛️ Saudi official entities data
- 👥 Expert and analyst following
- 🤖 AI-powered assistant

### Key Features:
- Official government dashboards
- Custom dashboard creation
- Real-time data updates
- Advanced verification system
- Impact indicators
- Smart alerts

### Tech Stack:
- React 19.2 + TypeScript 5.8
- Vite 6.2 + TailwindCSS
- React Router + Lucide Icons
- Clean Architecture + SOLID Principles

### Quick Start:
```bash
npm install
npm run dev
```

Visit: `http://localhost:3000`

---

**Version**: 1.0.0  
**Last Updated**: January 3, 2026  
**Status**: ✅ Active Development
