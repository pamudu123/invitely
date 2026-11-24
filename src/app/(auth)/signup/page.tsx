import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/site/AuthForm";
import { getUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Create account" };

async function Form({ searchParams }: { searchParams: PageProps<"/signup">["searchParams"] }) {
  const sp = await searchParams;
  const raw = typeof sp.next === "string" ? sp.next : "";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "";
  if (await getUser()) redirect(next || "/dashboard");
  return <AuthForm mode="signup" next={next} />;
}

export default function Page({ searchParams }: PageProps<"/signup">) {
  return (
    <>
      <p className="label text-flame">Create account</p>
      <h1 className="display mt-3 text-4xl">Create your account</h1>
      <p className="mb-7 mt-3 text-sm text-paper/60">Save your design, publish it and track every reply.</p>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-paper/5" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </>
  );
}
