// src/app/dashboard/cooperates/page.tsx
import { getCurrentUser } from "~/lib/auth1";
import CooperativesPage from "./page.client";
import { 
  getCooperatesDashboard, 
  getCooperatesDashboardStats,
  getCooperatesDashboardFiltered
} from "~/lib/queries/cooperates-dashboard";

// Update the interface to extend the props properly
interface PageProps {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
    location?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }>;
}

export default async function CooperativesServerPage(props: PageProps) {
  // Await searchParams first
  const searchParams = await props.searchParams;
  
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please log in to view this page</p>
        </div>
      </div>
    );
  }

  console.log("=== SERVER PAGE DEBUG ===");
  console.log("Loading cooperates for admin ID:", user.id);
  console.log("Search params:", searchParams);

  let cooperatesData;
  
  // Use filtered query if search params are provided
  if (searchParams?.search || searchParams?.location || searchParams?.status) {
    const filters: any = {};
    
    if (searchParams.search) {
      filters.search = searchParams.search;
    }
    if (searchParams.location) {
      filters.location = searchParams.location;
    }
    if (searchParams.status) {
      filters.status = searchParams.status === 'active' ? 1 : searchParams.status === 'inactive' ? 0 : undefined;
    }
    if (searchParams.role) {
      filters.role = searchParams.role;
    }
    if (searchParams.startDate) {
      filters.startDate = new Date(searchParams.startDate);
    }
    if (searchParams.endDate) {
      filters.endDate = new Date(searchParams.endDate);
    }
    
    cooperatesData = await getCooperatesDashboardFiltered(filters);
  } else {
    cooperatesData = await getCooperatesDashboard();
  }

  console.log("=== RAW DATA FROM DATABASE ===");
  console.log("Total records from DB:", cooperatesData?.length || 0);
  
  if (cooperatesData && cooperatesData.length > 0) {
    console.log("First record from DB:", cooperatesData[0]);
  } else {
    console.log("⚠️ WARNING: No data returned from database!");
  }
  
  // Get statistics
  const statsData = await getCooperatesDashboardStats();
  
  console.log("=== STATISTICS DATA ===");
  console.log("Stats:", statsData);

  // Get unique locations for filter dropdowns
  const uniqueLocations = Array.from(
    new Set(
      cooperatesData
        ?.map(c => c.location)
        .filter((location): location is string => 
          location !== undefined && location !== null && location !== ''
        ) || []
    )
  ).map(loc => loc.trim()); // Trim spaces from locations

  // Calculate stats
  const activeCooperates = cooperatesData?.filter(c => c.status === 1).length || 0;
  const inactiveCooperates = cooperatesData?.filter(c => c.status === 0).length || 0;
  
  // Transform data to match client interface
  console.log("=== TRANSFORMING DATA ===");
  
  const transformedCooperates = (cooperatesData || []).map((cooperate, index) => {
    // Split admin_fullname into first and last names
    const adminFullname = cooperate.admin_fullname || "";
    const nameParts = adminFullname.trim().split(/\s+/);
    const d_firstname = nameParts[0] || "";
    const d_surname = nameParts.slice(1).join(" ") || "";
    
    // Check for dash_role in the cooperate object
    const dashRole = (cooperate as any).dash_role || "admin";
    
    const transformed = {
      id: cooperate.cooperate_id,
      dash_id: cooperate.dash_id,
      name: cooperate.cooperate_name || `Cooperate ${cooperate.cooperate_id}`,
      email: cooperate.admin_email || "",
      phone: cooperate.admin_phone || "",
      address: "",
      state: cooperate.location ? cooperate.location.trim() : "Unknown",
      lga: "",
      registration_date: cooperate.add_date || new Date(),
      status: cooperate.status || 0,
      created_at: cooperate.add_date || new Date(),
      updated_at: cooperate.add_date || new Date(),
      
      // Dashboard admin fields
      dadmin_id: cooperate.dash_id,
      admin_fullname: cooperate.admin_fullname || "",
      d_firstname: d_firstname,
      d_surname: d_surname,
      d_phone: cooperate.admin_phone || "",
      d_email: cooperate.admin_email || "",
      d_status: cooperate.status || 0,
      d_state: cooperate.location ? cooperate.location.trim() : "Unknown",
      d_lga: "",
      dash_role: dashRole,
      dash_company: (cooperate as any).dash_company || "", // This might be missing
      created_at_dash: cooperate.add_date || new Date(),
      updated_at_dash: cooperate.add_date || new Date()
    };
    
    if (index === 0) {
      console.log("Sample transformation:");
      console.log("From:", cooperate);
      console.log("To:", transformed);
    }
    
    return transformed;
  });

  console.log("=== TRANSFORMATION COMPLETE ===");
  console.log("Total transformed cooperates:", transformedCooperates.length);

  // Apply sorting if specified
  let sortedCooperates = [...transformedCooperates];
  if (searchParams?.sort) {
    sortedCooperates.sort((a, b) => {
      const aVal = a[searchParams.sort as keyof typeof a];
      const bVal = b[searchParams.sort as keyof typeof b];
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return searchParams.order === 'desc' 
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }
      
      if (aVal instanceof Date && bVal instanceof Date) {
        return searchParams.order === 'desc'
          ? bVal.getTime() - aVal.getTime()
          : aVal.getTime() - bVal.getTime();
      }
      
      return 0;
    });
  }

  // Create user data
  const userData = {
    id: user.id || "",
    phone: user.phone || "",
    email: user.email || "",
    dash_id: user.id,
    name: user.name || "Admin",
    avatar: null,
  };

  console.log("=== PASSING TO CLIENT ===");
  console.log("Total cooperates to client:", sortedCooperates.length);

  return (
    <CooperativesPage
      user={userData}
      initialCooperates={sortedCooperates}
      stats={{
        totalCooperates: transformedCooperates.length,
        activeCooperates,
        inactiveCooperates,
        totalArea: 0,
        recentRegistrations: statsData.recentRegistrations || 0,
        byState: statsData.byState || {},
        byStatus: {
          active: activeCooperates,
          inactive: inactiveCooperates
        },
        totalRevenue: 0,
        activeAlerts: 0
      }}
      filters={{
        states: uniqueLocations,
        roles: [], // No roles in base query
        statuses: [
          { value: 'active', label: 'Active', count: activeCooperates },
          { value: 'inactive', label: 'Inactive', count: inactiveCooperates }
        ],
        years: []
      }}
      searchParams={searchParams || {}}
    />
  );
}