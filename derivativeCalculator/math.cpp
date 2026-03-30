#include <iostream>
#include <string>
#include <set>
#include <map>
#include <utility>
#include <vector>
#include <array>

class Equation {
    public:

        static void displayBracketData(std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData, std::string &eq) {
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

        Equation(std::string &eq) {
            std::map<int, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData = Equation::getBracketData(eq);
            Equation::displayBracketData(bracketData, eq);
        }
};

int main() {
    std::string eq = "((2/-3)*(x)^(5/3)+(32*(7+x))*(x)^(2))";
                //"((2/-3)*(x)^(5/3)^((3/7)*(x/2)^(2)))";
    Equation newEquation(eq);
    return 0;
}
  
/*
This should work! Go get em tiger!
Evaluate using EMPDAS
In Map set endIndex as key and value as value. Once calculated skip to startIndex
*/