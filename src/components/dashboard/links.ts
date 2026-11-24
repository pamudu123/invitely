"use client";

import { useSyncExternalStore } from "react";

const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
const subscribe = () => () => {};

/**
 * Site origin used to build guest links. Uses NEXT_PUBLIC_SITE_URL when set,
 * otherwise the address in the browser. Empty while rendering on the server
 * with no site URL configured.
 */
export function useOrigin(): string {
  return useSyncExternalStore(
    subscribe,
    () => configured || window.location.origin,
    () => configured,
  );
}

export const publicLink = (origin: string, slug: string): string => `${origin}/i/${slug}`;

export const personalLink = (origin: string, slug: string, token: string): string => `${origin}/i/${slug}?g=${token}`;

/** Digits only, in international form. Local Sri Lankan numbers (leading 0) get the 94 country code. */
export function whatsappDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `94${digits.slice(1)}`;
  return digits;
}

export function whatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${whatsappDigits(phone)}?text=${encodeURIComponent(message)}`;
}

export const guestMessage = (name: string, link: string): string =>
  `Dear ${name}, we would love you to join us. Here is your personal invitation: ${link}`;

/** Host without the protocol, for showing links compactly. */
export const bareHost = (origin: string): string => origin.replace(/^https?:\/\//, "");
