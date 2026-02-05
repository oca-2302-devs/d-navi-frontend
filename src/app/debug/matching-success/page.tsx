"use client";

import { useState } from "react";

import { MatchingSuccessModal } from "@/features/room/components/MatchingSuccessModal";

import { Button } from "@/shared/components/ui/button";

export default function MatchingSuccessDebugPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Matching Success Modal Debug</h1>
        <p className="text-gray-600">Click the button below to open the matching success modal.</p>
      </div>

      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <MatchingSuccessModal open={isOpen} onClose={() => setIsOpen(false)} />

      {/* Background content simulation */}
      <div
        className="w-full max-w-md bg-white p-4 rounded-lg shadow-sm space-y-4 opacity-50 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}
