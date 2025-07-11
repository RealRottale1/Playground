
import Foundation

func eval(_ str: String) -> Double {
    if str.isEmpty {print("C3"); return Double.nan};
    var str: String = str;
    str.removeAll(where: {$0==" "});
    var balancedParentheses: Int = 0;
    let allowedChars: Set<Character> = ["0","1","2","3","4","5","6","7","8","9","0",".","-","+","/","*","^"];
    for char in str {if char == "(" {balancedParentheses += 1;} else if char == ")" {balancedParentheses -= 1;} else if !allowedChars.contains(char) {print("D4"); return Double.nan};}
    if balancedParentheses != 0 {print("E5"); return Double.nan};
    str = "(" + str + ")";

    func segmentData() -> [String: [(isV: Bool, content: String)]] {
        var currentVarID: Int = 0;
        var variables: [String: [(isV: Bool, content: String)]] = [:];
        var sections: [(Int, Int, String)] = [];
        var sectionStarters: [Int] = [];
        for (i, char) in str.enumerated() {
            if char == "(" {
                sectionStarters.append(i);
            } else if char == ")" {
                let startIndex: Int = sectionStarters.removeLast();
                let startRange: String.Index = str.index(str.startIndex, offsetBy: startIndex);
                let endRange: String.Index = str.index(str.startIndex, offsetBy: i);

                var currentVariable: [(isV: Bool, content: String)] = [];
                let tempStr: String = String(str[startRange...endRange]);
                var j: Int = 0;
                var firstStringIndex: Int = 0;
                var gotString: Bool = false;
                while j < tempStr.count {
                    if tempStr[tempStr.index(tempStr.startIndex, offsetBy: j)] == "(" {
                        if gotString {
                            gotString = false;
                            let tempPriorStr: String = String(tempStr[tempStr.index(tempStr.startIndex, offsetBy: firstStringIndex)..<tempStr.index(tempStr.startIndex, offsetBy: j)]);
                            let priorPart: (isV: Bool, content: String) = (isV: false, content: tempPriorStr);
                            currentVariable.append(priorPart);
                        }
                        let offsetJ: Int = j+startIndex;
                        for i in 0..<sections.count {
                            let section: (Int, Int, String) = sections[i];
                            if section.0 == offsetJ {
                                let part: (isV: Bool, content: String) = (isV: true, content: section.2);
                                currentVariable.append(part);
                                j += (section.1 - section.0);
                                sections.remove(at: i);
                                break;
                            }
                        }
                    } else {
                        if !gotString {
                            firstStringIndex = j;
                            gotString = true;
                        }
                    }
                    j += 1;
                }
                if currentVariable.isEmpty {
                    let priorPart: (isV: Bool, content: String) = (isV: false, content: String(tempStr[tempStr.index(tempStr.startIndex, offsetBy: 1)..<tempStr.index(tempStr.startIndex, offsetBy: tempStr.count-1)]));
                    currentVariable.append(priorPart);
                }
                let nextVarID: String = String(currentVarID);
                variables[nextVarID] = currentVariable;
                sections.append((startIndex, i, nextVarID));
                currentVarID += 1;
            }
        }
        for d in variables {
            print("\(d)\n");
        }
        return variables;
    }
    var variables: [String: [(isV: Bool, content: String)]] = segmentData();
    var solvedVariables: [String: String] = [:];

    func solveEquation(data: [(isV: Bool, content: String)]) -> String {
        var solveString: String = "";
        for section in data {
            if section.isV == true {
                if let entry = solvedVariables[section.content] {
                    solveString += entry;
                } else {
                    return "";
                }
            } else {
                solveString += section.content;
            }
        }
        var solveArray: [String] = [];
        var startingIndex: Int = 0;
        var priorChar: Character = "(";
        for (i, char) in solveString.enumerated() {
            if !char.isNumber && char != "." {
                if char == "-" {
                    print(priorChar)
                }
                if char != "-" || char == "-" && (priorChar == ")" || priorChar.isNumber) {
                    let startRange = solveString.index(solveString.startIndex, offsetBy: startingIndex);
                    let endRange = solveString.index(solveString.startIndex, offsetBy: i);
                    solveArray.append(String(solveString[startRange..<endRange]));
                    solveArray.append(String(char));
                    startingIndex = i + 1;
                }
            }
            priorChar = char;
        }
        let startRange = solveString.index(solveString.startIndex, offsetBy: startingIndex);
        let endRange = solveString.index(solveString.startIndex, offsetBy: solveString.count);
        solveArray.append(String(solveString[startRange..<endRange]));
        print(solveArray);

        func calculate(num1: String, num2: String, operation: String) -> String {
            if let val1 = Double(num1) {
                if let val2 = Double(num2) {
                    switch (operation) {
                        case "^":
                            return String(pow(val1, val2));
                        case "*":
                            return String(val1 * val2);
                        case "/":
                            return String(val1 / val2);
                        case "+":
                            return String(val1 + val2);
                        default:
                            return String(val1 - val2);
                    }
                }
            }
            return "nan";
        }
        let operators: [Set<String>] = [["^"], ["*", "/"], ["+", "-"]];
        for s in operators {
            var j = 1;
            repeat {
                if solveArray.count-1 < j+1 {
                    break;
                }
                if s.contains(solveArray[j]) {
                    let value: String = calculate(num1: solveArray[j-1], num2: solveArray[j+1], operation: solveArray[j]);
                    if value == "nan" {
                        print("F6");
                        return value;
                    }
                    solveArray[j-1] = value;
                    solveArray.removeSubrange(j...j+1);
                } else {
                    j += 2;
                }
            } while true;
        }
        return solveArray[0];
    }
    
    for _ in 0..<variables.count {
        for (key, data) in variables {
            let answer: String = solveEquation(data: data);
            if answer != "" {
                if answer == "nan" {print("A1"); return Double.nan};
                if variables.count == 1 {
                    return Double(answer)!;
                }
                solvedVariables[key] = answer;
                variables.removeValue(forKey: key);
            }
        }
    }
    print("B2");
    return Double.nan;
}
//2+4*2^4-((2*7+3)-(2*4)+4)*4
let data: Double = eval("(2*7+3)-(2*4)+4");
print(data);