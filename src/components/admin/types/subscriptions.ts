// Subscription & Licensing Types

export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled' | 'suspended';
export type LicenseType = 'individual' | 'team' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface FeatureAccess {
  dataAngles: boolean;
  datasetExplorer: boolean;
  dashboardInsights: boolean;
  aiPrediction: boolean;
  aiAnalysis: boolean;
  aiSummarization: boolean;
  exportData: boolean;
  apiAccess: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
}

export interface PlanLimits {
  maxDashboards: number;
  maxDatasets: number;
  apiRequestsPerMonth: number;
  aiQueriesPerMonth: number;
  maxUsers: number;
  storageGB: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: PlanType;
  price: {
    monthly: number;
    yearly: number;
  };
  currency: string;
  features: FeatureAccess;
  limits: PlanLimits;
  description: string;
  popular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsageStats {
  apiCalls: number;
  aiQueries: {
    prediction: number;
    analysis: number;
    summarization: number;
  };
  datasetQueries: number;
  dashboardInteractions: number;
  storageUsedGB: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  autoRenew: boolean;
  usage: UsageStats;
  limits: PlanLimits;
  usagePercentage: {
    api: number;
    ai: number;
    storage: number;
  };
}

export interface License {
  id: string;
  key: string;
  type: LicenseType;
  organizationName?: string;
  allowedDomains: string[];
  maxUsers: number;
  currentUsers: number;
  features: FeatureAccess;
  status: 'active' | 'expired' | 'revoked';
  issuedDate: string;
  expiryDate: string;
  assignedTo?: string;
}

export interface SubscriptionAlert {
  id: string;
  type: 'expiring_soon' | 'limit_exceeded' | 'payment_failed' | 'high_usage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface MRRData {
  month: string;
  revenue: number;
  growth: number;
}

export interface PlanDistribution {
  plan: PlanType;
  count: number;
  percentage: number;
}
