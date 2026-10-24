import { revalidatePath } from "next/cache";

export function revalidateSite() {
  try {
    revalidatePath("/", "page");
    revalidatePath("/sitemap.xml");
  } catch (err) {
    console.error("Revalidation error:", err);
  }
}
