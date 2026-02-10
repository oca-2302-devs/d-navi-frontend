import elevatorIconUrl from "@/assets/ElevatorIcon.svg";
import parkingIconUrl from "@/assets/ParkingIcon.svg";
import stairsIconUrl from "@/assets/StairsIcon.svg";

import { NodeType } from "../types";

/**
 * Maps node types to their corresponding SVG icon URLs
 */
export const NODE_ICON_MAPPING: Partial<Record<NodeType, string | { src: string }>> = {
  elevator: elevatorIconUrl,
  stairs: stairsIconUrl,
  parking: parkingIconUrl,
};
