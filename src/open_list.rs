use std::cmp::Ordering;
use std::fmt::Debug;

#[derive(Debug)]
pub struct ListNode<Value> {
	pub value: Value,
	pub next: Option<Box<ListNode<Value>>>
}

#[allow(dead_code)]
impl<Value> ListNode<Value> {
	fn new(value: Value, next: Option<Box<ListNode<Value>>>) -> Self {
		ListNode { value, next }
	}
}

pub trait Compare<Value>: Debug {
	fn compare(&self, a: &Value, b: &Value) -> Ordering;
}

#[derive(Debug)]
pub struct OpenList<Value> {
	start: Option<Box<ListNode<Value>>>,
	size: usize,
	comparator: Box<dyn Compare<Value>>
}
#[allow(dead_code)]
impl<Value> OpenList<Value> {
	pub fn new(comparator: Box<dyn Compare<Value>>) -> Self {
		OpenList {
			start: None,
			size: 0,
			comparator,
		}
	}
	pub fn push(&mut self, value: Value) {
		if self.start.is_none() {
			self.start = Some(Box::new(ListNode { value, next: None }));
			self.size += 1;
			return;
		}

		let start = self.start.take().unwrap();
		if self.comparator.compare(&value, &start.value) == Ordering::Less {
			self.start = Some(Box::new(ListNode {
				value,
				next: Some(start),
			}));
			self.size += 1;
			return;
		}

		let mut current = Some(start);
		let mut prev = &mut self.start;

		while let Some(mut node) = current.take() {
			if let Some(next_node) = &node.next {
				if self.comparator.compare(&value, &next_node.value) != Ordering::Greater {
					node.next = Some(Box::new(ListNode {
						value,
						next: node.next.take(),
					}));
					*prev = Some(node);
					self.size += 1;
					return;
				}
			}

			current = node.next.take();
			*prev = Some(node);
			prev = &mut prev.as_mut().unwrap().next;
		}

		*prev = Some(Box::new(ListNode { value, next: None }));
		self.size += 1;
	}

	pub fn pop (&mut self) -> Result<Value, String> {
		match self.start.take() {
			None => Err("popping from an empty list".to_string()),
			Some(mut popped) => {
				self.start = popped.next.take();
				self.size -= 1;
				Ok(popped.value)
			}
		}
	}

	pub fn length(&self) -> usize {
		self.size
	}

	pub fn is_empty(&self) -> bool {
		self.start.is_none()
	}
}

#[cfg(test)]
mod tests {
	use super::*;

	#[derive(Debug)]
	struct IntComparator;

	impl Compare<i32> for IntComparator {
		fn compare(&self, a: &i32, b: &i32) -> Ordering {
			a.cmp(b)
		}
	}

	#[test]
	fn test_open_list() {
		let comparator = Box::new(IntComparator);
		let mut list = OpenList::new(comparator);

		assert!(list.is_empty());
		assert_eq!(list.length(), 0);

		list.push(3);
		list.push(1);
		list.push(4);

		assert!(!list.is_empty());
		assert_eq!(list.length(), 3);

		assert_eq!(list.pop(), Ok(1));
		assert_eq!(list.pop(), Ok(3));
		assert_eq!(list.pop(), Ok(4));
		assert!(list.pop().is_err());
	}
}