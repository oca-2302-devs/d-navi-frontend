import React from "react";

import destinationIconUrl from "@/assets/DestinationIcon.svg";
import toiletIconUrl from "@/assets/ToiletIcon.svg";

import { NODE_ICON_MAPPING } from "../constants/iconMapping";
import { Node } from "../types";

interface MapNodeIconProps {
  node: Node;
  isDestination?: boolean;
}

/**
 * Renders the appropriate icon for a map node based on its type
 * All icons are now rendered as SVG images for visual consistency
 */
export function MapNodeIcon({ node, isDestination }: MapNodeIconProps) {
  const { position, size, type } = node;
  const centerX = position.x + size.width / 2;
  const centerY = position.y + size.height / 2;

  const iconSize = 32;
  const x = centerX - iconSize / 2;
  const y = centerY - iconSize / 2;

  // Helper function to get proper href from import result
  const getHref = (iconUrl: string | { src: string }): string => {
    return typeof iconUrl === "string" ? iconUrl : iconUrl.src;
  };

  // Destination icon takes precedence
  if (isDestination) {
    return (
      <image href={getHref(destinationIconUrl)} x={x} y={y} width={iconSize} height={iconSize} />
    );
  }

  // Toilet icon
  if (type === "toilet") {
    return <image href={getHref(toiletIconUrl)} x={x} y={y} width={iconSize} height={iconSize} />;
  }

  // All other icons from mapping (elevator, stairs, parking)
  const iconUrl = NODE_ICON_MAPPING[type];
  if (iconUrl) {
    return <image href={getHref(iconUrl)} x={x} y={y} width={iconSize} height={iconSize} />;
  }

  return null;
}
