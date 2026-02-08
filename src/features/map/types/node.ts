/**
 * Node type definitions for the map
 */
export type NodeType =
  | "parking"
  | "elevator"
  | "room"
  | "stairs"
  | "exit"
  | "library"
  | "toilet"
  | "intersection";

/**
 * Position coordinates in the map
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Node data structure
 */
export interface NodeData {
  type: NodeType;
  floor: number;
  position: Position;
  size: Size;
  entry: Position;
}

/**
 * Simplified Node interface for frontend use
 */
export interface Node {
  id: string; // derived from SK (e.g., "1")
  type: NodeType;
  floor: number;
  position: Position;
  size: Size;
  entry: Position | null; // entry can be null
}
