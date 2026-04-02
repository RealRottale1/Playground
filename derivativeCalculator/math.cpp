#include <iostream>
#include <string>
#include <set>
#include <map>
#include <unordered_map>
#include <utility>
#include <vector>
#include <array>
#include <optional>

struct nugget {
    bool isOperation;
    bool isReference;
    int numerator;
    int denominator;
    char operation;
    int reference;
    nugget(bool iO, bool iR, int n, int d, char o, int r) {
        isOperation = iO;
        isReference = iR;
        numerator = n;
        denominator = d;
        operation = o;
        reference = r;
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
                    for (const auto& n : equationData) {
                        if (n.isOperation) {
                            std::cout << n.operation;
                        } else if (n.isReference) {
                            std::cout << "Ref" << n.reference;
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
                                bool isNegative = (eq[i] == '-' && r.has_value() && opMarks.count(r.value()) && l.has_value() && !opMarks.count(l.value()));
                                if (!isNegative) {
                                    // Uses reference
                                    if (eq[i+1] == '(') {
                                        nugget n1(false, true, 0, 0, ' ', SEESRange.first.at(i+1));
                                        bracketMemoryVector.push_back(n1);
                                    } else { // Uses number
                                        int numerator = std::stoi(eq.substr(i+1, lastSnipIndex - i));
                                        nugget n1(false, false, numerator, 1, ' ', 0);
                                        bracketMemoryVector.push_back(n1);
                                    }

                                    // Uses operation
                                    if (eq[i] != '(' && eq[i] != ')') {
                                        nugget n2(true, false, 0, 0, eq[i], 0);
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

        Equation(std::string &eq) {
            // Gets bracket data
            std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData = Equation::getBracketData(eq);
            Equation::displayBracketData(bracketData, eq);
            
            // Gets raw components and order of solving
            std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> SEESRange = Equation::getSEESRange(bracketData);
            // [Note!]: std::vector<nugget> is backwards so read from left to right when solving
            std::map<int, std::unordered_map<int, std::vector<nugget>>> chunckedEquation = Equation::getChunckedEquation(bracketData, eq, SEESRange);
            Equation::displayChunckedEquation(chunckedEquation, SEESRange);
        }
};

int main() {
    std::string eq = "((2/-3)*(4)^(5/3)+(32*(7+3))*(2)^(2))";
                //"((2/-3)*(x)^(5/3)^((3/7)*(x/2)^(2)))";
    Equation newEquation(eq);
    return 0;
}