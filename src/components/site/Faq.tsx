import { Plus } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export const generalFaq: FaqItem[] = [
  {
    q: "Do my guests need an app or an account?",
    a: "No. Your invitation is a web page. Guests tap the link you send on WhatsApp, SMS or email and it opens in their browser, on any phone.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There is no sign up and no password. You pay once per card, and each card comes with a private manage link. Open that link to edit the card, add guests and see replies. You can also set an edit PIN to open your card on any phone.",
  },
  {
    q: "Can I try it before paying?",
    a: "Yes. Pick a design, customise every detail and preview it on your own phone for free. You only pay when you are ready to publish and share.",
  },
  {
    q: "What is a personal guest link?",
    a: "Each guest or family can get their own link. The invitation greets them by name, shows the seats you reserved for them, and their reply is matched to your guest list automatically.",
  },
  {
    q: "Can I change details after sending it?",
    a: "Any time. Edit the time, venue or schedule and every guest sees the update on the same link. Nothing needs to be sent again.",
  },
  {
    q: "What happens on the day, and after?",
    a: "On the day the invitation shows what is happening now and what is next. Afterwards it becomes a thank you page with your photos and your guests' wishes.",
  },
  {
    q: "How long does the link stay live?",
    a: "Essential invitations stay live for 12 months. Signature invitations do not expire.",
  },
];

export function Faq({ items = generalFaq }: { items?: FaqItem[] }) {
  return (
    <div className="border-t border-fg/10">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-fg/10">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-serif text-[1.45rem] leading-snug sm:text-[1.7rem]">{item.q}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fg/15 text-fg/90 transition-transform duration-300 group-open:rotate-45">
              <Plus size={16} />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 leading-relaxed text-fg/85">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
