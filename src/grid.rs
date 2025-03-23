use crate::point::Point;
use js_sys::Float32Array;
use js_sys::Math::{pow, sqrt};

#[derive(Debug)]
pub struct Grid {
    width: usize,
    height: usize,
    height_matrix: Float32Array,
}

impl Grid {
    pub fn new(width: usize, height: usize, cost_matrix: Float32Array) -> Self {
        Grid {
            width,
            height,
            height_matrix: cost_matrix,
        }
    }

    pub fn get_height_at(&self, point: &Point) -> Option<f32> {
        if !self.in_bounds(&point) {
            return None;
        }
        self.height_matrix.at(self.index(point))
    }
    pub fn distance(point_a: &Point, point_b: &Point) -> usize {
        let x_expo = pow((point_a.x - point_b.x) as f64, 2f64);
        let y_expo = pow((point_a.y - point_b.y) as f64, 2f64);

        sqrt(x_expo + y_expo) as usize
    }

    pub fn index(&self, point: &Point) -> i32 {
        (point.y * self.height + point.x) as i32
    }

    pub fn in_bounds(&self, point: &Point) -> bool {
        point.x >= 0 && point.x < self.width && point.y >= 0 && point.y < self.height
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
                let index = (y * self.height + x) as i32;
                let cost = self.height_matrix.at(index);
                callback(x, y, cost);
            }
        }
    }

    pub fn find_path(start_point: Point, end_point: Point) -> Vec<Point> {
        Vec::new()
    }
}
