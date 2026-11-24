import { MyCards } from "@/components/dashboard/MyCards";

export default function MyCardsPage() {
  return (
    <>
      <p className="label text-brand">My cards</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Your invitations</h1>
      <p className="mb-8 mt-4 max-w-xl text-sm leading-relaxed text-fg/85 sm:mb-10">
        Cards you made or opened on this device appear here. There is no account. Each card has its own private manage link.
      </p>
      <MyCards />
    </>
  );
}
