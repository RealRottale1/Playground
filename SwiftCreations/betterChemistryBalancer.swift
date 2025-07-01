import Foundation

func gcdOfArray(data: [Int]) -> Int {
    guard var result = data.first else {return 1};
    func gcd(a: Int, b: Int) -> Int {
        var a: Int = abs(a);
        var b: Int = abs(b);
        while b != 0 {let tempB: Int = b; b = a % b; a = tempB;}
        return a;
    }
    for num in data.dropFirst() {
        result = gcd(a: result, b: num);
    }
    return result;
}

func getData(formula: String) -> (data: [String: (start: [(variable: Int, multiplicity: Int)],end: [(variable: Int, multiplicity: Int)])], sections: [[String]]) {
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
    return (data: data, sections: sections);
}

struct equationTerm {
    var variable: Int
    var multiplicity: Decimal
    var adding: Bool
}

func visualizeRawEquations(equations: [Int: [[equationTerm]]]) -> Void {
    print("---Visualized Raw Equations---");
    for (key, data) in equations {
        for i in 0..<data.count {
            print("V\(key)=", terminator: "");
            for j in 0..<data[i].count {
                print("\(j == 0 ? "" : (data[i][j].adding ? "+" : "-"))", terminator: "");
                print("(V\(data[i][j].variable)*\(data[i][j].multiplicity))", terminator: "");
            }
            print("");
        }
    }
    print("------------------------------");
}

func solveData(data: [String: (start: [(variable: Int, multiplicity: Int)], end: [(variable: Int, multiplicity: Int)])]) -> [Int: Decimal] {
    var variablesLeft: Int;
    var variableValues: [Int: Decimal] = [:];
    variableValues[0] = Decimal(1);

    var variableEquations: [Int: [[equationTerm]]] = [:];

    /*Makes Equations*/
    for (_, equation) in data {
        let totalVariables: Int = equation.start.count + equation.end.count - 1;
        for i in 0...totalVariables {
            let side: Bool = i > equation.start.count - 1 ? false : true; // start=true, end=false; 
            var newEquation: [equationTerm] = [];
            
            var normalizedI: Int;
            var sideContent: [(variable: Int, multiplicity: Int)];
            var otherSideContent: [(variable: Int, multiplicity: Int)];
            if side {
                sideContent = equation.start;
                otherSideContent = equation.end;
                normalizedI = i;
            } else {
                sideContent = equation.end;
                otherSideContent = equation.start;
                normalizedI = i - (equation.start.count - 1) - 1;
            }

            // Gets divide amount
            let myDivisor: Decimal = Decimal(sideContent[normalizedI].multiplicity);
            
            // Divides other side and adds to equation
            for content in otherSideContent {
                let structInstance = equationTerm(variable: content.variable, multiplicity: Decimal(content.multiplicity) / myDivisor, adding: true);
                newEquation.append(structInstance);
            }

            // Subtract from solving side
            for j in 0..<sideContent.count {
                if j == normalizedI {
                    continue;
                }
                let structInstance = equationTerm(variable: sideContent[j].variable, multiplicity: Decimal(sideContent[j].multiplicity) / myDivisor, adding: false);
                newEquation.append(structInstance);
            }
            //print("Element: \(element), Side:\(side), NI: \(normalizedI), SideContent: \(sideContent)");
            variableEquations[sideContent[normalizedI].variable, default: []].append(newEquation);
        }
    } 
    variablesLeft = variableEquations.count - 1;
    visualizeRawEquations(equations: variableEquations);

    /*Solves Equations*/
    repeat {
        var maxSolveLength: Int = variableValues.count + 1;
        for (variableID, equations) in variableEquations {
            for equation in equations {
                if equation.count > maxSolveLength {
                    continue;
                }

                var solution: Decimal = 0;
                var multipleUnknowns: Bool = false;
                if variableValues[variableID] != nil {continue};
                for portion in equation {
                    if variableValues[portion.variable] == nil {
                        multipleUnknowns = true;
                        break;
                    }
                    solution += variableValues[portion.variable]! * portion.multiplicity * (!portion.adding ? Decimal(-1) : Decimal(1)); 
                }
                if multipleUnknowns == true {continue};
                variableValues[variableID] = solution;
                maxSolveLength += 1;
                variablesLeft -= 1;
            }
        }
    } while variablesLeft > 0;

    /*Scales Variables*/
    var mostDecimalSpaces: Int = 0;
    for (_, value) in variableValues {
        let stringValue: String = value.description;
        if let decimalIndex = stringValue.firstIndex(of: ".") {
            let decimalSpaces: Int = stringValue.distance(from: stringValue.index(after: decimalIndex), to: stringValue.endIndex)
            if decimalSpaces > mostDecimalSpaces {mostDecimalSpaces = decimalSpaces};
        }
    }
    variableValues = variableValues.mapValues({$0 * (mostDecimalSpaces == 0 ? 1 : pow(10, mostDecimalSpaces))});
    let gcd: Decimal = Decimal(gcdOfArray(data: Array(variableValues.mapValues({NSDecimalNumber(decimal: $0).intValue}).values)));
    return variableValues.mapValues({$0 / gcd});
}

print("Examples:\nF1+C2=F1C3\nK1Mn1O4+H1Cl1=K1Cl1+Mn1Cl2+H2O1+Cl2\n");

repeat {
    print("Awaiting user input!");
    if let userInput = readLine() {
        /* Computing */
        let data: (data: [String: (start: [(variable: Int, multiplicity: Int)],end: [(variable: Int, multiplicity: Int)])], sections: [[String]]) = getData(formula: userInput);
        let solution: [Int: Decimal] = solveData(data: data.data);

        /* Display */
        let equalSignIndex: Int = data.sections[0].count - 1;
        let allPortions: [String] = data.sections[0] + data.sections[1];

        let sortedKeys: [Int] = solution.keys.sorted();
        for i in 0..<sortedKeys.count {
            if let value = solution[sortedKeys[i]] {
                print("\(value)*\(allPortions[i])\((i==equalSignIndex ? " = " : (i == sortedKeys.count - 1 ? "" : " + ")))", terminator: "");
            }
        }
        print("");
    }
} while true;