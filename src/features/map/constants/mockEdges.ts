import { EdgeData } from "../types";

export const MOCK_EDGE_DATA: EdgeData = {
  host: {
    start: "1",
    end: "92",
    path: ["1", "64", "67", "2", "35", "94", "92"],
    cost: 331,
    arrivalTime: "2026-02-07T09:07:53.521+09:00",
  },
  guest: {
    start: "40",
    end: "92",
    path: ["40", "89", "93", "92"],
    cost: 289,
    arrivalTime: "2026-02-07T09:05:21.721+09:00",
  },
};
