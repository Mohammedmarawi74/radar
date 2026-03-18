import React, { useState } from "react";
import {
  CreditCard,
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  Zap,
  Database,
  Key,
  FileText,
  Settings,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Copy,
  Trash2,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Star,
  Eye,
  Globe,
  Server,
  Cpu,
  Layers,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Send,
  Warning,
} from "lucide-react";
import {
  UserSubscription,
  License,
  SubscriptionAlert,
  PlanDistribution,
  MRRData,
} from "../types/subscriptions";
import {
  MOCK_USER_SUBSCRIPTIONS,
  MOCK_LICENSES,
  MOCK_ALERTS,
  MOCK_MRR_DATA,
  MOCK_PLAN_DISTRIBUTION,
  DEFAULT_PLANS,
  getPlanColor,
  getStatusColor,
  getSeverityColor,
  MOCK_USAGE_DATA,
  MOCK_USAGE_TRENDS,
  MOCK_USAGE_BY_FEATURE,
  MOCK_DAILY_USAGE,
  UsageData,
} from "./data/subscriptionsData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const SubscriptionsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "plans" | "users" | "licenses" | "usage" | "alerts"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Users tab state
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userPlanFilter, setUserPlanFilter] = useState<string>("all");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Plans tab state
  const [plansSearchQuery, setPlansSearchQuery] = useState("");
  const [plansStatusFilter, setPlansStatusFilter] = useState<string>("all");
  const [plansBillingCycle, setPlansBillingCycle] = useState<
    "monthly" | "yearly"
  >("monthly");
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [editingPlanModal, setEditingPlanModal] = useState<any>(null);

  // Licenses tab state
  const [licenseSearchQuery, setLicenseSearchQuery] = useState("");
  const [licenseStatusFilter, setLicenseStatusFilter] = useState("all");
  const [licenseTypeFilter, setLicenseTypeFilter] = useState("all");
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);

  // KPI Cards Data
  const kpiData = {
    totalSubscriptions: MOCK_USER_SUBSCRIPTIONS.length,
    activeSubscriptions: MOCK_USER_SUBSCRIPTIONS.filter(
      (s) => s.status === "active",
    ).length,
    trialUsers: MOCK_USER_SUBSCRIPTIONS.filter((s) => s.status === "trial")
      .length,
    expiringSoon: MOCK_USER_SUBSCRIPTIONS.filter((s) => {
      const endDate = new Date(s.endDate);
      const now = new Date();
      const daysUntilExpiry =
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    }).length,
    mrr: MOCK_MRR_DATA[MOCK_MRR_DATA.length - 1].revenue,
    mrrGrowth: MOCK_MRR_DATA[MOCK_MRR_DATA.length - 1].growth,
    totalAPIUsage: MOCK_USER_SUBSCRIPTIONS.reduce(
      (sum, sub) => sum + sub.usage.apiCalls,
      0,
    ),
    totalAIUsage: MOCK_USER_SUBSCRIPTIONS.reduce(
      (sum, sub) =>
        sum +
        sub.usage.aiQueries.prediction +
        sub.usage.aiQueries.analysis +
        sub.usage.aiQueries.summarization,
      0,
    ),
  };

  // Plans Tab Component
  const renderPlansTab: React.FC = () => {
    const filteredPlans = DEFAULT_PLANS.filter((plan: any) => {
      const matchesSearch = plan.name
        .toLowerCase()
        .includes(plansSearchQuery.toLowerCase());
      const matchesStatus =
        plansStatusFilter === "all" || plan.type === plansStatusFilter;
      return matchesSearch && matchesStatus;
    });

    const getPlanStats = (planType: string) => {
      const subs = MOCK_USER_SUBSCRIPTIONS.filter(
        (s) => s.planId === `plan_${planType}`,
      );
      const count = subs.length;
      const revenue =
        count *
        (plansBillingCycle === "monthly"
          ? planType === "free"
            ? 0
            : planType === "basic"
              ? 299
              : planType === "pro"
                ? 999
                : 4999
          : planType === "free"
            ? 0
            : planType === "basic"
              ? 2990
              : planType === "pro"
                ? 9990
                : 49990);
      return { count, revenue };
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              إدارة خطط الاشتراك
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              إنشاء وتعديل الخطط والأسعار
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPlanModal(null);
              setShowPlansModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            خطة جديدة
          </button>
        </div>

        {/* Filters & Controls */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن خطة..."
              value={plansSearchQuery}
              onChange={(e) => setPlansSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select
            value={plansStatusFilter}
            onChange={(e) => setPlansStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">جميع الحالات</option>
            <option value="free">مجاني</option>
            <option value="basic">أساسي</option>
            <option value="pro">محترف</option>
            <option value="enterprise">مؤسسات</option>
          </select>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
            <button
              onClick={() => setPlansBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                plansBillingCycle === "monthly"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setPlansBillingCycle("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                plansBillingCycle === "yearly"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              سنوي
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlans.map((plan: any) => {
            const stats = getPlanStats(plan.type);
            return (
              <div
                key={plan.id}
                className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className={`p-6 bg-gradient-to-l ${
                    plan.type === "free"
                      ? "from-slate-500 to-slate-600"
                      : plan.type === "basic"
                        ? "from-blue-500 to-blue-600"
                        : plan.type === "pro"
                          ? "from-purple-500 to-purple-600"
                          : "from-amber-500 to-amber-600"
                  } text-white`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-2xl font-black">{plan.name}</h4>
                        {plan.popular && (
                          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            الأكثر شعبية
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/80">
                        {plan.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        plan.type === "free"
                          ? "bg-white/20"
                          : "bg-emerald-500/30"
                      }`}
                    >
                      {plan.type === "free" ? "مجاني" : "نشط"}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">
                      {plansBillingCycle === "monthly"
                        ? plan.price.monthly
                        : plan.price.yearly}
                    </span>
                    <span className="text-white/80 font-medium">
                      ر.س / {plansBillingCycle === "monthly" ? "شهر" : "سنة"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-500">
                          المشتركون
                        </span>
                      </div>
                      <p className="text-2xl font-black text-slate-900">
                        {stats.count}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-500">
                          الدخل الشهري
                        </span>
                      </div>
                      <p className="text-2xl font-black text-slate-900">
                        {stats.revenue.toLocaleString()} ر.س
                      </p>
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      حدود الخطة
                    </h5>
                    <div className="space-y-2">
                      <LimitRow
                        label="لوحات التحكم"
                        value={plan.limits.maxDashboards}
                      />
                      <LimitRow
                        label="مجموعات البيانات"
                        value={plan.limits.maxDatasets}
                      />
                      <LimitRow
                        label="طلبات API"
                        value={plan.limits.apiRequestsPerMonth.toLocaleString()}
                      />
                      <LimitRow
                        label="استعلامات AI"
                        value={plan.limits.aiQueriesPerMonth.toLocaleString()}
                      />
                      <LimitRow
                        label="المستخدمين"
                        value={plan.limits.maxUsers}
                      />
                      <LimitRow
                        label="التخزين"
                        value={`${plan.limits.storageGB} GB`}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      الميزات
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      <FeatureBadge
                        label="زوايا البيانات"
                        enabled={plan.features.dataAngles}
                      />
                      <FeatureBadge
                        label="مستكشف البيانات"
                        enabled={plan.features.datasetExplorer}
                      />
                      <FeatureBadge
                        label="رؤى لوحة القيادة"
                        enabled={plan.features.dashboardInsights}
                      />
                      <FeatureBadge
                        label="تنبؤات AI"
                        enabled={plan.features.aiPrediction}
                      />
                      <FeatureBadge
                        label="تحليلات AI"
                        enabled={plan.features.aiAnalysis}
                      />
                      <FeatureBadge
                        label="تصدير البيانات"
                        enabled={plan.features.exportData}
                      />
                      <FeatureBadge
                        label="وصول API"
                        enabled={plan.features.apiAccess}
                      />
                      <FeatureBadge
                        label="دعم ذو أولوية"
                        enabled={plan.features.prioritySupport}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingPlanModal(plan);
                        setShowPlansModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      تعديل
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
                      <Copy className="w-4 h-4" />
                      نسخ
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan Comparison Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 overflow-x-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                مقارنة الخطط
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                مقارنة شاملة للميزات والحدود
              </p>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="text-right py-4 px-4 text-sm font-black text-slate-700">
                  الميزة
                </th>
                {DEFAULT_PLANS.map((plan: any) => (
                  <th key={plan.id} className="text-center py-4 px-4">
                    <div
                      className={`inline-block px-4 py-2 rounded-xl ${getPlanColor(plan.type)}`}
                    >
                      <p className="text-sm font-black">{plan.name}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                label="السعر الشهري"
                values={DEFAULT_PLANS.map((p: any) => `${p.price.monthly} ر.س`)}
              />
              <ComparisonRow
                label="السعر السنوي"
                values={DEFAULT_PLANS.map((p: any) => `${p.price.yearly} ر.س`)}
              />
              <ComparisonRow
                label="لوحات التحكم"
                values={DEFAULT_PLANS.map((p: any) => p.limits.maxDashboards)}
              />
              <ComparisonRow
                label="مجموعات البيانات"
                values={DEFAULT_PLANS.map((p: any) => p.limits.maxDatasets)}
              />
              <ComparisonRow
                label="طلبات API"
                values={DEFAULT_PLANS.map((p: any) =>
                  p.limits.apiRequestsPerMonth.toLocaleString(),
                )}
              />
              <ComparisonRow
                label="استعلامات AI"
                values={DEFAULT_PLANS.map((p: any) =>
                  p.limits.aiQueriesPerMonth.toLocaleString(),
                )}
              />
              <ComparisonRow
                label="المستخدمين"
                values={DEFAULT_PLANS.map((p: any) => p.limits.maxUsers)}
              />
              <ComparisonRow
                label="التخزين"
                values={DEFAULT_PLANS.map(
                  (p: any) => `${p.limits.storageGB} GB`,
                )}
              />
              <ComparisonRow
                label="زوايا البيانات"
                values={DEFAULT_PLANS.map((p: any) => p.features.dataAngles)}
                type="boolean"
              />
              <ComparisonRow
                label="مستكشف البيانات"
                values={DEFAULT_PLANS.map(
                  (p: any) => p.features.datasetExplorer,
                )}
                type="boolean"
              />
              <ComparisonRow
                label="تنبؤات AI"
                values={DEFAULT_PLANS.map((p: any) => p.features.aiPrediction)}
                type="boolean"
              />
              <ComparisonRow
                label="تصدير البيانات"
                values={DEFAULT_PLANS.map((p: any) => p.features.exportData)}
                type="boolean"
              />
              <ComparisonRow
                label="وصول API"
                values={DEFAULT_PLANS.map((p: any) => p.features.apiAccess)}
                type="boolean"
              />
              <ComparisonRow
                label="دعم ذو أولوية"
                values={DEFAULT_PLANS.map(
                  (p: any) => p.features.prioritySupport,
                )}
                type="boolean"
              />
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showPlansModal && (
          <PlanModal
            plan={editingPlanModal}
            onClose={() => setShowPlansModal(false)}
            onSave={() => setShowPlansModal(false)}
          />
        )}
      </div>
    );
  };

  const renderUsersTab: React.FC = () => {
    // Mock users data based on subscriptions
    const usersData = MOCK_USER_SUBSCRIPTIONS.map((sub, idx) => ({
      id: sub.id,
      name: sub.userName,
      email: sub.userEmail,
      plan: sub.planName,
      planType: sub.planId.replace("plan_", ""),
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      autoRenew: sub.autoRenew,
      usage: sub.usage,
      limits: sub.limits,
      usagePercentage: sub.usagePercentage,
    }));

    // Filter and sort users
    const filteredUsers = usersData
      .filter((user: any) => {
        const matchesSearch =
          user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
        const matchesPlan =
          userPlanFilter === "all" || user.planType === userPlanFilter;
        const matchesStatus =
          userStatusFilter === "all" || user.status === userStatusFilter;
        return matchesSearch && matchesPlan && matchesStatus;
      })
      .sort((a: any, b: any) => {
        const modifier = sortDirection === "asc" ? 1 : -1;
        if (sortField === "name")
          return a.name.localeCompare(b.name) * modifier;
        if (sortField === "startDate")
          return (
            (new Date(a.startDate).getTime() -
              new Date(b.startDate).getTime()) *
            modifier
          );
        if (sortField === "endDate")
          return (
            (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) *
            modifier
          );
        return 0;
      });

    // User stats
    const userStats = {
      total: usersData.length,
      active: usersData.filter((u: any) => u.status === "active").length,
      trial: usersData.filter((u: any) => u.status === "trial").length,
      expiring: usersData.filter((u: any) => {
        const endDate = new Date(u.endDate);
        const now = new Date();
        const daysUntilExpiry =
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }).length,
    };

    const toggleUserSelection = (userId: string) => {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    };

    const toggleAllUsers = () => {
      if (selectedUsers.length === filteredUsers.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(filteredUsers.map((u: any) => u.id));
      }
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي المستخدمين"
            value={userStats.total.toString()}
            icon={<Users className="w-6 h-6" />}
            color="indigo"
            trend={{ value: 12.5, positive: true }}
          />
          <StatCard
            title="مستخدمون نشطون"
            value={userStats.active.toString()}
            icon={<CheckCircle className="w-6 h-6" />}
            color="emerald"
            trend={{ value: 8.3, positive: true }}
          />
          <StatCard
            title="مستخدمو التجربة"
            value={userStats.trial.toString()}
            icon={<Clock className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="تنتهي خلال 30 يوم"
            value={userStats.expiring.toString()}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="amber"
            trend={{ value: 3, positive: false }}
          />
        </div>

        {/* Header & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              إدارة المستخدمين
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              عرض وإدارة جميع المشتركين في المنصة
            </p>
          </div>
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-200">
              <span className="text-sm font-bold text-indigo-700">
                تم تحديد {selectedUsers.length} مستخدم
              </span>
              <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
                تصدير CSV
              </button>
              <button className="px-3 py-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all">
                إرسال بريد
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select
            value={userPlanFilter}
            onChange={(e) => setUserPlanFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">جميع الخطط</option>
            <option value="free">مجاني</option>
            <option value="basic">أساسي</option>
            <option value="pro">محترف</option>
            <option value="enterprise">مؤسسات</option>
          </select>
          <select
            value={userStatusFilter}
            onChange={(e) => setUserStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="trial">تجريبي</option>
            <option value="expired">منتهي</option>
            <option value="cancelled">ملغى</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="text-right py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={toggleAllUsers}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    المستخدم
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    الخطة
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    الحالة
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    بداية الاشتراك
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    نهاية الاشتراك
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    التجديد التلقائي
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold ${getPlanColor(user.planType)}`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusColor(user.status)}`}
                      >
                        {user.status === "active"
                          ? "نشط"
                          : user.status === "trial"
                            ? "تجريبي"
                            : user.status === "expired"
                              ? "منتهي"
                              : user.status === "cancelled"
                                ? "ملغى"
                                : "معلق"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                      {new Date(user.startDate).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                      {new Date(user.endDate).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="py-4 px-6">
                      {user.autoRenew ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle className="w-4 h-4" />
                          مفعل
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <XCircle className="w-4 h-4" />
                          معطل
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetails(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="تعديل الاشتراك"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setShowUserDetails(false)}
          />
        )}
      </div>
    );
  };

  const renderLicensesTab: React.FC = () => {
    const licensesData = MOCK_LICENSES.map((lic: any) => ({
      id: lic.id,
      key: lic.key,
      name: `${lic.type === "enterprise" ? "مؤسسات" : lic.type === "team" ? "فريق" : "فردي"} - ${lic.organizationName || "مستخدم فردي"}`,
      type: lic.type,
      organizationName: lic.organizationName,
      assignedTo: lic.assignedTo,
      allowedDomains: lic.allowedDomains,
      maxUsers: lic.maxUsers,
      currentUsers: lic.currentUsers,
      status: lic.status,
      issuedDate: lic.issuedDate,
      expiryDate: lic.expiryDate,
    }));

    const filteredLicenses = licensesData.filter((license: any) => {
      const matchesSearch =
        license.name.toLowerCase().includes(licenseSearchQuery.toLowerCase()) ||
        license.key.toLowerCase().includes(licenseSearchQuery.toLowerCase()) ||
        (license.assignedTo &&
          license.assignedTo
            .toLowerCase()
            .includes(licenseSearchQuery.toLowerCase()));
      const matchesStatus =
        licenseStatusFilter === "all" || license.status === licenseStatusFilter;
      const matchesType =
        licenseTypeFilter === "all" || license.type === licenseTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

    const licenseStats = {
      total: licensesData.length,
      active: licensesData.filter((l: any) => l.status === "active").length,
      expired: licensesData.filter((l: any) => l.status === "expired").length,
      expiringSoon: licensesData.filter((l: any) => {
        const expiryDate = new Date(l.expiryDate);
        const now = new Date();
        const daysUntilExpiry =
          (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return (
          daysUntilExpiry <= 30 && daysUntilExpiry > 0 && l.status === "active"
        );
      }).length,
    };

    const toggleLicenseSelection = (licenseId: string) => {
      setSelectedLicenses((prev) =>
        prev.includes(licenseId)
          ? prev.filter((id) => id !== licenseId)
          : [...prev, licenseId],
      );
    };

    const toggleAllLicenses = () => {
      if (selectedLicenses.length === filteredLicenses.length)
        setSelectedLicenses([]);
      else setSelectedLicenses(filteredLicenses.map((l: any) => l.id));
    };

    const getLicenseTypeLabel = (type: string) =>
      type === "enterprise" ? "مؤسسات" : type === "team" ? "فريق" : "فردي";

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="إجمالي التراخيص"
            value={licenseStats.total.toString()}
            icon={<Key className="w-6 h-6" />}
            color="indigo"
          />
          <StatCard
            title="تراخيص نشطة"
            value={licenseStats.active.toString()}
            icon={<CheckCircle className="w-6 h-6" />}
            color="emerald"
          />
          <StatCard
            title="تراخيص منتهية"
            value={licenseStats.expired.toString()}
            icon={<XCircle className="w-6 h-6" />}
            color="rose"
          />
          <StatCard
            title="تنتهي خلال 30 يوم"
            value={licenseStats.expiringSoon.toString()}
            icon={<Clock className="w-6 h-6" />}
            color="blue"
            trend={{ value: 2, positive: false }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              إدارة التراخيص
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              عرض وإدارة جميع التراخيص الممنوحة
            </p>
          </div>
          {selectedLicenses.length > 0 && (
            <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-200">
              <span className="text-sm font-bold text-indigo-700">
                تم تحديد {selectedLicenses.length} ترخيص
              </span>
              <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
                تصدير CSV
              </button>
              <button className="px-3 py-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all">
                إرسال بريد
              </button>
            </div>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all">
            <Plus className="w-4 h-4" /> ترخيص جديد
          </button>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-slate-200">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن ترخيص..."
              value={licenseSearchQuery}
              onChange={(e) => setLicenseSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select
            value={licenseTypeFilter}
            onChange={(e) => setLicenseTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">جميع الأنواع</option>
            <option value="individual">فردي</option>
            <option value="team">فريق</option>
            <option value="enterprise">مؤسسات</option>
          </select>
          <select
            value={licenseStatusFilter}
            onChange={(e) => setLicenseStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="expired">منتهي</option>
          </select>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="text-right py-4 px-6">
                    <input
                      type="checkbox"
                      checked={
                        selectedLicenses.length === filteredLicenses.length
                      }
                      onChange={toggleAllLicenses}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    مفتاح الترخيص
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    نوع الترخيص
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    المؤسسة/المستخدم
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    المستخدمين
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    الحالة
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    تاريخ الانتهاء
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-black text-slate-700">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLicenses.map((license: any) => (
                  <tr
                    key={license.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedLicenses.includes(license.id)}
                        onChange={() => toggleLicenseSelection(license.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-mono font-bold text-slate-900">
                          {license.key}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ID: {license.id}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold ${license.type === "enterprise" ? "bg-amber-50 text-amber-700" : license.type === "team" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-700"}`}
                      >
                        {getLicenseTypeLabel(license.type)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {license.organizationName || "مستخدم فردي"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {license.assignedTo}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${license.currentUsers / license.maxUsers > 0.9 ? "bg-rose-500" : license.currentUsers / license.maxUsers > 0.7 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{
                              width: `${(license.currentUsers / license.maxUsers) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {license.currentUsers}/{license.maxUsers}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold ${license.status === "active" ? "bg-emerald-50 text-emerald-700" : license.status === "expired" ? "bg-slate-50 text-slate-700" : "bg-amber-50 text-amber-700"}`}
                      >
                        {license.status === "active"
                          ? "نشط"
                          : license.status === "expired"
                            ? "منتهي"
                            : "معلق"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                      {new Date(license.expiryDate).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLicense(license);
                            setShowLicenseModal(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="تجديد"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="إلغاء"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showLicenseModal && selectedLicense && (
          <LicenseDetailsModal
            license={selectedLicense}
            onClose={() => setShowLicenseModal(false)}
          />
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="إجمالي الاشتراكات"
          value={kpiData.totalSubscriptions.toString()}
          icon={<CreditCard className="w-6 h-6" />}
          color="indigo"
          trend={{ value: 12.5, positive: true }}
        />
        <KPICard
          title="اشتراكات نشطة"
          value={kpiData.activeSubscriptions.toString()}
          icon={<CheckCircle className="w-6 h-6" />}
          color="emerald"
          trend={{ value: 8.3, positive: true }}
        />
        <KPICard
          title="الدخل الشهري (MRR)"
          value={`${kpiData.mrr.toLocaleString()} ر.س`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="amber"
          trend={{ value: kpiData.mrrGrowth, positive: true }}
        />
        <KPICard
          title="تنتهي قريباً"
          value={kpiData.expiringSoon.toString()}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="rose"
          trend={{ value: 3, positive: false }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Trend */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                نمو الدخل الشهري
              </h3>
              <p className="text-sm text-slate-500 font-medium">آخر 6 أشهر</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MRR_DATA}>
                <defs>
                  <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dx={-10}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number) => [
                    `${value.toLocaleString()} ر.س`,
                    "الدخل",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMRR)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">توزيع الخطط</h3>
              <p className="text-sm text-slate-500 font-medium">
                عدد المستخدمين لكل خطة
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_PLAN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="plan"
                  label={({ plan, percentage }) => `${plan} (${percentage}%)`}
                >
                  {MOCK_PLAN_DISTRIBUTION.map((entry, index) => {
                    const colors = ["#64748b", "#3b82f6", "#8b5cf6", "#f59e0b"];
                    return <Cell key={`cell-${index}`} fill={colors[index]} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">استخدام API</h3>
              <p className="text-sm text-slate-500 font-medium">
                إجمالي الاستدعاءات
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Zap className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-5xl font-black text-slate-900 mb-2">
              {kpiData.totalAPIUsage.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 font-bold">
              استدعاء API هذا الشهر
            </p>
          </div>
          <div className="mt-6 space-y-4">
            {MOCK_USER_SUBSCRIPTIONS.slice(0, 4).map((sub, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">
                    {sub.userName}
                  </span>
                  <span className="text-slate-500">
                    {sub.usage.apiCalls.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${(sub.usage.apiCalls / 10000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">استخدام AI</h3>
              <p className="text-sm text-slate-500 font-medium">
                إجمالي الاستعلامات
              </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-5xl font-black text-slate-900 mb-2">
              {kpiData.totalAIUsage.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 font-bold">
              استعلام AI هذا الشهر
            </p>
          </div>
          <div className="mt-6 space-y-4">
            {MOCK_USER_SUBSCRIPTIONS.slice(0, 4).map((sub, idx) => {
              const total =
                sub.usage.aiQueries.prediction +
                sub.usage.aiQueries.analysis +
                sub.usage.aiQueries.summarization;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700">
                      {sub.userName}
                    </span>
                    <span className="text-slate-500">
                      {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${(total / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              التنبيهات الأخيرة
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              آخر التنبيهات والنشاطات
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-3">
          {MOCK_ALERTS.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {alert.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {alert.userName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getSeverityColor(alert.severity)}`}
                >
                  {alert.severity === "critical"
                    ? "حرج"
                    : alert.severity === "high"
                      ? "عالي"
                      : alert.severity === "medium"
                        ? "متوسط"
                        : "منخفض"}
                </span>
                {alert.resolved ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            إدارة الاشتراكات والترخيص
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            تحكّم كامل في الخطط والاشتراكات والتراخيص
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all">
            <Plus className="w-4 h-4" />
            خطة جديدة
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm w-fit">
        <TabButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          icon={<Activity className="w-4 h-4" />}
          label="نظرة عامة"
        />
        <TabButton
          active={activeTab === "plans"}
          onClick={() => setActiveTab("plans")}
          icon={<CreditCard className="w-4 h-4" />}
          label="الخطط"
        />
        <TabButton
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
          icon={<Users className="w-4 h-4" />}
          label="المستخدمون"
        />
        <TabButton
          active={activeTab === "licenses"}
          onClick={() => setActiveTab("licenses")}
          icon={<Key className="w-4 h-4" />}
          label="التراخيص"
        />
        <TabButton
          active={activeTab === "usage"}
          onClick={() => setActiveTab("usage")}
          icon={<Database className="w-4 h-4" />}
          label="الاستخدام"
        />
        <TabButton
          active={activeTab === "alerts"}
          onClick={() => setActiveTab("alerts")}
          icon={<AlertTriangle className="w-4 h-4" />}
          label="التنبيهات"
        />
      </div>

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "plans" && renderPlansTab()}
      {activeTab === "users" && renderUsersTab()}
      {activeTab === "licenses" && renderLicensesTab()}
      {activeTab === "usage" && renderUsageTab()}
      {activeTab === "alerts" && renderAlertsTab()}
    </div>
  );
};

// Sub-components
const KPICard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "indigo" | "emerald" | "amber" | "rose";
  trend?: { value: number; positive: boolean };
}> = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    indigo: "from-indigo-600 to-purple-600",
    emerald: "from-emerald-600 to-teal-600",
    amber: "from-amber-600 to-orange-600",
    rose: "from-rose-600 to-red-600",
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black ${
              trend.positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            <TrendingUp
              className={`w-3.5 h-3.5 ${!trend.positive ? "rotate-180" : ""}`}
            />
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-sm font-bold text-slate-500">{title}</p>
    </div>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-[1.5rem] font-bold text-sm transition-all ${
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
    }`}
  >
    {icon}
    {label}
  </button>
);

// Placeholder tabs (to be implemented)
const renderUsageTab = () => (
  <div className="p-12 text-center text-slate-400">
    جاري تطوير قسم الاستخدام...
  </div>
);
const renderAlertsTab = () => (
  <div className="p-12 text-center text-slate-400">
    جاري تطوير قسم التنبيهات...
  </div>
);

const LicenseDetailsModal: React.FC<{ license: any; onClose: () => void }> = ({
  license,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white">
              <Key className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {license.name}
              </h3>
              <p className="text-sm text-slate-500 font-mono">{license.key}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              معلومات الترخيص
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem
                label="نوع الترخيص"
                value={
                  license.type === "enterprise"
                    ? "مؤسسات"
                    : license.type === "team"
                      ? "فريق"
                      : "فردي"
                }
              />
              <InfoItem label="الحالة" value={license.status} badge />
              <InfoItem
                label="تاريخ الإصدار"
                value={new Date(license.issuedDate).toLocaleDateString("ar-SA")}
              />
              <InfoItem
                label="تاريخ الانتهاء"
                value={new Date(license.expiryDate).toLocaleDateString("ar-SA")}
              />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              استخدام الترخيص
            </h4>
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-700">
                  المستخدمين
                </span>
                <span className="text-lg font-black text-slate-900">
                  {license.currentUsers} / {license.maxUsers}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${license.currentUsers / license.maxUsers > 0.9 ? "bg-rose-500" : license.currentUsers / license.maxUsers > 0.7 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{
                    width: `${(license.currentUsers / license.maxUsers) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs font-bold text-slate-400 mt-2">
                {((license.currentUsers / license.maxUsers) * 100).toFixed(0)}%
                مستخدم
              </p>
            </div>
          </div>
          {license.allowedDomains && license.allowedDomains.length > 0 && (
            <div>
              <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                النطاقات المسموحة
              </h4>
              <div className="flex flex-wrap gap-2">
                {license.allowedDomains.map((domain: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-200"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
            >
              إغلاق
            </button>
            <button className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all">
              تجديد الترخيص
            </button>
            <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all">
              تعديل المستخدمين
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "indigo" | "emerald" | "blue" | "amber";
  trend?: { value: number; positive: boolean };
}> = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    indigo: "from-indigo-600 to-purple-600",
    emerald: "from-emerald-600 to-teal-600",
    blue: "from-blue-600 to-cyan-600",
    amber: "from-amber-600 to-orange-600",
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black ${
              trend.positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            <TrendingUp
              className={`w-3.5 h-3.5 ${!trend.positive ? "rotate-180" : ""}`}
            />
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-sm font-bold text-slate-500">{title}</p>
    </div>
  );
};

const UserDetailsModal: React.FC<{ user: any; onClose: () => void }> = ({
  user,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-2xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Subscription Info */}
          <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              معلومات الاشتراك
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="الخطة الحالية" value={user.plan} />
              <InfoItem label="الحالة" value={user.status} badge />
              <InfoItem
                label="تاريخ البداية"
                value={new Date(user.startDate).toLocaleDateString("ar-SA")}
              />
              <InfoItem
                label="تاريخ النهاية"
                value={new Date(user.endDate).toLocaleDateString("ar-SA")}
              />
            </div>
          </div>

          {/* Usage Metrics */}
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              استخدام الخدمة
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UsageBar
                label="لوحات التحكم"
                used={user.usage.dashboardInteractions || 0}
                limit={user.limits.maxDashboards}
                percentage={user.usagePercentage.dashboard || 0}
              />
              <UsageBar
                label="مجموعات البيانات"
                used={user.usage.datasetQueries || 0}
                limit={user.limits.maxDatasets}
                percentage={user.usagePercentage.datasets || 0}
              />
              <UsageBar
                label="طلبات API"
                used={user.usage.apiCalls}
                limit={user.limits.apiRequestsPerMonth}
                percentage={user.usagePercentage.api || 0}
              />
              <UsageBar
                label="استعلامات AI"
                used={
                  user.usage.aiQueries.prediction +
                  user.usage.aiQueries.analysis +
                  user.usage.aiQueries.summarization
                }
                limit={user.limits.aiQueriesPerMonth}
                percentage={user.usagePercentage.ai || 0}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
            >
              إغلاق
            </button>
            <button className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all">
              تغيير الخطة
            </button>
            <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all">
              إعادة تعيين كلمة المرور
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  label: string;
  value: string | number;
  badge?: boolean;
}> = ({ label, value, badge }) => (
  <div>
    <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
    {badge ? (
      <span
        className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(String(value))}`}
      >
        {value === "active"
          ? "نشط"
          : value === "trial"
            ? "تجريبي"
            : value === "expired"
              ? "منتهي"
              : "ملغى"}
      </span>
    ) : (
      <p className="text-sm font-black text-slate-900">{value}</p>
    )}
  </div>
);

const UsageBar: React.FC<{
  label: string;
  used: number;
  limit: number;
  percentage: number;
}> = ({ label, used, limit, percentage }) => (
  <div className="bg-white rounded-xl p-4 border border-slate-100">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="text-xs font-bold text-slate-500">
        {used.toLocaleString()} / {limit.toLocaleString()}
      </span>
    </div>
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${
          percentage > 90
            ? "bg-rose-500"
            : percentage > 70
              ? "bg-amber-500"
              : "bg-emerald-500"
        }`}
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
    <p className="text-xs font-bold text-slate-400 mt-2">
      {percentage.toFixed(0)}% مستخدم
    </p>
  </div>
);

const LimitRow: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-900 font-black">{value}</span>
  </div>
);

const FeatureBadge: React.FC<{ label: string; enabled: boolean }> = ({
  label,
  enabled,
}) => (
  <div
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
      enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-400"
    }`}
  >
    {enabled ? (
      <CheckCircle className="w-3.5 h-3.5" />
    ) : (
      <XCircle className="w-3.5 h-3.5" />
    )}
    {label}
  </div>
);

const ComparisonRow: React.FC<{
  label: string;
  values: any[];
  type?: "text" | "boolean";
}> = ({ label, values, type = "text" }) => (
  <tr className="border-b border-slate-50">
    <td className="py-4 px-4 text-sm font-bold text-slate-700">{label}</td>
    {values.map((value, idx) => (
      <td key={idx} className="text-center py-4 px-4">
        {type === "boolean" ? (
          value ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
          ) : (
            <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
          )
        ) : (
          <span className="text-sm font-bold text-slate-700">{value}</span>
        )}
      </td>
    ))}
  </tr>
);

const PlanModal: React.FC<{
  plan: any;
  onClose: () => void;
  onSave: () => void;
}> = ({ plan, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    plan || {
      name: "",
      type: "basic",
      price: { monthly: 0, yearly: 0 },
      description: "",
      features: {
        dataAngles: false,
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
        maxDashboards: 0,
        maxDatasets: 0,
        apiRequestsPerMonth: 0,
        aiQueriesPerMonth: 0,
        maxUsers: 0,
        storageGB: 0,
      },
    },
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {plan ? "تعديل الخطة" : "إنشاء خطة جديدة"}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              أدخل تفاصيل الخطة الجديدة
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                اسم الخطة
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="مثال: محترف"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                نوع الخطة
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="free">مجاني</option>
                <option value="basic">أساسي</option>
                <option value="pro">محترف</option>
                <option value="enterprise">مؤسسات</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                السعر الشهري (ر.س)
              </label>
              <input
                type="number"
                value={formData.price.monthly}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: {
                      ...formData.price,
                      monthly: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                السعر السنوي (ر.س)
              </label>
              <input
                type="number"
                value={formData.price.yearly}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: {
                      ...formData.price,
                      yearly: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
              rows={3}
              placeholder="وصف قصير للخطة..."
            />
          </div>

          {/* Limits */}
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              حدود الخطة
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <LimitInput
                label="لوحات التحكم"
                value={formData.limits.maxDashboards}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, maxDashboards: v },
                  })
                }
              />
              <LimitInput
                label="مجموعات البيانات"
                value={formData.limits.maxDatasets}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, maxDatasets: v },
                  })
                }
              />
              <LimitInput
                label="طلبات API"
                value={formData.limits.apiRequestsPerMonth}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, apiRequestsPerMonth: v },
                  })
                }
              />
              <LimitInput
                label="استعلامات AI"
                value={formData.limits.aiQueriesPerMonth}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, aiQueriesPerMonth: v },
                  })
                }
              />
              <LimitInput
                label="المستخدمين"
                value={formData.limits.maxUsers}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, maxUsers: v },
                  })
                }
              />
              <LimitInput
                label="التخزين (GB)"
                value={formData.limits.storageGB}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    limits: { ...formData.limits, storageGB: v },
                  })
                }
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-black text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              الميزات
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <FeatureToggle
                label="زوايا البيانات"
                enabled={formData.features.dataAngles}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, dataAngles: v },
                  })
                }
              />
              <FeatureToggle
                label="مستكشف البيانات"
                enabled={formData.features.datasetExplorer}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, datasetExplorer: v },
                  })
                }
              />
              <FeatureToggle
                label="رؤى لوحة القيادة"
                enabled={formData.features.dashboardInsights}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, dashboardInsights: v },
                  })
                }
              />
              <FeatureToggle
                label="تنبؤات AI"
                enabled={formData.features.aiPrediction}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, aiPrediction: v },
                  })
                }
              />
              <FeatureToggle
                label="تحليلات AI"
                enabled={formData.features.aiAnalysis}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, aiAnalysis: v },
                  })
                }
              />
              <FeatureToggle
                label="تصدير البيانات"
                enabled={formData.features.exportData}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, exportData: v },
                  })
                }
              />
              <FeatureToggle
                label="وصول API"
                enabled={formData.features.apiAccess}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, apiAccess: v },
                  })
                }
              />
              <FeatureToggle
                label="دعم ذو أولوية"
                enabled={formData.features.prioritySupport}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    features: { ...formData.features, prioritySupport: v },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            حفظ الخطة
          </button>
        </div>
      </div>
    </div>
  );
};

const LimitInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 mb-1.5">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    />
  </div>
);

const FeatureToggle: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
      enabled
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-slate-50 text-slate-500"
    }`}
  >
    <span className="text-sm font-bold">{label}</span>
    {enabled ? (
      <ToggleRight className="w-5 h-5 text-emerald-600" />
    ) : (
      <ToggleLeft className="w-5 h-5 text-slate-400" />
    )}
  </button>
);

export default SubscriptionsManagement;
