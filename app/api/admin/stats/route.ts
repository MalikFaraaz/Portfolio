import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await db.stat.findMany({ orderBy: { order: "asc" } });
    return Response.json(stats);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
