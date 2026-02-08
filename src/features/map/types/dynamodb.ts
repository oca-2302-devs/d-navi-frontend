/**
 * DynamoDB MapNode item structure
 */
export interface MapNode {
  PK: { S: string };
  SK: { S: string };
  created_at: { S: string };
  updated_at: { S: string };
  data: { M: NodeDataRaw };
}

/**
 * DynamoDB Raw Format Types for node data
 */
export interface NodeDataRaw {
  type: { S: string };
  floor: { N: string };
  position: { M: { x: { N: string }; y: { N: string } } };
  size: { M: { width: { N: string }; height: { N: string } } };
  entry: { M: { x: { N: string | "true" }; y: { N: string | "true" } } }; // "true" for NULL in some cases
}
