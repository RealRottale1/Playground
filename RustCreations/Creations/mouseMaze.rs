/*
   No external packages needed =)
*/

use std::collections::VecDeque;
/*
0 - Y
1 - X
2 - Parent Y
3 - Parent X
4 - Is Wall
5 - F
6 - G
7 - H
*/

fn handleSimulation() -> () {
  fn getPositionInMaze(findChar: char, maze: &[[char; 10]; 10]) -> Option<[usize; 2]> {
    for y in 0..10 {
      for x in 0..10 {
        if maze[y][x] == findChar {
          return Some([y, x]);
        }
      }
    }
    return None;
  }

  fn makeTiledMaze(maze: &[[char; 10]; 10]) -> [[[usize; 8]; 10]; 10] {
    let mut outerTempVec: Vec<[[usize; 8]; 10]> = Vec::new();
    for y in 0..10 {
      let mut innerTempVec: Vec<[usize; 8]> = Vec::new();
      for x in 0..10 {
        let mut point: [usize; 8] = [y, x, 11, 11, if maze[y][x] == '#' {1} else {0}, 0, 0, 0];
        innerTempVec.push(point);
      }
      let mut initialArray: [[usize; 8]; 10] = [
        innerTempVec[0],
        innerTempVec[1],
        innerTempVec[2],
        innerTempVec[3],
        innerTempVec[4],
        innerTempVec[5],
        innerTempVec[6],
        innerTempVec[7],
        innerTempVec[8],
        innerTempVec[9],
      ];
      outerTempVec.push(initialArray);
    }
    let mut finalArray: [[[usize; 8]; 10]; 10] = [
      outerTempVec[0],
      outerTempVec[1],
      outerTempVec[2],
      outerTempVec[3],
      outerTempVec[4],
      outerTempVec[5],
      outerTempVec[6],
      outerTempVec[7],
      outerTempVec[8],
      outerTempVec[9],
    ];
    return finalArray;
  }

  fn getNeighbors(sY: usize, sX: usize, tiledMaze: &[[[usize; 8]; 10]; 10]) -> Vec<[usize; 2]> {
    let mut allNeighbors: Vec<[usize; 2]> = Vec::new();
    let differences: [[isize; 2]; 4] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for i in 0..4 {
      let newY: isize = sY as isize + differences[i][0];
      let newX: isize = sX as isize + differences[i][1];
      if newY > -1 && newY < 10 && newX > -1 && newX < 10 {
        if tiledMaze[newY as usize][newX as usize][4] == 0 {
          allNeighbors.push([newY as usize, newX as usize]);
        }
      }
    }
    return allNeighbors;
  }

  fn includesNeighbor(theSet: &Vec<[usize; 2]>, neighborPosition: [usize; 2]) -> bool {
    let theSetLen: usize = theSet.len();
    for i in 0..theSetLen {
      if theSet[i][0] == neighborPosition[0] && theSet[i][1] == neighborPosition[1] {
        return true;
      }
    }
    return false;
  }
  
  fn findPath(sY: usize, sX: usize, eY: usize, eX: usize, maze: &[[char; 10]; 10]) -> Option<VecDeque<[usize; 2]>> {
    let mut tiledMaze: [[[usize; 8]; 10]; 10] = makeTiledMaze(&maze);
    
    let mut path: VecDeque<[usize; 2]> = VecDeque::new();
    let mut openSet: Vec<[usize; 2]> = vec![[sY, sX]];
    let mut closedSet: Vec<[usize; 2]> = Vec::new();

    while !openSet.is_empty() {
      let mut lowestIndex: usize = 0;
      let openSetLen: usize = openSet.len();
      for i in 0..openSetLen {
        if tiledMaze[openSet[i][0]][openSet[i][1]][5] < tiledMaze[openSet[lowestIndex][0]][openSet[lowestIndex][1]][5] {
          lowestIndex = i;
        }
      }

      let currentPoint: [usize; 2] = openSet[lowestIndex];
      if currentPoint[0] == eY && currentPoint[1] == eX {
        let mut tempPoint: [usize; 2] = currentPoint;
        path.push_front(tempPoint);
        loop {
          if tiledMaze[tempPoint[0]][tempPoint[1]][2] == 11 {
            return Some(path);
          }
          path.push_front([tiledMaze[tempPoint[0]][tempPoint[1]][2], tiledMaze[tempPoint[0]][tempPoint[1]][3]]);
          tempPoint = [tiledMaze[tempPoint[0]][tempPoint[1]][2], tiledMaze[tempPoint[0]][tempPoint[1]][3]];
        }
      }

      openSet.remove(lowestIndex);
      closedSet.push(currentPoint);

      let ValidNeighborPositions: Vec<[usize; 2]> = getNeighbors(currentPoint[0], currentPoint[1], &tiledMaze); 
      for neighborPosition in ValidNeighborPositions {
        let notInClosedSet: bool = !includesNeighbor(&closedSet, neighborPosition);
        if notInClosedSet {
          let possibleG: usize = tiledMaze[currentPoint[0]][currentPoint[1]][6] + 1;

          let notInOpenSet: bool = !includesNeighbor(&openSet, neighborPosition);
          if notInOpenSet {
            openSet.push(neighborPosition);
          } else if possibleG >= tiledMaze[neighborPosition[0]][neighborPosition[1]][6] {
            continue;
          }

          tiledMaze[neighborPosition[0]][neighborPosition[1]][6] = possibleG;
          tiledMaze[neighborPosition[0]][neighborPosition[1]][7] = neighborPosition[0].abs_diff(eY) + neighborPosition[1].abs_diff(eX);
          tiledMaze[neighborPosition[0]][neighborPosition[1]][5] = possibleG + tiledMaze[neighborPosition[0]][neighborPosition[1]][7];
          tiledMaze[neighborPosition[0]][neighborPosition[1]][2] = currentPoint[0];
          tiledMaze[neighborPosition[0]][neighborPosition[1]][3] = currentPoint[1];
        }
      }
    }
    
    return None;
  }
  
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

  let startPosition: Option<[usize; 2]> = getPositionInMaze('M', &maze);
  let endPosition: Option<[usize; 2]> = getPositionInMaze('C', &maze);
  if let Some(sPos) = startPosition {
    if let Some(ePos) = endPosition {
      let somePathRoute: Option<VecDeque<[usize; 2]>> = findPath(sPos[0], sPos[1], ePos[0], ePos[1], &maze);
      if let Some(pathRoute) = somePathRoute {
        maze[sPos[0]][sPos[1]] = ' ';

        let pathRouteLen: usize = pathRoute.len();
        for i in 0..pathRouteLen {
          for y in 0..10 {
            for x in 0..10 {
              if y == pathRoute[i][0] && x == pathRoute[i][1] {
                print!("M");
              } else {
                print!("{}", maze[y][x]);
              }
            }
            println!("");
          }
          println!("Step {}\n", i+1);
        }
        println!("The mouse was able to reach the cheese in {} move{}!", pathRouteLen, if pathRouteLen == 1 {""} else {"s"});
        return;
      }
    }
  }
  println!("The mouse was unable to reach the cheese!");
}

fn main() -> () {
  handleSimulation()
}