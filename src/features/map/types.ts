export type NodeType =
  | "parking"
  | "elevator"
  | "room"
  | "stairs"
  | "exit"
  | "library"
  | "toilet"
  | "intersection";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface NodeData {
  type: NodeType;
  floor: number;
  position: Position;
  size: Size;
  entry: Position;
}

export interface MapNode {
  PK: { S: string };
  SK: { S: string };
  created_at: { S: string };
  updated_at: { S: string };
  data: { M: NodeDataRaw };
}

// DynamoDB Raw Format Types
export interface NodeDataRaw {
  type: { S: string };
  floor: { N: string };
  position: { M: { x: { N: string }; y: { N: string } } };
  size: { M: { width: { N: string }; height: { N: string } } };
  entry: { M: { x: { N: string | "true" }; y: { N: string | "true" } } }; // "true" for NULL in some cases? The sample showed "NULL": true but strict typing might need adjustment.
  // Let's refine based on the "NULL": true seen in sample NODE#14.
}

// Simplified Interface for Frontend Use
export interface Node {
  id: string; // derived from SK (e.g., "1")
  type: NodeType;
  floor: number;
  position: Position;
  size: Size;
  entry: Position | null; // entry can be null
}

export interface PathData {
  start: string;
  end: string;
  path: string[];
  cost: number;
}

export interface EdgeData {
  host: PathData;
  guest: PathData;
}
