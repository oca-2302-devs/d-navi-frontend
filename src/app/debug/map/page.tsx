"use client";

import React from "react";

import { Map } from "@/features/map/components/Map";

export default function MapDebugPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Map Component Debug
      </h1>
      <div className="w-full max-w-4xl border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-black">
        <Map className="h-[600px] w-full" />
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
        <p>Instructions:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Use the floor navigation buttons (bottom-left) to switch floors.</li>
          <li>Verify that nodes appear for each floor.</li>
          <li>Default path (Host) should be visible on Floor 1 and Floor 4.</li>
          <li>Path animation should draw the line.</li>
        </ul>
      </div>
    </div>
  );
}
