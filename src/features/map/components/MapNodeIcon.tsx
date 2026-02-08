import React from "react";

import destinationIconUrl from "@/assets/DestinationIcon.svg";
import toiletIconUrl from "@/assets/ToiletIcon.svg";

import { NODE_ICON_MAPPING, type LucideIcon } from "../constants/iconMapping";
import { Node } from "../types";

interface MapNodeIconProps {
  node: Node;
  isDestination?: boolean;
}

/**
 * Renders the appropriate icon for a map node based on its type
 * Handles destination icons, toilet icons, and Lucide icons
 */
export function MapNodeIcon({ node, isDestination }: MapNodeIconProps) {
  const { position, size, type } = node;
  const centerX = position.x + size.width / 2;
  const centerY = position.y + size.height / 2;

  // Destination icon takes precedence
  if (isDestination) {
    const iconSize = 32;
    const x = centerX - iconSize / 2;
    const y = centerY - iconSize / 2;

    // Handle both object (StaticImageData) and string (URL) import results
    const href =
      typeof destinationIconUrl === "string"
        ? destinationIconUrl
        : (destinationIconUrl as { src: string }).src;

    return <image href={href} x={x} y={y} width={iconSize} height={iconSize} />;
  }

  // Toilet icon (SVG image)
  if (type === "toilet") {
    const iconSize = 32;
    const x = centerX - iconSize / 2;
    const y = centerY - iconSize / 2;
    const href =
      typeof toiletIconUrl === "string" ? toiletIconUrl : (toiletIconUrl as { src: string }).src;
    return <image href={href} x={x} y={y} width={iconSize} height={iconSize} />;
  }

  // Lucide icon rendering
  const IconComponent: LucideIcon | undefined = NODE_ICON_MAPPING[type];
  if (IconComponent) {
    const iconSize = 20; // Icon itself
    const bgSize = 32; // Background circle
    const iconX = centerX - iconSize / 2;
    const iconY = centerY - iconSize / 2;

    return (
      <g>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={bgSize / 2}
          className="fill-white dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700 stroke-1"
        />
        {/* Icon */}
        <IconComponent
          x={iconX}
          y={iconY}
          width={iconSize}
          height={iconSize}
          className="text-gray-600 dark:text-gray-300 pointer-events-none"
        />
      </g>
    );
  }

  return null;
}
