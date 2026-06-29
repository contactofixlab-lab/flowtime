import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import FloatingPillNav from "@/components/FloatingPillNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A1A", position: "relative", overflow: "hidden" }}>
      {/* Ambient blobs fijos */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-10%", left: "-15%",
          width: "55%", height: "55%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "-10%",
          width: "50%", height: "50%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "40%",
          width: "35%", height: "35%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>
      <main style={{ position: "relative", zIndex: 1, paddingBottom: 100 }}>
        {children}
      </main>
      <FloatingPillNav />
    </div>
  );
}
