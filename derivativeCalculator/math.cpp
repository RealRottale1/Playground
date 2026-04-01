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
        }

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

        static void getSolvedPieces(std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> &bracketData, std::string &eq) {
            // Id, []
            for (auto it = bracketData.rbegin(); it != bracketData.rend(); it++) {
                const auto& [depthAmount, data] = *it;
                for (const auto& [rangeData, depthVector] : data) {
                    int sI = rangeData.first;
                    int eI = rangeData.second;
                    std::vector<nugget> bracketMemoryVector = {};
/*
Add to a map with key=endindex
when getting in data if i == key then link it and skip over it
*/
                    int lastSnipIndex = eI - 1;
                    bool priorWasNumber = false;
                    std::set<char> opMarks= {'-', '+', '*', '/', '^'};
                    for (int i = eI - 1; i >= sI; i--) {
                        std::optional<char> r = (i - 1 >= sI) ? std::optional<char>(eq[i-1]) : std::nullopt;
                        if (opMarks.count(eq[i]) || (i == sI)) {
                            std::optional<char> l = (i + 1 < eI) ? std::optional<char>(eq[i+1]) : std::nullopt;
                            bool isNegative = (eq[i] == '-' && r.has_value() && opMarks.count(r.value()) && l.has_value() && !opMarks.count(l.value()));
                            if (!isNegative) {
                                int numerator = std::stoi(eq.substr(i+1, lastSnipIndex - i));
                                nugget n1(false, false, numerator, 1, ' ', 0);
                                bracketMemoryVector.push_back(n1);

                                if (eq[i] != '(' && eq[i] != ')') {
                                    nugget n2(true, false, 0, 0, eq[i], 0);
                                    bracketMemoryVector.push_back(n2);
                                }
                                
                                std::cout << "Nums: " << eq.substr(i+1, lastSnipIndex - i) << std::endl;
                                std::cout << "Op: " << eq[i] << std::endl;
                                std::cout << lastSnipIndex << std::endl;
                                lastSnipIndex = i-1;
                            }
                        }
                        //std::cout << eq[i] << std::endl;
                    }
                    std::cout << std::endl;
                }
            }
        }

        Equation(std::string &eq) {
            std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData = Equation::getBracketData(eq);
            Equation::displayBracketData(bracketData, eq);
            
            Equation::getSolvedPieces(bracketData, eq);
        }
};

int main() {
    std::string eq = "((2/-3)*(4)^(5/3)+(32*(7+3))*(2)^(2))";
                //"((2/-3)*(x)^(5/3)^((3/7)*(x/2)^(2)))";
    Equation newEquation(eq);
    return 0;
}
  
/*
This should work! Go get em tiger!
Evaluate using EMPDAS
In Map set endIndex as key and value as value. Once calculated skip to startIndex
*/