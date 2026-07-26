import type { Metadata } from "next";
import { LoginPage } from "./LoginPage";

export const metadata: Metadata = {
  title: "Sign in | TigerOne Business System",
  description:
    "Your first version will appear here automatically when it’s ready.",
};

export default function Home() {
  return <LoginPage />;
}
