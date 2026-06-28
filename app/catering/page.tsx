import type { Metadata } from "next";
import CateringView from "./catering-view";

export const metadata: Metadata = {
  title: "Catering & Custom Cakes",
  description:
    "Catering for any occasion in Armadale — wedding cakes, grand entremets, cocktail pieces and buffets. Enquire about custom orders & platters.",
  alternates: { canonical: "/catering" },
};

export default function Page() {
  return <CateringView />;
}
