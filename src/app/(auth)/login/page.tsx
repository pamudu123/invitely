import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/site/AuthForm";
import { getUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Sign in" };

async function Form({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const sp = await searchParams;
  const raw = typeof sp.next === "string" ? sp.next : "";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "";
  if (await getUser()) redirect(next || "/dashboard");
  return <AuthForm mode="login" next={next} />;
}

export default function Page({ searchParams }: PageProps<"/login">) {
  return (
    <>
      <p className="label text-flame">Sign in</p>
      <h1 className="display mt-3 text-4xl">Welcome back</h1>
      <p className="mb-7 mt-3 text-sm text-paper/60">Sign in to manage your invitations and replies.</p>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-paper/5" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </>
  );
}
