import Foundation

func getData(formula: String) -> [String: (start: [(variable: Int, multiplicity: Int)],end: [(variable: Int, multiplicity: Int)])] {
    var data: [String: (
        start: [(variable: Int, multiplicity: Int)],
        end: [(variable: Int, multiplicity: Int)]
    )] = [:];

    let sides: [Substring] = formula.split(separator: "=");
    let sections: [[String]] = [sides[0].split(separator: "+").map({String($0)}), sides[1].split(separator: "+").map({String($0)})];

    var currentVariable: Int = 0;
    for s in 0...1 {
        for p in 0..<sections[s].count {
            let useString: String = sections[s][p];
            var startIndex: String.Index = useString.index(useString.startIndex, offsetBy: 0);
            repeat {
                if let startValueIndex = useString[startIndex..<useString.endIndex].firstIndex(where: {$0.isNumber}) {
                    var endValueIndex: String.Index = startValueIndex;
                    repeat {
                        let nextIndex: String.Index = useString.index(after: endValueIndex);
                        if nextIndex < useString.endIndex && useString[nextIndex].isNumber {
                            endValueIndex = nextIndex;
                        } else {break;}
                    } while true;


                    let element: String = String(useString[startIndex...useString.index(before: startValueIndex)]);
                    let multiplicity: Int = Int(String(useString[startValueIndex...endValueIndex]))!;
                    //print("Element: \(element), Multiplicity: \(multiplicity)");
                    
                    if s == 0 {
                        data[element, default: (start: [], end: [])].start.append((variable: currentVariable, multiplicity: multiplicity));
                    } else {
                        data[element, default: (start: [], end: [])].end.append((variable: currentVariable, multiplicity: multiplicity));
                    }
                    if endValueIndex >= useString.endIndex {
                        break;
                    }
                    startIndex = useString.index(after: endValueIndex);
                    if startIndex >= useString.endIndex {
                        break;
                    }
                } else {
                    break;
                }
            } while true;
            currentVariable += 1;
        }
    }
    return data;
}

struct equationTerm {
    var variable: Int
    var knownValue: Int?
    var multiplicity: Decimal
    var adding: Bool
}

func visualizeRawEquations(equations: [Int: [[equationTerm]]]) -> Void {
    print("---Visualized Raw Equations---");
    for (key, data) in equations {
        for i in 0..<data.count {
            print("V\(key)=", terminator: "");
            for j in 0..<data[i].count {
                print("\(data[i][j].adding ? "+" : "-")", terminator: "");
                print("V\(data[i][j].variable)*\(data[i][j].multiplicity)", terminator: "");
            }
            print("");
        }
    }
    print("------------------------------");
}

func solveData(data: [String: (start: [(variable: Int, multiplicity: Int)],end: [(variable: Int, multiplicity: Int)])]) -> Void {
    var variableValues: [Int: Int] = [:];
    variableValues[0] = 1;

    var variableEquations: [Int: [[equationTerm]]] = [:];

    for (element, equation) in data {
        let totalVariables: Int = equation.start.count + equation.end.count - 1;
        print("Element: \(element), tv: \(totalVariables)");
        for i in 0...totalVariables {
            let side: Bool = i > equation.start.count - 1 ? false : true; // start=true, end=false; 
            let normalizedI: Int = side ? i : i - (equation.start.count - 1) - 1;
            var newEquation: [equationTerm] = [];
            
            // Gets divide amount
            let sideContent: [(variable: Int, multiplicity: Int)] = side ? equation.end : equation.start;
            var totalDiviser: Decimal = 0;
            for content in sideContent {
                totalDiviser += Decimal(content.multiplicity);
            }
            
            // Divides other side and adds to equation
            let otherSideContent: [(variable: Int, multiplicity: Int)] = !side ? equation.end : equation.start;
            for content in otherSideContent {
                let structInstance = equationTerm(variable: content.variable, knownValue: nil, multiplicity: Decimal(content.multiplicity) / totalDiviser, adding: true)
                newEquation.append(structInstance);
            }

            // Subtract from solving side
            for j in 0..<sideContent.count {
                if j == normalizedI {
                    continue;
                }
                let structInstance = equationTerm(variable: sideContent[j].variable, knownValue: nil, multiplicity: Decimal(1), adding: false);
                newEquation.append(structInstance);
            }
            variableEquations[sideContent[normalizedI].variable, default: []].append(newEquation);
        }
    } 
    //visualizeRawEquations(equations: variableEquations);
}

repeat {
    print("Awaiting user input!");
    //if let userInput = readLine() {
        let data: [String: (start: [(variable: Int, multiplicity: Int)],end: [(variable: Int, multiplicity: Int)])] = getData(formula: "K1Mn1O4+H1Cl1=K1Cl1+Mn1Cl2+H2O1+Cl2");
        print("Data: \(data)");
        solveData(data: data);
    //}
    break;
} while true;
print("FINISHED FINISHED FINISHED!");
//F1+C2=F1C3
//K1Mn1O4+H1Cl1=K1Cl1+Mn1Cl2+H2O1+Cl2
//https://www.webqc.org/balance.php?reaction=KMnO4+%2B+HCl+%3D+KCl+%2B+MnCl2+%2B+H2O+%2B+Cl2