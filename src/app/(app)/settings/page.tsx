import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

function Row({ label, sub, right }: { label: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05] last:border-0">
      <div>
        <p className="text-sm font-medium" style={{ color: "#E2E8F0" }}>
          {label}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user!;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8">
      <h1 className="text-2xl font-black mb-6" style={{ color: "#E2E8F0" }}>
        Configuración
      </h1>

      {/* Profile */}
      <div className="glass-card overflow-hidden mb-4">
        <div className="px-4 py-4 flex items-center gap-4 border-b border-white/[0.05]">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" className="w-12 h-12 rounded-full" />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
              style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
            >
              {user.name?.[0] ?? "U"}
            </div>
          )}
          <div>
            <p className="font-semibold" style={{ color: "#E2E8F0" }}>
              {user.name ?? "Usuario"}
            </p>
            <p className="text-sm" style={{ color: "#64748B" }}>
              {user.email}
            </p>
          </div>
        </div>
        <Row label="Zona horaria" sub="America/Santiago" />
        <Row label="Idioma" sub="Español (Chile)" />
      </div>

      {/* Telegram */}
      <p className="text-xs font-bold mb-2 px-1 tracking-wider" style={{ color: "#475569" }}>
        TELEGRAM
      </p>
      <div className="glass-card overflow-hidden mb-4">
        <Row
          label="Bot FlowTime"
          sub="Vincula tu cuenta para recibir recordatorios"
          right={
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(100,116,139,0.15)", color: "#64748B" }}>
              Próximamente
            </span>
          }
        />
      </div>

      {/* Notificaciones */}
      <p className="text-xs font-bold mb-2 px-1 tracking-wider" style={{ color: "#475569" }}>
        NOTIFICACIONES
      </p>
      <div className="glass-card overflow-hidden mb-4">
        <Row label="Recordatorios" sub="Recibir avisos antes de vencer" />
        <Row label="Anticipación" sub="30 minutos antes" />
      </div>

      {/* Cuenta */}
      <p className="text-xs font-bold mb-2 px-1 tracking-wider" style={{ color: "#475569" }}>
        CUENTA
      </p>
      <div className="glass-card overflow-hidden mb-4">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="w-full text-left px-4 py-3.5 flex items-center gap-3 transition hover:bg-white/5"
          >
            <LogOut size={16} style={{ color: "#F43F5E" }} />
            <span className="text-sm font-medium" style={{ color: "#F43F5E" }}>
              Cerrar sesión
            </span>
          </button>
        </form>
      </div>

      <p className="text-center text-xs pb-4" style={{ color: "#1E293B" }}>
        FlowTime v0.1.0
      </p>
    </div>
  );
}
