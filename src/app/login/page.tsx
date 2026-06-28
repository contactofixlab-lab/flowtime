import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(79,70,229,0.15) 0%, #0A0A1A 60%)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              boxShadow: "0 8px 32px rgba(79,70,229,0.4)",
            }}
          >
            <span className="text-white text-2xl font-black">F</span>
          </div>
          <h1 className="text-3xl font-black" style={{ color: "#E2E8F0" }}>
            FlowTime
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Organiza tu tiempo, sin fricción
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
