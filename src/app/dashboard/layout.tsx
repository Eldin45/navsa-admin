//import { getCurrentUserOrRedirect } from "~/lib/auth";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "~/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // biome-ignore lint/style/useTemplate: <explanation>
    redirect("/login?callbackUrl=" + encodeURIComponent("/dashboard"));
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header showAuth={true} /> */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
