import { smallGrid, testCasesSmallGrid } from "./test-data/small-grid.ts";
import { testCasesBigGrid } from "./test-data/big-grid.ts";
import {FinderEnum, Grid} from "../mod.ts";

import { assertEquals } from "std/assert/assert_equals.ts";
import { describe, it } from "std/testing/bdd.ts";
import { assertThrows } from "std/testing/asserts.ts";

describe("Diagonal Jump Point", () => {
  const testCases = [...testCasesSmallGrid, ...testCasesBigGrid];

  testCases.forEach(
    ({ startPoint, endPoint, maxJumpCost, path: expectedPath, grid }) => {
      it(`validates pathfinding from {${Object.values(startPoint)}} to {${Object.values(endPoint)}} with jumpCost {${maxJumpCost}}`, () => {
        const testGrid = Grid.from(grid);
        const path = testGrid.findPath(startPoint, endPoint, {finder: FinderEnum.JUMP_POINT, maxJumpCost});
        // drawLayout(grid, path)
        assertEquals(JSON.stringify(path), JSON.stringify(expectedPath));
      });
    },
  );

  it("throws an error if start point does no exist", () => {
    const grid = Grid.from(smallGrid);
    const find = () => grid.findPath({ x: 999, y: 999 }, { x: 4, y: 1 }, {finder: FinderEnum.JUMP_POINT});

    assertThrows(find, Error, "startNode does not exist in the grid");
  });

  it("throws an error if end point does no exist", () => {
    const grid = Grid.from(smallGrid);
    const find = () => grid.findPath({ x: 4, y: 1 }, { x: 999, y: 999 }, {finder: FinderEnum.JUMP_POINT});

    assertThrows(find, Error, "endNode does not exist in the grid");
  });

  it("throws an error if grid is empty", () => {
    const createEmptyGrid = () => Grid.from([]);
    assertThrows(createEmptyGrid, Error, "grid matrix cannot be empty");
  });
});
