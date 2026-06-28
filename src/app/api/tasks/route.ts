import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Priority, TaskStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") as TaskStatus | null;
  const priority = searchParams.get("priority") as Priority | null;

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user!.id!,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
    },
    include: { tags: true },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, priority, dueDate } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      priority: (priority as Priority) ?? "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user!.id!,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
