import { PostingManager } from "@/components/admin/posting-manager";

export default function VacantesGeneralesAdminPage() {
  return (
    <PostingManager
      type="general_vacancy"
      title="Vacantes"
      subtitle="Gestiona las oportunidades laborales generales, independientes de Vacantes AECID."
    />
  );
}
