# 💳 نظام إدارة الاشتراكات والترخيص

## 📋 نظرة عامة

نظام شامل ومتكامل لإدارة الاشتراكات والترخيص لمنصة رادار الاستثمارية الذكية. يتيح هذا النظام للمسؤولين التحكم الكامل في:

- ✅ خطط الاشتراك
- ✅ تراخيص المستخدمين
- ✅ حدود الاستخدام
- ✅ الفوترة والدفع
- ✅ التحكّم في الميزات

---

## 🎯 الأهداف الرئيسية

1. **التحكم في الوصول**: إدارة صلاحيات المستخدمين حسب خططهم
2. **المراقبة**: تتبع الاستخدام وفرض الحدود
3. **الإيرادات**: إدارة الدخل الشهري المتكرر (MRR)
4. **الأتمتة**: تنبيهات تلقائية للأحداث الهامة
5. **القابلية للتوسع**: جاهز للنمو ودعم آلاف المستخدمين

---

## 🏗️ هيكل النظام

### **1. لوحة التحكم الرئيسية (Overview Dashboard)**

#### **مؤشرات الأداء الرئيسية (KPIs)**

| المؤشر | الوصف |
|--------|--------|
| إجمالي الاشتراكات | عدد جميع الاشتراكات في المنصة |
| اشتراكات نشطة | الاشتراكات الفعالة حالياً |
| مستخدمو التجربة | الذين في فترة تجريبية |
| تنتهي قريباً | تنتهي خلال 7 أيام |
| الدخل الشهري (MRR) | الإيرادات الشهرية المتوقعة |
| نمو MRR | نسبة النمو الشهري |
| استخدام API | إجمالي استدعاءات API |
| استخدام AI | إجمالي استعلامات الذكاء الاصطناعي |

#### **الرسوم البيانية**

1. **نمو الدخل الشهري**
   - Area Chart
   - آخر 6 أشهر
   - لون أخضر (emerald)

2. **توزيع الخطط**
   - Pie Chart
   - 4 خطط (Free, Basic, Pro, Enterprise)
   - ألوان مميزة لكل خطة

3. **استخدام API**
   - Progress Bars
   - مقارنة بين المستخدمين
   - لون أزرق

4. **استخدام AI**
   - Progress Bars
   - مقارنة بين المستخدمين
   - لون بنفسجي

---

### **2. خطط الاشتراك (Subscription Plans)**

#### **الخطط الافتراضية**

```
┌─────────────────────────────────────────────────────────┐
│  مجاني        │  أساسي      │  محترف     │  مؤسسات    │
│  0 ر.س        │  299 ر.س    │  999 ر.س   │  4999 ر.س  │
│  للأفراد      │  للمحترفين  │  للفرق     │  للشركات   │
└─────────────────────────────────────────────────────────┘
```

#### **كل خطة تتضمن:**

**الميزات (Features):**
- ✅ الوصول لزوايا البيانات
- ✅ مستكشف البيانات
- ✅ رؤى لوحة القيادة
- ✅ تنبؤات AI
- ✅ تحليلات AI
- ✅ تلخيص AI
- ✅ تصدير البيانات
- ✅ وصول API
- ✅ علامة تجارية مخصصة
- ✅ دعم ذو أولوية

**الحدود (Limits):**
- عدد لوحات التحكم
- عدد مجموعات البيانات
- طلبات API شهرياً
- استعلامات AI شهرياً
- عدد المستخدمين
- مساحة التخزين (GB)

---

### **3. إدارة اشتراكات المستخدمين**

#### **حالات الاشتراك:**

| الحالة | الوصف | اللون |
|--------|--------|-------|
| Active | نشط وفعال | أخضر |
| Trial | فترة تجريبية | أزرق |
| Expired | منتهي الصلاحية | رمادي |
| Cancelled | ملغى | أحمر |
| Suspended | معلق | برتقالي |

#### **بيانات كل اشتراك:**

```typescript
{
  id: string
  userId: string
  userName: string
  userEmail: string
  planId: string
  planName: string
  status: SubscriptionStatus
  billingCycle: 'monthly' | 'yearly'
  startDate: string
  endDate: string
  trialEndDate?: string
  autoRenew: boolean
  usage: UsageStats
  limits: PlanLimits
  usagePercentage: {
    api: number
    ai: number
    storage: number
  }
}
```

---

### **4. نظام التراخيص (Licensing)**

#### **أنواع التراخيص:**

1. **Individual** (فردي)
   - مستخدم واحد
   - ميزات أساسية
   - سنة واحدة

2. **Team** (فريق)
   - حتى 10 مستخدمين
   - ميزات متقدمة
   - نطاقات مخصصة

3. **Enterprise** (مؤسسات)
   - عدد غير محدود
   - جميع الميزات
   - دعم خاص

#### **بيانات الترخيص:**

```typescript
{
  id: string
  key: string  // مثال: RADAR-ENT-2025-XKCD-MNO123
  type: 'individual' | 'team' | 'enterprise'
  organizationName?: string
  allowedDomains: string[]
  maxUsers: number
  currentUsers: number
  features: FeatureAccess
  status: 'active' | 'expired' | 'revoked'
  issuedDate: string
  expiryDate: string
  assignedTo?: string
}
```

---

### **5. تتبع الاستخدام (Usage Tracking)**

#### **ما يتم تتبعه:**

- 📡 **استدعاءات API**
- 🤖 **استعلامات AI** (لكل نموذج)
- 📊 **استعلامات البيانات**
- 🎯 **تفاعلات لوحة القيادة**
- 💾 **التخزين المستخدم (GB)**

#### **إنذارات الاستخدام:**

| النسبة | الإجراء |
|--------|---------|
| 50% | إشعار عادي |
| 75% | تحذير |
| 90% | تنبيه عالي |
| 100% | تقييد الوصول |

---

### **6. نظام التنبيهات (Alerts System)**

#### **أنواع التنبيهات:**

1. **expiring_soon** - اشتراك ينتهي قريباً
2. **limit_exceeded** - تجاوز الحد المسموح
3. **payment_failed** - فشل الدفع
4. **high_usage** - استخدام عالي

#### **مستويات الخطورة:**

- 🟢 **Low** - منخفضة
- 🟡 **Medium** - متوسطة
- 🟠 **High** - عالية
- 🔴 **Critical** - حرجة

---

## 🎨 نظام التصميم

### **الألوان**

```typescript
// الخطط
free: 'bg-slate-100 text-slate-700'
basic: 'bg-blue-50 text-blue-700'
pro: 'bg-purple-50 text-purple-700'
enterprise: 'bg-amber-50 text-amber-700'

// الحالات
active: 'bg-emerald-50 text-emerald-700'
trial: 'bg-blue-50 text-blue-700'
expired: 'bg-slate-50 text-slate-700'
cancelled: 'bg-rose-50 text-rose-700'
suspended: 'bg-amber-50 text-amber-700'

// الخطورة
low: 'bg-blue-50 text-blue-700'
medium: 'bg-amber-50 text-amber-700'
high: 'bg-orange-50 text-orange-700'
critical: 'bg-rose-50 text-rose-700'
```

### **المكونات البصرية**

- **Border Radius**: `rounded-[2rem]` للعناصر الكبيرة
- **Shadows**: `shadow-sm`, `shadow-lg`, `shadow-xl`
- **Gradients**: `from-indigo-600 to-purple-600`

---

## 📊 هيكل البيانات

### **Types & Interfaces**

```typescript
// أنواع الخطط
type PlanType = 'free' | 'basic' | 'pro' | 'enterprise'

// حالات الاشتراك
type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended'

// أنواع التراخيص
type LicenseType = 'individual' | 'team' | 'enterprise'

// دورة الفوترة
type BillingCycle = 'monthly' | 'yearly'
```

### **الوصول للميزات**

```typescript
interface FeatureAccess {
  dataAngles: boolean
  datasetExplorer: boolean
  dashboardInsights: boolean
  aiPrediction: boolean
  aiAnalysis: boolean
  aiSummarization: boolean
  exportData: boolean
  apiAccess: boolean
  customBranding: boolean
  prioritySupport: boolean
}
```

### **حدود الخطة**

```typescript
interface PlanLimits {
  maxDashboards: number
  maxDatasets: number
  apiRequestsPerMonth: number
  aiQueriesPerMonth: number
  maxUsers: number
  storageGB: number
}
```

---

## 🚀 الميزات الرئيسية

### **1. إدارة الخطط**
- ✅ إنشاء خطط جديدة
- ✅ تعديل الخطط الحالية
- ✅ حذف/تعطيل الخطط
- ✅ نسخ الخطط

### **2. إدارة المستخدمين**
- ✅ عرض جميع الاشتراكات
- ✅ ترقية/تخفيض الخطة
- ✅ تمديد الاشتراك
- ✅ إلغاء الاشتراك
- ✅ سجل الاشتراكات

### **3. إدارة التراخيص**
- ✅ إنشاء مفاتيح ترخيص
- ✅ التحقق من التراخيص
- ✅ تعيين التراخيص
- ✅ إلغاء التراخيص

### **4. مراقبة الاستخدام**
- ✅ تتبع API
- ✅ تتبع AI
- ✅ تتبع التخزين
- ✅ فرض الحدود

### **5. التنبيهات**
- ✅ تنبيهات تلقائية
- ✅ إشعارات بالبريد
- ✅ تنبيهات داخل التطبيق
- ✅ سجل التنبيهات

---

## 📁 هيكل الملفات

```
components/admin/
├── types/
│   └── subscriptions.ts           ✨ تعريفات TypeScript
├── data/
│   └── subscriptionsData.ts       ✨ بيانات تجريبية
├── SubscriptionsManagement.tsx    ✨ الصفحة الرئيسية
└── ...
```

---

## 🔧 كيفية الاستخدام

### **1. استيراد الصفحة**

```tsx
import SubscriptionsManagement from './components/admin/SubscriptionsManagement';

// في App.tsx أو صفحة الأدمن
<Route path="/admin/subscriptions" element={<SubscriptionsManagement />} />
```

### **2. الوصول للبيانات**

```tsx
import {
  MOCK_USER_SUBSCRIPTIONS,
  MOCK_LICENSES,
  MOCK_ALERTS
} from './components/admin/data/subscriptionsData';

// استخدام البيانات
const activeSubs = MOCK_USER_SUBSCRIPTIONS.filter(s => s.status === 'active');
```

### **3. دوال مساعدة**

```tsx
import { getPlanColor, getStatusColor, getSeverityColor } from './data/subscriptionsData';

// استخدام
const planClass = getPlanColor('pro');  // 'bg-purple-50 text-purple-700'
const statusClass = getStatusColor('active');  // 'bg-emerald-50 text-emerald-700'
```

---

## 📈 الإحصائيات التجريبية

### **توزيع الخطط**
- مجاني: 1,250 مستخدم (62.5%)
- أساسي: 500 مستخدم (25.0%)
- محترف: 200 مستخدم (10.0%)
- مؤسسات: 50 مستخدم (2.5%)

### **الدخل الشهري**
- أبريل: 45,000 ر.س
- مايو: 52,000 ر.س (+15.6%)
- يونيو: 61,000 ر.س (+17.3%)
- يوليو: 68,000 ر.س (+11.5%)
- أغسطس: 78,000 ر.س (+14.7%)
- سبتمبر: 89,000 ر.س (+14.1%)

---

## 🎯 سيناريوهات الاستخدام

### **سيناريو 1: مستخدم جديد**
```
1. ينشئ حساب مجاني
2. يستخدم الميزات الأساسية
3. يصل لحد 80% من الاستخدام
4. يتلقى اقتراح ترقية
5. يترقى لـ Basic
```

### **سيناريو 2: انتهاء اشتراك**
```
1. باقي 7 أيام على الانتهاء
2. إرسال إشعار بالبريد
3. عرض في لوحة التنبيهات
4. تذكير بعد 3 أيام
5. إذا لم يجدد: تعطيل الحساب
```

### **سيناريو 3: تجاوز الحدود**
```
1. المستخدم يصل لـ 100% من API
2. تنبيه فوري
3. تقييد الوصول
4. عرض خيارات الترقية
5. إذا رقى: إعادة تفعيل
```

---

## 🔐 الأمان والصلاحيات

### **مستويات الوصول:**

| الدور | الصلاحيات |
|-------|-----------|
| Super Admin | كامل الصلاحيات |
| Admin | إدارة الاشتراكات فقط |
| Support | عرض فقط |
| User | إدارة اشتراكه فقط |

### **التحقق:**

- ✅ Token-based authentication
- ✅ Role-based access control
- ✅ Plan-based feature flags
- ✅ API rate limiting

---

## 📊 التكاملات المستقبلية

### **بوابات الدفع:**
- [ ] Stripe
- [ ] PayPal
- [ ] HyperPay
- [ ] Moyasar

### **البريد:**
- [ ] SendGrid
- [ ] Amazon SES
- [ ] Mailgun

### **التحليلات:**
- [ ] Google Analytics
- [ ] Mixpanel
- [ ] Amplitude

---

## ✅ قائمة التحقق

### **المكتمل:**
- [x] تعريفات TypeScript
- [x] بيانات تجريبية
- [x] لوحة التحكم الرئيسية
- [x] مؤشرات الأداء
- [x] رسوم بيانية
- [x] نظام التنبيهات

### **قيد التطوير:**
- [ ] قسم الخطط التفصيلي
- [ ] قسم المستخدمين
- [ ] قسم التراخيص
- [ ] قسم الاستخدام

### **المستقبل:**
- [ ] تكامل دفع
- [ ] فواتير PDF
- [ ] كوبونات خصم
- [ ] إحالات

---

## 🎨 لقطات الشاشة

### **لوحة التحكم الرئيسية**
```
┌────────────────────────────────────────────────────┐
│  إدارة الاشتراكات والترخيص                         │
│  [نظرة عامة] [الخطط] [المستخدمون] [التراخيص]...   │
├────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ 2.5K │ │ 1.8K │ │89K ر.│ │  12  │             │
│  │اشتراك│ │نشط   │ │س     │ │تنتهي │             │
│  └──────┘ └──────┘ └──────┘ └──────┘             │
│                                                    │
│  ┌──────────────────┐ ┌──────────────────┐       │
│  │ نمو الدخل الشهري │ │  توزيع الخطط     │       │
│  │ [Area Chart]     │ │  [Pie Chart]     │       │
│  └──────────────────┘ └──────────────────┘       │
│                                                    │
│  ┌──────────────────┐ ┌──────────────────┐       │
│  │ استخدام API      │ │ استخدام AI       │       │
│  │ [Progress Bars]  │ │ [Progress Bars]  │       │
│  └──────────────────┘ └──────────────────┘       │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ التنبيهات الأخيرة                        │    │
│  │ • فاطمة علي: اشتراك ينتهي خلال 3 أيام   │    │
│  │ • أحمد محمد: استخدام API 75%            │    │
│  └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```

---

**تم التطوير بواسطة:** فريق Radar 🎯
**الإصدار:** 1.0.0
**التاريخ:** 2025
