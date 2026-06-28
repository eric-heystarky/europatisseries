import type { Metadata } from "next";
import ContactView from "./contact-view";

export const metadata: Metadata = {
  title: "Contact & Visit Us",
  description:
    "Visit Euro Patisserie at 974 High St, Armadale VIC 3143. Open Tues–Sun 7am–3pm. Call (03) 9822 1234 or send us a message.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactView />;
}
