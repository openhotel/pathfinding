use crate::point::Point;

pub struct PathNode {
    pub point: Point,
    pub from: Option<Box<PathNode>>,
    pub cost: usize,
    pub heuristic_value: f32,
}

impl PathNode {
    pub fn new(
        point: Point,
        from: Option<Box<PathNode>>,
        cost: usize,
        heuristic_value: f32,
    ) -> Self {
        PathNode {
            point,
            from,
            cost,
            heuristic_value,
        }
    }
}

impl Clone for PathNode {
    fn clone(&self) -> Self {
        Self {
            point: self.point.clone(),
            from: self.from.clone(),
            cost: self.cost,
            heuristic_value: self.heuristic_value,
        }
    }
}
