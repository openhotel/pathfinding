use crate::find_path_config::FindPathConfig;
use crate::grid::Grid;
use crate::open_list::{Compare, OpenList};
use crate::path_node::PathNode;
use crate::point::Point;
use std::f32;

#[derive(Debug)]
pub struct PathNodeComparator;

impl Compare<PathNode> for PathNodeComparator {
    fn compare(&self, a: &PathNode, b: &PathNode) -> f32 {
        (a.cost + a.heuristic_value) - (b.cost + b.heuristic_value)
    }
}

pub struct Finder {
    not_reached_cost: f32,
    visited: Vec<f32>,
    travel_heuristic: Vec<f32>,
    queue: OpenList<PathNode>,

    pub start_point: Point,
    pub end_point: Point,
    pub grid: Grid,
    pub config: FindPathConfig,
}

impl Finder {
    pub fn new(
        start_point: Point,
        end_point: Point,
        grid: Grid,
        config: Option<FindPathConfig>,
    ) -> Self {
        let not_reached_cost = 999999.0;

        let mut visited = vec![0.0; grid.width * grid.height];
        visited.fill(not_reached_cost);

        let mut travel_heuristic = vec![0.0; grid.width * grid.height];
        travel_heuristic.fill(not_reached_cost);

        Finder {
            not_reached_cost,
            visited,
            travel_heuristic,
            queue: OpenList::new(Box::new(PathNodeComparator)),

            start_point,
            end_point,
            grid,
            config: config.unwrap_or(FindPathConfig::new(None, None, None, None, None)),
        }
    }

    fn index(&self, point: &Point) -> usize {
        (point.y * (self.grid.height as isize) + point.x) as usize
    }

    fn get_move_cost_at(&self, src: &Point, dst: &Point) -> Option<f32> {
        if !self.grid.in_bounds(&src) || !self.grid.in_bounds(&dst) {
            return None;
        }
        let src_height = self
            .grid
            .get_height_at(&src)
            .unwrap_or(self.not_reached_cost);
        let dst_height = self
            .grid
            .get_height_at(&dst)
            .unwrap_or(self.not_reached_cost);

        println!(
            "{} {}",
            (src_height - dst_height).abs(),
            self.config.max_jump_cost
        );
        if (src_height - dst_height).abs() > self.config.max_jump_cost {
            return None;
        }

        Some(1.0)
    }

    fn heuristic(&self, point: &Point) -> f32 {
        self.travel_heuristic[self.index(&point)]
    }

    fn add_orthogonal_jumps(&mut self, prev_node: &PathNode, dir_x: isize, dir_y: isize) {
        let mut jump_distance = 1;
        let mut accumulated_cost = 0f32;
        let mut prev_point = prev_node.point.clone();

        loop {
            let target: Point = Point::new(
                prev_node.point.x + dir_x * jump_distance,
                prev_node.point.y + dir_y * jump_distance,
            );
            if !self.grid.is_walkable(&target) {
                return;
            }
            let move_cost = match self.get_move_cost_at(&prev_point, &target) {
                Some(cost) => cost,
                None => return,
            };

            accumulated_cost += move_cost * self.config.orthogonal_cost_multiplier;
            let target_index = self.index(&target);
            let total_cost = prev_node.cost + accumulated_cost;

            if total_cost < self.visited[target_index] {
                self.visited[target_index] = total_cost;
                self.queue.push(PathNode::new(
                    self.start_point.clone(),
                    None,
                    0f32,
                    self.heuristic(&target),
                ))
            }
            prev_point = target;
            jump_distance = jump_distance + 1;

            if accumulated_cost > self.config.max_jump_cost {
                return;
            }
        }
    }

    fn add_diagonal(&mut self, prev_node: &PathNode, dir_x: isize, dir_y: isize) {
        let target: Point = Point {
            x: prev_node.point.x + dir_x,
            y: prev_node.point.y + dir_y,
        };
        let move_cost = prev_node.cost
            + (self
                .get_move_cost_at(&prev_node.point, &target)
                .unwrap_or(self.not_reached_cost)) as f32
                * self.config.diagonal_cost_multiplier;
        let target_height = self.grid.get_height_at(&target);
        let aux1: Point = Point {
            x: prev_node.point.x,
            y: prev_node.point.y + dir_y,
        };
        let aux2: Point = Point {
            x: prev_node.point.x + dir_x,
            y: prev_node.point.y,
        };
        let target_index = self.index(&target);

        let can_jump_diagonals = self.config.jump_blocked_diagonals
            || (self.grid.is_walkable(&aux1)
                && self.grid.is_walkable(&aux2)
                && target_height == self.grid.get_height_at(&aux1)
                && target_height == self.grid.get_height_at(&aux2));

        if self.grid.is_walkable(&target)
            && can_jump_diagonals
            && move_cost < self.visited[target_index]
        {
            self.visited[target_index] = move_cost;
            self.queue.push(PathNode::new(
                target.clone(),
                Some(Box::new(prev_node.clone())),
                move_cost,
                self.heuristic(&target),
            ))
        }
    }

    fn get_path_from_node(&self, last_node: PathNode) -> Vec<Point> {
        let mut path: Vec<Point> = Vec::new();
        let mut node: Option<Box<PathNode>> = Some(Box::new(last_node));
        loop {
            match node {
                None => {
                    break;
                }
                Some(current_node) => {
                    path.push(current_node.point);
                    node = current_node.from
                }
            }
        }

        path.reverse();
        path
    }

    pub fn find(&mut self) -> Vec<Point> {
        let empty = Vec::new();

        if !self.grid.is_walkable(&self.start_point) || !self.grid.is_walkable(&self.end_point) {
            return empty;
        }

        self.grid.walk_matrix(|x, y, _cost| {
            self.travel_heuristic[y * self.grid.height + x] = self
                .grid
                .distance(&Point::new(x as isize, y as isize), &self.end_point);
        });

        let start_index = self.index(&self.start_point.clone());
        self.visited[start_index] = 0f32;
        self.queue.push(PathNode::new(
            self.start_point.clone(),
            None,
            0f32,
            self.heuristic(&self.start_point),
        ));

        let mut iterations = 0;

        loop {
            if self.queue.is_empty() {
                return empty;
            }
            if iterations > self.config.max_iterations {
                return empty;
            }
            iterations += 1;
            let node = self.queue.pop().unwrap();

            if node.point.x == self.end_point.x && node.point.y == self.end_point.y {
                return self.get_path_from_node(node);
            }

            self.add_orthogonal_jumps(&node, 0, -1);
            self.add_orthogonal_jumps(&node, 0, 1);
            self.add_orthogonal_jumps(&node, -1, 0);
            self.add_orthogonal_jumps(&node, 1, 0);

            self.add_diagonal(&node, 1, 1);
            self.add_diagonal(&node, -1, 1);
            self.add_diagonal(&node, 1, -1);
            self.add_diagonal(&node, -1, -1);
        }
    }
}
