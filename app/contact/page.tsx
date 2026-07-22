import type { Metadata } from "next";
import ContactView from "./contact-view";
import { FaqSection } from "@/components/faq-section";

export const metadata: Metadata = {
  title: "Contact & Visit Us",
  description:
    "Visit Euro Patisserie at 974 High St, Armadale VIC 3143. Open 7 days, 7am–3pm. Call (03) 9822 1234 or send us a message.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <>
      <ContactView />
      <FaqSection />
    </>
  );
}
