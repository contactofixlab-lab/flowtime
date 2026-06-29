import { auth, signOut } from "@/lib/auth";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  backdropFilter: "blur(16px)",
  overflow: "hidden",
};

function Row({ label, sub, right }: { label: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div>
        <p style={{ color: "#E2E8F0", fontSize: 14, fontWeight: 500, margin: 0 }}>{label}</p>
        {sub && <p style={{ color: "#475569", fontSize: 12, margin: "2px 0 0" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: "#334155", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 8px 4px" }}>
      {children}
    </p>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user!;

  return (
    <div className="page-layout" style={{ padding: "24px 16px 0" }}>
      <style>{`
        .page-layout { max-width: 560px; margin: 0 auto; }
        @media (min-width: 1024px) { .page-layout { max-width: 640px; padding: 40px 48px !important; } }
      `}</style>

      <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
        Configuración
      </h1>

      {/* Perfil */}
      <SectionLabel>Perfil</SectionLabel>
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(79,70,229,0.4)" }} />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#fff",
            }}>{user.name?.[0] ?? "U"}</div>
          )}
          <div>
            <p style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 700, margin: 0 }}>{user.name ?? "Usuario"}</p>
            <p style={{ color: "#475569", fontSize: 13, margin: "2px 0 0" }}>{user.email}</p>
          </div>
        </div>
        <Row label="Zona horaria" sub="America/Santiago (UTC-4)" />
        <Row label="Idioma" sub="Español (Chile)" />
      </div>

      {/* Telegram */}
      <SectionLabel>Telegram</SectionLabel>
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#E2E8F0", fontSize: 14, fontWeight: 500, margin: 0 }}>Bot FlowTime</p>
            <p style={{ color: "#475569", fontSize: 12, margin: "2px 0 0" }}>Vincula tu cuenta para recordatorios</p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
            background: "rgba(79,70,229,0.12)", color: "#818CF8",
            border: "1px solid rgba(79,70,229,0.2)", whiteSpace: "nowrap",
          }}>Próximamente</span>
        </div>
      </div>

      {/* Notificaciones */}
      <SectionLabel>Notificaciones</SectionLabel>
      <div style={{ ...card, marginBottom: 20 }}>
        <Row
          label="Recordatorios"
          sub="Recibir avisos antes de vencer"
          right={
            <div style={{
              width: 42, height: 24, borderRadius: 12,
              background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.3)",
              display: "flex", alignItems: "center", padding: "2px",
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: "#334155" }} />
            </div>
          }
        />
        <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ color: "#E2E8F0", fontSize: 14, fontWeight: 500, margin: 0 }}>Anticipación</p>
          <span style={{ color: "#818CF8", fontSize: 13, fontWeight: 600 }}>30 min</span>
        </div>
      </div>

      {/* Cuenta */}
      <SectionLabel>Cuenta</SectionLabel>
      <div style={{ ...card, marginBottom: 24 }}>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
          <button
            type="submit"
            style={{
              width: "100%", textAlign: "left", padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
              background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
            }}
            >
            <span style={{ fontSize: 16 }}>🚪</span>
            <span style={{ color: "#F43F5E", fontSize: 14, fontWeight: 600 }}>Cerrar sesión</span>
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", color: "#1E293B", fontSize: 11 }}>FlowTime v0.1.0</p>
    </div>
  );
}
