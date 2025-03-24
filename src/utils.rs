pub fn convert_array(arr: [[i32; 32]; 26]) -> Vec<Vec<usize>> {
    arr.iter()
        .map(|inner| inner.iter().map(|&x| x as usize).collect())
        .collect()
}
pub fn make_square(layout: Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    let max_length = layout
        .iter()
        .map(|row| row.len())
        .max()
        .unwrap_or(0)
        .max(layout.len());

    let mut square = vec![vec![0; max_length]; max_length];

    for (i, row) in layout.iter().enumerate() {
        for (j, &val) in row.iter().enumerate() {
            square[i][j] = val;
        }
    }

    square
}

pub fn transpose(matrix: Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    let max_cols = matrix.iter().map(|row| row.len()).max().unwrap_or(0);

    let mut transposed = vec![vec![0; matrix.len()]; max_cols];

    for (i, row) in matrix.iter().enumerate() {
        for (j, &val) in row.iter().enumerate() {
            transposed[j][i] = val;
        }
    }

    transposed
}
