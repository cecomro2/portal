import { PersonManager } from "@/components/admin/person-manager";

export default function JuntaAdminPage() {
  return (
    <PersonManager
      table="board_members"
      title="Junta Directiva"
      subtitle="Gestiona los miembros de la junta directiva."
    />
  );
}
