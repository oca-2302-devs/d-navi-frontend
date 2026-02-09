import type { Metadata } from "next";

import { MapContainer } from "@/features/room/components";

export const metadata: Metadata = {
  title: "Map Navigation",
};

export default function RoomMapPage() {
  return <MapContainer />;
}
