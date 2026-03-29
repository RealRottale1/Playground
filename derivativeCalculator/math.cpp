#include <iostream>
#include <string>
#include <set>
#include <map>
#include <utility>
#include <vector>
#include <array>

class Equation {
    public:

        static void displayBracketData(std::map<std::pair<int, int>, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData, std::string &eq) {
            std::cout << "DisplayBracketData ---" << std::endl;
            for (auto it = bracketData.rbegin(); it != bracketData.rend(); it++) {
                const auto& [keyData, data] = *it;
                
                std::cout << "Length: " << keyData.second << ", Depth: " << keyData.first << std::endl;
                for (const auto& [rangeData, depthVector] : data) {
                    std::cout << "sI: " << rangeData.first << ", eI: " << rangeData.second << " | D: ";
                    for (int d : depthVector) {
                        std::cout << d << ", "; 
                    }
                    std::cout << std::endl;
                }
            }
            std::cout << "---" << std::endl;
        }

        static std::map<std::pair<int, int>, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> getBracketData(std::string &eq) {
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

            // <Depth, Length>: {<<sI, eI>, {DepthVector}>}
            std::map<std::pair<int, int>, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData = {};
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
                        for (int j = openBracketsSize; j >= 0; j--) {
                            depth.push_back(brackets[openBrackets[j]].first);
                        }
                    }
                    int depthAmount = depth.size();

                    int length = (stringIndex - openStringIndex) + 1;
                    bracketData[{depthAmount, length}].push_back({{openStringIndex, stringIndex}, depth});
                }
                i++;
            }

            return bracketData;
        }

        Equation(std::string &eq) {
            std::map<std::pair<int, int>, std::vector<std::pair<std::pair<int, int>, std::vector<int>>>> bracketData = Equation::getBracketData(eq);
            Equation::displayBracketData(bracketData, eq);
        }
};

int main() {
    std::string eq = "((2/-3)*(x)^(5/3)+(3*(7+x))*(x)^(2))";
                //"((2/-3)*(x)^(5/3)^((3/7)*(x/2)^(2)))";
    Equation newEquation(eq);
    return 0;
}