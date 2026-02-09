/**
 * モック現在地データ
 * 実際のアプリでは、GPS/Bluetooth/Wi-Fiなどから取得
 * 現在地はルートの開始点（駐車場のentry）に設定
 */
export const MOCK_CURRENT_LOCATION = {
  floor: 1, // 1F
  x: 262, // 駐車場のentry x座標（ルート開始点）
  y: 190, // 駐車場のentry y座標（ルート開始点）
};
