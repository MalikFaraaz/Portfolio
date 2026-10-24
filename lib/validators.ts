import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ContactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email is required"),
  message: z.string().min(5, "Message must be at least 5 characters").max(2000, "Message cannot exceed 2000 characters"),
  honeypot: z.string().optional(),
});

export const HeroSchema = z.object({
  line1: z.string().min(1, "Line 1 is required"),
  line2: z.string().min(1, "Line 2 is required"),
  line3: z.string().min(1, "Line 3 is required"),
  roles: z.array(z.string().min(1, "Role cannot be empty")).min(1, "At least one role is required"),
  lead: z.string().min(1, "Lead text is required"),
  cta1Label: z.string().min(1, "Primary CTA label is required"),
  cta1Href: z.string().min(1, "Primary CTA link is required"),
  cta2Label: z.string().min(1, "Secondary CTA label is required"),
  cta2Href: z.string().min(1, "Secondary CTA link is required"),
  codeFile: z.string().min(1, "Code file name is required"),
  codeText: z.string().min(1, "Code content is required"),
  codeLang: z.string().default("dart"),
});

export const AboutSchema = z.object({
  tag: z.string().min(1, "Tag is required"),
  heading: z.string().min(1, "Heading is required"),
  paragraphs: z.array(z.string().min(1, "Paragraph cannot be empty")).min(1, "At least one paragraph is required"),
});

export const FactSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  order: z.number().int().default(0),
});

export const ProjectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(5, "Description is required"),
  features: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  codeFile: z.string().optional().nullable(),
  codeText: z.string().optional().nullable(),
  codeLang: z.string().default("dart").optional().nullable(),
  liveUrl: z.string().url().optional().or(z.literal("")).nullable(),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const TechSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Technology name is required"),
  order: z.number().int().default(0),
});

export const ProcessStepSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.number().int().default(0),
});

export const StatSchema = z.object({
  id: z.string().optional(),
  value: z.number().int("Value must be an integer"),
  suffix: z.string().max(5).default(""),
  label: z.string().min(1, "Label is required"),
  order: z.number().int().default(0),
});

export const ContactInfoSchema = z.object({
  email: z.string().email("Valid contact email is required"),
  heading: z.string().min(1, "Heading is required"),
  footerLeft: z.string().min(1, "Footer left text is required"),
  footerRight: z.string().min(1, "Footer right text is required"),
});

export const SocialLinkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  url: z.string().url("Must be a valid URL"),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const SiteSettingsSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  ogImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  accentLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a 6-digit hex color like #2457F5"),
  accentDark: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a 6-digit hex color like #4B7BFF"),
  availableBadge: z.string().min(1, "Badge text is required"),
  showBadge: z.boolean().default(true),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(10, "New password must be at least 10 characters"),
  confirmPassword: z.string().min(10, "Confirm password must match"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
