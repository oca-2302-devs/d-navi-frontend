"use client";

import { Spinner } from "@/shared/components/ui/spinner";

export function LocationConfirmationScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-12 shadow-2xl">
        <Spinner className="size-12" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">現在地を確認中</h2>
          <p className="mt-2 text-base text-gray-600">少々お待ちください...</p>
        </div>
      </div>
    </div>
  );
}
