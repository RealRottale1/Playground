
func eval(_ str: String) -> Int? {
    if str.isEmpty {return nil};
    var str: String = str;
    str.removeAll(where: {$0==" "});
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
        return variables;
    }
    var variables: [String: [(isV: Bool, content: String)]] = segmentData();
    
    for (key, data) in variables {
        print("Variable: \(key), Data: \(data)\n");
    }
    return 0;
}

if let data = eval("2 + 3 - (24 / 4 + 1) * ((2+4)*(2*2))") {
    print("-----");
    print(data);
} else {
    print("NONE!");
}