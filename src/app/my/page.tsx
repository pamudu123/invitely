import { MyCards } from "@/components/dashboard/MyCards";
import { SeasonPicker } from "@/components/site/season/SeasonPicker";
import { Card } from "@/components/ui/kit";

export default function MyCardsPage() {
  return (
    <>
      <p className="label text-brand">My cards</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Your invitations</h1>
      <p className="mb-8 mt-4 max-w-xl text-sm leading-relaxed text-fg/85 sm:mb-10">
        Cards you made or opened on this device appear here. There is no account. Each card has its own private manage link.
      </p>
      <MyCards />
      <Card id="preferences" className="mt-6 scroll-mt-24 p-5 sm:p-6">
        <h2 className="font-serif text-2xl leading-tight">Preferences</h2>
        <p className="mb-5 mt-1 text-sm leading-relaxed text-fg/85">
          Pick a season for the site. We remember it on this device. Your invitations keep the colours you gave them.
        </p>
        <SeasonPicker className="season-picker-wide" />
      </Card>
    </>
  );
}
