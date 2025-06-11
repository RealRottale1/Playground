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

let results: [String: Int] = wordFrequency("Hello hello hello, ,hello bob bob dow");
for (key, value) in results {
    print("Key: \(key), Value: \(value)");
}