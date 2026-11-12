import UserList from "@/components/admin/users";

export default function AdminUsersPage() {
  return (
    <>
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">Manage accounts, plans, credits and roles</p>
      <UserList />
    </>
  );
}
