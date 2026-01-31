#include <iostream>
#include <string>
#include <vector>
#include <array>
#include <optional>
#include <cctype>

struct Chunk {
    int lC;
    std::optional<int> d;
    Chunk(int lC, std::optional<int> d) {
        this->lC = lC;
        this->d = d;
    }
};

class Equation {
    public:
        std::vector<Chunk> equationComponents;

        static void makeComponents(Equation &object, std::string &rawData) {
            int rawDataSize = rawData.size();

            int sI = 0;
            std::optional<int> lC;
            for (size_t i = 0; i < rawDataSize; i++) {
                char *c = &rawData[i];
                switch (*c) {
                    case 'x': {
                        std::string lCString = rawData.substr(sI, (i - sI) + 1);
                        lC = std::stoi(lCString);
                        if ((i + 1) < rawDataSize && *(c+1) == '^') {
                            sI = i + 1;
                        } else {
                            Chunk data(lC.value(), 1);
                            object.equationComponents.push_back(data);
                            lC = std::nullopt;
                            sI = i + 1;
                        }
                        break;
                    } case '}': {
                        std::string dString = rawData.substr(sI + 2, (i - (sI + 2)) + 1);
                        Chunk data(lC.value(), std::stoi(dString));
                        object.equationComponents.push_back(data);
                        lC = std::nullopt;
                        sI = i + 1;
                        break;
                    } default: {
                        if (!std::isdigit(*c)) {
                            if (!lC.has_value() && (i - 1 >= 0) && std::isdigit(*(c-1))) {
                                std::string lCString = rawData.substr(sI, (i - sI));
                                Chunk data(std::stoi(lCString), std::nullopt);
                                object.equationComponents.push_back(data);
                                sI = i + 1;
                            }
                        }
                        break;
                    }
                }
            }
        }

        static void displayEquation(Equation &object) {
            int equationComponentsSize = object.equationComponents.size();
            for (size_t i = 0; i < equationComponentsSize; i++) {
                std::cout << object.equationComponents[i].lC;
                if (object.equationComponents[i].d.has_value()) {
                    std::cout << "x^" << object.equationComponents[i].d.value();
                }
                if (i + 1 < equationComponentsSize) {
                    std::cout << "+";
                }
            }
            std::cout << std::endl;
        }
        
        Equation(std::string rD) {
            std::string rawData = rD + " "; // Extra padding
            Equation::makeComponents(*this, rawData);
        }

};

int main() {

    Equation test1("2x^{-2}-3x^{3}+5+2x^{1}+2x+3s");
    Equation::displayEquation(test1);

    return 0;
}