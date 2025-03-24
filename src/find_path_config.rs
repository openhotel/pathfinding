#[derive(Debug, Clone, Default)]
pub struct FindPathConfig {
    pub diagonal_cost_multiplier: f32,
    pub orthogonal_cost_multiplier: i32,
    pub max_jump_cost: u32,
    pub max_iterations: u32,
    pub jump_blocked_diagonals: bool,
}

impl FindPathConfig {
    pub fn new(
        diagonal_cost_multiplier: Option<f32>,
        orthogonal_cost_multiplier: Option<i32>,
        max_jump_cost: Option<u32>,
        max_iterations: Option<u32>,
        jump_blocked_diagonals: Option<bool>,
    ) -> Self {
        FindPathConfig {
            diagonal_cost_multiplier: diagonal_cost_multiplier.unwrap_or(1.0),
            orthogonal_cost_multiplier: orthogonal_cost_multiplier.unwrap_or(1),
            max_jump_cost: max_jump_cost.unwrap_or(5),
            max_iterations: max_iterations.unwrap_or(99999),
            jump_blocked_diagonals: jump_blocked_diagonals.unwrap_or(false),
        }
    }
}
