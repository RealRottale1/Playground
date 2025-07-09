import Foundation // Used for pow

func safeDivide(_ n: Int?,_ d: Int?) -> Int? {
    guard let n = n, let d = d, d == 0 else {
        return nil;
    }
    return n/d;
}

func printSquare(_ n: Int?) -> () {
    if let n = n {
        let result = Int(pow(Double(n), 2.0));
        print(result);
    } else {
        print("No number to square!");
    }
}

func isPalindrom(_ s: String) -> Bool {
    var aS: [Character] = Array(s.lowercased());
    aS = aS.filter({$0 != " "});
    let sA: [Character] = aS.reversed();
    let len: Int = aS.count;
    for i in 0..<len {if aS[i] != sA[i] {return false;}}
    return true; 
}

func countVowels(_ s: String) -> Int {
    var aS: [Character] = Array(s.lowercased());
    aS = aS.filter({$0 in ["a", "e", "i", "o", "u"] as [Character]});
    return aS.count;
}

func countWords(_ s: String) -> Int {
    return (Array(s).filter({$0 == " "})).count + 1;
}

func makeAcronym(_ s: String) -> String {
    let w: [String] = s.split(separator: " ");
    let a: [Character] = w.map({($0.first)!});
    return String(a);
}

func wordFrequency(_ s: String) -> [String: Int] {
    var frequency: [String: Int] = [:];
    let aS: [String] = s.lowercased().split(separator: " ").map({String($0)});
    let filteredWords: [String] = aS.map({
        var nAS: String = "";
        for char in $0 {
            if char.isLetter || char.isNumber {
                nAS.append(char);
            }
        }
        return nAS;
    })        
    for entry in filteredWords {
        frequency[entry] = (frequency[entry] ?? 0) + 1;
    }
    return frequency;
}

func mostFrequentLetter(_ s: String) -> Character? {
    let s: String = s.lowercased();
    var f: [Int: [Character]] = [:];
    var d: [Character: Int] = [:];
    for c in s {
        if c.isLetter {
            d[c] = (d[c] ?? 0) + 1;
            f[d[c]!, default: []].append(c);
        }
    }
    if f.count == 0 {
        return nil;
    }
    let m: Int = f.keys.max()!;
    return f[m]!.first!;
}

func longestWord(_ s: String) -> String? {
    if s.isEmpty {return nil};
    let s: String = s.filter({$0.isLetter || $0==" "});
    let a: [String.SubSequence] = s.split(separator: " ");
    if let m = a.max(by: {$0.count < $1.count}) {
        return String(m);
    } else {
        return nil;
    }
}

func countVowelHeavyWords(_ s: String) -> Int? {
    if s.isEmpty {return nil};
    let s: String = s.lowercased().filter({$0.isLetter || $0==" "});
    let a: [String.SubSequence] = s.split(separator: " ");
    if a.count == 0 {return nil};
    var t: Int = 0;
    for w in a {
        var vowels: Int = 0;
        var consonants: Int = 0;
        for c in w {
            if ["a", "e", "i", "o", "u"].contains(c) {
                vowels += 1;
            } else {
                consonants += 1;
            }
        }
        if vowels > consonants {
            t += 1;
        }
    }
    return t;
}

func groupAnagrams(_ words: [String]) -> [[String]]? {
    if words.isEmpty {return nil};
    var holder: [[String]] = [];
    var words: [String] = words.map({$0.lowercased()});
    for i in stride(from: words.count-1, through: 0, by: -1) {
        if i >= words.count {
            continue;
        }
        for j in stride(from: words.count-1, through: 0, by: -1) {
            if i == j {
                continue;
            }
            if words[i] == String(words[j].reversed()) {
                holder.append([words[i], words[j]]);
                let check: Bool = i > j;
                words.remove(at: check ? i : j);
                words.remove(at: check ? j : i);
                break;
            }
        }
    }
    return holder;
}

let input = ["bat", "tab", "tap", "pat", "eat", "tea", "tan", "nat"]; // 3 anagram pairs
let output = groupAnagrams(input);


func oneOfFromPalindrome(word: String) -> Bool {
    let a: [Character] = Array(word);
    let c: Int = a.count-1;
    let d: Int = c % 2 == 0 ? (c/2) : (c-1)/2;
    var s: Int = 0;
    for i in 0..<d {
        if a[i] == a[c-i] {
            continue;
        } else if i+1<=c && a[i+1] == a[c-i] || i-1>=0 && a[i] == a[c-i-1] {
            if s == 1 {return false};
            s += 1;
            continue;
        } else {
            return false;
        }
    }
    return true;
}
print(oneOfFromPalindrome(word: "abcbbccca"));

func longestCommonPrefix(data: [String]) -> String {
    var commonPrefix: [Character] = [];
    var i: Int = 0;
    repeat {
        for word in data {
            if i >= word.count {return commonPrefix.isEmpty ? "" : String(commonPrefix)};
            let j: String.Index = word.index(word.startIndex, offsetBy: i);
            if commonPrefix.count-1 < i {
                commonPrefix.append(word[j]);
            } else if commonPrefix[i] != word[j] {
                commonPrefix.removeLast();
                return commonPrefix.isEmpty ? "" : String(commonPrefix);
            }
        }
        i += 1;
    } while true;
}
print(longestCommonPrefix(data: ["interspecies", "interstellar", "interstate"]));

func digitalRoot(num: Int) -> Int {
    var num: Int = abs(num);
    var temp: Int = 0;
    repeat {
        let stringNum: String = String(num);
        if stringNum.count <= 1 {return num};
        stringNum.map({Int(String($0))!}).forEach({temp += $0});
        num = temp;
        temp = 0;
    } while true;
}
print(digitalRoot(num: 38));

func isAnagram(word1: String, word2: String) -> Bool {
    if word1.count != word2.count {return false};
    var allChars: [Character : Int] = [:];
    for char in word1 {
        allChars[char] = allChars[char] ?? 0 + 1;
    }
    let allKeys: Set<Character> = Set(allChars.keys);
    for char in word2 {
        if !allKeys.contains(char) {return false};
        allChars[char]! -= 1;
        if allChars[char]! < 0 {return false};
    }
    return true;
}
print(isAnagram(word1: "listen", word2: "silent"));

func runLengthEncode(data: String) -> String {
    var encodedText: String = "";
    var currentChar: Character = data[data.index(data.startIndex, offsetBy: 0)];
    var currentCount: Int = 0;
    for char in data {
        if char == currentChar {currentCount += 1} else {
            encodedText += String(currentChar) + String(currentCount);
            currentCount = 1;
            currentChar = char;
        }
    }
    encodedText += String(currentChar) + String(currentCount);
    return encodedText;
}

func runLengthDecode(data: String) -> String {
    var currentString: String = "";
    var currentChar: String = "";
    var currentCount: String = "0";
    func addToString() -> Void {
        if let endIndex = Int(currentCount) {
            for _ in 0..<endIndex {
                currentString += currentChar;
            }
        }
    }
    for char in data {
        if !char.isNumber {
            addToString();
            currentChar = String(char);
            currentCount = "";
        } else {
            currentCount += String(char);
        }
    }
    addToString();
    return currentString;
}
let results1: String = runLengthEncode(data: "Hello there welcome back to another video");
let results2: String = runLengthDecode(data: results1);
print(results1);
print(results2)

func isIsogram(word: String) -> Bool {
    return Set(word.lowercased()).count-1 == word.count-1;
}
print(isIsogram(word: "Hello"));

func multiplyString(str: String, amount: Int) -> String {
    guard amount > 0 else {
        return "";
    }
    var returnString: String = str;
    for _ in 0..<amount-1 {
        returnString += str;
    }
    return returnString;
}

print(multiplyString(str: "Hello ", amount: 0));


/*


func eval(_ str: String) -> Int? {
    if str.isEmpty {return nil};

    var str: String = str;
    str.removeAll(where: {$0==" "});
    str = "(" + str + ")";

    var sections: [Int: [(Int, Int)]] = [:];
    var sectionStarters: [Int] = [];
    for (i, char) in str.enumerated() {
        if char == "(" {
            sectionStarters.append(i);
        } else if char == ")" {
            let startIndex: Int = sectionStarters.removeLast();
            sections[i-startIndex, default: []].append((startIndex, i));
        }
    }
    print(sections)

    var solvedSections: [String: String] = [:];

    for length in sections.keys.sorted() {
        let data: [(Int, Int)] = sections[length]!;
        for (s, e) in data {
            let startRange: String.Index = str.index(str.startIndex, offsetBy: s+1);
            let endRange: String.Index = str.index(str.startIndex, offsetBy: e);
            var equation: String = String(str[startRange..<endRange]);
            print(equation)
        }
    }
    return 0;
}

if let data = eval("2 + 3 - (24 / 4 + 1) * ((2+4)*(2*2))") {
    print("-----");
    print(data);
} else {
    print("NONE!");
}
*/