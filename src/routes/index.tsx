import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "VLC Web Player" }, { name: "description", content: "VLC-inspired browser video player with EQ, themes, and full keyboard control." }] }),
  component: () => <AppLayout />,
});
