import elevatorIconUrl from "@/assets/ElevatorIcon.svg";
import parkingIconUrl from "@/assets/ParkingIcon.svg";
import stairsIconUrl from "@/assets/StairsIcon.svg";

/**
 * Maps node types to their corresponding SVG icon URLs
 */
export const NODE_ICON_MAPPING: Record<string, string | { src: string }> = {
  elevator: elevatorIconUrl,
  stairs: stairsIconUrl,
  parking: parkingIconUrl,
};
