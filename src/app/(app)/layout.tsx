import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import FloatingPillNav from "@/components/FloatingPillNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg-base)" }}>
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 30%, rgba(79,70,229,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />
      <main className="relative pb-24 md:pb-28">{children}</main>
      <FloatingPillNav />
    </div>
  );
}
