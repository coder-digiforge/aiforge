import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import DashboardAdminPage from "@/components/admin/page";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <DashboardAdminPage />;
}
