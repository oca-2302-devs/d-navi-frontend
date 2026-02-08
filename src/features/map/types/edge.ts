/**
 * Path data for navigation routes
 */
export interface PathData {
  start: string;
  end: string;
  path: string[];
  cost: number;
}

/**
 * Edge data containing host and guest paths
 */
export interface EdgeData {
  host: PathData;
  guest: PathData;
}
