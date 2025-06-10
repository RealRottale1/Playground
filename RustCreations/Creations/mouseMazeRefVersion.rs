/*
   No external packages needed =)
*/

use std::collections::VecDeque;

#[derive(Clone, Copy)]
struct Tile {
  isWall: bool,
  y: usize,
  x: usize,
  f: usize,
  g: usize,
  h: usize,
  parent: Option<*mut Tile>,
}

fn handleSimulation() -> () {
  let mut maze: [[char; 10]; 10] = [
    ['#','#','#','#','#','#','#','#','#','#'],
    ['#','M','#',' ',' ',' ',' ',' ',' ','#'],
    ['#',' ','#',' ',' ',' ',' ',' ',' ','#'],
    ['#',' ','#',' ',' ',' ',' ',' ',' ','#'],
    ['#',' ','#','#',' ','#',' ',' ',' ','#'],
    ['#',' ',' ',' ',' ','#',' ',' ',' ','#'],
    ['#',' ','#','#','#','#',' ',' ',' ','#'],
    ['#',' ','#',' ',' ','#',' ',' ',' ','#'],
    ['#',' ',' ',' ',' ','#',' ',' ','C','#'],
    ['#','#','#','#','#','#','#','#','#','#'],
  ];

  fn findCharPosition(findChar: char, maze: &[[char; 10]; 10]) -> Option<[usize; 2]> {
    for y in 0..10 {
      for x in 0..10 {
        if maze[y][x] == findChar {
          return Some([y, x]);
        }
      }
    }
    return None;
  }

  fn makeTiledMaze(maze: &[[char; 10]; 10]) -> [[Tile; 10]; 10] {
    let mut tiledMaze: [[Tile; 10]; 10] = [[Tile {isWall: false, y: 0, x: 0, f: 0, g: 0, h: 0, parent: None}; 10]; 10];
    for y in 0..10 {
      for x in 0..10 {
        tiledMaze[y][x].isWall = maze[y][x] == '#';
        tiledMaze[y][x].y = y;
        tiledMaze[y][x].x = x;
      }
    }
    return tiledMaze;
  }

  fn getNeighbors(sY: isize, sX: isize, tiledMaze: &mut [[Tile; 10]; 10]) -> Vec<*mut Tile> {
    let mut allNeighbors: Vec<*mut Tile> = Vec::new();
    let differences: [[isize; 2]; 8] = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
    for i in 0..8 {
      let newY: isize = sY + differences[i][0];
      let newX: isize = sX + differences[i][1];
      if newY > -1 && newY < 10 && newX > -1 && newX < 10 {
        unsafe {
          let neighboringTile: *mut Tile = &mut tiledMaze[newY as usize][newX as usize];
          if !(*neighboringTile).isWall {
            allNeighbors.push(neighboringTile);
          }
        }
      }
    }
    return allNeighbors;
  }

  fn includesNeighbor(theSet: &Vec<*mut Tile>, neighbor: *mut Tile) -> bool {
    let openSetLen: usize = theSet.len();
    for i in 0.. openSetLen {
      unsafe {
        let tempTile: *mut Tile = theSet[i];
        if (*tempTile).y == (*neighbor).y && (*tempTile).x == (*neighbor).x {
          return true;
        }
      }
    }
    return false;
  }
  
  fn findPath(sY: usize, sX: usize, eY: usize, eX: usize, maze: &[[char; 10]; 10]) -> Option<VecDeque<[usize; 2]>> {
    let mut tiledMaze: [[Tile; 10]; 10] = makeTiledMaze(&maze);

    let mut startPoint: *mut Tile = &mut tiledMaze[sY][sX];
    let mut endPoint: *mut Tile = &mut tiledMaze[eY][eX];

    let mut path: VecDeque<[usize; 2]> = VecDeque::new();
    let mut openSet: Vec<*mut Tile> = vec![startPoint];
    let mut closedSet: Vec<*mut Tile> = Vec::new();

    while !openSet.is_empty() {
      let mut lowestIndex: usize = 0;
      let openSetLen: usize = openSet.len();
      for i in 0..openSetLen {
        unsafe {
          let iPointer: *mut Tile = openSet[i];
          let lPointer: *mut Tile = openSet[lowestIndex];
          if (*iPointer).f < (*lPointer).f {
            lowestIndex = i;
          }
        }
      }

      unsafe {
        let currentPoint: *mut Tile = openSet[lowestIndex];
        if (*currentPoint).y == (*endPoint).y && (*currentPoint).x == (*endPoint).x {
          let mut tempTile: *mut Tile = currentPoint;
          path.push_front([(*tempTile).y, (*tempTile).x]);
          while (*tempTile).parent.is_some() {
            let parentTile: *mut Tile = (*tempTile).parent.unwrap();
            path.push_front([(*parentTile).y, (*parentTile).x]);
            tempTile = parentTile;
          }
          return Some(path);
        }

        openSet.remove(lowestIndex);
        closedSet.push(currentPoint);

        let neighbors: Vec<*mut Tile> = getNeighbors((*currentPoint).y as isize, (*currentPoint).x as isize, &mut tiledMaze);
        for neighbor in neighbors {
          if !includesNeighbor(&closedSet, neighbor) {
            let possibleG: usize = (*currentPoint).g + 1;

            if !includesNeighbor(&openSet, neighbor) {
              openSet.push(neighbor);
            } else if possibleG >= (*neighbor).g {
              continue;
            }
            (*neighbor).g = possibleG;
            (*neighbor).h = (*neighbor).y.abs_diff(eY) + (*neighbor).x.abs_diff(eX);
            (*neighbor).f = (*neighbor).g + (*neighbor).h;
            (*neighbor).parent = Some(currentPoint);
         } 
        }
      }
    }
    return None;
  }

  if let startPoint = findCharPosition('M', &maze) {
    if let endPoint = findCharPosition('C', &maze) {
      let uStartPoint: [usize; 2] = startPoint.unwrap();
      let uEndPoint: [usize; 2] = endPoint.unwrap();
      
      let pathRoute: Option<VecDeque<[usize; 2]>> = findPath(uStartPoint[0], uStartPoint[1], uEndPoint[0], uEndPoint[1], &maze);
      if pathRoute.is_some() {
        let uPathRoute: VecDeque<[usize; 2]> = pathRoute.unwrap();
        maze[uStartPoint[0]][uStartPoint[1]] = ' ';
        let uPathRouteLen: usize = uPathRoute.len();
        for i in 0..uPathRouteLen {
          for y in 0..10 {
            for x in 0..10 {
              if y == uPathRoute[i][0] && x == uPathRoute[i][1] {
                print!("M");
              } else {
                print!("{}", maze[y][x]);
              }
            }
            println!("");
          }
          println!("Step {}\n", i+1);
        }
      } else {
        println!("The mouse was unable to reach the cheese!");
      }
      return;
    }
  }
  println!("Invalid maze setup!");
}

fn main() -> () {
  handleSimulation();
}