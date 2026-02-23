// src/app/dashboard/account/page.tsx
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
  
  Clock,
  
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Receipt,
  FileText,
  
  ArrowRightLeft,
  
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,

  Settings,
  
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  X,
  Send,
  Repeat,
  Clock as ClockIcon,

  CreditCard as CreditCardIcon,
  Smartphone as SmartphoneIcon,
  QrCode as QrCodeIcon,
  
  ArrowRightLeft as TransferIcon,
 
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
} from "recharts";

// Import components
import Navbar from "~/ui/components/header/header";
import Sidebar from "~/ui/components/sidebar/sidebar";

// Loading component - Updated to show within content area
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

// Transaction type definition
interface Transaction {
  id: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  date: string;
  time: string;
  description: string;
  reference: string;
  sender: string;
  recipient: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  category: string;
  balanceAfter: number;
}

// Account type definition
interface Account {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  type: 'corporate' | 'operational' | 'savings' | 'escrow';
  currency: string;
  currentBalance: number;
  availableBalance: number;
  ledgerBalance: number;
  status: 'active' | 'suspended' | 'inactive';
  openedDate: string;
  lastTransactionDate: string;
  dailyLimit: number;
  monthlyLimit: number;
  totalDeposits: number;
  totalWithdrawals: number;
  interestRate?: number;
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
  };
}

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

// Account Info Card
const AccountInfoCard = ({ account }: { account: Account }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Null Wallet</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Null • {account.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(`${account.accountNumber} - ${account.bankName}`)}
              className="flex items-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy Details'}</span>
            </button>
            {/* <button className="flex items-center space-x-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </button> */}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Balance Information */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₦ 0.00
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ₦0.00
                </p>
              </div>
              {/* <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ledger</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ₦{account.ledgerBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div> */}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Account Number</p>
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-gray-900 dark:text-white">Null</p>
                <button
                  onClick={() => copyToClipboard(account.accountNumber)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Bank Name</p>
              <p className="font-semibold text-gray-900 dark:text-white">Null</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">Null</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Currency</p>
              <p className="font-semibold text-gray-900 dark:text-white">{account.currency}</p>
            </div>
          </div>

          {/* Limits & Status */}
      
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 p-6 dark:border-gray-700">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
       
          <button className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
            <FileText className="h-4 w-4" />
            <span>View Reports</span>
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

// Fund Transfer Modal
const FundTransferModal = ({ 
  isOpen, 
  onClose, 
  account,
  onSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  account: Account;
  onSuccess: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    recipientName: '',
    recipientAccountNumber: '',
    recipientBank: '',
    recipientBankCode: '',
    narration: '',
    pin: '',
    saveAsBeneficiary: false
  });

  const [banks, setBanks] = useState([
    { code: '001', name: 'First Bank of Nigeria' },
    { code: '044', name: 'Access Bank' },
    { code: '058', name: 'GTBank' },
    { code: '033', name: 'United Bank for Africa' },
    { code: '214', name: 'First City Monument Bank' },
    { code: '050', name: 'Ecobank Nigeria' },
    { code: '232', name: 'Sterling Bank' },
    { code: '215', name: 'Unity Bank' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '011', name: 'First Bank of Nigeria' }
  ]);

  const validateAccount = async () => {
    if (!formData.recipientAccountNumber || !formData.recipientBankCode) {
      toast.error('Please enter account number and select bank');
      return false;
    }

    if (formData.amount === '' || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }

    const amount = parseFloat(formData.amount);
    if (amount > account.availableBalance) {
      toast.error('Insufficient funds');
      return false;
    }

    if (amount > account.dailyLimit) {
      toast.error(`Amount exceeds daily limit of ₦${account.dailyLimit.toLocaleString()}`);
      return false;
    }

    // Simulate account validation
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation - in real app, this would be an API call
    const isValid = formData.recipientAccountNumber.length === 10;
    
    if (isValid) {
      const mockName = formData.recipientAccountNumber === '1234567890' 
        ? 'Test Recipient' 
        : `Account ${formData.recipientAccountNumber.slice(-4)}`;
      
      setFormData(prev => ({ ...prev, recipientName: mockName }));
      setStep(2);
      toast.success('Account validated successfully');
    } else {
      toast.error('Invalid account number');
    }
    
    setLoading(false);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction
      const transaction = {
        id: `TRX${Date.now()}`,
        amount: parseFloat(formData.amount),
        recipient: formData.recipientName,
        date: new Date().toISOString(),
        status: 'completed'
      };

      toast.success(`Transfer of ₦${transaction.amount.toLocaleString()} completed successfully!`);
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      recipientName: '',
      recipientAccountNumber: '',
      recipientBank: '',
      recipientBankCode: '',
      narration: '',
      pin: '',
      saveAsBeneficiary: false
    });
    setStep(1);
  };

  const handleBankSelect = (bankCode: string) => {
    const bank = banks.find(b => b.code === bankCode);
    if (bank) {
      setFormData(prev => ({ 
        ...prev, 
        recipientBank: bank.name,
        recipientBankCode: bank.code
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="rounded-t-2xl bg-gradient-to-r from-green-600 to-green-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Fund Cooperate</h2>
                <p className="text-sm text-white/90 mt-1">
                  Transfer funds from your corporate account
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-white/10"
                disabled={loading}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  1
                </div>
                <div className={`h-1 w-16 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  2
                </div>
                <div className={`h-1 w-16 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  3
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className={step >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>Details</span>
              <span className={step >= 2 ? 'text-green-600 font-medium' : 'text-gray-500'}>Review</span>
              <span className={step >= 3 ? 'text-green-600 font-medium' : 'text-gray-500'}>Confirm</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount (₦) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span>
                    <input
                      type="number"
                      required
                      min="100"
                      step="100"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="0.00"
                      disabled={loading}
                    />
                  </div>
                  <div className="mt-2 flex space-x-2">
                    {[5000, 10000, 50000, 100000].map((amount) => (
                      <button
                        type="button"
                        key={amount}
                        onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-green-500 hover:bg-green-50 dark:border-gray-600 dark:hover:border-green-500"
                      >
                        ₦{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Account */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recipient Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientAccountNumber}
                    onChange={(e) => setFormData({ ...formData, recipientAccountNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter 10-digit account number"
                    maxLength={10}
                    disabled={loading}
                  />
                </div>

                {/* Bank Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Bank *
                  </label>
                  <select
                    required
                    value={formData.recipientBankCode}
                    onChange={(e) => handleBankSelect(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    disabled={loading}
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Narration */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Narration
                  </label>
                  <input
                    type="text"
                    value={formData.narration}
                    onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter payment description"
                    disabled={loading}
                  />
                </div>

                {/* Save Beneficiary */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.saveAsBeneficiary}
                    onChange={(e) => setFormData({ ...formData, saveAsBeneficiary: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    disabled={loading}
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Save as beneficiary for future transfers
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Review Section */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-4 font-medium text-gray-900 dark:text-white">Transfer Review</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₦{parseFloat(formData.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Recipient:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formData.recipientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Account Number:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formData.recipientAccountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bank:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formData.recipientBank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Narration:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formData.narration || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transfer Fee:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₦50.00</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Total Debit:</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₦{(parseFloat(formData.amount) + 50).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PIN Input */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter Transaction PIN *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-lg tracking-widest focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="●●●●"
                    maxLength={4}
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter your 4-digit transaction PIN
                  </p>
                </div>

                {/* Terms */}
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                  <div className="flex items-start">
                    <AlertCircle className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div className="text-sm text-amber-800 dark:text-amber-400">
                      <p className="font-medium">Important Notice</p>
                      <p className="mt-1">
                        Please review all details carefully. Once confirmed, this transaction cannot be reversed.
                        Ensure you have sufficient balance and the recipient details are correct.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-8 flex justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={async () => {
                      if (step === 1) {
                        const isValid = await validateAccount();
                        if (!isValid) return;
                      } else if (step === 2) {
                        setStep(3);
                      }
                    }}
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </span>
                    ) : step === 1 ? (
                      'Validate Account'
                    ) : (
                      'Confirm Transfer'
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </span>
                    ) : (
                      'Complete Transfer'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AccountPage({ user }: AccountPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: '30d',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Mock account data
  const account: Account = {
    id: 'ACC001',
    name: 'NAVSA Agro Tech Ltd. - Main Account',
    accountNumber: '7300123456',
    bankName: 'First Bank of Nigeria',
    bankCode: '001',
    type: 'corporate',
    currency: 'NGN',
    currentBalance: 2450000,
    availableBalance: 2420000,
    ledgerBalance: 2450000,
    status: 'active',
    openedDate: '2023-01-15',
    lastTransactionDate: '2024-02-07',
    dailyLimit: 5000000,
    monthlyLimit: 50000000,
    totalDeposits: 3500000,
    totalWithdrawals: 1050000,
    interestRate: 4.5
  };

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 'TRX001',
      type: 'transfer',
      amount: 150000,
      currency: 'NGN',
      status: 'completed',
      date: '2024-02-07',
      time: '10:30 AM',
      description: 'Farm equipment purchase',
      reference: 'REF001',
      sender: 'NAVSA Agro Tech Ltd.',
      recipient: 'Agro Equipment Ltd.',
      bankName: 'First Bank',
      accountNumber: '9876543210',
      accountName: 'Agro Equipment Ltd.',
      category: 'Equipment',
      balanceAfter: 2300000
    },
    {
      id: 'TRX002',
      type: 'deposit',
      amount: 500000,
      currency: 'NGN',
      status: 'completed',
      date: '2024-02-05',
      time: '02:15 PM',
      description: 'Client payment - Farm produce',
      reference: 'REF002',
      sender: 'Fresh Foods Market',
      recipient: 'NAVSA Agro Tech Ltd.',
      bankName: 'GTBank',
      accountNumber: '7300123456',
      accountName: 'NAVSA Agro Tech Ltd.',
      category: 'Revenue',
      balanceAfter: 2450000
    },
    {
      id: 'TRX003',
      type: 'withdrawal',
      amount: 200000,
      currency: 'NGN',
      status: 'completed',
      date: '2024-02-03',
      time: '11:45 AM',
      description: 'Staff salaries - February',
      reference: 'REF003',
      sender: 'NAVSA Agro Tech Ltd.',
      recipient: 'Various Staff Accounts',
      bankName: 'First Bank',
      accountNumber: 'N/A',
      accountName: 'Salary Payments',
      category: 'Payroll',
      balanceAfter: 2250000
    },
    {
      id: 'TRX004',
      type: 'payment',
      amount: 75000,
      currency: 'NGN',
      status: 'pending',
      date: '2024-02-07',
      time: '03:20 PM',
      description: 'Utility bills payment',
      reference: 'REF004',
      sender: 'NAVSA Agro Tech Ltd.',
      recipient: 'PHCN',
      bankName: 'First Bank',
      accountNumber: '1234567890',
      accountName: 'PHCN Billing',
      category: 'Utilities',
      balanceAfter: 2375000
    },
    {
      id: 'TRX005',
      type: 'refund',
      amount: 45000,
      currency: 'NGN',
      status: 'completed',
      date: '2024-02-06',
      time: '09:15 AM',
      description: 'Supplier overpayment refund',
      reference: 'REF005',
      sender: 'Agro Supplies Ltd.',
      recipient: 'NAVSA Agro Tech Ltd.',
      bankName: 'Access Bank',
      accountNumber: '7300123456',
      accountName: 'NAVSA Agro Tech Ltd.',
      category: 'Refund',
      balanceAfter: 2415000
    },
    {
      id: 'TRX006',
      type: 'transfer',
      amount: 120000,
      currency: 'NGN',
      status: 'failed',
      date: '2024-02-04',
      time: '04:30 PM',
      description: 'Seed supplier payment',
      reference: 'REF006',
      sender: 'NAVSA Agro Tech Ltd.',
      recipient: 'Seed Masters Ltd.',
      bankName: 'Zenith Bank',
      accountNumber: '1122334455',
      accountName: 'Seed Masters Ltd.',
      category: 'Supplies',
      balanceAfter: 2450000
    },
    {
      id: 'TRX007',
      type: 'deposit',
      amount: 300000,
      currency: 'NGN',
      status: 'completed',
      date: '2024-02-02',
      time: '01:45 PM',
      description: 'Farm produce sales',
      reference: 'REF007',
      sender: 'Green Market Ltd.',
      recipient: 'NAVSA Agro Tech Ltd.',
      bankName: 'UBA',
      accountNumber: '7300123456',
      accountName: 'NAVSA Agro Tech Ltd.',
      category: 'Revenue',
      balanceAfter: 2150000
    },
    {
      id: 'TRX008',
      type: 'withdrawal',
      amount: 50000,
      currency: 'NGN',
      status: 'completed',
      date: '2024-02-01',
      time: '10:00 AM',
      description: 'Office supplies',
      reference: 'REF008',
      sender: 'NAVSA Agro Tech Ltd.',
      recipient: 'Stationery World',
      bankName: 'First Bank',
      accountNumber: '9988776655',
      accountName: 'Stationery World',
      category: 'Operations',
      balanceAfter: 2100000
    }
  ];

  // Calculate stats
  const totalTransactions = transactions.length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => (t.type === 'withdrawal' || t.type === 'payment' || t.type === 'transfer') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  // Chart data
  const dailyTransactionsData = [
    { day: 'Mon', amount: 450000 },
    { day: 'Tue', amount: 320000 },
    { day: 'Wed', amount: 280000 },
    { day: 'Thu', amount: 510000 },
    { day: 'Fri', amount: 420000 },
    { day: 'Sat', amount: 190000 },
    { day: 'Sun', amount: 150000 }
  ];

  const transactionTypeData = [
    { name: 'Transfers', value: 3, color: '#8B5CF6' },
    { name: 'Deposits', value: 2, color: '#10B981' },
    { name: 'Withdrawals', value: 2, color: '#EF4444' },
    { name: 'Payments', value: 1, color: '#3B82F6' }
  ];

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.reference.toLowerCase().includes(searchLower) ||
        t.recipient.toLowerCase().includes(searchLower) ||
        t.sender.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    const now = new Date();
    const daysAgo = filters.dateRange === '7d' ? 7 : 
                    filters.dateRange === '30d' ? 30 : 
                    filters.dateRange === '90d' ? 90 : 365;

    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.date);
      const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= daysAgo;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Initialize data
  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Account data refreshed');
    }, 1000);
  };

  const handleExportStatement = () => {
    toast.success('Exporting account statement...');
    // Export logic here
  };

  const handleTransactionSuccess = () => {
    // Refresh transactions after successful transfer
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Imported Components */}
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Transfer Modal */}
      <FundTransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        account={account}
        onSuccess={handleTransactionSuccess}
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''} lg:ml-64`}>
        <div className="p-4 md:p-6 pt-20 lg:pt-24">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-50">
               Account Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your corporate funds, view transactions, and make transfers
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <button 
                  onClick={handleRefresh}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </button>
                <button 
                  onClick={() => setIsTransferModalOpen(true)}
                  className="flex items-center rounded-lg bg-[#2e7d32] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1b5e20]"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Fund Cooperate
                </button>
              </div>
            </div>
          </div>

          {/* Content with Loading State */}
          {isLoading ? (
            <AccountLoading />
          ) : (
            <>
              {/* Account Information */}
              <div className="mb-6">
                <AccountInfoCard account={account} />
              </div>

              {/* Quick Stats */}
          

              {/* Charts Section */}
              <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Daily Transactions */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Transaction Volume</h3>
                    <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      <option>This Week</option>
                      <option>Last Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={dailyTransactionsData}>
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

                {/* Transaction Types */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Transaction Type Distribution</h3>
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
                      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                      <button
                        onClick={handleExportStatement}
                        className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </button>
                      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                      <button className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Type Filter */}
                    <div>
                      {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Transaction Type
                      </label>
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="all">All Types</option>
                        <option value="transfer">Transfers</option>
                        <option value="deposit">Deposits</option>
                        <option value="withdrawal">Withdrawals</option>
                        <option value="payment">Payments</option>
                        <option value="refund">Refunds</option>
                      </select>
                    </div>

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
                        <option value="processing">Processing</option>
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
                        <option value="1y">Last Year</option>
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
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount (₦)</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Balance After</th>
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
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{transaction.description}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Ref: {transaction.reference} • {transaction.recipient}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <TransactionType type={transaction.type} />
                          </td>
                          <td className="px-6 py-4">
                            <div className={`font-bold ${transaction.type === 'deposit' || transaction.type === 'refund' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                              ₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <TransactionStatus status={transaction.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              ₦{transaction.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
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
                              {transaction.status === 'pending' && (
                                <button
                                  onClick={() => toast.info(`Cancel transaction ${transaction.reference}`)}
                                  className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                                  title="Cancel Transaction"
                                >
                                  <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </button>
                              )}
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
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`rounded-lg px-3 py-1 text-sm ${
                              currentPage === pageNum
                                ? 'bg-[#2e7d32] text-white'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
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