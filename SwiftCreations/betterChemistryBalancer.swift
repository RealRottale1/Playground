


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
                if let startValueIndex = useString.firstIndex(where: {$0.isNumber}) {
                    var endValueIndex: String.Index = startValueIndex;
                    repeat {
                        let nextIndex: String.Index = useString.index(after: endValueIndex);
                        if nextIndex < useString.endIndex && useString[nextIndex].isNumber {
                            endValueIndex = nextIndex;
                        } else {break;}
                    } while true;


                    let element: String = String(useString[startIndex...useString.index(before: startValueIndex)]);
                    let multiplicity: Int = Int(String(useString[startValueIndex...endValueIndex]))!;
                    if s == 0 {
                        data[element, default: (start: [], end: [])].start.append((variable: currentVariable, multiplicity: multiplicity));
                    } else {
                        data[element, default: (start: [], end: [])].end.append((variable: currentVariable, multiplicity: multiplicity));
                    }
                    if endValueIndex >= useString.endIndex {
                        break;
                    }
                    startIndex = useString.index(after: endValueIndex);
                    break;
                } else {
                    break;
                }
            } while true;
            currentVariable += 1;
        }
    }

    print(data);
    return data;
}

repeat {
    print("Awaiting user input!");
    if let userInput = readLine() {
        let data: [String: (start: [(variable: Int, multiplicity: Int)],end: [(variable: Int, multiplicity: Int)])] = getData(formula: userInput);
        
    }
} while true;
