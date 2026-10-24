"use server";

import { db } from "./db";
import { requireAdmin, setSessionCookie, clearSessionCookie, verifyPassword, hashPassword } from "./auth";
import { revalidateSite } from "./revalidate";
import { checkRateLimit } from "./rateLimit";
import {
  LoginSchema,
  HeroSchema,
  AboutSchema,
  FactSchema,
  ProjectSchema,
  TechSchema,
  ProcessStepSchema,
  StatSchema,
  ContactInfoSchema,
  SocialLinkSchema,
  SiteSettingsSchema,
  ChangePasswordSchema,
  ContactMessageSchema,
} from "./validators";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Helper to get client IP
async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return headerList.get("x-real-ip") || "127.0.0.1";
}

// ----------------- AUTH ACTIONS -----------------

export async function loginAction(formData: FormData) {
  const ip = await getClientIp();
  const rateLimitKey = `login:${ip}`;
  const rate = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000); // 5 attempts per 15 min

  if (!rate.allowed) {
    return { error: "Too many login attempts. Please wait 15 minutes before trying again." };
  }

  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Incorrect email or password." };
  }

  const user = await db.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
  });

  if (!user) {
    return { error: "Incorrect email or password." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Incorrect email or password." };
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
  });

  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export async function changePasswordAction(raw: unknown) {
  const session = await requireAdmin();
  const parsed = ChangePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const user = await db.adminUser.findUnique({ where: { id: session.userId } });
  if (!user) return { error: "User not found" };

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return { success: true };
}

// ----------------- HERO ACTIONS -----------------

export async function updateHeroAction(raw: unknown) {
  await requireAdmin();
  const parsed = HeroSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  await db.hero.upsert({
    where: { id: 1 },
    update: {
      ...parsed.data,
      roles: JSON.stringify(parsed.data.roles),
    },
    create: {
      id: 1,
      ...parsed.data,
      roles: JSON.stringify(parsed.data.roles),
    },
  });

  revalidateSite();
  return { success: true };
}

// ----------------- ABOUT & FACTS -----------------

export async function updateAboutAction(raw: unknown) {
  await requireAdmin();
  const parsed = AboutSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  await db.about.upsert({
    where: { id: 1 },
    update: {
      tag: parsed.data.tag,
      heading: parsed.data.heading,
      paragraphs: JSON.stringify(parsed.data.paragraphs),
    },
    create: {
      id: 1,
      tag: parsed.data.tag,
      heading: parsed.data.heading,
      paragraphs: JSON.stringify(parsed.data.paragraphs),
    },
  });

  revalidateSite();
  return { success: true };
}

export async function createFactAction(raw: unknown) {
  await requireAdmin();
  const parsed = FactSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const count = await db.fact.count();
  await db.fact.create({
    data: {
      label: parsed.data.label,
      value: parsed.data.value,
      order: count,
    },
  });

  revalidateSite();
  return { success: true };
}

export async function updateFactAction(id: string, raw: unknown) {
  await requireAdmin();
  const parsed = FactSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await db.fact.update({
    where: { id },
    data: {
      label: parsed.data.label,
      value: parsed.data.value,
    },
  });

  revalidateSite();
  return { success: true };
}

export async function deleteFactAction(id: string) {
  await requireAdmin();
  await db.fact.delete({ where: { id } });
  revalidateSite();
  return { success: true };
}

export async function reorderFactsAction(orderedIds: string[]) {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.fact.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidateSite();
  return { success: true };
}

// ----------------- PROJECTS -----------------

export async function saveProjectAction(raw: unknown) {
  await requireAdmin();
  const parsed = ProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const { id, features, tags, ...rest } = parsed.data;

  if (id) {
    await db.project.update({
      where: { id },
      data: {
        ...rest,
        features: JSON.stringify(features),
        tags: JSON.stringify(tags),
      },
    });
  } else {
    const count = await db.project.count();
    await db.project.create({
      data: {
        ...rest,
        features: JSON.stringify(features),
        tags: JSON.stringify(tags),
        order: count,
      },
    });
  }

  revalidateSite();
  return { success: true };
}

export async function toggleProjectVisibilityAction(id: string, visible: boolean) {
  await requireAdmin();
  await db.project.update({
    where: { id },
    data: { visible },
  });
  revalidateSite();
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  revalidateSite();
  return { success: true };
}

export async function reorderProjectsAction(orderedIds: string[]) {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.project.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidateSite();
  return { success: true };
}

// ----------------- TECH MARQUEE -----------------

export async function addTechAction(name: string) {
  await requireAdmin();
  const parsed = TechSchema.safeParse({ name: name.trim() });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const count = await db.tech.count();
  await db.tech.create({
    data: { name: parsed.data.name, order: count },
  });
  revalidateSite();
  return { success: true };
}

export async function deleteTechAction(id: string) {
  await requireAdmin();
  await db.tech.delete({ where: { id } });
  revalidateSite();
  return { success: true };
}

export async function reorderTechAction(orderedIds: string[]) {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.tech.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidateSite();
  return { success: true };
}

// ----------------- PROCESS STEPS -----------------

export async function saveProcessStepAction(raw: unknown) {
  await requireAdmin();
  const parsed = ProcessStepSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  if (parsed.data.id) {
    await db.processStep.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
      },
    });
  } else {
    const count = await db.processStep.count();
    await db.processStep.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        order: count,
      },
    });
  }

  revalidateSite();
  return { success: true };
}

export async function deleteProcessStepAction(id: string) {
  await requireAdmin();
  await db.processStep.delete({ where: { id } });
  revalidateSite();
  return { success: true };
}

export async function reorderProcessStepsAction(orderedIds: string[]) {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.processStep.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidateSite();
  return { success: true };
}

// ----------------- STATS -----------------

export async function saveStatAction(raw: unknown) {
  await requireAdmin();
  const parsed = StatSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  if (parsed.data.id) {
    await db.stat.update({
      where: { id: parsed.data.id },
      data: {
        value: parsed.data.value,
        suffix: parsed.data.suffix,
        label: parsed.data.label,
      },
    });
  } else {
    const count = await db.stat.count();
    await db.stat.create({
      data: {
        value: parsed.data.value,
        suffix: parsed.data.suffix,
        label: parsed.data.label,
        order: count,
      },
    });
  }

  revalidateSite();
  return { success: true };
}

export async function deleteStatAction(id: string) {
  await requireAdmin();
  await db.stat.delete({ where: { id } });
  revalidateSite();
  return { success: true };
}

export async function reorderStatsAction(orderedIds: string[]) {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.stat.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidateSite();
  return { success: true };
}

// ----------------- CONTACT & SOCIAL -----------------

export async function updateContactInfoAction(raw: unknown) {
  await requireAdmin();
  const parsed = ContactInfoSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await db.contactInfo.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  revalidateSite();
  return { success: true };
}

export async function saveSocialLinkAction(raw: unknown) {
  await requireAdmin();
  const parsed = SocialLinkSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  if (parsed.data.id) {
    await db.socialLink.update({
      where: { id: parsed.data.id },
      data: {
        label: parsed.data.label,
        url: parsed.data.url,
        visible: parsed.data.visible,
      },
    });
  } else {
    const count = await db.socialLink.count();
    await db.socialLink.create({
      data: {
        label: parsed.data.label,
        url: parsed.data.url,
        visible: parsed.data.visible,
        order: count,
      },
    });
  }

  revalidateSite();
  return { success: true };
}

export async function deleteSocialLinkAction(id: string) {
  await requireAdmin();
  await db.socialLink.delete({ where: { id } });
  revalidateSite();
  return { success: true };
}

export async function reorderSocialLinksAction(orderedIds: string[]) {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.socialLink.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  revalidateSite();
  return { success: true };
}

// ----------------- SETTINGS -----------------

export async function updateSettingsAction(raw: unknown) {
  await requireAdmin();
  const parsed = SiteSettingsSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  await db.siteSettings.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  revalidateSite();
  return { success: true };
}

// ----------------- MESSAGES -----------------

export async function markMessageReadAction(id: string, read: boolean) {
  await requireAdmin();
  await db.message.update({
    where: { id },
    data: { read },
  });
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  await db.message.delete({ where: { id } });
  return { success: true };
}

// ----------------- PUBLIC CONTACT SUBMISSION -----------------

export async function submitContactMessageAction(raw: unknown) {
  const ip = await getClientIp();
  const rateLimitKey = `contact:${ip}`;
  const rate = checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000); // 3 per hour per IP

  if (!rate.allowed) {
    return { error: "You have reached the contact limit (3 messages per hour). Please try again later." };
  }

  const parsed = ContactMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid submission" };
  }

  // Honeypot check for bots
  if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
    // Silently return success to bot without saving
    return { success: true };
  }

  await db.message.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      body: parsed.data.message,
      ip,
    },
  });

  return { success: true };
}
