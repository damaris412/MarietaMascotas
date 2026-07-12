import { getStoreSettings } from "@/server/services/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracionPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl italic text-english-900">Configuración</h1>
        <p className="text-sm text-ink/60">Ajustes generales de la tienda.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
