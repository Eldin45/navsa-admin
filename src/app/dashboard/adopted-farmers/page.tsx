// src/app/dashboard/adopted-farmers/page.tsx (SERVER COMPONENT)
import { getCurrentUser } from "~/lib/auth1";
import AdoptedFarmersPage from "./page.client";
import { getAdoptedFarmers,  getAdoptedFarmersStats } from "~/lib/queries/adopted-farmers";

interface PageProps {
  searchParams?: {
    page?: string;
    search?: string;
    status?: string;
    state?: string;
    batch?: string;
  }
}

export default async function AdoptedFarmersServerPage({ searchParams = {} }: PageProps) {
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

  console.log("Loading adopted farmers for admin ID:", user.id);

  // Use filtered query if search params are provided
  let adoptedFarmersData;
  
  if (searchParams.search || searchParams.state || searchParams.status) {
    adoptedFarmersData = await getAdoptedFarmersWithFilters(
      user.id,
      {
        search: searchParams.search,
        state: searchParams.state,
        status: searchParams.status,
        batch: searchParams.batch || "A"
      }
    );
  } else {
    adoptedFarmersData = await getAdoptedFarmers(user.id);
  }

  // Get statistics
  const statsData = await getAdoptedFarmersStats(user.id);
  
  console.log("DEBUG - Farmers data structure:", {
    totalCount: adoptedFarmersData.length,
    firstFarmerKeys: adoptedFarmersData.length > 0 ? Object.keys(adoptedFarmersData[0]) : [],
    firstFarmerSample: adoptedFarmersData.length > 0 ? {
      id: adoptedFarmersData[0].farmer_id,
      name: `${adoptedFarmersData[0].f_surname} ${adoptedFarmersData[0].first_name}`,
      state: adoptedFarmersData[0].state,
      adopted: adoptedFarmersData[0].adopted,
      state_batch: adoptedFarmersData[0].state_batch
    } : null
  });

  // Get unique states and enterprises for filter dropdowns
  const uniqueStates = Array.from(new Set(adoptedFarmersData.map(f => f.state))).filter(Boolean);
  const uniqueEnterprises = Array.from(new Set(adoptedFarmersData.map(f => f.enterprise_name))).filter(Boolean);

  // Create a complete user object for the client
  const userData = {
    id: user.id || "",
    phone: user.phone || "",
    email: user.email || "",
    dadmin_id: user.id,
    name: user.name || "Admin",
    avatar: null,
  };

  // Calculate active farmers (adopted = 1)
  const activeFarmers = adoptedFarmersData.filter(f => f.adopted === 1).length;
  const notAdoptedFarmers = adoptedFarmersData.filter(f => f.adopted === 0).length;

  // Transform data to match client interface
  const transformedFarmers = adoptedFarmersData.map(farmer => ({
    id: farmer.farmer_id,
    dash_id: farmer.dash_id,
    f_surname: farmer.f_surname || "",
    first_name: farmer.first_name || "",
    f_email: farmer.f_email || "",
    f_phone: farmer.f_phone || "",
    gender: farmer.gender || "",
    reg_date: farmer.reg_date || new Date(),
    state: farmer.state || "",
    lga: farmer.lga || "",
    farm_name: farmer.farm_name || "",
    farm_size: farmer.farm_size || 0,
    f_loc: farmer.f_loc || "",
    enterprise_name: farmer.enterprise_name || "",
    state_batch: farmer.state_batch || "A",
    adopted: farmer.adopted || 0
  }));

  console.log("DEBUG - After transformation:", {
    transformedCount: transformedFarmers.length,
    firstTransformed: transformedFarmers[0]
  });

  return (
    <AdoptedFarmersPage
      user={userData}
      initialFarmers={transformedFarmers}
      stats={{
        totalFarmers: adoptedFarmersData.length,
        activeFarmers: activeFarmers,
        pendingFarmers: 0,
        totalFarms: adoptedFarmersData.length,
        notAdoptedFarmers: notAdoptedFarmers,
        byState: statsData.byState || {},
        byEnterprise: statsData.byEnterprise || {}
      }}
      filters={{
        states: uniqueStates,
        enterprises: uniqueEnterprises,
        statuses: [
          { value: 'adopted', label: 'Adopted' },
          { value: 'not_adopted', label: 'Not Adopted' }
        ]
      }}
      searchParams={searchParams}
    />
  );
}