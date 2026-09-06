import { PersonManager } from "@/components/admin/person-manager";

export default function EquipoAdminPage() {
  return (
    <PersonManager
      table="executive_team"
      title="Equipo Ejecutivo"
      subtitle="Gestiona los miembros del equipo ejecutivo."
    />
  );
}
