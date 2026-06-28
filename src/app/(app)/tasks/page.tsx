import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TasksClient from "./TasksClient";

export default async function TasksPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const tasks = await prisma.task.findMany({
    where: { userId, status: { not: "CANCELLED" } },
    include: { tags: true },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
  });

  return <TasksClient initialTasks={tasks} />;
}
