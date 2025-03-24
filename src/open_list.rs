use std::cmp::Ordering;
use std::fmt::Debug;

#[derive(Debug)]
pub struct ListNode<Value> {
    pub value: Value,
    pub next: Option<Box<ListNode<Value>>>,
}

#[allow(dead_code)]
impl<Value> ListNode<Value> {
    fn new(value: Value, next: Option<Box<ListNode<Value>>>) -> Self {
        ListNode { value, next }
    }

    fn set_next(&mut self, next: Option<Box<ListNode<Value>>>) {
        self.next = next;
    }
}

pub trait Compare<Value>: Debug {
    fn compare(&self, a: &Value, b: &Value) -> f32;
}

#[derive(Debug)]
pub struct OpenList<Value> {
    start: Option<Box<ListNode<Value>>>,
    size: usize,
    comparator: Box<dyn Compare<Value>>,
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
            self.start = Some(Box::new(ListNode::new(value, None)));
            self.size += 1;
            return;
        }
        // Compare with the first element
        if self.comparator(&value, &self.start.as_ref().unwrap().value) < 0 {
            let old_start = self.start.take();
            self.start = Some(Box::new(ListNode::new(value, old_start)));
            self.size += 1;
            return;
        }

        // Traverse to find insertion point
        let mut current = &mut self.start;
        while let Some(node) = current {
            if node.next.is_none() {
                // Insert at the end
                node.next = Some(Box::new(ListNode::new(value, None)));
                self.size += 1;
                return;
            }
            // Compare with next node's value
            if self.comparator(&value, &node.next.as_ref().unwrap().value) < 0 {
                // Insert after current node
                let next = node.next.take();
                node.next = Some(Box::new(ListNode::new(value, next)));
                self.size += 1;
                return;
            }
            current = &mut node.next;
        }
    }

    pub fn pop(&mut self) -> Result<Value, String> {
        match self.start.take() {
            None => Err("popping from an empty list".to_string()),
            Some(popped) => {
                self.start = popped.next;
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
