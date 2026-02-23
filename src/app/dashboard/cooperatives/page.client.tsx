// src/app/dashboard/cooperatives/page.client.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Building,
  Users,
  Phone,
  Mail,
  MapPin,
  Home,
  Shield,
  Briefcase,
  UserCheck,
  Target,
  X,
  DollarSign,
  Save
} from "lucide-react";

// Import components
import Navbar from "~/ui/components/header/header";
import Sidebar from "~/ui/components/sidebar/sidebar";
import {
  BarChart,
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
} from "recharts";

// Import server action
import { createCooperateAdmin } from "~/lib/actions/cooperate-admin-actions";

// Cooperate type definition
interface Cooperate {
  id: number;
  dash_id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  registration_date: Date;
  status: number;
  created_at: Date;
  updated_at: Date;
  
  // Dashboard admin fields
  dadmin_id: number;
  admin_fullname: string;
  d_firstname: string;
  d_surname: string;
  d_phone: string;
  d_email: string;
  d_status: number;
  d_state: string;
  d_lga: string;
  dash_role: string;
  dash_company: string;
  created_at_dash: Date;
  updated_at_dash: Date;
}

interface CooperateStats {
  totalCooperates: number;
  activeCooperates: number;
  inactiveCooperates: number;
  totalArea: number;
  recentRegistrations: number;
  byState: Record<string, number>;
  byStatus: Record<string, number>;
  totalRevenue: number;
  activeAlerts: number;
}

interface UserData {
  id: string;
  phone: string;
  email: string;
  dash_id: number;
  name: string;
  avatar: string | null;
}

interface FiltersData {
  states: string[];
  roles: string[];
  statuses: { value: string; label: string; count?: number }[];
  years: number[];
}

// Status badge component
const StatusBadge = ({ status }: { status: number }) => {
  const statusConfig = {
    1: {
      label: "Active",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle
    },
    0: {
      label: "Inactive",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      icon: XCircle
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

// Role badge component
const RoleBadge = ({ role }: { role: string }) => {
  const roleConfig: Record<string, { color: string; icon: any }> = {
    "admin": { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: Shield },
    "manager": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: Briefcase },
    "supervisor": { color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400", icon: UserCheck },
    "agent": { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: Users },
    "coordinator": { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Target },
    "default": { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", icon: Users }
  };

  const config = roleConfig[role.toLowerCase()] || roleConfig.default;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// Stats card component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon,
  color = "primary"
}: { 
  title: string; 
  value: string | number; 
  icon: any;
  color?: "primary" | "success" | "warning" | "info" | "danger";
}) => {
  const colorClasses = {
    primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    success: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    info: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20",
    danger: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
  };

  return (
    <div className="rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

// View Modal Component
const ViewModal = ({ 
  cooperate, 
  isOpen, 
  onClose 
}: { 
  cooperate: Cooperate | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!cooperate || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cooperative Details
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Cooperative Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {cooperate.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{cooperate.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">ID: {cooperate.id}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={cooperate.status} />
                <RoleBadge role={cooperate.dash_role} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Cooperative Information */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Cooperative Info
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Email:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{cooperate.email || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Phone:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{cooperate.phone || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Address:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{cooperate.address || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Location:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{cooperate.state}, {cooperate.lga}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Registered:</span>{' '}
                  <span className="text-gray-900 dark:text-white">
                    {cooperate.registration_date ? new Date(cooperate.registration_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </span>
                </p>
              </div>
            </div>

            {/* Admin Information */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Dashboard Admin
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Name:</span>{' '}
                  <span className="text-gray-900 dark:text-white">
                    {cooperate.d_firstname} {cooperate.d_surname}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Email:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{cooperate.d_email}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Phone:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{cooperate.d_phone || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Role:</span>{' '}
                  <span className="text-gray-900 dark:text-white capitalize">{cooperate.dash_role}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Company:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{cooperate.dash_company || 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 border-t pt-4 dark:border-gray-700">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Created: {new Date(cooperate.created_at).toLocaleString()}</span>
              <span>Updated: {new Date(cooperate.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditModal = ({ 
  cooperate, 
  isOpen, 
  onClose 
}: { 
  cooperate: Cooperate | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    lga: "",
    status: 1,
    dash_role: "",
    dash_company: "",
    d_firstname: "",
    d_surname: "",
    d_email: "",
    d_phone: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cooperate) {
      setFormData({
        name: cooperate.name || "",
        email: cooperate.email || "",
        phone: cooperate.phone || "",
        address: cooperate.address || "",
        state: cooperate.state || "",
        lga: cooperate.lga || "",
        status: cooperate.status,
        dash_role: cooperate.dash_role || "",
        dash_company: cooperate.dash_company || "",
        d_firstname: cooperate.d_firstname || "",
        d_surname: cooperate.d_surname || "",
        d_email: cooperate.d_email || "",
        d_phone: cooperate.d_phone || ""
      });
    }
  }, [cooperate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Cooperate updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update cooperate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!cooperate || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Modal Header */}
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Cooperative
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Cooperative Information */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Cooperative Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">LGA</label>
                  <input
                    type="text"
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Admin Information */}
            <div className="border-t pt-4 dark:border-gray-700">
              <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Admin Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">First Name *</label>
                  <input
                    type="text"
                    name="d_firstname"
                    value={formData.d_firstname}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Surname *</label>
                  <input
                    type="text"
                    name="d_surname"
                    value={formData.d_surname}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Email *</label>
                  <input
                    type="email"
                    name="d_email"
                    value={formData.d_email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Phone</label>
                  <input
                    type="text"
                    name="d_phone"
                    value={formData.d_phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Role</label>
                  <select
                    name="dash_role"
                    value={formData.dash_role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Company</label>
                  <input
                    type="text"
                    name="dash_company"
                    value={formData.dash_company}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 mt-6 border-t border-gray-200 bg-white pt-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Funding Modal Component
const FundingModal = ({ 
  cooperate, 
  isOpen, 
  onClose 
}: { 
  cooperate: Cooperate | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cooperate) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Successfully funded ₦${parseInt(amount).toLocaleString()} to ${cooperate.name}`);
      setAmount("");
      setPurpose("");
      onClose();
    } catch (error) {
      toast.error("Failed to process funding");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cooperate || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fund Cooperative
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{cooperate.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{cooperate.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount to Fund
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-700 dark:text-gray-400">₦</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Purpose (Optional)
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What is this funding for?"
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !amount}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <div className="h-4 w-4" />
                  Confirm Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Modal Component
const DeleteModal = ({ 
  cooperate, 
  isOpen, 
  onClose,
  onConfirm
}: { 
  cooperate: Cooperate | null; 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onConfirm();
      toast.success("Cooperate deleted successfully");
    } catch (error) {
      toast.error("Failed to delete cooperate");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!cooperate || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-900">
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
              <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Delete Cooperative
          </h3>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-white">{cooperate.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cooperate card component (Grid View)
const CooperateCard = ({ 
  cooperate, 
  onView, 
  onEdit, 
  onFund,
  onDelete 
}: { 
  cooperate: Cooperate; 
  onView: (cooperate: Cooperate) => void;
  onEdit: (cooperate: Cooperate) => void;
  onFund: (cooperate: Cooperate) => void;
  onDelete: (cooperate: Cooperate) => void;
}) => {
  return (
    <div className="rounded-xl border bg-white p-4 transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {/* Cooperate Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{cooperate.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{cooperate.email}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={cooperate.status} />
            <RoleBadge role={cooperate.dash_role} />
          </div>
        </div>
        <div className="relative group">
          <button className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreVertical className="h-4 w-4" />
          </button>
          <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-lg border border-gray-200 bg-white shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-800 z-10">
            <button 
              onClick={() => onView(cooperate)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button 
              onClick={() => onEdit(cooperate)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
              Edit Cooperate
            </button>
            <button 
              onClick={() => onFund(cooperate)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600"
            >
              <div className="h-4 w-4" />
              Fund Cooperate
            </button>
            <div className="border-t dark:border-gray-700 my-1"></div>
            <button 
              onClick={() => onDelete(cooperate)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <Trash2 className="h-4 w-4" />
              Delete Cooperate
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{cooperate.phone || "No phone"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {cooperate.state}, {cooperate.lga || "N/A"}
          </span>
        </div>
      </div>

      {/* Admin Info */}
      <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">Dashboard Admin</div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <div className="text-sm font-medium">
              {cooperate.d_firstname} {cooperate.d_surname}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{cooperate.d_email}</div>
          </div>
        </div>
      </div>

      {/* Registration Date */}
      <div className="flex items-center justify-between border-t pt-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Registered: {cooperate.registration_date ? new Date(cooperate.registration_date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }) : "N/A"}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

// Debug View Component
const DataDebugView = ({ cooperates }: { cooperates: Cooperate[] }) => {
  if (cooperates.length === 0) {
    return (
      <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20">
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-red-700 dark:text-red-300">⚠️ No Cooperates Data Available</h3>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              The cooperates list is empty. Check the following:
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm text-red-600 dark:text-red-400 space-y-1">
              <li>Check browser console for server logs</li>
              <li>Verify database has records in cooperates table</li>
              <li>Verify dashboard_admin has records with status = 1</li>
              <li>Check the JOIN condition (cooperate_id = dash_id)</li>
            </ul>
            <div className="mt-3 p-2 bg-white rounded border">
              <code className="text-xs">
                SELECT cooperate_id, cooperate_name FROM cooperates LIMIT 5;
                <br />
                SELECT dash_id, admin_fullname FROM dashboard_admin WHERE status = 1 LIMIT 5;
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Add Cooperate Modal Component - Simplified Version
const AddCooperateModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    // Institution Information
    cname: "", // Institution Name
    name: "",  // Rep Fullname
    email: "",
    phone: "",
    state: "",
    password: "",
    confirm_password: ""
  });

  const [states, setStates] = useState<string[]>([
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
    "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", 
    "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate required fields
    if (!formData.cname || !formData.name || !formData.email || !formData.password || !formData.state) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the server action to create cooperate admin
      const result = await createCooperateAdmin({
        cooperate_name: formData.cname,
        location: formData.state,
        fullname: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (result.success) {
        toast.success("Cooperate account created successfully!");
        onClose();
        
        // Reset form
        setFormData({
          cname: "",
          name: "",
          email: "",
          phone: "",
          state: "",
          password: "",
          confirm_password: ""
        });
        setRememberMe(true);
        
        // Refresh the page to show new cooperate
        window.location.reload();
        
      } else {
        // Display validation errors
        if (result.errors) {
          if (result.errors.email) {
            toast.error(result.errors.email);
          } else if (result.errors.general) {
            toast.error(result.errors.general);
          } else {
            toast.error("Failed to create cooperate account. Please try again.");
          }
        }
      }
      
    } catch (error) {
      console.error("Error creating cooperate:", error);
      toast.error("Failed to create cooperate account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl dark:bg-gray-900">
          {/* Card Header */}
          <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Cooperative
              </h4>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution Name */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Institution Name
                  </label>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <input
                    type="text"
                    name="cname"
                    value={formData.cname}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Institution Name"
                  />
                </div>
              </div>

              {/* Rep Fullname */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rep Fullname
                  </label>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Rep fullname"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mobile
                  </label>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Mobile"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              {/* Location State */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location State
                  </label>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4"></div>
                <div className="col-span-12 md:col-span-8">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Remember Me
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-8 md:col-start-4">
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Creating...
                        </>
                      ) : (
                        "Create"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          cname: "",
                          name: "",
                          email: "",
                          phone: "",
                          state: "",
                          password: "",
                          confirm_password: ""
                        });
                        setRememberMe(true);
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CooperativesPageProps {
  user: UserData;
  initialCooperates: Cooperate[];
  stats: CooperateStats;
  filters: FiltersData;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    state?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  };
}

export default function CooperativesPage({
  user,
  initialCooperates,
  stats,
  filters,
  searchParams
}: CooperativesPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCooperate, setSelectedCooperate] = useState<Cooperate | null>(null);
  const [cooperates, setCooperates] = useState<Cooperate[]>(initialCooperates);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.status || "all");
  const [stateFilter, setStateFilter] = useState<string>(searchParams.state || "all");
  const [roleFilter, setRoleFilter] = useState<string>(searchParams.role || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Log received data
  useEffect(() => {
    console.log("=== CLIENT PAGE DEBUG ===");
    console.log("Initial cooperates received:", initialCooperates.length);
    console.log("First cooperate:", initialCooperates[0]);
    console.log("Stats received:", stats);
    console.log("Search params:", searchParams);
  }, [initialCooperates, stats, searchParams]);

  // Update cooperates when initial data changes
  useEffect(() => {
    setCooperates(initialCooperates);
  }, [initialCooperates]);

  // Modal handlers
  const handleViewClick = (cooperate: Cooperate) => {
    setSelectedCooperate(cooperate);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (cooperate: Cooperate) => {
    setSelectedCooperate(cooperate);
    setIsEditModalOpen(true);
  };

  const handleFundClick = (cooperate: Cooperate) => {
    setSelectedCooperate(cooperate);
    setIsFundingModalOpen(true);
  };

  const handleDeleteClick = (cooperate: Cooperate) => {
    setSelectedCooperate(cooperate);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCooperate) {
      setCooperates(cooperates.filter(c => c.id !== selectedCooperate.id));
      setIsDeleteModalOpen(false);
      setSelectedCooperate(null);
    }
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsFundingModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCooperate(null);
  };

  // Filter cooperates based on current filters
  const filteredCooperates = cooperates.filter(cooperate => {
    const matchesSearch = 
      searchQuery === "" ||
      cooperate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cooperate.admin_fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cooperate.d_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cooperate.d_phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && cooperate.status === 1) ||
      (statusFilter === "inactive" && cooperate.status === 0);
    
    const matchesLocation = stateFilter === "all" || cooperate.state === stateFilter;
    const matchesRole = roleFilter === "all" || cooperate.dash_role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesLocation && matchesRole;
  });

  console.log("Filtered cooperates count:", filteredCooperates.length);

  // Chart data
  const statusData = [
    { name: 'Active', value: stats.activeCooperates, color: '#10B981' },
    { name: 'Inactive', value: stats.inactiveCooperates, color: '#EF4444' },
  ];

  const stateData = Object.entries(stats.byState || {}).map(([state, count]) => ({
    name: state,
    value: count
  })).slice(0, 10);

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

      {/* Modals */}
      <AddCooperateModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <ViewModal 
        cooperate={selectedCooperate}
        isOpen={isViewModalOpen}
        onClose={closeModals}
      />

      <EditModal 
        cooperate={selectedCooperate}
        isOpen={isEditModalOpen}
        onClose={closeModals}
      />

      <FundingModal 
        cooperate={selectedCooperate}
        isOpen={isFundingModalOpen}
        onClose={closeModals}
      />

      <DeleteModal 
        cooperate={selectedCooperate}
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteConfirm}
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''} lg:ml-64`}>
        <div className="p-4 md:p-6 pt-20 lg:pt-24">
          {/* Debug View */}
          <DataDebugView cooperates={initialCooperates} />

          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-50">
                  Cooperative Users
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor cooperative organizations and their dashboard admins
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Cooperates"
              value={stats.totalCooperates}
              icon={Building}
              color="primary"
            />
            <StatsCard
              title="Active"
              value={stats.activeCooperates}
              icon={CheckCircle}
              color="success"
            />
            <StatsCard
              title="Inactive"
              value={stats.inactiveCooperates}
              icon={XCircle}
              color="danger"
            />
            <StatsCard
              title="Recent Registrations"
              value={stats.recentRegistrations}
              icon={Calendar}
              color="info"
            />
          </div>

          {/* Action Bar */}
          <div className="mb-6 rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex flex-1 flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by cooperate name or admin details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-2 ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    title="Grid View"
                  >
                    <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
                      <div className="rounded-sm bg-gray-600 dark:bg-gray-400"></div>
                      <div className="rounded-sm bg-gray-600 dark:bg-gray-400"></div>
                      <div className="rounded-sm bg-gray-600 dark:bg-gray-400"></div>
                      <div className="rounded-sm bg-gray-600 dark:bg-gray-400"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-2 ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    title="List View"
                  >
                    <div className="h-4 w-4 space-y-1">
                      <div className="h-0.5 w-full bg-gray-600 dark:bg-gray-400"></div>
                      <div className="h-0.5 w-full bg-gray-600 dark:bg-gray-400"></div>
                      <div className="h-0.5 w-full bg-gray-600 dark:bg-gray-400"></div>
                    </div>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  {filters.states.length > 0 && (
                    <select
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="all">All States</option>
                      {filters.states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  )}

                  {filters.roles.length > 0 && (
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="all">All Roles</option>
                      {filters.roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => toast.success("Export feature coming soon")}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Cooperate
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredCooperates.length} of {cooperates.length} cooperates
              {searchQuery && ` for "${searchQuery}"`}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {statusFilter !== 'all' && `Status: ${statusFilter} • `}
              {stateFilter !== 'all' && `State: ${stateFilter} • `}
              {roleFilter !== 'all' && `Role: ${roleFilter}`}
            </div>
          </div>

          {/* Cooperates Content */}
          {viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCooperates.map((cooperate) => (
                <CooperateCard 
                  key={cooperate.id} 
                  cooperate={cooperate} 
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onFund={handleFundClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            // List View
            <div className="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-800">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Cooperate
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Admin Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredCooperates.map((cooperate) => (
                      <tr key={cooperate.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">{cooperate.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{cooperate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{cooperate.phone || "N/A"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">
                              {cooperate.state || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={cooperate.status} />
                        </td>
                        <td className="px-6 py-4">
                          <RoleBadge role={cooperate.dash_role} />
                          <div className="mt-1 text-xs text-gray-500">
                            {cooperate.d_firstname} {cooperate.d_surname}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">
                              {cooperate.registration_date ? new Date(cooperate.registration_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              }) : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewClick(cooperate)}
                              className="rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditClick(cooperate)}
                              className="rounded-lg bg-green-600 p-1.5 text-white hover:bg-green-700"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleFundClick(cooperate)}
                              className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                              title="Fund Cooperate"
                            >
                              <DollarSign className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Empty State */}
                {filteredCooperates.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No cooperates found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {searchQuery ? "Try adjusting your search or filters" : "No cooperate accounts available"}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Cooperate
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View Toggle Empty State for Grid View */}
          {viewMode === "grid" && filteredCooperates.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No cooperates found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery ? "Try adjusting your search or filters" : "No cooperate accounts available"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Cooperate
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredCooperates.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredCooperates.length} of {cooperates.length} cooperates
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                  Previous
                </button>
                <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                  1
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                  2
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}