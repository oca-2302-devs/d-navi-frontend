import { NotFound } from "@/shared/components/error";

export default function GuestScanNotFound() {
  return (
    <NotFound
      title="無効なルームID"
      description={`ルームIDが見つかりませんでした。\nURLを確認してもう一度お試しください。`}
      linkHref="/"
      linkLabel="ホームに戻る"
    />
  );
}
