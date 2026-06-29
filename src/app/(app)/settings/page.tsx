import { auth, signOut } from "@/lib/auth";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 18,
  backdropFilter: "blur(16px)",
  overflow: "hidden",
};

function MobileRow({ label, sub, right }: { label: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <p style={{ color: "#E2E8F0", fontSize: 14, fontWeight: 500, margin: 0 }}>{label}</p>
        {sub && <p style={{ color: "#475569", fontSize: 12, margin: "2px 0 0" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

const NAV_ITEMS = [
  { icon: "👤", label: "Perfil", active: true },
  { icon: "✈", label: "Telegram" },
  { icon: "🔔", label: "Notificaciones" },
  { icon: "🏷", label: "Etiquetas" },
  { icon: "🎨", label: "Apariencia" },
];

export default async function SettingsPage() {
  const session = await auth();
  const user = session!.user!;
  const firstName = user.name?.split(" ")[0] ?? "U";

  return (
    <>
      {/* Mobile */}
      <div className="settings-mobile" style={{ padding: "24px 16px 0" }}>
        <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Configuración</h1>
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(79,70,229,0.4)" }} />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>{firstName[0]}</div>
            )}
            <div>
              <p style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 700, margin: 0 }}>{user.name ?? "Usuario"}</p>
              <p style={{ color: "#475569", fontSize: 12, margin: "2px 0 0" }}>{user.email}</p>
            </div>
          </div>
          <MobileRow label="Zona horaria" sub="America/Santiago (UTC-4)" />
          <MobileRow label="Idioma" sub="Español (Chile)" />
        </div>
        <div style={{ ...card, marginBottom: 20 }}>
          <MobileRow label="Bot Telegram" sub="Vincula tu cuenta" right={<span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(79,70,229,0.12)", color: "#818CF8", border: "1px solid rgba(79,70,229,0.2)" }}>Próximamente</span>} />
        </div>
        <div style={{ ...card, marginBottom: 20 }}>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <button type="submit" style={{ width: "100%", textAlign: "left", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              <span>→</span>
              <span style={{ color: "#F43F5E", fontSize: 14, fontWeight: 600 }}>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </div>

      {/* Desktop — dos columnas */}
      <div className="settings-desktop" style={{ padding: "32px 48px 0" }}>
        <h1 style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, margin: "0 0 24px", letterSpacing: "-0.03em" }}>Configuración</h1>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
          {/* Left nav */}
          <div style={{ ...card, height: "fit-content", padding: "8px" }}>
            {NAV_ITEMS.map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 12, marginBottom: 2, cursor: "pointer",
                background: item.active ? "rgba(79,70,229,0.22)" : "transparent",
                border: item.active ? "1px solid rgba(79,70,229,0.4)" : "1px solid transparent",
              }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ color: item.active ? "#818CF8" : "#475569", fontSize: 13, fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: "pointer" }}>
              <span style={{ fontSize: 13 }}>🔑</span>
              <span style={{ color: "#475569", fontSize: 13 }}>Cambiar contraseña</span>
            </div>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                <span style={{ fontSize: 15 }}>→</span>
                <span style={{ color: "#FB7185", fontSize: 13 }}>Cerrar sesión</span>
              </button>
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: "pointer" }}>
              <span style={{ fontSize: 13 }}>🗑</span>
              <span style={{ color: "#F43F5E", fontSize: 13 }}>Eliminar cuenta</span>
            </div>
          </div>

          {/* Right content panel */}
          <div style={{ ...card }}>
            <div style={{ padding: "20px 28px 0" }}>
              <h2 style={{ color: "#E2E8F0", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Perfil de Usuario</h2>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />

            <div style={{ padding: "0 28px 24px", display: "flex", gap: 40 }}>
              {/* Avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" style={{ width: 96, height: 96, borderRadius: "50%", border: "2px solid #4F46E5" }} />
                ) : (
                  <div style={{ width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, color: "#fff", border: "2px solid #4F46E5" }}>{firstName[0]}</div>
                )}
                <div style={{ padding: "5px 14px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, color: "#64748B", cursor: "pointer" }}>Cambiar foto</div>
              </div>

              {/* Fields */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", margin: "0 0 6px" }}>NOMBRE</p>
                  <div style={{ height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(79,70,229,0.4)", display: "flex", alignItems: "center", padding: "0 16px" }}>
                    <span style={{ color: "#E2E8F0", fontSize: 14 }}>{user.name ?? "Usuario"}</span>
                  </div>
                </div>
                <div>
                  <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", margin: "0 0 6px" }}>EMAIL</p>
                  <div style={{ height: 40, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                    <span style={{ color: "#64748B", fontSize: 14 }}>{user.email}</span>
                    <span style={{ color: "#475569", fontSize: 10 }}>Solo lectura</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", margin: "0 0 6px" }}>ZONA HORARIA</p>
                    <div style={{ height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                      <span style={{ color: "#E2E8F0", fontSize: 13 }}>🌎 America/Santiago (UTC-4)</span>
                      <span style={{ color: "#818CF8", fontSize: 12 }}>▼</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", margin: "0 0 6px" }}>IDIOMA</p>
                    <div style={{ height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                      <span style={{ color: "#E2E8F0", fontSize: 13 }}>🇨🇱 Español (Chile)</span>
                      <span style={{ color: "#818CF8", fontSize: 12 }}>▼</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ padding: "16px 28px", display: "flex", justifyContent: "space-between" }}>
              <div style={{ padding: "0 24px", height: 38, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13, color: "#64748B", cursor: "pointer" }}>Cancelar</div>
              <div style={{ padding: "0 24px", height: 38, display: "flex", alignItems: "center", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Guardar cambios</div>
            </div>
          </div>
        </div>

        <p style={{ color: "#334155", fontSize: 11, marginTop: 20 }}>FlowTime v0.1.0 · Desarrollado con Next.js + Neon Postgres</p>
      </div>

      <style>{`
        .settings-mobile  { display: block; }
        .settings-desktop { display: none; }
        @media (min-width: 1024px) {
          .settings-mobile  { display: none; }
          .settings-desktop { display: block; }
        }
      `}</style>
    </>
  );
}
