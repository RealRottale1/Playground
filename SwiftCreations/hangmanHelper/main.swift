/* To run input the following commands
    cd [Directory of parent folder]
    swift main.swift
*/
import Foundation

struct WordData : Hashable {
    var desc: [Character: Set<Int>]
    var size: Int
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
                    );
                allWords.insert(data);
            }
        }
    } catch {
        print("Unable to load dictionary!");
    }
    return allWords;
}

func createGuessWords(guessedChar: Character) -> ([Int: [[Int: Character]]], Set<Int>) {
    var guessWords: [Int: [[Int: Character]]] = [:];
    var sizesWithoutChar: Set<Int> = [];
    var charSizeDict: [Int: Int] = [:];
    repeat {
        print("Input the current board where [_] indicates an unknown and [ ] indicates a space");
        if let userInput = readLine() {
            let rawGuessWords: [[Character]] = userInput.split(separator: " ").map({Array($0)});
            for word in rawGuessWords {
                let wordSize: Int = word.count;
                if charSizeDict[wordSize] == nil {
                    charSizeDict[wordSize] = 0;
                }
                var foundGuessedChar: Bool = false;
                var temp: [Int: Character] = [:];
                for (i, char) in word.enumerated() {
                    if char == "_" {continue};
                    if !foundGuessedChar && char == guessedChar {
                        foundGuessedChar = true;
                        (charSizeDict[wordSize]!) += 1;
                    }
                    temp[i] = char;
                }
                guessWords[wordSize, default: []].append(temp);
            }
            for (size, value) in charSizeDict {
                if value == 0 {
                    sizesWithoutChar.insert(size);
                }
            }
            return (guessWords, sizesWithoutChar);
        }
    } while true;
    return (guessWords, sizesWithoutChar);
}

var guessWords: [Int: [[Int: Character]]] = createGuessWords(guessedChar: "_").0;
var dictionary: Set<WordData> = loadDictionary(wordSizes: Set(guessWords.keys));

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

var usedChars: Set<Character> = [];
repeat {
    let noneLeft: Bool = getPercentUsage(usedChars: usedChars);
    if noneLeft {break};

    print("Input the best letter!");
    if let userInput = readLine() {
        if userInput.count == 1 {
            let nextGuess: Character = Character(userInput);
            print("Is [\(nextGuess)] on the board? (Y/N)");
            if let validate = readLine() {
                let answer: Bool = validate == "Y" || validate == "y";
                var removeSet: Set<WordData> = [];
                if answer {
                    usedChars.insert(nextGuess);
                    let guessData: ([Int: [[Int: Character]]], Set<Int>) = createGuessWords(guessedChar: nextGuess)
                    guessWords = guessData.0;
                    let sizesWithoutChar: Set<Int> = guessData.1;
                    for data in dictionary {
                        if data.desc[nextGuess] != nil && sizesWithoutChar.contains(data.size) {
                            removeSet.insert(data);
                            continue;
                        }
                        let wordsOfSize: [[Int: Character]] = guessWords[data.size]!;
                        let totalWordsOfSize: Int = wordsOfSize.count;
                        var nonFits: Int = 0;
                        for word in wordsOfSize {
                            for (i, char) in word {
                                if data.desc[char] == nil ||
                                   data.desc[char] != nil && !(data.desc[char]!).contains(i) {
                                    nonFits += 1;
                                    break;
                                }
                            }
                        }
                        if nonFits >= totalWordsOfSize {
                            removeSet.insert(data);
                            continue;
                        }
                    }
                } else {
                    for data in dictionary {
                        if data.desc[nextGuess] != nil {
                            removeSet.insert(data);
                        }
                    }
                }
                for data in removeSet {
                    dictionary.remove(data);
                }
            }
        }
    }
} while true;
print("Hangman solved!");