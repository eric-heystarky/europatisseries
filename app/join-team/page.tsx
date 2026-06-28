import type { Metadata } from "next";
import JoinTeamView from "./join-team-view";

export const metadata: Metadata = {
  title: "Join the Team — Careers",
  description:
    "We're hiring! Join the Euro Patisserie Armadale team — pastry chefs, baristas & front of house. Great perks, a fun team and real growth. Apply now.",
  alternates: { canonical: "/join-team" },
};

export default function Page() {
  return <JoinTeamView />;
}
