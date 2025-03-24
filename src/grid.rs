use crate::point::Point;
use crate::utils::make_square;

#[derive(Debug)]
pub struct Grid {
    pub width: usize,
    pub height: usize,
    pub height_matrix: Vec<f32>,
}

impl Grid {
    pub fn new(width: usize, height: usize, cost_matrix: Vec<f32>) -> Self {
        Grid {
            width,
            height,
            height_matrix: cost_matrix,
        }
    }

    pub fn from(matrix: Vec<Vec<usize>>) -> Result<Self, String> {
        if matrix.get(0).is_none() || matrix.get(0).unwrap().get(0).is_none() {
            return Err("Grid matrix cannot be empty!".to_string());
        }

        let mat = make_square(matrix);
        let height = mat.len();
        let width = mat.get(0).unwrap().len();

        if height != width {
            return Err("Grid matrix must be square!".to_string());
        }

        let mut cost_matrix = vec![0.0; width * height];

        for (y, row) in mat.iter().enumerate() {
            for (x, &cost) in row.iter().enumerate() {
                cost_matrix[y * width + x] = cost as f32
            }
        }

        Ok(Grid::new(width, height, cost_matrix))
    }

    pub fn get_height_at(&self, point: &Point) -> Option<f32> {
        if !self.in_bounds(&point) {
            return None;
        }
        Some(self.height_matrix[self.index(point)])
    }
    pub fn distance(&self, point_a: &Point, point_b: &Point) -> usize {
        let x_expo = i32::pow((point_a.x - point_b.x) as i32, 2);
        let y_expo = i32::pow((point_a.y - point_b.y) as i32, 2);

        i32::isqrt(x_expo + y_expo) as usize
    }

    pub fn index(&self, point: &Point) -> usize {
        (point.y * self.height as isize + point.x) as usize
    }

    pub fn in_bounds(&self, point: &Point) -> bool {
        point.x >= 0
            && point.x < self.width as isize
            && point.y >= 0
            && point.y < self.height as isize
    }

    pub fn is_walkable(&self, point: &Point) -> bool {
        let height_at = self.get_height_at(&point);
        self.in_bounds(point)
	        && height_at.is_some()
	        //NON WALKABLE HEIGHT
	        && height_at.unwrap() != 0f32
    }

    pub fn walk_matrix<F>(&self, mut callback: F)
    where
        F: FnMut(usize, usize, Option<f32>),
    {
        for y in 0..self.height {
            for x in 0..self.width {
                let index = y * self.height + x;
                let cost = self.height_matrix[index];
                callback(x, y, Some(cost));
            }
        }
    }
}
