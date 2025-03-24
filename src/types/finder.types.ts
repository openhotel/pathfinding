export type FindPathConfig = {
  maxJumpCost?: number;
  orthogonalCostMultiplier?: number;
  diagonalCostMultiplier?: number;
  maxIterations?: number;
  jumpBlockedDiagonals?: boolean;
};
