export interface IChessGameTypeValue {
  fullName: string,
  simpleName: string,
  timeControl: string;
}

export const ChessGameTypesArray  = ["bullet_1_0", "bullet_1_2", "blitz_3_0", "blitz_3_2", "rapid_10_0", "rapid_10_5", "classic_30_0", "classic_30_30"] as const;
export type ChessGameTypesType = typeof ChessGameTypesArray[number];

export const ChessGameTypes: Record<ChessGameTypesType, IChessGameTypeValue> = {
  bullet_1_0: { fullName: "bullet_1_0", simpleName: "BULLET", timeControl: "1м + 0с" },
  bullet_1_2: { fullName: "bullet_1_2", simpleName: "BULLET", timeControl: "1м + 2с" },
  blitz_3_0: { fullName: "blitz_3_0", simpleName: "BLITZ", timeControl: "3м + 0с" },
  blitz_3_2: { fullName: "blitz_3_2", simpleName: "BLITZ", timeControl: "3м + 2с" },
  rapid_10_0: { fullName: "rapid_10_0", simpleName: "RAPID", timeControl: "10м + 0с" },
  rapid_10_5: { fullName: "rapid_10_5", simpleName: "RAPID", timeControl: "10м + 5с" },
  classic_30_0: { fullName: "classic_30_0", simpleName: "CLASSIC", timeControl: "30м + 0с" },
  classic_30_30: { fullName: "classic_30_30", simpleName: "CLASSIC", timeControl: "30м + 30с" },
};