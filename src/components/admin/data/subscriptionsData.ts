import {
  SubscriptionPlan,
  UserSubscription,
  License,
  SubscriptionAlert,
  MRRData,
  PlanDistribution,
  FeatureAccess,
  PlanLimits,
} from "../types/subscriptions";

// Default Plans
export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: "plan_free",
    name: "مجاني",
    type: "free",
    price: { monthly: 0, yearly: 0 },
    currency: "SAR",
    description: "للأفراد الذين يريدون استكشاف البيانات الأساسية",
    features: {
      dataAngles: true,
      datasetExplorer: false,
      dashboardInsights: false,
      aiPrediction: false,
      aiAnalysis: false,
      aiSummarization: false,
      exportData: false,
      apiAccess: false,
      customBranding: false,
      prioritySupport: false,
    },
    limits: {
      maxDashboards: 2,
      maxDatasets: 5,
      apiRequestsPerMonth: 0,
      aiQueriesPerMonth: 0,
      maxUsers: 1,
      storageGB: 1,
    },
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "plan_basic",
    name: "أساسي",
    type: "basic",
    price: { monthly: 299, yearly: 2990 },
    currency: "SAR",
    description: "للمحترفين الذين يحتاجون تحليلات متقدمة",
    features: {
      dataAngles: true,
      datasetExplorer: true,
      dashboardInsights: true,
      aiPrediction: false,
      aiAnalysis: false,
      aiSummarization: false,
      exportData: true,
      apiAccess: false,
      customBranding: false,
      prioritySupport: false,
    },
    limits: {
      maxDashboards: 10,
      maxDatasets: 50,
      apiRequestsPerMonth: 0,
      aiQueriesPerMonth: 0,
      maxUsers: 3,
      storageGB: 10,
    },
    popular: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "plan_pro",
    name: "محترف",
    type: "pro",
    price: { monthly: 999, yearly: 9990 },
    currency: "SAR",
    description: "للفرق والشركات الصغيرة التي تحتاج ميزات كاملة",
    features: {
      dataAngles: true,
      datasetExplorer: true,
      dashboardInsights: true,
      aiPrediction: true,
      aiAnalysis: true,
      aiSummarization: true,
      exportData: true,
      apiAccess: true,
      customBranding: false,
      prioritySupport: true,
    },
    limits: {
      maxDashboards: 50,
      maxDatasets: 500,
      apiRequestsPerMonth: 10000,
      aiQueriesPerMonth: 1000,
      maxUsers: 10,
      storageGB: 100,
    },
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "plan_enterprise",
    name: "مؤسسات",
    type: "enterprise",
    price: { monthly: 4999, yearly: 49990 },
    currency: "SAR",
    description: "للمؤسسات الكبيرة التي تحتاج تحكماً كاملاً",
    features: {
      dataAngles: true,
      datasetExplorer: true,
      dashboardInsights: true,
      aiPrediction: true,
      aiAnalysis: true,
      aiSummarization: true,
      exportData: true,
      apiAccess: true,
      customBranding: true,
      prioritySupport: true,
    },
    limits: {
      maxDashboards: 999,
      maxDatasets: 9999,
      apiRequestsPerMonth: 100000,
      aiQueriesPerMonth: 10000,
      maxUsers: 999,
      storageGB: 1000,
    },
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

// Mock User Subscriptions
export const MOCK_USER_SUBSCRIPTIONS: UserSubscription[] = [
  {
    id: "sub_001",
    userId: "user_001",
    userName: "أحمد محمد",
    userEmail: "ahmed@example.com",
    planId: "plan_pro",
    planName: "محترف",
    status: "active",
    billingCycle: "yearly",
    startDate: "2025-01-15T00:00:00Z",
    endDate: "2026-01-15T00:00:00Z",
    autoRenew: true,
    usage: {
      apiCalls: 7500,
      aiQueries: { prediction: 300, analysis: 400, summarization: 100 },
      datasetQueries: 1200,
      dashboardInteractions: 5000,
      storageUsedGB: 45,
    },
    limits: {
      maxDashboards: 50,
      maxDatasets: 500,
      apiRequestsPerMonth: 10000,
      aiQueriesPerMonth: 1000,
      maxUsers: 10,
      storageGB: 100,
    },
    usagePercentage: {
      api: 75,
      ai: 80,
      storage: 45,
    },
  },
  {
    id: "sub_002",
    userId: "user_002",
    userName: "فاطمة علي",
    userEmail: "fatima@example.com",
    planId: "plan_basic",
    planName: "أساسي",
    status: "active",
    billingCycle: "monthly",
    startDate: "2025-09-01T00:00:00Z",
    endDate: "2025-10-01T00:00:00Z",
    autoRenew: true,
    usage: {
      apiCalls: 0,
      aiQueries: { prediction: 0, analysis: 0, summarization: 0 },
      datasetQueries: 200,
      dashboardInteractions: 800,
      storageUsedGB: 3,
    },
    limits: {
      maxDashboards: 10,
      maxDatasets: 50,
      apiRequestsPerMonth: 0,
      aiQueriesPerMonth: 0,
      maxUsers: 3,
      storageGB: 10,
    },
    usagePercentage: {
      api: 0,
      ai: 0,
      storage: 30,
    },
  },
  {
    id: "sub_003",
    userId: "user_003",
    userName: "شركة التقنية المتقدمة",
    userEmail: "info@techcorp.sa",
    planId: "plan_enterprise",
    planName: "مؤسسات",
    status: "active",
    billingCycle: "yearly",
    startDate: "2025-03-01T00:00:00Z",
    endDate: "2026-03-01T00:00:00Z",
    autoRenew: true,
    usage: {
      apiCalls: 45000,
      aiQueries: { prediction: 2000, analysis: 3000, summarization: 1500 },
      datasetQueries: 15000,
      dashboardInteractions: 50000,
      storageUsedGB: 350,
    },
    limits: {
      maxDashboards: 999,
      maxDatasets: 9999,
      apiRequestsPerMonth: 100000,
      aiQueriesPerMonth: 10000,
      maxUsers: 999,
      storageGB: 1000,
    },
    usagePercentage: {
      api: 45,
      ai: 65,
      storage: 35,
    },
  },
  {
    id: "sub_004",
    userId: "user_004",
    userName: "محمد سعيد",
    userEmail: "mohammed@example.com",
    planId: "plan_free",
    planName: "مجاني",
    status: "trial",
    billingCycle: "monthly",
    startDate: "2025-09-20T00:00:00Z",
    endDate: "2025-10-20T00:00:00Z",
    trialEndDate: "2025-10-05T00:00:00Z",
    autoRenew: false,
    usage: {
      apiCalls: 0,
      aiQueries: { prediction: 0, analysis: 0, summarization: 0 },
      datasetQueries: 15,
      dashboardInteractions: 50,
      storageUsedGB: 0.5,
    },
    limits: {
      maxDashboards: 2,
      maxDatasets: 5,
      apiRequestsPerMonth: 0,
      aiQueriesPerMonth: 0,
      maxUsers: 1,
      storageGB: 1,
    },
    usagePercentage: {
      api: 0,
      ai: 0,
      storage: 50,
    },
  },
  {
    id: "sub_005",
    userId: "user_005",
    userName: "نورة الأحمد",
    userEmail: "noura@example.com",
    planId: "plan_basic",
    planName: "أساسي",
    status: "expired",
    billingCycle: "monthly",
    startDate: "2025-08-01T00:00:00Z",
    endDate: "2025-09-01T00:00:00Z",
    autoRenew: false,
    usage: {
      apiCalls: 0,
      aiQueries: { prediction: 0, analysis: 0, summarization: 0 },
      datasetQueries: 180,
      dashboardInteractions: 600,
      storageUsedGB: 2,
    },
    limits: {
      maxDashboards: 10,
      maxDatasets: 50,
      apiRequestsPerMonth: 0,
      aiQueriesPerMonth: 0,
      maxUsers: 3,
      storageGB: 10,
    },
    usagePercentage: {
      api: 0,
      ai: 0,
      storage: 20,
    },
  },
];

// Mock Licenses
export const MOCK_LICENSES: License[] = [
  {
    id: "lic_001",
    key: "RADAR-ENT-2025-XKCD-MNO123",
    type: "enterprise",
    organizationName: "شركة التقنية المتقدمة",
    allowedDomains: ["techcorp.sa", "techcorp.com"],
    maxUsers: 50,
    currentUsers: 32,
    features: {
      dataAngles: true,
      datasetExplorer: true,
      dashboardInsights: true,
      aiPrediction: true,
      aiAnalysis: true,
      aiSummarization: true,
      exportData: true,
      apiAccess: true,
      customBranding: true,
      prioritySupport: true,
    },
    status: "active",
    issuedDate: "2025-03-01T00:00:00Z",
    expiryDate: "2026-03-01T00:00:00Z",
    assignedTo: "info@techcorp.sa",
  },
  {
    id: "lic_002",
    key: "RADAR-PRO-2025-ABC789-XYZ",
    type: "team",
    organizationName: "مجموعة الأفق",
    allowedDomains: ["horizon-group.sa"],
    maxUsers: 10,
    currentUsers: 7,
    features: {
      dataAngles: true,
      datasetExplorer: true,
      dashboardInsights: true,
      aiPrediction: true,
      aiAnalysis: true,
      aiSummarization: true,
      exportData: true,
      apiAccess: true,
      customBranding: false,
      prioritySupport: true,
    },
    status: "active",
    issuedDate: "2025-06-15T00:00:00Z",
    expiryDate: "2026-06-15T00:00:00Z",
    assignedTo: "admin@horizon-group.sa",
  },
  {
    id: "lic_003",
    key: "RADAR-IND-2025-QWE456-RTY",
    type: "individual",
    organizationName: undefined,
    allowedDomains: [],
    maxUsers: 1,
    currentUsers: 1,
    features: {
      dataAngles: true,
      datasetExplorer: true,
      dashboardInsights: false,
      aiPrediction: false,
      aiAnalysis: false,
      aiSummarization: false,
      exportData: true,
      apiAccess: false,
      customBranding: false,
      prioritySupport: false,
    },
    status: "expired",
    issuedDate: "2024-09-01T00:00:00Z",
    expiryDate: "2025-09-01T00:00:00Z",
    assignedTo: "user@example.com",
  },
];

// Mock Alerts
export const MOCK_ALERTS: SubscriptionAlert[] = [
  {
    id: "alert_001",
    type: "expiring_soon",
    severity: "high",
    userId: "user_002",
    userName: "فاطمة علي",
    message: "الاشتراك سينتهي خلال 3 أيام",
    createdAt: "2025-09-28T00:00:00Z",
    resolved: false,
  },
  {
    id: "alert_002",
    type: "high_usage",
    severity: "medium",
    userId: "user_001",
    userName: "أحمد محمد",
    message: "استخدام API وصل إلى 75% من الحد المسموح",
    createdAt: "2025-09-27T00:00:00Z",
    resolved: false,
  },
  {
    id: "alert_003",
    type: "limit_exceeded",
    severity: "critical",
    userId: "user_006",
    userName: "شركة الابتكار",
    message: "تم تجاوز حد استعلامات AI للشهر الحالي",
    createdAt: "2025-09-25T00:00:00Z",
    resolved: true,
  },
  {
    id: "alert_004",
    type: "payment_failed",
    severity: "critical",
    userId: "user_005",
    userName: "نورة الأحمد",
    message: "فشلت عملية الدفع للاشتراك الشهري",
    createdAt: "2025-09-01T00:00:00Z",
    resolved: false,
  },
];

// Mock MRR Data
export const MOCK_MRR_DATA: MRRData[] = [
  { month: "أبريل", revenue: 45000, growth: 0 },
  { month: "مايو", revenue: 52000, growth: 15.6 },
  { month: "يونيو", revenue: 61000, growth: 17.3 },
  { month: "يوليو", revenue: 68000, growth: 11.5 },
  { month: "أغسطس", revenue: 78000, growth: 14.7 },
  { month: "سبتمبر", revenue: 89000, growth: 14.1 },
];

// Mock Plan Distribution
export const MOCK_PLAN_DISTRIBUTION: PlanDistribution[] = [
  { plan: "free", count: 1250, percentage: 62.5 },
  { plan: "basic", count: 500, percentage: 25.0 },
  { plan: "pro", count: 200, percentage: 10.0 },
  { plan: "enterprise", count: 50, percentage: 2.5 },
];

// Helper Functions
export const getPlanColor = (planType: string): string => {
  const colors: Record<string, string> = {
    free: "bg-slate-100 text-slate-700",
    basic: "bg-blue-50 text-blue-700",
    pro: "bg-purple-50 text-purple-700",
    enterprise: "bg-amber-50 text-amber-700",
  };
  return colors[planType] || colors.free;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    trial: "bg-blue-50 text-blue-700",
    expired: "bg-slate-50 text-slate-700",
    cancelled: "bg-rose-50 text-rose-700",
    suspended: "bg-amber-50 text-amber-700",
  };
  return colors[status] || colors.active;
};

export const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    low: "bg-blue-50 text-blue-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-orange-50 text-orange-700",
    critical: "bg-rose-50 text-rose-700",
  };
  return colors[severity] || colors.low;
};

// ==========================================
// Usage Tab Data & Types
// ==========================================

export interface UsageData {
  id: string;
  userName: string;
  email: string;
  license: string;
  planType: string;
  dashboardsUsed: number;
  dataAnglesUsed: number;
  apiCallsUsed: number;
  apiCallsLimit: number;
  aiModelsUsed: number;
  aiModelsLimit: number;
  lastActive: string;
  status: "active" | "inactive" | "overused";
}

export interface UsageTrendData {
  period: string;
  apiCalls: number;
  aiQueries: number;
  dashboardInteractions: number;
  dataAngles: number;
}

export interface UsageByFeature {
  feature: string;
  value: number;
  color: string;
}

export const MOCK_USAGE_DATA: UsageData[] = [
  {
    id: "usage_001",
    userName: "أحمد محمد",
    email: "ahmed@example.com",
    license: "LIC-PRO-001",
    planType: "pro",
    dashboardsUsed: 35,
    dataAnglesUsed: 120,
    apiCallsUsed: 7500,
    apiCallsLimit: 10000,
    aiModelsUsed: 800,
    aiModelsLimit: 1000,
    lastActive: "2025-09-29T10:30:00Z",
    status: "active",
  },
  {
    id: "usage_002",
    userName: "فاطمة علي",
    email: "fatima@example.com",
    license: "LIC-BAS-002",
    planType: "basic",
    dashboardsUsed: 8,
    dataAnglesUsed: 45,
    apiCallsUsed: 0,
    apiCallsLimit: 0,
    aiModelsUsed: 0,
    aiModelsLimit: 0,
    lastActive: "2025-09-28T14:20:00Z",
    status: "active",
  },
  {
    id: "usage_003",
    userName: "شركة التقنية المتقدمة",
    email: "info@techcorp.sa",
    license: "LIC-ENT-003",
    planType: "enterprise",
    dashboardsUsed: 250,
    dataAnglesUsed: 890,
    apiCallsUsed: 45000,
    apiCallsLimit: 100000,
    aiModelsUsed: 6500,
    aiModelsLimit: 10000,
    lastActive: "2025-09-29T11:45:00Z",
    status: "active",
  },
  {
    id: "usage_004",
    userName: "محمد سعيد",
    email: "mohammed@example.com",
    license: "LIC-FREE-004",
    planType: "free",
    dashboardsUsed: 2,
    dataAnglesUsed: 8,
    apiCallsUsed: 0,
    apiCallsLimit: 0,
    aiModelsUsed: 0,
    aiModelsLimit: 0,
    lastActive: "2025-09-25T09:15:00Z",
    status: "inactive",
  },
  {
    id: "usage_005",
    userName: "نورة الأحمد",
    email: "noura@example.com",
    license: "LIC-BAS-005",
    planType: "basic",
    dashboardsUsed: 12,
    dataAnglesUsed: 65,
    apiCallsUsed: 0,
    apiCallsLimit: 0,
    aiModelsUsed: 0,
    aiModelsLimit: 0,
    lastActive: "2025-09-29T08:00:00Z",
    status: "active",
  },
  {
    id: "usage_006",
    userName: "شركة الابتكار",
    email: "info@innovate.sa",
    license: "LIC-PRO-006",
    planType: "pro",
    dashboardsUsed: 48,
    dataAnglesUsed: 200,
    apiCallsUsed: 9800,
    apiCallsLimit: 10000,
    aiModelsUsed: 1050,
    aiModelsLimit: 1000,
    lastActive: "2025-09-29T12:00:00Z",
    status: "overused",
  },
  {
    id: "usage_007",
    userName: "خالد العمر",
    email: "khaled@example.com",
    license: "LIC-PRO-007",
    planType: "pro",
    dashboardsUsed: 28,
    dataAnglesUsed: 95,
    apiCallsUsed: 5600,
    apiCallsLimit: 10000,
    aiModelsUsed: 720,
    aiModelsLimit: 1000,
    lastActive: "2025-09-27T16:30:00Z",
    status: "active",
  },
  {
    id: "usage_008",
    userName: "مجموعة الأفق",
    email: "admin@horizon-group.sa",
    license: "LIC-TEAM-008",
    planType: "enterprise",
    dashboardsUsed: 180,
    dataAnglesUsed: 520,
    apiCallsUsed: 32000,
    apiCallsLimit: 100000,
    aiModelsUsed: 4200,
    aiModelsLimit: 10000,
    lastActive: "2025-09-29T10:00:00Z",
    status: "active",
  },
];

export const MOCK_USAGE_TRENDS: UsageTrendData[] = [
  {
    period: "1 سبتمبر",
    apiCalls: 25000,
    aiQueries: 3200,
    dashboardInteractions: 12000,
    dataAngles: 450,
  },
  {
    period: "5 سبتمبر",
    apiCalls: 28000,
    aiQueries: 3500,
    dashboardInteractions: 13500,
    dataAngles: 480,
  },
  {
    period: "10 سبتمبر",
    apiCalls: 32000,
    aiQueries: 3900,
    dashboardInteractions: 15000,
    dataAngles: 520,
  },
  {
    period: "15 سبتمبر",
    apiCalls: 35000,
    aiQueries: 4200,
    dashboardInteractions: 16500,
    dataAngles: 560,
  },
  {
    period: "20 سبتمبر",
    apiCalls: 38000,
    aiQueries: 4600,
    dashboardInteractions: 18000,
    dataAngles: 600,
  },
  {
    period: "25 سبتمبر",
    apiCalls: 42000,
    aiQueries: 5000,
    dashboardInteractions: 19500,
    dataAngles: 650,
  },
  {
    period: "29 سبتمبر",
    apiCalls: 45000,
    aiQueries: 5400,
    dashboardInteractions: 21000,
    dataAngles: 700,
  },
];

export const MOCK_USAGE_BY_FEATURE: UsageByFeature[] = [
  { feature: "لوحات التحكم", value: 35, color: "#6366f1" },
  { feature: "زوايا البيانات", value: 28, color: "#8b5cf6" },
  { feature: "طلبات API", value: 20, color: "#ec4899" },
  { feature: "تحليلات AI", value: 12, color: "#10b981" },
  { feature: "تنبؤات AI", value: 5, color: "#f59e0b" },
];

export const MOCK_DAILY_USAGE = [
  { day: "السبت", users: 145, apiCalls: 8500, aiQueries: 920 },
  { day: "الأحد", users: 162, apiCalls: 9200, aiQueries: 1050 },
  { day: "الاثنين", users: 178, apiCalls: 10500, aiQueries: 1180 },
  { day: "الثلاثاء", users: 165, apiCalls: 9800, aiQueries: 1100 },
  { day: "الأربعاء", users: 171, apiCalls: 10200, aiQueries: 1150 },
  { day: "الخميس", users: 155, apiCalls: 8900, aiQueries: 980 },
  { day: "الجمعة", users: 98, apiCalls: 5200, aiQueries: 620 },
];
