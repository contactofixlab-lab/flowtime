import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const [events, tasks] = await Promise.all([
    prisma.event.findMany({
      where: { userId, startDate: { gte: start, lte: end } },
      orderBy: { startDate: "asc" },
    }),
    prisma.task.findMany({
      where: { userId, dueDate: { gte: start, lte: end }, status: { not: "CANCELLED" } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return <CalendarClient events={events} tasks={tasks} />;
}
