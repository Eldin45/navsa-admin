import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "./auth";
import { db } from "./db";

interface UserDbType {
  email: string;
  id: string;
  phone: null | string;
  dash_id: any; // Change to 'any' to be more flexible
  name?: string;
}

export const getCurrentUser = async (): Promise<null | UserDbType> => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    // Fetch user directly from database
    const userFromDb = await db.queryOne<{
      admin_id: number;
      admin_email: string;
      fullname: string;
      admin_phone: string | null;
      dash_id: any;
    }>(
      'SELECT admin_id, admin_email, fullname, admin_phone, dash_id FROM app_admin WHERE admin_email = ?',
      [session.user.email]
    );

    if (!userFromDb) {
      return null;
    }

    console.log("getCurrentUserFromDb - User from DB:", userFromDb);
    
    return {
      email: userFromDb.admin_email,
      id: userFromDb.admin_id.toString(),
      dash_id: userFromDb.dash_id,
      phone: userFromDb.admin_phone,
      name: userFromDb.fullname,
    };
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
  }
};

export const getCurrentUserOrRedirect = async (
  forbiddenUrl = "/auth/sign-in",
  okUrl = "",
  ignoreForbidden = false,
): Promise<null | UserDbType> => {
  const user = await getCurrentUser();

  // If no user is found
  if (!user) {
    // Redirect to forbidden url unless explicitly ignored
    if (!ignoreForbidden) {
      redirect(forbiddenUrl);
    }
    // If ignoring forbidden, return the null user immediately
    return user;
  }

  // If user is found and an okUrl is provided, redirect there
  if (okUrl) {
    redirect(okUrl);
  }

  // If user is found and no okUrl is provided, return the user
  return user;
};