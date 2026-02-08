import {
  ArrowUpDown,
  Footprints,
  CircleParking,
  DoorOpen,
  Library,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps node types to their corresponding Lucide icons
 */
export const NODE_ICON_MAPPING: Record<string, LucideIcon> = {
  elevator: ArrowUpDown,
  stairs: Footprints, // 階段のメタファーとして足跡を使用
  parking: CircleParking,
  exit: DoorOpen,
  library: Library,
};

export type { LucideIcon };
