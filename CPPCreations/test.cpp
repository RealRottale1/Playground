#include <iostream>
#include <string>
#include <vector>
#include <array>
#include <deque>
#include <map>
#include <algorithm>
#include <cmath>

std::string solveEquation(std::string &equation)
{
    //std::cout << "Raw Data: " << equation <<std::endl;
    std::deque<std::string> tokenedEquation;
    std::string tempString = "";
    for (int i = equation.length() - 1; i >= 0; i--)
    {
        if (equation[i] == ' ')
        {
            equation.erase(equation.begin() + i);
        }
        else
        {
            if (std::isdigit(equation[i]) || equation[i] == '.')
            {
                tempString = equation[i] + tempString;
            }
            else
            {
                if (tempString.length() > 0)
                {
                    tokenedEquation.push_front(tempString);
                    tempString.erase(tempString.begin(), tempString.end());
                }
                std::string charToString(1, equation[i]);
                tokenedEquation.push_front(charToString);
            }
        }
    }

    /*std::cout << "Tokened Data: ";
    for (int i = 0; i < tokenedEquation.size(); i++)
    {
        std::cout << tokenedEquation[i];
    }
    std::cout << std::endl;*/

    std::vector<std::vector<std::array<int, 2>>> sections;
    const int tokenedEquationSize = tokenedEquation.size();

    std::vector<std::array<int, 2>> tempVector;
    int counter = 0;
    int totalCounted = -1;
    for (int i = 0; i < tokenedEquationSize; i++)
    {
        if (tokenedEquation[i] == "(")
        {
            counter += 1;
            totalCounted += 1;
            tempVector.push_back({i, 0});
        }
        else if (tokenedEquation[i] == ")")
        {
            counter -= 1;
            if (!counter)
            {
                tempVector[0][1] = i;
                sections.push_back(tempVector);
                tempVector.clear();
                totalCounted = -1;
            }
            else
            {
                tempVector[totalCounted][1] = i;
            }
        }
    }

    /*std::cout << "Sectioned Data: ";
    for (int i = 0; i < sections.size(); i++)
    {
        for (int j = 0; j < sections[i].size(); j++)
        {
            std::cout << sections[i][j][0] << " to " << sections[i][j][1] << ", ";
        }
        std::cout << " | ";
    }
    std::cout << std::endl;*/

    std::map<int, std::vector<std::array<int, 2>>> priorityParentheses;
    const int sectionsSize = sections.size();
    for (int i = 0; i < sectionsSize; i++)
    {
        const int sectionsContentetsSize = sections[i].size();
        for (int j = 0; j < sectionsContentetsSize; j++)
        {
            const int difference = sections[i][j][1] - sections[i][j][0];
            if (priorityParentheses.find(difference) != priorityParentheses.end())
            {
                priorityParentheses[difference].push_back({sections[i][j][0], sections[i][j][1]});
            }
            else
            {
                std::vector<std::array<int, 2>> initialVector;
                initialVector.push_back({sections[i][j][0], sections[i][j][1]});
                priorityParentheses[difference] = initialVector;
            }
        }
    }

    /*std::cout << "Priority Data: " << std::endl;
    for (auto &pair : priorityParentheses)
    {
        std::cout << "Difference: " << pair.first << std::endl;
        const int pairSize = pair.second.size();
        for (int i = 0; i < pairSize; i++)
        {
            std::cout << pair.second[i][0] << ", end: " << pair.second[i][1] << std::endl;
        }    
    }*/

    const std::array<std::string, 5> EMDASOperators= {"^", "*", "/", "+", "-"};
    auto EMDAS = [&EMDASOperators] (std::vector<std::string> &equation, int returnIndex)
    {
        auto solveEMDAS = [] (int i, std::string &previous, std::string &following)
        {
            std::string solvedEquation;
            switch (i) {
                case (0):
                    solvedEquation = std::to_string(std::pow(std::stod(previous), std::stod(following)));
                    break;
                case (1):
                    solvedEquation = std::to_string(std::stod(previous) * std::stod(following));
                    break;
                case (2):
                    solvedEquation = std::to_string(std::stod(previous) / std::stod(following));
                    break;
                case (3):
                    solvedEquation = std::to_string(std::stod(previous) + std::stod(following));
                    break;
                case (4):
                    solvedEquation = std::to_string(std::stod(previous) - std::stod(following));
                    break;
            }
            //std::cout << solvedEquation << std::endl;
            return solvedEquation;
        };
        
        for (int i = 0; i < 5; i++)
        {
            auto equationIterator = std::find(equation.begin(), equation.end(), EMDASOperators[i]); 
            while (equationIterator != equation.end())
            {
                /*std::cout << "Info ";
                for (int a = 0; a < equation.size(); a++)
                {
                    std::cout << equation[a];
                }
                std::cout << std::endl;*/
                const int operatorPosition = std::distance(equation.begin(), equationIterator);
                //std::cout << "Position: " << operatorPosition << std::endl;
                //std::cout << equation[operatorPosition-1] << "," << equation[operatorPosition+1] << std::endl;
                equation[operatorPosition-1] = solveEMDAS(i, equation[operatorPosition-1], equation[operatorPosition+1]);
                equation.erase(equation.begin() + operatorPosition, equation.begin() + operatorPosition + 2);
                equationIterator = std::find(equation.begin(), equation.end(), EMDASOperators[i]); 
            }
        }
        return equation[returnIndex];
    };

    auto adjustPriorityParenthesesSize = [&priorityParentheses] (int start, int end)
    {
        for (auto &pair : priorityParentheses)
        {
            const int pairSize = pair.second.size();
            for (int i = 0; i < pairSize; i++)
            {
                const int difference = end - start;
                if (pair.second[i][0] <= start && pair.second[i][1] >= end)
                {
                    pair.second[i][1] -= difference;
                } 
                else if (start <= pair.second[i][0]) {
                    pair.second[i][0] -= difference;
                    pair.second[i][1] -= difference;
                }
            }
        }
    };

    //std::cout << std::endl << std::endl << std::endl;

    for (auto &pair : priorityParentheses)
    {
        const int pairSize = pair.second.size();
        for (int i = 0; i < pairSize; i++)
        {
            const int start = pair.second[i][0];
            const int end = pair.second[i][1];
            std::vector<std::string> tempVector = {tokenedEquation.begin() + start, tokenedEquation.begin() + end + 1};
            tokenedEquation[start] = EMDAS(tempVector, 1);
            tokenedEquation.erase(tokenedEquation.begin() + start + 1, tokenedEquation.begin() + end + 1);
            adjustPriorityParenthesesSize(start, end);
            for (int j = 0; j < tokenedEquation.size(); j++)
            {
                std::cout << tokenedEquation[j];
            }
            std::cout << std::endl;
        }
    }

    std::vector<std::string> finalTempVector = {tokenedEquation.begin(), tokenedEquation.end()};
    std::string finalAnswer = EMDAS(finalTempVector, 0);

    return finalAnswer;
}

int main()
{
    //((2-3)*4-(7^3)/4)+90/2+(5^2)^2
    std::string equation = "2+(2+2)-(3+4)+((2/6)+((2+5)))+(9+2)+2";
    std::string answer = solveEquation(equation);
    std::cout << "Answer: " << answer << std::endl;
    return 0;
}