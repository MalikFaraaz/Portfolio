import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const hero = await db.hero.findUnique({ where: { id: 1 } });
    return Response.json(hero);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
