// src/app/dashboard/adopted-farmers/page.client.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { 
  Search, 
  Download, 
  Eye,
  Mail,
  Phone,
  MapPin,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Database,
  Package,
  User,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Building,
  Tractor,
  Calendar,
  X,
  DollarSign,
  FileText,
  Send,
  Home,
  Globe,
  Hash,
  Award,
  TrendingUp,
  Cpu,
  Coffee
} from "lucide-react";

// Import TanStack Table
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState
} from "@tanstack/react-table";

// Import components
import Navbar from "~/ui/components/header/header";
import Sidebar from "~/ui/components/sidebar/sidebar";

// Loading component - UPDATED: Only shows spinner in content area
const AdoptedFarmersLoading = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-transparent">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2e7d32] border-t-transparent"></div>
      <p className="mt-4 text-gray-700 dark:text-gray-400">
        Loading farmers data...
      </p>
    </div>
  </div>
);

// Farmer type definition matching database structure
interface Farmer {
  id: number;
  dash_id: number;
  f_surname: string;
  first_name: string;
  f_email: string;
  f_phone: string;
  gender: string;
  reg_date: Date | string;
  state: string;
  lga: string;
  farm_name: string;
  farm_size: number;
  f_loc: string;
  enterprise_name: string;
  state_batch: string;
  adopted: number;
}

// Props interface
interface AdoptedFarmersPageProps {
  user: {
    id: string;
    phone: string;
    email: string;
    dadmin_id: number;
    name: string;
    avatar: null;
    state?: string;
    lga?: string;
    role?: string;
    company?: string;
  };
  initialFarmers: Farmer[];
  stats: {
    totalFarmers: number;
    activeFarmers: number;
    pendingFarmers: number;
    totalFarms: number;
    notAdoptedFarmers: number;
  };
  filters: {
    states: string[];
    enterprises: string[];
    statuses: { value: string; label: string }[];
  };
  searchParams?: {
    page?: string;
    search?: string;
    status?: string;
    state?: string;
    batch?: string;
  };
}

// Stats card component
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon
}: { 
  title: string; 
  value: string | number; 
  icon: any;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="rounded-lg bg-[#2e7d32]/10 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#2e7d32]/20">
            <Icon className="h-5 w-5 text-[#2e7d32] transition-colors duration-200 group-hover:text-[#1b5e20]" />
          </div>
          <div>
            <p className="text-sm text-gray-700 transition-colors duration-200 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Gender badge component matching PHP UI
const GenderBadge = ({ gender }: { gender: string }) => {
  const config = {
    Male: {
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      icon: "👨",
      hover: "hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800/50"
    },
    Female: {
      className: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      icon: "👩",
      hover: "hover:bg-pink-200 hover:text-pink-900 dark:hover:bg-pink-800/50"
    }
  };

  const { className, icon, hover } = config[gender as keyof typeof config] || {
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    icon: "👤",
    hover: "hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ${className} ${hover}`}>
      {icon} {gender}
    </span>
  );
};

// Adopted status badge
const AdoptedBadge = ({ adopted }: { adopted: number }) => {
  if (adopted === 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 transition-all duration-200 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50">
        <CheckCircle className="h-3 w-3 transition-transform duration-300" />
        Adopted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
      <XCircle className="h-3 w-3 transition-transform duration-300" />
      Not Adopted
    </span>
  );
};

// Funding Modal Component (Matches PHP UI) - Keep the component for potential future use but not used in actions
const FundingModal = ({ 
  farmer, 
  isOpen, 
  onClose 
}: { 
  farmer: Farmer | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Updated to show ₦ symbol instead of $
      toast.success(`Successfully funded ₦${parseInt(amount).toLocaleString()} to ${farmer.f_surname} ${farmer.first_name}`);
      setAmount("");
      setNote("");
      onClose();
    } catch (error) {
      toast.error("Failed to process funding");
    } finally {
      setIsLoading(false);
    }
  };

  if (!farmer || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl transition-all duration-300 dark:bg-gray-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
            Fund Farmer
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5 transition-colors duration-200" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Farmer Avatar and Details */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 transition-all duration-300 hover:scale-105 dark:bg-blue-900/30 dark:text-blue-400">
              {(farmer.f_surname?.charAt(0) || farmer.first_name?.charAt(0) || 'F').toUpperCase()}
            </div>
            <h4 className="mb-1 text-lg font-bold text-gray-900 transition-colors duration-200 dark:text-white">
              {farmer.f_surname} {farmer.first_name}
            </h4>
            <div className="mb-4 space-y-1">
              <p className="flex items-center justify-center gap-2 text-sm text-gray-700 transition-colors duration-200 dark:text-gray-400">
                <Phone className="h-4 w-4 transition-transform duration-300" />
                {farmer.f_phone}
              </p>
              <p className="flex items-center justify-center gap-2 text-sm text-gray-700 transition-colors duration-200 dark:text-gray-400">
                <MapPin className="h-4 w-4 transition-transform duration-300" />
                {farmer.state}
              </p>
            </div>
          </div>

          {/* Funding Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="farmer_id" value={farmer.id} />
            
            {/* Amount Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Amount to Fund
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-700 transition-colors duration-200">₦</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 transition-all duration-200 focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this transaction"
                rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition-all duration-200 focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !amount}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-green-700 disabled:opacity-50 group"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span className="text-sm transition-transform duration-300 group-hover:scale-110">₦</span>
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

// View Modal Component (Matches PHP UI)
const ViewModal = ({ 
  farmer, 
  isOpen, 
  onClose 
}: { 
  farmer: Farmer | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!farmer || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl transition-all duration-300 dark:bg-gray-900">
        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
              Farmer Details
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5 transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Farmer Avatar */}
          <div className="relative">
            <div className="absolute left-1/2 -top-12 -translate-x-1/2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 dark:border-gray-900 dark:bg-blue-900/30 dark:text-blue-400">
                {(farmer.f_surname?.charAt(0) || farmer.first_name?.charAt(0) || 'F').toUpperCase()}
              </div>
            </div>
          </div>

          {/* Farmer Name and Badges */}
          <div className="mt-12 text-center">
            <h3 className="mb-2 text-2xl font-bold text-gray-900 transition-colors duration-200 dark:text-white">
              {farmer.f_surname} {farmer.first_name}
            </h3>
            <div className="mb-6 flex items-center justify-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition-all duration-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                {farmer.state_batch || "A"} Batch
              </span>
              <GenderBadge gender={farmer.gender} />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
                <User className="h-5 w-5 transition-transform duration-300" />
                Personal Information
              </h4>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Email:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{farmer.f_email}</span>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Phone:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{farmer.f_phone}</span>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Registration:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {farmer.reg_date ? new Date(farmer.reg_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "Not available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 transition-colors duration-200 dark:text-white">
                <Globe className="h-5 w-5 transition-transform duration-300" />
                Location Details
              </h4>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400">State:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{farmer.state || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded transition-colors duration-200">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-400">LGA:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{farmer.lga || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Navigate to edit page
                window.location.href = `/dashboard/edit-farmer?id=${farmer.id}`;
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 group"
            >
              <Edit className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdoptedFarmersPage({
  user,
  initialFarmers = [],
  stats,
  filters,
  searchParams = {}
}: AdoptedFarmersPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState(searchParams.search || "");

  // Handle view button click - removed handleFundClick
  const handleViewClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setShowViewModal(true);
  };

  // Define columns - removed Fund button
  const columns: ColumnDef<Farmer>[] = useMemo(() => [
    {
      accessorKey: "f_surname",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 transition-all duration-200 hover:text-gray-900 dark:hover:text-white group"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Farmer
            <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </button>
        )
      },
      cell: ({ row }) => {
        const farmer = row.original;
        return (
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 transition-all duration-300 hover:scale-110 dark:bg-blue-900/30 dark:text-blue-400 mr-3 group">
              {(farmer.f_surname?.charAt(0) || farmer.first_name?.charAt(0) || 'F').toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-gray-900 transition-colors duration-200 dark:text-white">
                {farmer.f_surname || ''} {farmer.first_name || ''}
              </div>
              <div className="text-xs text-gray-700 transition-colors duration-200 dark:text-gray-400">
                ID: F{farmer.id.toString().padStart(4, '0')}
              </div>
              <div className="mt-1">
                <AdoptedBadge adopted={farmer.adopted} />
              </div>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const farmer = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 group">
              <Mail className="h-3 w-3 text-gray-700 transition-colors duration-200 dark:text-gray-400 group-hover:text-[#2e7d32]" />
              <span className="text-sm truncate max-w-[180px] transition-colors duration-200" title={farmer.f_email}>
                {farmer.f_email || "No email"}
              </span>
            </div>
            <div className="flex items-center gap-2 group">
              <Phone className="h-3 w-3 text-gray-700 transition-colors duration-200 dark:text-gray-400 group-hover:text-[#2e7d32]" />
              <span className="text-sm transition-colors duration-200">{farmer.f_phone || "No phone"}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const farmer = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 group">
              <MapPin className="h-3 w-3 text-red-500 transition-colors duration-200" />
              <span className="font-medium transition-colors duration-200">{farmer.state || "No state"}</span>
            </div>
            <div className="text-xs text-gray-700 transition-colors duration-200 dark:text-gray-400 pl-5">
              {farmer.lga || "No LGA"}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-700 transition-colors duration-200 dark:text-gray-400 pl-5 group">
              <Calendar className="h-3 w-3 transition-colors duration-200 group-hover:text-[#2e7d32]" />
              {farmer.reg_date ? new Date(farmer.reg_date).toLocaleDateString() : "No date"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        return <GenderBadge gender={row.original.gender || "Unknown"} />;
      },
    },
    {
      accessorKey: "state_batch",
      header: "Batch",
      cell: ({ row }) => {
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 transition-all duration-200 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50">
            {row.original.state_batch || "A"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const farmer = row.original;
        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleViewClick(farmer)}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-amber-700 hover:shadow-md active:scale-95 group"
            >
              <Eye className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
              View
            </button>
          </div>
        );
      },
    },
  ], [router]);

  // Initialize table
  const table = useReactTable({
    data: farmers,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data refreshed successfully");
    }, 1000);
  };

  // Handle export
  const handleExport = async () => {
    try {
      toast.loading("Preparing export...");
      
      const headers = ['ID', 'Surname', 'First Name', 'Email', 'Phone', 'Gender', 'State', 'LGA', 'Farm Name', 'Farm Size', 'Location', 'Enterprise', 'State Batch', 'Registration Date', 'Adopted'];
      const csvData = farmers.map(farmer => [
        farmer.id,
        farmer.f_surname || '',
        farmer.first_name || '',
        farmer.f_email || '',
        farmer.f_phone || '',
        farmer.gender || '',
        farmer.state || '',
        farmer.lga || '',
        farmer.farm_name || '',
        farmer.farm_size || '',
        farmer.f_loc || '',
        farmer.enterprise_name || '',
        farmer.state_batch || '',
        farmer.reg_date ? new Date(farmer.reg_date).toLocaleDateString() : '',
        farmer.adopted === 1 ? 'Yes' : 'No'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `adopted-farmers-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success("Export completed!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to export data");
    }
  };

  if (!user || !user.dadmin_id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''} lg:ml-64`}>
          <div className="p-4 md:p-6 pt-20 lg:pt-24">
            <AdoptedFarmersLoading />
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Imported Components - Always visible */}
        <Navbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Main Content */}
        <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''} lg:ml-64`}>
          <div className="p-4 md:p-6 pt-20 lg:pt-24">
            {isLoading ? (
              <AdoptedFarmersLoading />
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl transition-colors duration-200 dark:text-gray-50">
                        Adopted Farmers
                      </h1>
                      <p className="text-gray-700 dark:text-gray-400 mt-1 transition-colors duration-200">
                        {stats?.totalFarmers || 0} farmers • Admin ID: {user.dadmin_id}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-3">
                      <div className="text-sm text-gray-700 transition-colors duration-200 dark:text-gray-400">
                        Admin: {user.name}
                      </div>
                      <button 
                        className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 group"
                        onClick={handleRefresh}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin transition-transform duration-300" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                        )}
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatsCard
                    title="Total Farmers"
                    value={stats?.totalFarmers || 0}
                    icon={Users}
                  />
                  <StatsCard
                    title="Adopted"
                    value={stats?.activeFarmers || 0}
                    icon={CheckCircle}
                  />
                  <StatsCard
                    title="Not Adopted"
                    value={stats?.notAdoptedFarmers || 0}
                    icon={XCircle}
                  />
                  <StatsCard
                    title="Total Farm Area"
                    value={`${farmers.reduce((sum, f) => sum + (f.farm_size || 0), 0).toLocaleString()} ha`}
                    icon={MapPin}
                  />
                </div>

                {/* DataTable Controls */}
                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex flex-1 items-center gap-4">
                      <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700 transition-colors duration-200 dark:text-gray-400 group-hover:text-[#2e7d32]" />
                        <input
                          type="text"
                          placeholder="Search farmers..."
                          value={globalFilter ?? ""}
                          onChange={(e) => setGlobalFilter(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 transition-all duration-200 focus:border-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      
                      {/* Page Size Selector */}
                      <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                          table.setPageSize(Number(e.target.value));
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-all duration-200 hover:border-gray-400 focus:border-[#2e7d32] focus:ring-2 focus:ring-[#2e7d32]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleExport}
                        disabled={isLoading || farmers.length === 0}
                        className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gray-50 hover:shadow-md disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 group"
                      >
                        <Download className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        Export CSV
                      </button>
                    </div>
                  </div>
                </div>

                {/* DataTable - Removed green header background */}
                <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          {table.getHeaderGroups().map((headerGroup) => (
                            headerGroup.headers.map((header) => (
                              <th 
                                key={header.id}
                                className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                                style={{ width: header.getSize() }}
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </th>
                            ))
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <tr 
                              key={row.id} 
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 group/row"
                            >
                              {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4 transition-colors duration-200 group-hover/row:bg-gray-50 dark:group-hover/row:bg-gray-800/30">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center">
                              <div className="mx-auto max-w-md">
                                <User className="mx-auto h-12 w-12 text-gray-700 transition-colors duration-200 dark:text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-white">
                                  No farmers found
                                </h3>
                                <p className="mt-2 text-sm text-gray-700 transition-colors duration-200 dark:text-gray-400">
                                  {globalFilter
                                    ? `No results found for "${globalFilter}"`
                                    : "There are no farmers available in your adopted list"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                    <div className="text-sm text-gray-700 transition-colors duration-200 dark:text-gray-400">
                      Showing{" "}
                      <span className="font-medium">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                          table.getFilteredRowModel().rows.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{" "}
                      farmers
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-lg border border-gray-300 bg-white p-2 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 group"
                      >
                        <ChevronsLeft className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </button>
                      <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-lg border border-gray-300 bg-white p-2 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 group"
                      >
                        <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </button>
                      <span className="px-3 text-sm text-gray-700 transition-colors duration-200 dark:text-gray-400">
                        Page{" "}
                        <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span>{" "}
                        of{" "}
                        <span className="font-medium">{table.getPageCount()}</span>
                      </span>
                      <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-lg border border-gray-300 bg-white p-2 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 group"
                      >
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </button>
                      <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="rounded-lg border border-gray-300 bg-white p-2 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 group"
                      >
                        <ChevronsRight className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Funding Modal - Keep but not used in actions */}
      <FundingModal 
        farmer={selectedFarmer}
        isOpen={showFundingModal}
        onClose={() => {
          setShowFundingModal(false);
          setSelectedFarmer(null);
        }}
      />

      {/* View Modal */}
      <ViewModal 
        farmer={selectedFarmer}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedFarmer(null);
        }}
      />
    </>
  );
}