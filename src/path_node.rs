use crate::point::Point;

#[derive(Clone)]
pub struct PathNode {
    pub point: Point,
    pub from: Option<Box<PathNode>>,
    pub cost: f32,
    pub heuristic_value: f32,
}

impl PathNode {
    pub fn new(point: Point, from: Option<Box<PathNode>>, cost: f32, heuristic_value: f32) -> Self {
        PathNode {
            point,
            from,
            cost,
            heuristic_value,
        }
    }
}
