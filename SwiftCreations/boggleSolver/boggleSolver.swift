import Foundation


do {
    let contents: String = try String(contentsOfFile: "boggleWords.txt");
    let lines: Set<String> = Set(contents.split(seperator: "\n").map({String($0)}));
    print(lines.count);
} catch {
    print("OH NO")
}
print("DONE")