#include <iostream>
#include <string>
#include <set>
#include <map>
#include <unordered_map>
#include <utility>
#include <vector>
#include <array>
#include <optional>
#include <cmath>

struct nugget {
    bool isOperation;
    bool isReference;
    bool isVariable;
    int numerator;
    int denominator;
    char operation;
    int reference;
    char variable;
    nugget(bool iO, bool iR, bool iV, int n, int d, char o, int r, char v) {
        isOperation = iO;
        isReference = iR;
        isVariable = iV;
        numerator = n;
        denominator = d;
        operation = o;
        reference = r;
        variable = v;
    }
};

class Equation {
    public:
        /* Printers */
        static void displayBracketData(std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> &bracketData, std::string &eq) {
            std::cout << "DisplayBracketData ---" << std::endl;
            for (auto it = bracketData.rbegin(); it != bracketData.rend(); it++) {
                const auto& [depthAmount, data] = *it;
                
                std::cout << "Depth: " << depthAmount << std::endl;
                for (const auto& [rangeData, depthVector] : data) {
                    std::cout << "sI: " << rangeData.first << ", eI: " << rangeData.second << " | D: ";
                    for (int d : depthVector) {
                        std::cout << d << ", "; 
                    }
                    std::cout << "| Str: " << eq.substr(rangeData.first, (rangeData.second - rangeData.first) + 1);
                    std::cout << std::endl;
                }
            }
            std::cout << "---" << std::endl;
            std::cout << std::endl;
        }

        static void displayChunckedEquation(std::map<int, std::unordered_map<int, std::vector<nugget>>> &chunckedEquation, std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> &SEESRange) {
            std::cout << "DisplayChunckedEquation ---" << std::endl;
            for (auto it = chunckedEquation.rbegin(); it != chunckedEquation.rend(); it++) {
                std::cout << "Depth:" << it->first << std::endl;
                for (const auto& [eI, equationData] : it->second) {
                    std::cout << "eI: " << eI << "| Eq: ";
                    for (auto it2 = equationData.rbegin(); it2 != equationData.rend(); it2++) {
                        const auto& n = *it2;
                        if (n.isOperation) {
                            std::cout << n.operation;
                        } else if (n.isReference) {
                            std::cout << "Ref" << n.reference;
                        } else if (n.isVariable) {
                            std::cout << "(" << n.numerator << "/" << n.denominator << ")x";
                        } else {
                            std::cout << "(" << n.numerator << "/" << n.denominator << ")";
                        }
                    }
                    std::cout << std::endl;
                }
            }
            std::cout << "---" << std::endl;
            std::cout << std::endl;
        }


        /* Helpers */
        static std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> getSEESRange(std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> &bracketData) {
            std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> SEESRange = {};
            for (const auto& [_, data] : bracketData) {
                for (const auto& [rangeData, _] : data) {
                    SEESRange.first.insert({rangeData.first, rangeData.second});
                    SEESRange.second.insert({rangeData.second, rangeData.first});
                }
            }
            return SEESRange;
        }

        static std::optional<int> getPerfectRoot(long long base, int rootIndex) {
            if (rootIndex < 1) return std::nullopt; 
            if (base == 0) return 0;
            if (base == 1) return 1;
            bool isNegative = (base < 0);
            if (isNegative && (rootIndex % 2 == 0)) return std::nullopt;
            double guess = std::pow(static_cast<double>(std::abs(base)), 1.0 / rootIndex);
            int roundedGuess = static_cast<int>(std::round(guess));
            long long check = 1;
            for (int i = 0; i < rootIndex; ++i) {
                check *= roundedGuess;
                if (check > std::abs(base) && i < rootIndex - 1) return std::nullopt;
            }
            if (check == std::abs(base)) {
                return isNegative ? -roundedGuess : roundedGuess;
            }
            return std::nullopt;
        }

        /* Cores */
        static std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> getBracketData(std::string &eq) {
            std::vector<std::pair<int, bool>> brackets = {};
            int i = 0;
            for (char c : eq) {
                if (c == '(') {
                    brackets.push_back({i, true});
                } else if (c == ')') {
                    brackets.push_back({i, false});
                }
                i ++;
            }

            // Depth: {<<sI, eI>, {DepthVector}>}
            std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData = {};
            std::vector<int> openBrackets = {};
            i = 0;
            for (const auto& [stringIndex, isOpen] : brackets) {
                if (isOpen) {
                    openBrackets.push_back(i);
                } else {
                    auto& [openStringIndex, _] = brackets[openBrackets.back()];
                    openBrackets.pop_back();

                    std::vector<int> depth = {};
                    int openBracketsSize = openBrackets.size();
                    if (openBracketsSize > 0) {
                        for (int j = openBracketsSize - 1; j >= 0; j--) {
                            depth.push_back(brackets[openBrackets[j]].first);
                        }
                    }
                    int depthAmount = depth.size();
                    bracketData[depthAmount].push_back({{openStringIndex, stringIndex}, depth});
                }
                i++;
            }

            return bracketData;
        }

        static std::map<int, std::unordered_map<int, std::vector<nugget>>> getChunckedEquation(std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> &bracketData, std::string &eq, std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> &SEESRange) {
            std::map<int, std::unordered_map<int, std::vector<nugget>>> equationMemoryMap = {};
            for (auto it = bracketData.rbegin(); it != bracketData.rend(); it++) {
                const auto& [depthAmount, data] = *it;
                for (const auto& [rangeData, depthVector] : data) {
                    int sI = rangeData.first;
                    int eI = rangeData.second;
                    std::vector<nugget> bracketMemoryVector = {};

                    int lastSnipIndex = eI - 1;
                    bool priorWasNumber = false;
                    std::set<char> opMarks= {'-', '+', '*', '/', '^'};
                    for (int i = eI - 1; i >= sI; i--) {
                        std::optional<char> r = (i - 1 >= sI) ? std::optional<char>(eq[i-1]) : std::nullopt;
                        if (eq[i] == ')') {
                            i = SEESRange.second.at(i);
                            //std::cout << "ES" << i << std::endl;
                        } else {
                            if (opMarks.count(eq[i]) || (i == sI)) {
                                std::optional<char> l = (i + 1 < eI) ? std::optional<char>(eq[i+1]) : std::nullopt;
                                bool isNegative = (eq[i] == '-' && r.has_value() && (opMarks.count(r.value()) || r.value() == '(') && l.has_value() && !opMarks.count(l.value()));
                                if (!isNegative) {
                                    // Uses reference
                                    if (eq[i+1] == '(') {
                                        nugget n1(false, true, false, 0, 0, ' ', SEESRange.first.at(i+1), ' ');
                                        bracketMemoryVector.push_back(n1);
                                    } else if (eq[i+1] == 'x' || eq[i+2] == 'x') { // Uses variable
                                        nugget n1(false, false, true, 1 * (eq[i+1]=='-' ? -1 : 1), 1, ' ', 0, 'x');
                                        bracketMemoryVector.push_back(n1);
                                    } else { // Uses number
                                        std::cout << eq[i] <<  eq[i+1] <<  eq[i+2] << std::endl;
                                        std::cout << "Num:" << eq.substr(i+1, lastSnipIndex - i) << std::endl;
                                        int numerator = std::stoi(eq.substr(i+1, lastSnipIndex - i));
                                        nugget n1(false, false, false, numerator, 1, ' ', 0, ' ');
                                        bracketMemoryVector.push_back(n1);
                                    }

                                    // Uses operation
                                    if (eq[i] != '(' && eq[i] != ')') {
                                        nugget n2(true, false, false, 0, 0, eq[i], 0, ' ');
                                        bracketMemoryVector.push_back(n2);
                                    }
                                    
                                    // std::cout << "Nums: " << eq.substr(i+1, lastSnipIndex - i) << std::endl;
                                    // std::cout << "Op: " << eq[i] << std::endl;
                                    // std::cout << lastSnipIndex << std::endl;
                                    lastSnipIndex = i-1;
                                }
                            }
                        }
                    }
                    equationMemoryMap[depthAmount][eI] = bracketMemoryVector;
                }
            }
            return equationMemoryMap;
        }

        static bool solveSimpleMath(nugget& n, nugget& prevNugget, nugget& nextNugget) {
            int newNumerator = 0;
            int newDenominator = 0;
            bool bothAreNumbers = (!prevNugget.isVariable && !nextNugget.isVariable);
            bool bothAreVariables = (prevNugget.isVariable && nextNugget.isVariable);
            if (n.operation == '^') { // Power
                if (bothAreVariables) {
                    return false; // x^x is as simple as it gets
                }
                if (nextNugget.numerator < 0) {
                    nextNugget.numerator *= -1;
                    int savedNumerator = prevNugget.numerator;
                    prevNugget.numerator = prevNugget.denominator;
                    prevNugget.denominator = savedNumerator;
                }
                long long powerNum = std::pow(prevNugget.numerator, nextNugget.numerator);
                long long powerDen = std::pow(prevNugget.denominator, nextNugget.numerator);
                std::optional<int> rootNum = getPerfectRoot(powerNum, nextNugget.denominator);
                std::optional<int> rootDen = getPerfectRoot(powerDen, nextNugget.denominator);
                if (rootNum.has_value() && rootDen.has_value()) {
                    newNumerator = rootNum.value();
                    newDenominator = rootDen.value();
                } else {
                    return false;
                }
            } else if (n.operation == '*') { // Multiplication
                newNumerator = prevNugget.numerator * nextNugget.numerator;
                newDenominator = prevNugget.denominator * nextNugget.denominator;
                if (bothAreVariables) {
                    
                }
                if (nextNugget.isVariable) {
                    prevNugget.isVariable = true;
                }
            } else if (n.operation == '/') { // Division
                newNumerator = prevNugget.numerator * nextNugget.denominator;
                newDenominator = prevNugget.denominator * nextNugget.numerator;
                if (bothAreVariables) {
                    prevNugget.isVariable = false;
                }
            } else { // Addition & Subtraction
                if (bothAreVariables || bothAreNumbers) {
                    int cross1 = prevNugget.numerator * nextNugget.denominator;
                    int cross2 = prevNugget.denominator * nextNugget.numerator;
                    if (n.operation == '+') {
                        newNumerator = cross1 + cross2;
                    } else {
                        newNumerator = cross1 - cross2;
                    }
                    newDenominator = prevNugget.denominator * nextNugget.denominator;
                } else {
                    return false; // Cant simplify x + 2
                }
            }

            // ensures numerator is the only one negative
            if (newDenominator < 0) {
                newDenominator *= -1;
                newNumerator *= -1;
            }

            prevNugget.numerator = newNumerator;
            prevNugget.denominator = newDenominator;
            return true;
        }

        static void simplifyEquation(std::map<int, std::unordered_map<int, std::vector<nugget>>> &chunckedEquation, std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> &SEESRange) {
            std::cout << "--- ___ --- ___ ---" << std::endl;
            for (auto it = chunckedEquation.rbegin(); it != chunckedEquation.rend(); it++) {
                for (auto& [eI, equationData] : it->second) {

                    std::vector<std::set<char>> EMDAS = {{'^'},{'/','*'},{'+','-'}};
                    for (int i = 0; i < EMDAS.size(); i++) {
                        std::set<char> currentOperations = EMDAS[i];

                        auto it2 = equationData.rbegin();
                        while (it2 != equationData.rend()) {
                            auto& n = *it2;
                            if (n.isOperation && currentOperations.count(n.operation)) {
                                std::cout << "Operation: " << n.operation << std::endl;
                                auto& prevNugget = *std::prev(it2);
                                auto& nextNugget = *std::next(it2);
                                if (!prevNugget.isReference && !nextNugget.isReference) {
                                    bool simplified = solveSimpleMath(n, prevNugget, nextNugget);
                                    if (simplified) {
                                        auto opBaseIt = it2.base(); 
                                        equationData.erase(opBaseIt - 1);
                                        equationData.erase(opBaseIt - 2);
                                        it2 = equationData.rbegin();
                                    } else {
                                        ++it2;
                                    }
                                } else {
                                    ++it2;
                                }
                            } else {
                                ++it2;
                            }
                        }
                    }
                }
           }
        }

        Equation(std::string &eq) {
            // Gets bracket data
            std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData = Equation::getBracketData(eq);
            Equation::displayBracketData(bracketData, eq);
            
            // Gets raw components and order of solving
            std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> SEESRange = Equation::getSEESRange(bracketData);
            std::map<int, std::unordered_map<int, std::vector<nugget>>> chunckedEquation = Equation::getChunckedEquation(bracketData, eq, SEESRange);
            Equation::displayChunckedEquation(chunckedEquation, SEESRange);

            Equation::simplifyEquation(chunckedEquation, SEESRange);
            Equation::displayChunckedEquation(chunckedEquation, SEESRange);
        }
};

int main() {
    std::string eq = "(x^x^x)";//"((2+-x/2+2)*(-2))";
    Equation newEquation(eq);
    return 0;
}