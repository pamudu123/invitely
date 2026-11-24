import Link from "next/link";
import { Logo } from "@/components/ui/kit";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, rgba(232,181,101,0.22), rgba(232,181,101,0.05) 45%, transparent 70%)" }}
      />
      <Link href="/" className="relative mb-10 text-paper" aria-label="Invitely home">
        <Logo size={26} />
      </Link>
      <div className="relative w-full max-w-md rounded-3xl border border-paper/10 bg-night-2/80 p-6 backdrop-blur-xl sm:p-8">
        {children}
      </div>
    </main>
  );
}
