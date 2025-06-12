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