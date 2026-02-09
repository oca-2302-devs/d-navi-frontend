"use client";

import { useEffect, useState } from "react";

import { generateClient } from "aws-amplify/api";

import { listNodesQuery } from "../graphql/queries";
import { Node } from "../types";

const client = generateClient();

interface NodeAPIResponse {
  PK: string;
  SK: string;
  created_at: string;
  updated_at: string;
  data: {
    type: string;
    floor: number;
    position: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
    entry: {
      x: number;
      y: number;
    } | null;
  };
}

interface ListNodesResponse {
  listNodes: {
    items: NodeAPIResponse[];
  };
}

/**
 * Transform API response to frontend Node format
 */
function transformNodeData(apiNode: NodeAPIResponse): Node {
  return {
    id: apiNode.SK, // Use SK as the node ID
    type: apiNode.data.type as Node["type"],
    floor: apiNode.data.floor,
    position: apiNode.data.position,
    size: apiNode.data.size,
    entry: apiNode.data.entry,
  };
}

/**
 * Custom hook to fetch and manage map nodes from AppSync
 */
export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = (await client.graphql({
        query: listNodesQuery,
      })) as { data: ListNodesResponse };

      const transformedNodes = response.data.listNodes.items.map(transformNodeData);

      setNodes(transformedNodes);
    } catch (err) {
      console.error("Error fetching nodes:", JSON.stringify(err, null, 2));
      setError(err instanceof Error ? err : new Error("Failed to fetch nodes"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  return {
    nodes,
    loading,
    error,
    refetch: fetchNodes,
  };
}
