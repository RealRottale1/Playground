#include <iostream>
#include <string>
#include <vector>
#include <array>
#include <deque>
#include <map>
#include <algorithm>

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
                tempString += equation[i];
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
                priorityParentheses[difference].push_back({sections[i][j][0], difference});
            }
            else
            {
                std::vector<std::array<int, 2>> initialVector;
                initialVector.push_back({sections[i][j][0], difference});
                priorityParentheses[difference] = initialVector;
            }
        }
    }

    std::cout << "Priority Data: " << std::endl;
    for (auto &pair : priorityParentheses)
    {
        std::cout << "Difference: " << pair.first << std::endl;
        const int pairSize = pair.second.size();
        for (int i = 0; i < pairSize; i++)
        {
            std::cout << pair.second[i][0] << ", length: " << pair.second[i][1] << std::endl;
        }    
    }


    // std::cout << equation;
    return "  ";
}

int main()
{
    std::string equation = "((3+2)*(3+5-7))^2-5/6+(2-5)";
    std::cout << solveEquation(equation) << std::endl;
    return 0;
}