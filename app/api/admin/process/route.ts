import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const steps = await db.processStep.findMany({ orderBy: { order: "asc" } });
    return Response.json(steps);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
