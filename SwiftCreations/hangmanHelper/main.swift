import Foundation

struct WordData : Hashable {
    var desc: [Character: Set<Int>]
    var size: Int
    var temp: String
}

func loadDictionary(wordSizes: Set<Int>) -> Set<WordData> {
    var allWords: Set<WordData> = [];
    do {
        var rawData: String = "";
        rawData = try String(contentsOfFile: "allWords.txt", encoding: .utf8);
        for word in rawData.split(separator: "\n") {
            if wordSizes.contains(word.count) {
                var desc: [Character: Set<Int>] = [:];
                for (i, char) in word.enumerated() {
                    desc[char, default: []].insert(i);
                }
                let data: WordData = WordData(
                    desc: desc,
                    size: word.count,
                    temp: String(word),
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

func makeWordDict(data: [[Character]]) -> [Int: Int] {
    var dict: [Int: Int] = [:];
    for word in data {
        dict[word.count] = (dict[word.count] ?? 0) + 1;
    }
    print(dict)
    return dict;
}

var guessWords: [[Character]] = updateGuessWords(pastGuessWords: nil);
var guessWordCount: [Int: Int] = makeWordDict(data: guessWords);
var dictionary: Set<WordData> = loadDictionary(wordSizes: Set(Array(guessWords.map({$0.count}))));

func getPercentUsage(usedChars: Set<Character>) -> Bool {
    var charDict: [Character: Int] = [:];
    var total: Float = 0;
    for data in dictionary {
        for (char, loc) in data.desc {
            if !usedChars.contains(char) {
                let size: Int = loc.count;
                charDict[char, default: 0] += size;
                total += Float(size);
            }
        }
    }
    print(charDict);
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
    var removeSet: Set<WordData> = [];
    for data in dictionary {
        let results: Bool = data.desc[char] != nil;
        if hasChar && !results || !hasChar && results {
            removeSet.insert(data);
        }
    }
    for data in removeSet {
        dictionary.remove(data);
    }
}

func removeInvalidPositionWords() -> Void {
    var removeSet: Set<WordData> = [];
    for data in dictionary {
        print(data.temp)
        var foundPossibleWord: Bool = false;
        for guess in guessWords {
            if guessWordCount[data.size] == nil {continue};
            if guess.count != data.size {continue};
            var exitedEarly: Bool = false;
            for (i, char) in guess.enumerated() {
                if char == "_" {continue};
                print("CURRENT: \(char)")
                if data.desc[char] == nil || !(data.desc[char]!).contains(i) {
                    exitedEarly = true;
                    break;
                }
            }
            if !exitedEarly {
                foundPossibleWord = true;
                break;
            }
        }
        if !foundPossibleWord {
            print("Removed: \(data.temp)")
            removeSet.insert(data);
        }
    }
    for data in removeSet {
        dictionary.remove(data);
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