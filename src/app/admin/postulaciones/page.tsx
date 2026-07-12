import Link from "next/link";
import { FileText } from "lucide-react";
import { getJobApplications } from "@/server/services/applications";
import { areaLabel } from "@/server/email/templates";

export const dynamic = "force-dynamic";

export default async function AdminPostulacionesPage() {
  const applications = await getJobApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl italic text-english-900">Postulaciones</h1>
        <p className="text-sm text-ink/60">
          Personas y empresas que se postularon desde &quot;Trabajá con nosotros&quot;.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-sage-200/70 bg-white/80">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-sage-200 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Contacto</th>
              <th className="px-5 py-3">Área</th>
              <th className="px-5 py-3">Mensaje</th>
              <th className="px-5 py-3">CV</th>
              <th className="px-5 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-sage-100 last:border-0 hover:bg-sage-50/50">
                <td className="px-5 py-3 font-medium text-ink">{app.name}</td>
                <td className="px-5 py-3 text-ink/70">
                  <p>{app.email}</p>
                  <p className="text-xs text-ink/50">{app.phone}</p>
                </td>
                <td className="px-5 py-3 text-ink/70">{areaLabel(app.area)}</td>
                <td className="max-w-[280px] px-5 py-3 text-ink/70">{app.message}</td>
                <td className="px-5 py-3">
                  {app.resumeUrl ? (
                    <Link
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-english-700 hover:text-english-800"
                    >
                      <FileText className="h-3.5 w-3.5" /> Ver
                    </Link>
                  ) : (
                    <span className="text-xs text-ink/40">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-ink/60">
                  {new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(
                    app.createdAt
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink/50">
            Aún no hay postulaciones registradas.
          </p>
        )}
      </div>
    </div>
  );
}
