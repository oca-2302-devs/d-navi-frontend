"use client";

import { useEffect, useState } from "react";

import { useRouter, useParams } from "next/navigation";

// 表示段階を定義 (更新版)
export enum DisplayStage {
  LOCATION_CONFIRMATION = "LOCATION_CONFIRMATION", // 現在地確定中 (スピナー)
  CURRENT_LOCATION_ONLY = "CURRENT_LOCATION_ONLY", // 現在地のみ表示 (ルートなし)
  MATCHING = "MATCHING", // マッチング中 (現在地表示 + モーダル)
  ROUTE_WITH_CURRENT_LOCATION = "ROUTE_WITH_CURRENT_LOCATION", // 現在地 + ルートと目的地表示
}

const STAGE_TRANSITION_DELAY_MS = 2000; // 2秒ごとに画面遷移

export function useMapStage() {
  const [displayStage, setDisplayStage] = useState<DisplayStage>(
    DisplayStage.LOCATION_CONFIRMATION
  );
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  // 段階的な画面遷移を制御
  useEffect(() => {
    let timer: NodeJS.Timeout;

    switch (displayStage) {
      case DisplayStage.LOCATION_CONFIRMATION:
        // 2秒後に現在地のみ表示段階へ遷移
        // TODO: バックエンド実装時には、現在地確定API応答時に遷移
        timer = setTimeout(() => {
          setDisplayStage(DisplayStage.CURRENT_LOCATION_ONLY);
        }, STAGE_TRANSITION_DELAY_MS);
        break;

      case DisplayStage.CURRENT_LOCATION_ONLY:
        // 2秒後にマッチング段階へ遷移
        timer = setTimeout(() => {
          setDisplayStage(DisplayStage.MATCHING);
          setShowMatchingModal(true);
        }, STAGE_TRANSITION_DELAY_MS);
        break;

      case DisplayStage.MATCHING:
        // MatchingSuccessModalは自動的に3秒後に閉じる (useAutoClose)
        // モーダルが閉じた後、ルート+現在地表示段階へ遷移
        break;

      case DisplayStage.ROUTE_WITH_CURRENT_LOCATION:
        router.replace(`/room/${roomId}/meet`);
        break;
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [displayStage, router, roomId]);

  // MatchingSuccessModalが閉じられたときの処理
  const handleMatchingModalClose = () => {
    setShowMatchingModal(false);
    // TODO: バックエンド実装時には、マッチング成立API応答でルートデータを取得
    setDisplayStage(DisplayStage.ROUTE_WITH_CURRENT_LOCATION);
  };

  return {
    displayStage,
    showMatchingModal,
    handleMatchingModalClose,
  };
}
