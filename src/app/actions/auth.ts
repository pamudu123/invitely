"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { checkCredentials, createSession, createUser, destroySession } from "@/lib/server/auth";

export interface AuthState {
  error?: string;
  values?: { name?: string; email?: string };
}

function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

const signupSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters for your password.").max(200),
});

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const values = { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") };
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form.", values };
  const user = await createUser(parsed.data.email, parsed.data.name, parsed.data.password);
  if (!user) return { error: "An account with that email already exists. Try signing in.", values };
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const values = { email: String(formData.get("email") ?? "") };
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email and password.", values };
  const user = await checkCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { error: "That email and password do not match.", values };
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
