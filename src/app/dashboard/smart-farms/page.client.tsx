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
  Sprout,
  Tractor,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Egg,
  Wheat
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

// Cooperate type definition with smart farms data
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
  
  // Smart Farms related fields
  total_farms?: number;
  poultry_farms?: number;
  crop_farms?: number;
}

interface CooperateStats {
  totalCooperates: number;
  activeCooperates: number;
  inactiveCooperates: number;
  recentRegistrations: number;
  byState: Record<string, number>;
  byStatus: Record<string, number>;
  activeAlerts: number;
  
  // Smart Farms stats
  totalFarms: number;
  totalPoultryFarms: number;
  totalCropFarms: number;
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

// Farm Status badge component - Simplified to show only farm type
const FarmTypeBadge = ({ type = "both" }: { type?: "poultry" | "crop" | "both" }) => {
  if (type === "poultry") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        <Egg className="h-3 w-3" />
        Brooding Farm
      </span>
    );
  } else if (type === "crop") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <Wheat className="h-3 w-3" />
        Crop Farm
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
      <Sprout className="h-3 w-3" />
      2 Smart Farms
    </span>
  );
};

// Stats card component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon,
  color = "primary",
  subtitle = ""
}: { 
  title: string; 
  value: string | number; 
  icon: any;
  color?: "primary" | "success" | "warning" | "info" | "danger" | "amber";
  subtitle?: string;
}) => {
  const colorClasses = {
    primary: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    success: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    info: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20",
    danger: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
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
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Smart Farms Metrics Component - Simplified to show only farm types
const SmartFarmMetrics = ({ cooperate }: { cooperate: Cooperate }) => {
  return (
    <div className="mb-4 space-y-3">
      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Smart Farm Types</div>
      <div className="grid grid-cols-2 gap-2">
        {/* Poultry Farm */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/30 dark:bg-amber-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Egg className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Brooding</span>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              1 Farm
            </span>
          </div>
        </div>

        {/* Crop Farm */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800/30 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wheat className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Crop</span>
            </div>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
              1 Farm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cooperate card component
const CooperateCard = ({ cooperate }: { cooperate: Cooperate }) => {
  const router = useRouter();
  
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
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={cooperate.status} />
            <RoleBadge role={cooperate.dash_role} />
            <FarmTypeBadge type="both" />
          </div>
        </div>
        <div className="relative group">
          <button className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreVertical className="h-4 w-4" />
          </button>
          <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-lg border border-gray-200 bg-white shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-800 z-10">
            <button 
              onClick={() => router.push(`/dashboard/cooperatives/${cooperate.id}`)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button 
              onClick={() => router.push(`/dashboard/smart-farms?cooperate=${cooperate.id}`)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sprout className="h-4 w-4" />
              View All Farms
            </button>
            <button 
              onClick={() => router.push(`/dashboard/smart-farms?cooperate=${cooperate.id}&type=poultry`)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Egg className="h-4 w-4" />
              View Brooding Farm
            </button>
            <button 
              onClick={() => router.push(`/dashboard/smart-farms?cooperate=${cooperate.id}&type=crop`)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Wheat className="h-4 w-4" />
              View Crop Farm
            </button>
            <button 
              onClick={() => router.push(`/dashboard/cooperatives/${cooperate.id}/edit`)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4" />
              Edit Cooperate
            </button>
            <div className="border-t dark:border-gray-700 my-1"></div>
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30">
              <Trash2 className="h-4 w-4" />
              Delete Cooperate
            </button>
          </div>
        </div>
      </div>

      {/* Smart Farms Metrics */}
      <SmartFarmMetrics cooperate={cooperate} />

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

      {/* Action Buttons */}
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
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/smart-farms?cooperate=${cooperate.id}`)}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            title="View Smart Farms"
          >
            <Sprout className="h-3 w-3" />
            2 Farms
          </button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
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
};

// Add Cooperate Modal Component - Simplified to remove farm details
const AddCooperateModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    // Cooperate Information
    cooperate_name: "",
    cooperate_email: "",
    cooperate_phone: "",
    cooperate_address: "",
    cooperate_state: "",
    cooperate_lga: "",
    registration_date: new Date().toISOString().split('T')[0],
    cooperate_status: "1",
    
    // Dashboard Admin Information
    admin_fullname: "",
    admin_email: "",
    admin_phone: "",
    admin_role: "admin",
    admin_location: "",
    admin_company: "",
    admin_password: "",
    confirm_password: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.admin_password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate required fields
    if (!formData.cooperate_name || !formData.admin_fullname || !formData.admin_email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Cooperate account created successfully! Each cooperate gets 1 brooding farm and 1 crop farm.");
      onClose();
      
      // Reset form
      setFormData({
        cooperate_name: "",
        cooperate_email: "",
        cooperate_phone: "",
        cooperate_address: "",
        cooperate_state: "",
        cooperate_lga: "",
        registration_date: new Date().toISOString().split('T')[0],
        cooperate_status: "1",
        admin_fullname: "",
        admin_email: "",
        admin_phone: "",
        admin_role: "admin",
        admin_location: "",
        admin_company: "",
        admin_password: "",
        confirm_password: ""
      });
      
      // Refresh the page to show new cooperate
      window.location.reload();
      
    } catch (error) {
      console.error("Error creating cooperate:", error);
      toast.error("Failed to create cooperate account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        <div className="relative w-full max-w-4xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Cooperate Account
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add a new cooperative organization with standard smart farms (1 brooding + 1 crop)
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Cooperate Information Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Cooperate Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cooperate Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cooperate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cooperate_name"
                      required
                      value={formData.cooperate_name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter cooperate name"
                    />
                  </div>

                  {/* Cooperate Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cooperate Email
                    </label>
                    <input
                      type="email"
                      name="cooperate_email"
                      value={formData.cooperate_email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Cooperate Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cooperate Phone
                    </label>
                    <input
                      type="tel"
                      name="cooperate_phone"
                      value={formData.cooperate_phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Registration Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Registration Date
                    </label>
                    <input
                      type="date"
                      name="registration_date"
                      value={formData.registration_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      State
                    </label>
                    <select
                      name="cooperate_state"
                      value={formData.cooperate_state}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select State</option>
                      <option value="Abia">Abia</option>
                      <option value="Adamawa">Adamawa</option>
                      <option value="Akwa Ibom">Akwa Ibom</option>
                      <option value="Anambra">Anambra</option>
                      <option value="Bauchi">Bauchi</option>
                      <option value="Bayelsa">Bayelsa</option>
                      <option value="Benue">Benue</option>
                      <option value="Borno">Borno</option>
                      <option value="Cross River">Cross River</option>
                      <option value="Delta">Delta</option>
                      <option value="Ebonyi">Ebonyi</option>
                      <option value="Edo">Edo</option>
                      <option value="Ekiti">Ekiti</option>
                      <option value="Enugu">Enugu</option>
                      <option value="FCT">FCT</option>
                      <option value="Gombe">Gombe</option>
                      <option value="Imo">Imo</option>
                      <option value="Jigawa">Jigawa</option>
                      <option value="Kaduna">Kaduna</option>
                      <option value="Kano">Kano</option>
                      <option value="Katsina">Katsina</option>
                      <option value="Kebbi">Kebbi</option>
                      <option value="Kogi">Kogi</option>
                      <option value="Kwara">Kwara</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Nasarawa">Nasarawa</option>
                      <option value="Niger">Niger</option>
                      <option value="Ogun">Ogun</option>
                      <option value="Ondo">Ondo</option>
                      <option value="Osun">Osun</option>
                      <option value="Oyo">Oyo</option>
                      <option value="Plateau">Plateau</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Sokoto">Sokoto</option>
                      <option value="Taraba">Taraba</option>
                      <option value="Yobe">Yobe</option>
                      <option value="Zamfara">Zamfara</option>
                    </select>
                  </div>

                  {/* LGA */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Local Government Area
                    </label>
                    <input
                      type="text"
                      name="cooperate_lga"
                      value={formData.cooperate_lga}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter LGA"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <textarea
                      name="cooperate_address"
                      value={formData.cooperate_address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter full address"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      name="cooperate_status"
                      value={formData.cooperate_status}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Smart Farms Information Section - Simplified */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Egg className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-600 dark:text-amber-400">+</span>
                      <Wheat className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    Smart Farms Configuration
                  </h3>
                  <div className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Standard: 1 Brooding + 1 Crop Farm
                  </div>
                </div>
                
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brooding Farm Card - Simplified */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/30 dark:bg-amber-900/20">
                    <div className="flex items-center gap-2">
                      <Egg className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Brooding (Poultry) Farm</h4>
                      <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        1 Farm
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Standard poultry brooding farm
                    </p>
                  </div>

                  {/* Crop Farm Card - Simplified */}
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800/30 dark:bg-green-900/20">
                    <div className="flex items-center gap-2">
                      <Wheat className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Crop Farm</h4>
                      <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        1 Farm
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Standard crop cultivation farm
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Information Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Dashboard Admin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Admin Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Admin Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="admin_fullname"
                      required
                      value={formData.admin_fullname}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter admin full name"
                    />
                  </div>

                  {/* Admin Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Admin Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="admin_email"
                      required
                      value={formData.admin_email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter admin email"
                    />
                  </div>

                  {/* Admin Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Admin Phone
                    </label>
                    <input
                      type="tel"
                      name="admin_phone"
                      value={formData.admin_phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter admin phone"
                    />
                  </div>

                  {/* Admin Role */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Admin Role
                    </label>
                    <select
                      name="admin_role"
                      value={formData.admin_role}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="agent">Agent</option>
                    </select>
                  </div>

                  {/* Admin Location */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </label>
                    <input
                      type="text"
                      name="admin_location"
                      value={formData.admin_location}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter location"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company
                    </label>
                    <input
                      type="text"
                      name="admin_company"
                      value={formData.admin_company}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="admin_password"
                      required
                      value={formData.admin_password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      required
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Cooperate with 2 Farms
                  </>
                )}
              </button>
            </div>
          </form>
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
  const [cooperates, setCooperates] = useState<Cooperate[]>(initialCooperates);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.status || "all");
  const [stateFilter, setStateFilter] = useState<string>(searchParams.state || "all");
  const [roleFilter, setRoleFilter] = useState<string>(searchParams.role || "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Add default smart farms data to each cooperate
  useEffect(() => {
    const cooperatesWithFarms = initialCooperates.map(cooperate => ({
      ...cooperate,
      total_farms: 2, // Each cooperate has exactly 2 farms
      poultry_farms: 1, // 1 brooding farm
      crop_farms: 1, // 1 crop farm
    }));
    setCooperates(cooperatesWithFarms);
  }, [initialCooperates]);

  // Log received data
  useEffect(() => {
    console.log("=== CLIENT PAGE DEBUG ===");
    console.log("Initial cooperates received:", initialCooperates.length);
    console.log("First cooperate:", initialCooperates[0]);
    console.log("Stats received:", stats);
    console.log("Search params:", searchParams);
  }, [initialCooperates, stats, searchParams]);

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

  // Calculate stats for smart farms
  const totalFarms = cooperates.length * 2; // Each cooperate has 2 farms
  const totalPoultryFarms = cooperates.length; // 1 poultry farm per cooperate
  const totalCropFarms = cooperates.length; // 1 crop farm per cooperate

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

      {/* Add Cooperate Modal */}
      <AddCooperateModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
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
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-50 flex items-center gap-2">
                  <Building className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  Smart Farms
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Cooperative organizations with standard smart farms (1 brooding + 1 crop each)
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <button
                  onClick={() => router.push("/dashboard/smart-farms")}
                  className="flex items-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                >
                  <Sprout className="mr-2 h-4 w-4" />
                  View All Farms ({totalFarms})
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid - Simplified to remove area/capacity details */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Cooperates"
              value={stats.totalCooperates}
              icon={Building}
              color="primary"
              subtitle={`${totalFarms} total farms`}
            />
            <StatsCard
              title="Brooding Farms"
              value={totalPoultryFarms}
              icon={Egg}
              color="amber"
              subtitle="Poultry farms"
            />
            <StatsCard
              title="Crop Farms"
              value={totalCropFarms}
              icon={Wheat}
              color="success"
              subtitle="Cultivation farms"
            />
            <StatsCard
              title="Total Farms"
              value={totalFarms}
              icon={Sprout}
              color="info"
              subtitle="All farm types"
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
                    placeholder="Search by cooperate name, admin, or farm location..."
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
                <CooperateCard key={cooperate.id} cooperate={cooperate} />
              ))}
            </div>
          ) : (
            // List View - Simplified farm display
            <div className="rounded-xl border bg-white dark:border-gray-700 dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-800">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Cooperate
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Farm Types
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
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Egg className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              <div>
                                <div className="text-sm font-medium">Brooding Farm</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wheat className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <div>
                                <div className="text-sm font-medium">Crop Farm</div>
                              </div>
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
                          <div className="space-y-1">
                            <StatusBadge status={cooperate.status} />
                            <FarmTypeBadge type="both" />
                          </div>
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
                              onClick={() => router.push(`/dashboard/smart-farms?cooperate=${cooperate.id}`)}
                              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                              title="View All Farms"
                            >
                              <Sprout className="h-3 w-3" />
                              Farms
                            </button>
                            <button
                              onClick={() => router.push(`/dashboard/cooperatives/${cooperate.id}`)}
                              className="rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/dashboard/cooperatives/${cooperate.id}/edit`)}
                              className="rounded-lg bg-green-600 p-1.5 text-white hover:bg-green-700"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
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
                <span className="ml-2 text-gray-400">
                  ({totalFarms} farms total)
                </span>
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