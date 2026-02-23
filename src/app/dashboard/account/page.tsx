import { getCurrentUser } from "~/lib/auth1";

import CustomersPage from "./page.client";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <CustomersPage user={user} />;
}
