export const makeSquare = (layout: number[][]): number[][] => {
  const maxLength = Math.max(layout.length, ...layout.map((row) => row.length));
  const squareLayout = Array.from({ length: maxLength }, () =>
    Array(maxLength).fill(null),
  );

  for (let i = 0; i < layout.length; i++) {
    for (let j = 0; j < layout[i].length; j++) {
      squareLayout[i][j] = layout[i][j];
    }
  }

  return squareLayout;
};

export const transpose = (matrix: number[][]): number[][] => {
  const maxCols = Math.max(...matrix.map((row) => row.length));
  const transposed: number[][] = Array.from({ length: maxCols }, () =>
    Array(matrix.length).fill(null),
  );

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      transposed[j][i] = matrix[i][j];
    }
  }

  return transposed;
};
