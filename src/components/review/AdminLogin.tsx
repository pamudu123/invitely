"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/app/actions/reviews";
import { Button, Field, Input } from "@/components/ui/kit";

export function AdminLogin() {
  const [state, action, pending] = useActionState(adminLoginAction, {});
  return (
    <form action={action} className="mx-auto grid max-w-sm gap-4 pt-10">
      <h1 className="display text-5xl">Team sign in</h1>
      <Field label="Password">
        <Input name="password" type="password" autoComplete="current-password" required autoFocus />
      </Field>
      {state.error ? <p role="alert" className="text-sm text-red-700">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Checking…" : "Sign in"}</Button>
    </form>
  );
}
