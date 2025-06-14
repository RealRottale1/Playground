
class Roman {
    private let romanSymbols: [Character] = ["M","D","C","L","X","V","I"];
    private let romanValues:  [Int]       = [1000,500,100,50,10,5,1];

    private(set) var base10Value: Int = 0;
    private(set) var romanValue: String = "";

    func base10ToRoman(value: Int) -> String {
        if value < 0 || value > 3999 {
            return ""; // If number is too big or too small it will return "" which is equal to 0
        }

        var value: Int = value;
        var returnValue: String = "";

        func handleCalculation(romanValue: Int, romanSymbols: String) -> Void {
            let remainder: Int = value % romanValue;
            let amountRemoved: Int = value - remainder;
            let symbolAmount: Int = amountRemoved / romanValue;
            value -= amountRemoved;
            returnValue += String(repeating: romanSymbols, count: symbolAmount);
        }

        for i in 0...6 {
            handleCalculation(romanValue: self.romanValues[i], romanSymbols: String(self.romanSymbols[i]));
            let isEven: Bool = i % 2 == 0;
            if isEven && i != 6 {
                handleCalculation(romanValue: self.romanValues[i] - self.romanValues[i+2], romanSymbols: (String(self.romanSymbols[i+2]) + String(self.romanSymbols[i])));
            } else if !isEven {
                handleCalculation(romanValue: self.romanValues[i] - self.romanValues[i+1], romanSymbols: (String(self.romanSymbols[i+1]) + String(self.romanSymbols[i])));
            }
        }

        return returnValue;
    }
    private func fastRomanToBase10(symbol: String) -> Int { // No error checking
        var returnValue: Int = 0;
        let symbolArray: [Character] = Array(symbol);
        for i in stride(from: symbolArray.count-1, through: 0, by: -2) {
            let currentSymbol: Character = symbolArray[i];
            let currentValue: Int = self.romanValues[self.romanSymbols.firstIndex(of: currentSymbol)!];
            let previousValue: Int = i == 0 ? self.romanValues[self.romanSymbols.firstIndex(of: symbolArray[i-1])!] : 0;
            returnValue += previousValue > currentValue ? previousValue - currentValue : previousValue + currentValue;
        }
        return returnValue;
    }
    func romanToBase10(symbol: String) -> Int {             // Error checking
        let symbolArray: [Character] = Array(symbol);
        let symbolCount: Int = symbolArray.count;
        for i in 0..<symbolCount {
            if !self.romanSymbols.contains(symbolArray[i]) {
                return -1; // Not a valid roman symbol
            }
        }
        for i in 0...2 {
            let currentSymbol: String = String(self.romanSymbols[i*2+1]);
            if symbol.contains(String(repeating: currentSymbol, count: 2)) {
                return -1; // Repeating V, L, or D
            }
        }
        for i in 0...6 {
            let currentSymbol: String = String(self.romanSymbols[i]);
            if symbol.contains(String(repeating: currentSymbol, count: 4)) {
                return -1; // Four or more of same symbols attatched
            }
            if i == 6 {continue};
            let rI: Int = 6-i;
            let isEven: Bool = rI % 2 == 0;
            let duration: Int = rI - (isEven ? 3 : 1);
            for j in 0...duration {
                if symbol.contains(currentSymbol + String(self.romanSymbols[j])) {
                    return -1; // Invalid 2-pair subtraction
                }
            }
            if !isEven {continue};
            for j in 0..<rI {
                if symbol.contains(currentSymbol + currentSymbol + String(self.romanSymbols[j])) {
                    return -1; // Invalid 3-pair subtraction
                }
            }
        }
        for i in 0...2 {
            let firstIndex: Int = 6 - i*2;
            let firstSymbol: String = String(self.romanSymbols[firstIndex]);
            for j in 0...1 {
                let secondSymbol: String = String(self.romanSymbols[firstIndex - (1 + j*2)]);
                for k in 0...6 {
                    if symbol.contains(firstSymbol + secondSymbol + String(self.romanSymbols[k])) {
                        return -1; // Value order violation
                    }
                }
            }
        }
        let romanValue = self.fastRomanToBase10(symbol: symbol);
        if romanValue > 3999 {
            return -1; // Value too big
        }
        return romanValue;
    }

    static func add(first: Roman, second: Roman) -> Roman {
        let r: Roman = Roman(value: first.base10Value + second.base10Value);
        return r;
    }
    static func subtract(first: Roman, second: Roman) -> Roman {
        // If second > first then results are 0 because negatives can't be represented with roman numerals
        let r: Roman = Roman(value: first.base10Value - second.base10Value);
        return r;
    }
    static func multiply(first: Roman, second: Roman) -> Roman {
        let r: Roman = Roman(value: first.base10Value * second.base10Value);
        return r;
    }
    static func divide(first: Roman, second: Roman) -> Roman {
        let r: Roman = Roman(value: first.base10Value / second.base10Value);
        return r;
    }

    func equals(_ other: Roman) -> Bool {
        return self.base10Value == other.base10Value;
    }
    func lessThan(_ other: Roman) -> Bool {
        return self.base10Value < other.base10Value;
    }
    func greaterThan(_ other: Roman) -> Bool {
        return self.base10Value > other.base10Value;
    }

    init(value: Int) {
        if value < 0 || value > 3999 {
            self.base10Value = 0;
            self.romanValue = "";
        } else {
            let romanValue = base10ToRoman(value: value);
            self.base10Value = value;
            self.romanValue = romanValue;
        }
    }
}

let r1: Roman = Roman(value: 5);
let r2: Roman = Roman(value: 10);
let r3: Roman = Roman.add(first: r1, second: r2);
print(r3.base10Value);
print(r3.romanValue);