import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [todayTasks, pendingCount, completedToday, upcomingEvents] = await Promise.all([
    prisma.task.findMany({
      where: { userId, dueDate: { gte: today, lt: tomorrow }, status: { not: "CANCELLED" } },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      take: 8,
    }),
    prisma.task.count({ where: { userId, status: "PENDING" } }),
    prisma.task.count({
      where: { userId, status: "COMPLETED", completedAt: { gte: today } },
    }),
    prisma.event.findMany({
      where: { userId, startDate: { gte: today } },
      orderBy: { startDate: "asc" },
      take: 5,
    }),
  ]);

  return (
    <DashboardClient
      user={{ name: session!.user!.name, image: session!.user!.image }}
      todayTasks={todayTasks}
      pendingCount={pendingCount}
      completedToday={completedToday}
      upcomingEvents={upcomingEvents}
    />
  );
}
