use std::collections::VecDeque;

#[derive(Copy, Clone, Debug)]
struct Tile {
  isWall: bool,
  y: usize,
  x: usize,
  f: usize,
  g: usize,
  h: usize,
  parent: Option<[usize; 2]>,
}

fn handleSimulation() -> () {

  fn getPositionOfChar(findChar: char, maze: &[[char; 10]; 10]) -> [Option<usize>; 2] {
    for y in 0..10 {
      for x in 0..10 {
        if maze[y][x] == findChar {
          return [Some(y), Some(x)];
        }
      }
    }
    return [None, None];
  }

  fn findPath(sY: usize, sX: usize, eY: usize, eX: usize, maze: &[[char; 10]; 10]) -> Option<VecDeque<[usize; 2]>> {

    fn makeTiledMaze(maze: &[[char; 10]; 10]) -> [[Option<Tile>; 10]; 10] {
      let mut tiledMaze: [[Option<Tile>; 10]; 10] = [[None; 10]; 10];
      for y in 0..10 {
        for x in 0..10 {
          tiledMaze[y][x] = Some(Tile {
            isWall: maze[y][x] == '#',
            x: x,
            y: y,
            f: 0,
            g: 0,
            h: 0,
            parent: None,
          });
        }
      }
      return tiledMaze;
    }

    fn getNeighbors(y: usize, x: usize, tiledMaze: &[[Option<Tile>; 10]; 10]) -> Vec<[usize; 2]> {
      let mut neighbors: Vec<[usize; 2]> = Vec::new();
      let directions: [[isize; 2]; 8] = [[1, 0], [1, -1], [1, -1], [0, -1], [-1, 0], [-1, 1], [-1, 1], [0, 1]];
      for i in 0..8 {
        let newY: isize = y as isize + directions[i][0];
        let newX: isize = x as isize + directions[i][1];
        if newX > -1 && newX < 10 && newY > -1 && newY < 10 {
          let tile: &Option<Tile> = &tiledMaze[newY as usize][newX as usize];
          if tile.is_some() {
            if !tile.unwrap().isWall {
              neighbors.push([tile.unwrap().y, tile.unwrap().x]);
            }
          }
        } 
      }
      return neighbors;
    }

    fn includesNeighbors(tiles: &Vec<[usize; 2]>, y: usize, x: usize) -> bool {
      let tilesLen: usize = tiles.len();
      for i in 0..tilesLen {
        if tiles[i][0] == y && tiles[i][1] == x {
          return true;
        }
      }
      return false;
    }
    
    let mut tiledMaze: [[Option<Tile>; 10]; 10] = makeTiledMaze(&maze);

    let mut path: VecDeque<[usize; 2]> = VecDeque::new();
    let mut openSet: Vec<[usize; 2]> = vec![[sY, sX]];
    let mut closedSet: Vec<[usize; 2]> = Vec::new();

    while !openSet.is_empty() {
      let mut lowestIndex: usize = 0;
      let openSetSize: usize = openSet.len();
      for i in 0..openSetSize {
        if tiledMaze[openSet[i][0]][openSet[i][1]].unwrap().f < tiledMaze[openSet[lowestIndex][0]][openSet[lowestIndex][1]].unwrap().f {
            lowestIndex = i;
        }
      }

      let currentPosition: [usize; 2] = openSet[lowestIndex];
      if tiledMaze[currentPosition[0]][currentPosition[1]].unwrap().y == tiledMaze[eY][eX].unwrap().y && tiledMaze[currentPosition[0]][currentPosition[1]].unwrap().x == tiledMaze[eY][eX].unwrap().x {
        let mut tempTile: [usize; 2] = [currentPosition[0], currentPosition[1]];
        path.push_front([currentPosition[0], currentPosition[1]]);
        while tiledMaze[tempTile[0]][tempTile[1]].unwrap().parent.is_some() {
          path.push_front([tiledMaze[tempTile[0]][tempTile[1]].unwrap().parent.unwrap()[0], tiledMaze[tempTile[0]][tempTile[1]].unwrap().parent.unwrap()[1]]);
          tempTile = [tiledMaze[tempTile[0]][tempTile[1]].unwrap().parent.unwrap()[0], tiledMaze[tempTile[0]][tempTile[1]].unwrap().parent.unwrap()[1]];
        }
        return Some(path);
      }

      openSet.remove(lowestIndex);
      closedSet.push([currentPosition[0], currentPosition[1]]);

      let mut neighbors: Vec<[usize; 2]> = getNeighbors(currentPosition[0], currentPosition[1], &tiledMaze);

      for [y, x] in neighbors {
        let check1: bool = !includesNeighbors(&closedSet, y, x);
        if check1 {
          let possibleG = tiledMaze[currentPosition[0]][currentPosition[1]].unwrap().g + 1;
          let check2: bool = !includesNeighbors(&openSet, y, x);
          if check2 {
            openSet.push([y, x]);
          } else if possibleG >= tiledMaze[y][x].unwrap().g {
            continue;
          }

          if let Some(tile) = &mut tiledMaze[y][x] {
              tile.g = possibleG;
              tile.h = eX.abs_diff(x) + eY.abs_diff(y);
              tile.f = tile.g + tile.h;
              tile.parent = Some([currentPosition[0], currentPosition[1]]);
          }
        }
      }
    }
    return None;
  }
  
  let mut maze: [[char; 10]; 10] = [
    ['#','#','#','#','#','#','#','#','#','#'],
    ['#','M','#',' ','#',' ',' ',' ',' ','#'],
    ['#',' ','#',' ',' ',' ','#','#',' ','#'],
    ['#',' ','#',' ','#',' ',' ','#',' ','#'],
    ['#',' ','#',' ','#','#','#','#',' ','#'],
    ['#',' ','#',' ',' ',' ','#',' ',' ','#'],
    ['#',' ','#',' ','#',' ','#',' ','#','#'],
    ['#',' ','#',' ','#',' ','#',' ',' ','#'],
    ['#',' ',' ',' ','#','#','#',' ','C','#'],
    ['#','#','#','#','#','#','#','#','#','#'],
  ];

  let [startY, startX]: [Option<usize>; 2] = getPositionOfChar('M', &maze);
  let [endY, endX]: [Option<usize>; 2] = getPositionOfChar('C', &maze);

  if startY.is_none() || endY.is_none() {
    println!("Unable to do path finding as start/end is undefined!");
    return;
  }

  let pathRoute: Option<VecDeque<[usize; 2]>> = findPath(startY.unwrap(), startX.unwrap(), endY.unwrap(), endX.unwrap(), &maze);

  if pathRoute.is_none() {
    println!("The mouse was unable to get to the cheese!");
    return;
  }

  let uPathRoute: VecDeque<[usize; 2]> = pathRoute.unwrap();

  maze[startY.unwrap()][startX.unwrap()] = '#';
  let pathRouteLen: usize = uPathRoute.len();
  println!("LENGTH: {}", pathRouteLen);
  for i in 0..pathRouteLen {
    for y in 0..10 {
      for x in 0..10 {
        if y == uPathRoute[i][1] && x == uPathRoute[i][0] {
          print!("M");
        } else {
          print!("{}", maze[y][x]);
        }
      }
      println!("");
    }
    println!("Step #{}\n",i+1)
  }
}

fn main() -> () {
  handleSimulation();
}