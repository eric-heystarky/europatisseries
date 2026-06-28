import type { Metadata } from "next";
import FaqView from "./faq-view";

export const metadata: Metadata = {
  title: "FAQ — Ordering, Delivery & Pickup",
  description:
    "Answers to common questions about ordering online, pickup & delivery, fees, catering, allergens, gift cards and opening hours at Euro Patisserie Armadale.",
  alternates: { canonical: "/faq" },
};

// Plain-text Q&A mirror of faq-view, for FAQPage rich snippets in Google.
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How do I order online?",
    a: "Browse the menu, add items to your cart, then check out with pickup or delivery and pay securely by card. You'll get an order confirmation on screen.",
  },
  {
    q: "Do you offer pickup and delivery?",
    a: "Both. Pick up from our shop at 974 High St, Armadale, or have it delivered. Choose your option at checkout — ASAP or scheduled for later.",
  },
  {
    q: "How much is delivery, and how far do you go?",
    a: "Delivery is $5 per km driving distance from our Armadale shop, calculated live at checkout when you enter your address. Free delivery on orders over $300.",
  },
  {
    q: "Can you cater for events?",
    a: "Yes — wedding cakes, grand entremets, cocktail pieces, buffets and more. See the catering page or send an enquiry. For large orders we recommend at least 48 hours' notice.",
  },
  {
    q: "Do you cater to allergies and dietary needs?",
    a: "We carry gluten-free and vegetarian options. However, everything is made in a kitchen that handles nuts, gluten, dairy and eggs, so we can't guarantee any item is completely allergen-free.",
  },
  {
    q: "Do you sell gift cards?",
    a: "Yes — a Euro Patisserie gift card is the perfect treat, redeemable in-store on everything we make. See our gift cards page for details.",
  },
  {
    q: "What are your opening hours?",
    a: "Tuesday–Sunday, 7am–3pm. Closed Mondays. Order online any time and we'll have it ready in opening hours.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <FaqView />
    </>
  );
}
