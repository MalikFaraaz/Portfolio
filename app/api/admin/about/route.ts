import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const [about, facts] = await Promise.all([
      db.about.findUnique({ where: { id: 1 } }),
      db.fact.findMany({ orderBy: { order: "asc" } }),
    ]);
    return Response.json({ about, facts });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
