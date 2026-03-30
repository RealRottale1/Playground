#include <iostream>
#include <string>
#include <vector>
#include <array>
#include <optional>
#include <cctype>
#include <utility>
#include <string>
#include <cmath>
#include <numeric>

class Fraction {
    public:
        bool negative = false;
        long long numerator;
        long long denominator;

        static std::pair<long long, long long> splitString(Fraction &object, std::string &data, size_t dI) {
            object.negative = data[0] == '-';
            std::string nS = data.substr((object.negative) ? 1 : 0, dI);
            std::string dS = data.substr(dI + 1, data.size() - dI);
            long long n = std::stoll(nS);
            long long d = std::stoll(dS);
            return std::make_pair(n, d);
        }

        Fraction(std::string &data) {
            size_t dI = data.find('/');
            bool isDecimal = !(dI != std::string::npos);
            if (isDecimal) { dI = data.find('.');}
            if (!(dI != std::string::npos)) {
                long long w = std::stoll(data);
                if (w < 0) {
                    this->negative = true;
                    w = w * -1;
                }
                this->numerator = w;
                this->denominator = static_cast<long long>(1);
                return;
            }

            std::pair<long long, long long> f = Fraction::splitString(*this, data, dI);
            long long n = f.first;
            long long d = f.second;
            if (isDecimal) {
                long long p =  static_cast<long long>(std::pow(10, (data.size() - dI)));
                n = (n * p) + d;
                d = 10*p;
            }
            std::cout << "RAW " << n << " , " << d << std::endl;
            long long g = std::gcd(n, d);
            this->numerator = n / g;
            this->denominator = d / g;
        }
};

struct Chunk {
    Fraction lC;
    std::optional<Fraction> d;
    Chunk(Fraction lC, std::optional<Fraction> d) {
        this->lC = lC;
        this->d = d;
    }
};

class Equation {
    public:
        std::vector<Chunk> equationComponents;


        static void makeComponents(Equation &object, std::string &rawData) {
            std::vector<std::string> rawComponents;

            // Divide into raw components
            size_t rawDataSize = rawData.size();
            size_t startIndex = 0;
            for (size_t i = 0; i < rawDataSize; i++) {
                char *c = &rawData[i];
                bool isADigit = std::isdigit(*c);
                bool hasNext = (i+1) < rawDataSize;
                if ((isADigit || *c == '}' || *c == 'x') && (!hasNext || (*(c+1) == '+' || *(c+1) == '-'))) {
                    rawComponents.push_back(rawData.substr(startIndex, (i - startIndex) + 1));
                    startIndex = i + 1;
                }
            }

            // Create components
            for (size_t i = 0; i < rawComponents.size(); i++) {
                std::string *rD = &rawComponents[i];
                size_t rDSize = (*rD).size();
                size_t sI = (*rD).find('x');
                if (sI == std::string::npos) {
                    sI = rDSize;
                }
                std::string rLC = (*rD).substr(0, sI);
                Fraction lC(rLC);
                std::cout << "negative: " << lC.negative << " , " << lC.numerator << "/" << lC.denominator << " | " << *rD << std::endl;
                

                std::string useRawDegree;
                if (sI - (rDSize-1) == 0) {
                    useRawDegree = "1";
                } else if (sI > (rDSize-1)) {
                    // empty thing
                } else {
                    useRawDegree = (*rD).substr(sI + 1, (sI - rDSize-1));
                    std::cout << useRawDegree << std::endl;
                }

                std::cout << sI << " , " << rDSize-1 << std::endl;
            }
        }

        // static void displayEquation(Equation &object) {
        //     int equationComponentsSize = object.equationComponents.size();
        //     for (size_t i = 0; i < equationComponentsSize; i++) {
        //         std::cout << object.equationComponents[i].lC;
        //         if (object.equationComponents[i].d.has_value()) {
        //             std::cout << "x^" << object.equationComponents[i].d.value();
        //         }
        //         if (i + 1 < equationComponentsSize) {
        //             std::cout << "+";
        //         }
        //     }
        //     std::cout << std::endl;
        // }
        
        Equation(std::string rawData) {
            Equation::makeComponents(*this, rawData);
        }

};

int main() {

    Equation test1("-1/2x^{-2/3}-3x^{3}+5+2x^{1}+2x+3");
    //Equation test1("-1/2x^{-1/2}");
    // Equation::displayEquation(test1);

    return 0;
}
