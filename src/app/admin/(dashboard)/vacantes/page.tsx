import { PostingManager } from "@/components/admin/posting-manager";

export default function VacantesAdminPage() {
  return (
    <PostingManager
      type="vacancy"
      title="Vacantes AECID"
      subtitle="Gestiona las oportunidades laborales de los proyectos de cooperación."
    />
  );
}
