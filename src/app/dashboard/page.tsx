// src/app/dashboard/page.tsx (server component)
import { getCurrentUser } from "~/lib/auth1";
import DashboardPage from "./page.client";
import { 
  getNumberOfBuss,
  getFarmData,
  getSupplyData,
  getFarmersByState,
  getAllFarmersCount
} from "~/lib/queries/users";

// Helper function to normalize state names
function normalizeStateName(state: string): string {
  if (!state) return 'Unknown';
  
  // Convert to proper case (first letter capital, rest lowercase)
  return state
    .trim()
    .split(' ')
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
}

// Helper function to deduplicate and merge states
function deduplicateStates(states: Array<{ state: string; farmer_count: number; registration_date?: string }>) {
  const stateMap = new Map<string, { 
    state: string; 
    farmer_count: number; 
    registration_date?: string;
    originalStates: string[]; // Track original variations for debugging
  }>();

  states.forEach(item => {
    if (!item.state) return;
    
    const normalizedState = normalizeStateName(item.state);
    const count = Number(item.farmer_count) || 0;
    
    if (stateMap.has(normalizedState)) {
      // Merge counts for duplicate states
      const existing = stateMap.get(normalizedState)!;
      existing.farmer_count += count;
      existing.originalStates.push(item.state);
    } else {
      stateMap.set(normalizedState, {
        state: normalizedState,
        farmer_count: count,
        registration_date: item.registration_date,
        originalStates: [item.state]
      });
    }
  });

  // Log duplicates for debugging
  stateMap.forEach((value, key) => {
    if (value.originalStates.length > 1) {
      console.log(`State "${key}" had ${value.originalStates.length} duplicates:`, value.originalStates);
    }
  });

  // Convert back to array and sort by count
  return Array.from(stateMap.values())
    .map(({ state, farmer_count, registration_date }) => ({
      state,
      farmer_count,
      registration_date
    }))
    .sort((a, b) => b.farmer_count - a.farmer_count);
}

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user || !user.phone) {
    return null;
  }

  // Fetch all data in parallel
  const [
    numberfarmers,
    numberFarms,
    supplyData,
    farmersByStateData,
  ] = await Promise.all([
    getNumberOfBuss(),
    getFarmData(),
    getSupplyData(),
    getFarmersByState(),
  ]);

  // Deduplicate and normalize states
  const deduplicatedStates = farmersByStateData ? deduplicateStates(farmersByStateData) : [];

  console.log("Dashboard data loaded:", {
    totalFarmers: numberfarmers,
    totalFarms: numberFarms,
    totalSuppliers: supplyData,
    rawStatesCount: farmersByStateData?.length || 0,
    deduplicatedStatesCount: deduplicatedStates.length,
    statesWithFarmers: deduplicatedStates.length,
    farmersByStateSample: deduplicatedStates.slice(0, 3)
  });

  const userData = {
    id: user.id || "",
    phone: user.phone || "",
    name: user.name || "Admin",
    email: user.email || "",
    avatar: null,
  };

  return (
    <DashboardPage
      user={userData}
      farms={numberFarms || 0}
      farmers={numberfarmers || 0}
      supply={supplyData || 0}
      farmersByState={deduplicatedStates} // Pass deduplicated data
      totalFarmers={numberfarmers || 0}
    />
  );
}