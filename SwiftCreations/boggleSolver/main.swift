import Foundation

class trieNode {
    var children: [Character: trieNode] = [:];
    var endOfWord: Bool = false;
}

class trieManager {
    private let root: trieNode = trieNode();

    func insert(word: String) -> Void {
        var node: trieNode = root;
        for char in word {
            if node.children[char] == nil {
                node.children[char] = trieNode();
            }
            node = node.children[char]!;
        }
        node.endOfWord = true;
    }

    func hasWord(word: String) -> Bool {
        var node: trieNode = root;
        for char in word {
            if let nextNode = node.children[char] {node = nextNode} else {return false}
        }
        return node.endOfWord;
    }

    func hasPrefix(prefix: String) -> Bool {
        var node: trieNode = root;
        for char in prefix {
            if let nextNode = node.children[char] {node = nextNode} else {return false}
        }
        return true;
    }
}

let trieTree: trieManager = trieManager();
/*
    Extra rawData to try 
    f p s a s m r v a l e e h i f er e x i e h t t u u
    r k e e a t p s s t h g an d l l a v m f e t t u o
    l e o n a p h z n f e r n t t s i l he w o d a w o
    t e e i o p h r e i t s w i f z u er u m c f h a o
    t r qu p n i a r a r t e o i r t l f d i s m u m u
*/
let rawData: String = "s n o a t g r e n h e r e r s i an l d z i t m t i";
let boardPieces: [String] = rawData.split(separator: " ").map({String($0)});
var boardData: [[String]] = [];
for i in 0..<5 {
    boardData.append(Array(boardPieces[(5*i)...(4+5*i)]));
}
var allFoundWords: Set<String> = [];

func loadTrie() -> Void {
    var contents: String;
    do {
        contents = try String(contentsOfFile: "boggleWords.txt", encoding: .utf8);
    } catch { 
        return;
    }
    print("Getting possible words");

    var uniqueChars: Set<Character> = Set(rawData);
    uniqueChars.remove(" ");
    let uniqueCharsCount: Int = uniqueChars.count;

    let words: Set<String> = Set(contents.split(separator: "\n").filter({$0.count>3}).map({String($0)}));
    for word in words {
        let charsInWord: Set<Character> = Set(word);
        if uniqueCharsCount >= charsInWord.count {
            if uniqueChars.isSuperset(of: charsInWord) {
                trieTree.insert(word: word);
            }
        }
    }
}

struct cord: Hashable {
    var y: Int
    var x: Int
}

func findAllWords() -> Void {
    func getNeighbors(c: cord, p: Set<cord>) -> [cord] {
        let directions: [cord] = [
            cord(y: c.y+1, x: c.x),
            cord(y: c.y+1, x: c.x+1),
            cord(y: c.y, x: c.x+1),
            cord(y: c.y-1, x: c.x+1),
            cord(y: c.y-1, x: c.x),
            cord(y: c.y-1, x: c.x-1),
            cord(y: c.y, x: c.x-1),
            cord(y: c.y+1, x: c.x-1),
        ].filter({$0.y >= 0 && $0.x >= 0 && $0.y <= 4 && $0.x <= 4}).filter({!p.contains($0)});
        return directions;
    }

    for i in 0..<25 {
        let cY: Int = i / 5;
        let cX: Int = i % 5;
        let masterCord: cord = cord(y: cY, x: cX);

        var usedCells: Set<cord> = [masterCord];
        let nextNodes: [cord] = getNeighbors(c: masterCord, p: usedCells);
        var masterBranch: [[cord]] = [nextNodes];
        var masterWord: [String] = [boardData[cY][cX]];
        if let lastNextNode = nextNodes.indices.last {
            masterWord.append(boardData[nextNodes[lastNextNode].y][nextNodes[lastNextNode].x]);
            usedCells.insert(nextNodes[lastNextNode]);
        } else {
            break;
        }

        func backTrack() -> Void {
            repeat {
                if let lastArray = masterBranch.indices.last {
                    let next: cord = masterBranch[lastArray].removeLast();
                    masterWord.removeLast();
                    usedCells.remove(next);
                    if masterBranch[lastArray].isEmpty {
                        masterBranch.removeLast();
                    } else {
                        let lastIndex: Int = masterBranch[lastArray].indices.last!;
                        let new: cord = masterBranch[lastArray][lastIndex];
                        masterWord.append(boardData[new.y][new.x]);
                        usedCells.insert(new);
                        return;
                    }
                } else {
                    return;
                }
            } while true; 
        }

        while !masterBranch.isEmpty {
            let currentWord: String = masterWord.joined();
            let lastArray = masterBranch.indices.last!;
            let lastIndex = masterBranch[lastArray].indices.last!;
            if trieTree.hasPrefix(prefix: currentWord) {
                if trieTree.hasWord(word: currentWord) {
                    allFoundWords.insert(currentWord);
                }
                let current: cord = masterBranch[lastArray][lastIndex];
                let next: [cord] = getNeighbors(c: current, p: usedCells);
                if !next.isEmpty {
                    masterBranch.append(next);
                    let nextLast: Int = next.indices.last!;
                    let currentNext: cord = next[nextLast];
                    masterWord.append(boardData[currentNext.y][currentNext.x]);
                    usedCells.insert(currentNext);
                } else {
                    backTrack();
                }
            } else {
                backTrack();
            }
        }
    }
}

func displayWords() -> [Int: [String]] {
    var dict: [Int: [String]] = [:];
    for word in allFoundWords {
        dict[word.count, default: []].append(word);
    }
    for key in dict.keys.sorted() {
        print("Char #: \(key), Words: \(String(describing: dict[key]!))");
    }
    return dict;
}

print("Reading word file");
loadTrie();
print("Finding all possible words");
findAllWords();
let sortedData: [Int: [String]] = displayWords();