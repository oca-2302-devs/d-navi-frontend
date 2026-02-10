import { Metadata } from "next";

import { RouteGuidanceContainer } from "@/features/map/components/RouteGuidanceContainer";

export const metadata: Metadata = {
  title: "ナビ案内",
};

export default function Meet() {
  return <RouteGuidanceContainer />;
}
