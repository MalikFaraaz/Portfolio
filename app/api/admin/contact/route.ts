import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const [contactInfo, socialLinks] = await Promise.all([
      db.contactInfo.findUnique({ where: { id: 1 } }),
      db.socialLink.findMany({ orderBy: { order: "asc" } }),
    ]);
    return Response.json({ contactInfo, socialLinks });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
