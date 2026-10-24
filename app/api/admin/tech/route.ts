import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const techs = await db.tech.findMany({ orderBy: { order: "asc" } });
    return Response.json(techs);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
