# pathfinding.ts

`npm i pathfinding.ts`

Finders:

- [x] Jump Point - Diagonal Movement

### Grid example

Jump point: 10

```ts
const grid = Grid.from([
  [50, 55, 60, 65, 70],
  [45, 0, 0, 0, 75],
  [40, 0, 0, 0, 1], //x4y2
  [35, 0, 0, 0, 5],
  [30, 25, 20, 15, 10],
]);
```

#### PF example 1

```ts
grid.findPath(
  { x: 4, y: 2 },
  { x: 4, y: 1 },
  { finder: FinderEnum.JUMP_POINT, maxJumpCost: 10 },
);
```

```js
[
  { x: 4, y: 2 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 1 },
];
```

#### PF example 2

```ts
grid.findPath({ x: 4, y: 2 }, { x: 4, y: 1 }, { maxJumpCost: 1 });
```

```js
[];
```

#### PF example 3

```ts
grid.findPath({ x: 4, y: 2 }, { x: 4, y: 1 }, { maxJumpCost: 85 });
```

```js
[
  { x: 4, y: 2 },
  { x: 4, y: 1 },
];
```
