interface DestinationIconProps {
  x: number;
  y: number;
  size?: number;
}

export function DestinationIcon({ x, y, size = 48 }: DestinationIconProps) {
  // アイコンをx, yの位置に中央配置
  // 正方形の幅は'size'
  const offset = size / 2;
  const drawX = x - offset;
  const drawY = y - offset;

  // アイコンコンテンツのスケール係数は〜50pxボックス内の30pxアイコンに基づく（約0.6）
  // viewBoxに依存する
  // ピンデザイン: 赤い角丸背景 + 白いピンベクター

  return (
    <g transform={`translate(${drawX}, ${drawY})`}>
      {/* 背景: Rose-500 (#F43F5E) 角丸四角形 */}
      <rect
        width={size}
        height={size}
        rx={5}
        fill="#F43F5E"
        filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
        className="animate-bounce-subtle" // 親でframerを使用してアニメーションを追加可能
      />

      {/* ピンアイコン中央配置 */}
      {/* 元のSVG viewboxは:
          外側のピン: 0 0 21.5 26.5
          内側のドット: 0 0 9 9
          
          'size'の中に中央配置する必要がある
          'size' = 48と仮定
          アイコンは中央に約24x24または30x30にしたい
      */}
      <svg
        x={size * 0.25}
        y={size * 0.25}
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 28"
        overflow="visible"
      >
        {/* 外側のピンパス（21.5x26.5からスケール/配置して適合） */}
        {/* 元のパス D: M20.75 10.75... */}
        {/* 中央配置する。21.5/2 = 10.75. 26.5/2 = 13.25. */}
        <g transform="translate(1.25, 0.75)">
          <path
            d="M20.75 10.75C20.75 16.9913 13.8262 23.4912 11.5012 25.4987C11.2847 25.6616 11.021 25.7497 10.75 25.7497C10.479 25.7497 10.2153 25.6616 9.99875 25.4987C7.67375 23.4912 0.75 16.9913 0.75 10.75C0.75 8.09784 1.80357 5.5543 3.67893 3.67893C5.5543 1.80357 8.09784 0.75 10.75 0.75C13.4022 0.75 15.9457 1.80357 17.8211 3.67893C19.6964 5.5543 20.75 8.09784 20.75 10.75Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* 内側のドットパス */}
          {/* 元の中心はおよそ10.75, 10.75? */}
          {/* ドットパス D: M4.5 8.25... バウンディングボックス 0.75〜8.25（幅7.5）。中心4.5。 */}
          {/* 内側の円の中心はマップピンの中心（10.75, 10.75）に配置する必要がある */}
          {/* 既存のパスは4.5, 4.5を中心にしている。6.25, 6.25オフセット */}
          <g transform="translate(6.25, 6.25)">
            <path
              d="M4.5 8.25C6.57107 8.25 8.25 6.57107 8.25 4.5C8.25 2.42893 6.57107 0.75 4.5 0.75C2.42893 0.75 0.75 2.42893 0.75 4.5C0.75 6.57107 2.42893 8.25 4.5 8.25Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </g>
  );
}
