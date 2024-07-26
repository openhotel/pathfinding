import { OpenList } from "../src/objects/openList.ts";

import { assertEquals } from "std/assert/assert_equals.ts";
import { describe, it, beforeEach } from "std/testing/bdd.ts";
import { assertThrows } from "std/testing/asserts.ts";

describe("OpenList", () => {
  let list: OpenList<number>;

  beforeEach(() => {
    list = new OpenList<number>((a, b) => a - b);
  });

  it("inserts one", () => {
    list.push(1);
    assertEquals(list.pop(), 1);
  });

  it("is empty", () => {
    assertEquals(list.isEmpty(), true);
  });

  it("is not empty", () => {
    list.push(1);
    assertEquals(list.isEmpty(), false);
  });

  it("removes lowest value", () => {
    list.push(3);
    list.push(5);
    list.push(1);
    assertEquals(list.pop(), 1);
    assertEquals(list.pop(), 3);
    assertEquals(list.pop(), 5);
  });

  it("errors when popping from empty list", () => {
    assertThrows(() => list.pop(), Error, "popping from an empty list");
  });
});
