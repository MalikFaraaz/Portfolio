import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { db } from "@/lib/db";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const title = settings?.siteTitle || "Faraz Hassan | Full Stack Developer";
  const description =
    settings?.metaDescription ||
    "Full stack developer from Sialkot, Pakistan. I turn ideas into fast, polished mobile and web products.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: settings?.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    metadataBase: new URL(process.env.AUTH_URL || "http://localhost:3000"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const accentLight = settings?.accentLight || "#2457F5";
  const accentDark = settings?.accentDark || "#4B7BFF";

  return (
    <html lang="en" className={sora.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --a: ${accentLight}; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --a: ${accentDark}; } }
:root[data-theme="dark"] { --a: ${accentDark}; }
:root[data-theme="light"] { --a: ${accentLight}; }`,
          }}
        />
        <div id="bar"></div>
        {children}
      </body>
    </html>
  );
}
