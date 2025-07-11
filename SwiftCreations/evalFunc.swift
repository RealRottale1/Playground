
import Foundation

func eval(_ str: String) -> Double {
    // Initial string validation and formatting
    if str.isEmpty {return Double.nan};
    var str: String = str;
    str.removeAll(where: {$0==" "});
    var balancedParentheses: Int = 0;
    let allowedChars: Set<Character> = ["0","1","2","3","4","5","6","7","8","9","0",".","-","+","/","*","^"];
    for char in str {if char == "(" {balancedParentheses += 1;} else if char == ")" {balancedParentheses -= 1;} else if !allowedChars.contains(char) {return Double.nan};}
    if balancedParentheses != 0 {return Double.nan};
    str = "(" + str + ")";

    // Breaks raw equation into a flexible variable format
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
                if gotString && firstStringIndex < tempStr.count - 1 {
                    let priorPart: (isV: Bool, content: String) = (isV: false, content: String(tempStr[tempStr.index(tempStr.startIndex, offsetBy: firstStringIndex)..<tempStr.index(tempStr.endIndex, offsetBy: -1)]));
                    currentVariable.append(priorPart);
                }
                let nextVarID: String = String(currentVarID);
                variables[nextVarID] = currentVariable;
                sections.append((startIndex, i, nextVarID));
                currentVarID += 1;
            }
        }
        return variables;
    }
    var variables: [String: [(isV: Bool, content: String)]] = segmentData();
    var solvedVariables: [String: String] = [:];

    // Attempts to match a value with a variable
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
        for entry in solveArray {
            var totalDecmialPoints: Int = 0;
            for char in entry {
                if char == "." {
                    if totalDecmialPoints == 1 {
                        return "nan";
                    }
                    totalDecmialPoints += 1;
                }
            }
        }
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

        // Exponents are calculated in reverse (right to left) order
        var eJ: Int = solveArray.count - 2;
        repeat {
            if eJ < 1 {
                break;
            }
            if solveArray[eJ] == "^" {
                let value: String = calculate(num1: solveArray[eJ-1], num2: solveArray[eJ+1], operation: solveArray[eJ]);
                if value == "nan" {return value;}
                solveArray[eJ-1] = value;
                solveArray.removeSubrange(eJ...eJ+1);
            }
            eJ -= 2;
        } while true;

        // Everything else is calculated in normal (left to right) order
        let operators: [Set<String>] = [["*", "/"], ["+", "-"]];
        for s in operators {
            var j = 1;
            repeat {
                if solveArray.count-1 < j+1 {
                    break;
                }
                if s.contains(solveArray[j]) {
                    let value: String = calculate(num1: solveArray[j-1], num2: solveArray[j+1], operation: solveArray[j]);
                    if value == "nan" {return value;}
                    solveArray[j-1] = value;
                    solveArray.removeSubrange(j...j+1);
                } else {
                    j += 2;
                }
            } while true;
        }
        return solveArray[0];
    }
    
    // Handles matching values to variables
    for _ in 0..<variables.count {
        for (key, data) in variables {
            let answer: String = solveEquation(data: data);
            if answer != "" {
                if answer == "nan" {return Double.nan};
                if variables.count == 1 {
                    return Double(round(1000000000 * Double(answer)!) / 1000000000);
                }
                solvedVariables[key] = answer;
                variables.removeValue(forKey: key);
            }
        }
    }
    return Double.nan;
}

let data: Double = eval("0.1+0.2");
print(data);
