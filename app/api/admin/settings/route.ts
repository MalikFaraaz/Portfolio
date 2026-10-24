import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
    return Response.json(settings);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
