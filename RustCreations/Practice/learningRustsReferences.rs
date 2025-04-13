#![warn(unused_imports)]

use std::collections::HashMap;


fn setChar(pieceReference1Reference: &mut &mut char) {
    **pieceReference1Reference = 'X';
}

fn main() {
    let mut board: [[char; 3]; 3] = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
    let mut row: &mut [char; 3] = &mut board[0];
    let mut pieceReference1: &mut char = &mut row[2]; 
    let mut pieceReference2: &mut char = &mut row[1]; 
    let mut pieceReference3: &mut char = &mut row[0]; 
    let mut pieceReference1Reference: &mut &mut char = &mut pieceReference1;

    let mut rowReference: [&mut char; 3] = [pieceReference3, pieceReference2, pieceReference1];


    setChar(&mut pieceReference1Reference);

    println!("{}", board[0][2]);
}