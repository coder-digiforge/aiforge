import PlanEditor from "@/components/admin/plans";

export default function AdminPlansPage() {
  return (
    <>
      <h1 className="page-title">Plans</h1>
      <p className="page-subtitle">Edit plan names, prices and credits</p>
      <PlanEditor />
    </>
  );
}