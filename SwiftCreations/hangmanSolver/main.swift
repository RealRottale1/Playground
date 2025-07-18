import Foundation

struct WordData : Hashable {
    var word: [Character]
    var letters: Set<Character>
}

func loadDictionary(wordSizes: Set<Int>) -> Set<WordData> {
    var allWords: Set<WordData> = [];
    do {
        var rawData: String = "";
        rawData = try String(contentsOfFile: "allWords.txt", encoding: .utf8);
        for word in rawData.split(separator: "\n") {
            if wordSizes.contains(word.count) {
                let arrayWord: [Character] = Array(word);
                let data: WordData = WordData(
                    word: arrayWord,
                    letters: Set(arrayWord)
                    );
                allWords.insert(data);
            }
        }
    } catch {
        print("Unable to load dictionary!");
    }
    return allWords;
}

func updateGuessWords(pastGuessWords: [[Character]]?) -> [[Character]] {
    repeat {
        print("Input the current board where [_] indicates an unknown and [ ] indicates a space");
        if let userInput = readLine() {
            let guessWords: [[Character]] = userInput.split(separator: " ").map({Array($0)});
            if let pastGuessWords = pastGuessWords {
                if guessWords.count != pastGuessWords.count {continue};
                var notSame: Bool = false;
                for i in 0..<pastGuessWords.count {
                    if guessWords[i].count != pastGuessWords[i].count {
                        notSame = true;
                        break;
                    }
                }
                if notSame {
                    continue;
                }
            }
            return guessWords;
        }
    } while true;
    return [[]];
}

var guessWords: [[Character]] = updateGuessWords(pastGuessWords: nil);
var dictionary: Set<WordData> = loadDictionary(wordSizes: Set(Array(guessWords.map({$0.count}))));

func getPercentUsage(usedChars: Set<Character>) -> Bool {
    var charDict: [Character: Int] = [:];
    var total: Float = 0;
    for data in dictionary {
        for char in data.word {
            if !usedChars.contains(char) {
                charDict[char, default: 0] += 1;
                total += 1;
            }
        }
    }
    if charDict.isEmpty {return true};
    print("Letter percentage");
    let sortedDict: [(key: Character, value: Int)] = charDict.sorted(by: {$0.value > $1.value});
    var i: Int = 1;
    for (key, value) in sortedDict {
        print("\(key) = %\(total == 0 ? "0" : String(format: "%0.2f",(Float(value)/total)*100))", terminator: " | ");
        if i % 4 == 0 {print()};
        i += 1;
    }
    return false;
}

func removeImpossibleWords(char: Character, hasChar: Bool) -> Void {
    for data in dictionary {
        let results: Bool = data.letters.contains(char);
        if hasChar && !results || !hasChar && results {
            dictionary.remove(data);
        }
    }
}

func removeInvalidPositionWords() -> Void {
    let singleWordGuess: Bool = guessWords.count == 1;
    for data in dictionary {
        var invalidPosition: Int = 0;
        var checkedWords: Int = 0;
        for guess in guessWords {
            if guess.count != data.word.count {continue};
            checkedWords += 1;
            for i in 0..<guess.count {
                if data.word[i] != guess[i] && guess[i] != "_" {
                    invalidPosition += 1;
                    break;
                }
            }
            if invalidPosition == 2 {
                dictionary.remove(data);
                break;
            }
        }
        if checkedWords == 1 && invalidPosition == 1 {
            dictionary.remove(data);
        }
    }
}

var usedChars: Set<Character> = [];
repeat {
    print(guessWords);
    let noneLeft: Bool = getPercentUsage(usedChars: usedChars);
    if noneLeft {break};

    print("Input the best letter!");
    if let userInput = readLine() {
        if userInput.count == 1 {
            let nextGuess: Character = Character(userInput);
            print("Is [\(nextGuess)] on the board? (Y/N)");
            if let validate = readLine() {
                let answer: Bool = validate == "Y" || validate == "y";
                if answer {
                    usedChars.insert(nextGuess);
                    guessWords = updateGuessWords(pastGuessWords: guessWords);
                }
                removeImpossibleWords(char: nextGuess, hasChar: answer);
                if answer {
                    removeInvalidPositionWords();
                }
            }
        }
    }
} while true;
print("Hangman solved!");