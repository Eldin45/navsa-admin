// src/app/dashboard/account/page.client.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  CreditCard,
  DollarSign,
  History,
  Copy,
  Check,
  RefreshCw,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Shield,
  QrCode,
  Smartphone,
  Wallet,
  Banknote,
  Clock,
  Calendar,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Lock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Receipt,
  FileText,
  Hash,
  Users,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  BarChart,
  PieChart,
  LineChart,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  BadgeCheck,
  Award,
  Star,
  Target,
  BarChart3,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Zap,
  Globe2,
  FileSpreadsheet,
  Printer,
  Share2,
  Bell,
  Settings,
  HelpCircle,
  Info,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  X,
  Edit,
  Trash2,
  Send,
  Receive,
  Repeat,
  Clock as ClockIcon,
  CalendarDays,
  WalletCards,
  Landmark,
  Coins,
  PiggyBank,
  Bank,
  HandCoins,
  CreditCard as CreditCardIcon,
  Smartphone as SmartphoneIcon,
  QrCode as QrCodeIcon,
  ArrowUpFromSquare,
  ArrowDownToSquare,
  ArrowRightLeft as TransferIcon,
  CircleDollarSign,
  CircleEuro,
  CirclePound,
  CircleYen,
  Bitcoin,
  Ethereum,
  CircleHelp,
  CircleAlert,
  CircleCheck,
  CircleX,
  CirclePlus,
  CircleMinus,
  CircleArrowUp,
  CircleArrowDown,
  CircleArrowRight,
  CircleArrowLeft,
  CircleUser,
  CircleBuilding,
  CircleBank,
  CircleDashed,
  CircleDot,
  CircleEllipsis,
  CircleEqual,
  CircleFadingPlus,
  CircleGauge,
  CirclePercent,
  CirclePower,
  CircleStop,
  CircleUserRound,
  CircleWaveformLines
} from "lucide-react";

// Chart components
import {
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";

// Import components
import Navbar from "~/ui/components/header/header";
import Sidebar from "~/ui/components/sidebar/sidebar";

// Loading component
const AccountLoading = () => (
  <div className="flex h-[calc(100vh-200px)] items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2e7d32] border-t-transparent"></div>
      <p className="mt-4 text-gray-700 dark:text-gray-400">
        Loading account information...
      </p>
    </div>
  </div>
);

// Types from server
interface AccountData {
  admin: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  } | null;
  wallet: {
    id: number;
    accountNumber: string;
    bankCode: string;
    accountName: string;
    customerId: string;
    openedDate: string;
  } | null;
  balance: {
    ledgerBalance: number;
    availableBalance: number;
    netBalance: number;
    totalInflow: number;
    totalOutflow: number;
    accountName: string;
    currency: string;
  } | null;
  transactions: Array<{
    id: number;
    reference: string;
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    time: string;
    creditAccount: string;
    debitAccount: string;
  }>;
}

interface Summary {
  totalWallets: number;
  totalBalance: number;
  totalTransactions: number;
  pendingTransactions: number;
}

// Props interface
interface AccountPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    company: string;
    avatar?: string;
    dash_id?: number;
  };
  accountData: AccountData | null;
  summary: Summary;
}

// Transaction Type Badge
const TransactionType = ({ type }: { type: string }) => {
  const config = {
    transfer: { label: "Transfer", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: ArrowRightLeft },
    deposit: { label: "Deposit", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: ArrowDownToLine },
    withdrawal: { label: "Withdrawal", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: ArrowUpFromLine },
    payment: { label: "Payment", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: CreditCard },
    refund: { label: "Refund", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: Repeat }
  };

  const TypeConfig = config[type as keyof typeof config] || config.transfer;
  const Icon = TypeConfig.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TypeConfig.className}`}>
      <Icon className="h-3 w-3" />
      {TypeConfig.label}
    </span>
  );
};

// Transaction Status Badge
const TransactionStatus = ({ status }: { status: string }) => {
  const config = {
    completed: { label: "Completed", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
    failed: { label: "Failed", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: Loader2 }
  };

  const StatusConfig = config[status as keyof typeof config] || config.pending;
  const Icon = StatusConfig.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${StatusConfig.className}`}>
      <Icon className="h-3 w-3" />
      {StatusConfig.label}
    </span>
  );
};

// Account Stat Card
const AccountStatCard = ({ 
  title, 
  value, 
  change, 
  trend = "neutral",
  icon: Icon,
  color = "primary",
  subtitle
}: { 
  title: string; 
  value: string | number; 
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: any;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  subtitle?: string;
}) => {
  const colorClasses = {
    primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
    success: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
    warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800",
    danger: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
    info: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800"
  };

  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 ${colorClasses[color]} hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className={`rounded-full p-2 ${colorClasses[color].split(' ')[0].replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}/20`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-xs mt-1 opacity-75">{subtitle}</p>
        )}
      </div>
      {change && (
        <div className={`mt-2 flex items-center text-xs ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}>
          {trend === "up" ? <TrendingUpIcon className="mr-1 h-3 w-3" /> : 
           trend === "down" ? <TrendingDownIcon className="mr-1 h-3 w-3" /> : null}
          {change}
        </div>
      )}
    </div>
  );
};

// Account Info Card
const AccountInfoCard = ({ accountData }: { accountData: AccountData }) => {
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  if (!accountData.wallet || !accountData.balance) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Wallet className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">No Wallet Found</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Please contact support to set up your wallet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {accountData.balance.accountName || 'Corporate Account'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {accountData.admin?.name} • {accountData.wallet.bankCode}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(`${accountData.wallet.accountNumber} - ${accountData.wallet.bankCode}`)}
              className="flex items-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy Details'}</span>
            </button>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="rounded-lg border border-gray-300 bg-white p-2 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Balance Information */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ledger Balance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {showBalance ? (
                  <>₦{accountData.balance.ledgerBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                ) : (
                  '••••••••'
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {showBalance ? (
                    <>₦{accountData.balance.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                  ) : (
                    '••••••'
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Net Balance</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {showBalance ? (
                    <>₦{accountData.balance.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                  ) : (
                    '••••••'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Account Number</p>
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-gray-900 dark:text-white">{accountData.wallet.accountNumber}</p>
                <button
                  onClick={() => copyToClipboard(accountData.wallet.accountNumber)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Bank Code</p>
              <p className="font-semibold text-gray-900 dark:text-white">{accountData.wallet.bankCode}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Currency</p>
              <p className="font-semibold text-gray-900 dark:text-white">{accountData.balance.currency || 'NGN'}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Opened Date</p>
              <p className="font-semibold text-gray-900 dark:text-white">{accountData.wallet.openedDate}</p>
            </div>
          </div>

          {/* Flow Summary */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Inflow</p>
              <p className="font-semibold text-green-600 dark:text-green-400">
                {showBalance ? (
                  <>+₦{accountData.balance.totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                ) : (
                  '••••••'
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Outflow</p>
              <p className="font-semibold text-red-600 dark:text-red-400">
                {showBalance ? (
                  <>-₦{accountData.balance.totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                ) : (
                  '••••••'
                )}
              </p>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Net Position</p>
              <p className={`font-bold ${
                accountData.balance.netBalance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {showBalance ? (
                  <>₦{accountData.balance.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                ) : (
                  '••••••'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 p-6 dark:border-gray-700">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <button className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
            <Download className="h-4 w-4" />
            <span>Download Statement</span>
          </button>
          <button className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
            <Send className="h-4 w-4" />
            <span>Make Transfer</span>
          </button>
          <button className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
            <History className="h-4 w-4" />
            <span>Transaction History</span>
          </button>
          <button className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AccountPageClient({ user, accountData, summary }: AccountPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30d',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Use real transactions from accountData
  const transactions = accountData?.transactions || [];
  
  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return t.description.toLowerCase().includes(searchLower) ||
             t.reference.toLowerCase().includes(searchLower);
    }
    
    // Date range filtering
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange.replace('d', ''));
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const transactionDate = new Date(t.date);
      if (transactionDate < cutoff) return false;
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Chart data from real transactions
  const transactionTypeData = [
    { name: 'Completed', value: transactions.filter(t => t.status === 'completed').length, color: '#10B981' },
    { name: 'Pending', value: transactions.filter(t => t.status === 'pending').length, color: '#F59E0B' },
    { name: 'Failed', value: transactions.filter(t => t.status === 'failed').length, color: '#EF4444' }
  ];

  // Daily transaction volume (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      amount: total
    };
  }).reverse();

  const handleRefresh = async () => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Account data refreshed');
    }, 1000);
  };

  const handleExportStatement = () => {
    toast.success('Exporting account statement...');
    // Export logic here
  };

  if (!accountData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="lg:ml-64">
          <div className="p-4 md:p-6 pt-20 lg:pt-24">
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <Wallet className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">No Account Data Found</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Unable to load your account information. Please contact support.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''} lg:ml-64`}>
        <div className="p-4 md:p-6 pt-20 lg:pt-24">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-50">
                  Corporate Account Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your corporate funds, view transactions, and monitor balances
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <button 
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button 
                  className="flex items-center rounded-lg bg-[#2e7d32] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1b5e20]"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Make Transfer
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <AccountLoading />
          ) : (
            <>
              {/* Account Information */}
              <div className="mb-6">
                <AccountInfoCard accountData={accountData} />
              </div>

              {/* Quick Stats */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AccountStatCard
                  title="Total Balance"
                  value={`₦${accountData.balance?.ledgerBalance.toLocaleString() || '0'}`}
                  change={`+${((accountData.balance?.totalInflow || 0) / (accountData.balance?.ledgerBalance || 1) * 100).toFixed(1)}% growth`}
                  trend="up"
                  icon={DollarSign}
                  color="primary"
                />
                <AccountStatCard
                  title="Total Transactions"
                  value={transactions.length}
                  change={`${transactions.filter(t => t.status === 'completed').length} completed`}
                  trend="neutral"
                  icon={ArrowRightLeft}
                  color="success"
                />
                <AccountStatCard
                  title="Total Inflow"
                  value={`₦${accountData.balance?.totalInflow.toLocaleString() || '0'}`}
                  subtitle="All time deposits"
                  trend="up"
                  icon={ArrowDownToLine}
                  color="info"
                />
                <AccountStatCard
                  title="Pending Transactions"
                  value={transactions.filter(t => t.status === 'pending').length}
                  change="Awaiting confirmation"
                  trend="neutral"
                  icon={Clock}
                  color="warning"
                />
              </div>

              {/* Charts Section */}
              <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Daily Transactions */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Transaction Volume</h3>
                    <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={last7Days}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Amount']}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                        />
                        <Bar 
                          dataKey="amount" 
                          name="Daily Amount" 
                          fill="#10B981" 
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Transaction Status Distribution */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Transaction Status Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={transactionTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {transactionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [value, 'transactions']}
                          contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                {/* Header */}
                <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Recent account transactions and activities
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleExportStatement}
                        className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Status Filter */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date Range
                      </label>
                      <select
                        value={filters.dateRange}
                        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                        <option value="all">All Time</option>
                      </select>
                    </div>

                    {/* Search */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          value={filters.search}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Reference</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount (₦)</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{transaction.date}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.time}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">{transaction.description}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.creditAccount === accountData.wallet?.accountNumber ? 'Credit' : 'Debit'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                              {transaction.reference}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`font-bold ${
                              transaction.creditAccount === accountData.wallet?.accountNumber 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.creditAccount === accountData.wallet?.accountNumber ? '+' : '-'}
                              ₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <TransactionStatus status={transaction.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toast.info(`Viewing receipt for ${transaction.reference}`)}
                                className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="View Receipt"
                              >
                                <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(transaction.reference);
                                  toast.success('Reference copied to clipboard');
                                }}
                                className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Copy Reference"
                              >
                                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Empty State */}
                  {filteredTransactions.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <History className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        No transactions found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your filters or make your first transaction
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {filteredTransactions.length > 0 && (
                  <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(endIndex, filteredTransactions.length)}</span> of{' '}
                      <span className="font-medium">{filteredTransactions.length}</span> transactions
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1 text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}