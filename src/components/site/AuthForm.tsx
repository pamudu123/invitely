"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, signupAction, type AuthState } from "@/app/actions/auth";
import { Button, Field, Input } from "@/components/ui/kit";

const initial: AuthState = {};

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? loginAction : signupAction, initial);
  const other = mode === "login" ? "signup" : "login";
  const query = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" ? (
        <Field label="Your name">
          <Input name="name" autoComplete="name" required maxLength={80} defaultValue={state.values?.name} placeholder="Amaya Perera" />
        </Field>
      ) : null}
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} placeholder="you@example.com" />
      </Field>
      <Field label="Password" hint={mode === "signup" ? "At least 8 characters." : undefined}>
        <Input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "signup" ? 8 : 1}
        />
      </Field>
      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
        {pending ? "One moment…" : mode === "login" ? "Sign in" : "Create my account"}
      </Button>
      <p className="text-center text-sm text-paper/55">
        {mode === "login" ? "New to Invitely?" : "Already have an account?"}{" "}
        <Link href={`/${other}${query}`} className="text-flame underline-offset-4 hover:underline">
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
