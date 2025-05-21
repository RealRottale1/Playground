use std::collections::HashMap;
use std::collections::VecDeque;

fn subsitutionCypher(text: &str) -> () {
    let mut totalCharacters: usize = 0;
    let mut occurrenceMap: HashMap<char, usize> = HashMap::new();
    let letters: Vec<char> = text.to_uppercase().chars().collect();
    for character in letters {
        if character.is_alphabetic() {
            if let Some(entry) = occurrenceMap.get_mut(&character) {
                *entry += 1;
            } else {
                occurrenceMap.insert(character, 1);
            }
            totalCharacters += 1;
        }
    }
    let mut frequencyVecDeque: VecDeque<(usize, Vec<char>)> = VecDeque::new();
    for (key, value) in occurrenceMap {
        let frequency: usize =
            (((value as f32) / (totalCharacters as f32)) * 100000.0).round() as usize;
        let mut enteredData: bool = false;
        let fVecDeqLength: usize = frequencyVecDeque.len();
        for i in 0..fVecDeqLength {
          if frequencyVecDeque[i].0 > frequency {
              frequencyVecDeque.insert(i, (frequency, vec![key]));
            enteredData = true;
              break;
          } else if frequencyVecDeque[i].0 == frequency {
              frequencyVecDeque[i].1.push(key);
            enteredData = true;
              break;
          }
        }
      if !enteredData {
        frequencyVecDeque.push_back((frequency, vec![key]));
      }
    }
    for frequencyData in frequencyVecDeque {
      let trueFrequency: f32 = (frequencyData.0 as f32) * 0.001;
        print!("Frequency Precent: {:.2}%, Chars: ", trueFrequency);
        for char in frequencyData.1 {
            print!("{}, ", char);
        }
        println!("");
    }
}

fn main() -> () {
    let mut unreadableText: String = String::new();
    println!("Enter unreadable text:");
    std::io::stdin()
        .read_line(&mut unreadableText)
        .expect("Unable to read line!");
    println!("");
  subsitutionCypher(unreadableText.trim());
}
