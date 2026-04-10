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
#include <memory>

struct Block {
    virtual std::string output() = 0;
    virtual ~Block() = default;
};

struct Value : Block {
    long long n;
    long long d;
    bool isNegative;
    char v;

    Value(long long n, long long d, bool isNegative, char v) {
        this->n = n;
        this->d = d;
        this->isNegative = isNegative;
        this->v = v;
    }

    bool hasVariable() {
        return v != ' ';
    }

    std::string output() override {
        return (isNegative ? "-" : "") + (hasVariable() ? std::string(1, v) : "") + std::to_string(n) + '/' + std::to_string(d);
    }
};

struct Operation : Block  {
    char sign;

    Operation(char sign) {
        this->sign = sign;
    }

    std::string output() override {
        return std::string(1, sign);
    }
};

struct Line {
    
    std::unordered_map<Block*, Line*> powerData = {};
    std::vector<Block*> lineData = {};

    Line() {
    }

    void pushBlock(Block* b) {
        std::cout << "Ref: " << b << std::endl;
        lineData.push_back(b);
    }

    void output() {
        for (auto& b : lineData) {
            std::cout << (*b).output();
            if (powerData.find(&(*b)) != powerData.end()) {
                Line* powerParent = powerData.at(&(*b));
                std::cout << "^(";
                powerParent->output();
                std::cout << ")";
            }
        }
    }
};

int main() {
    // Main Line
    Line line1 = {};
    Value v1(1, 1, false, ' ');
    Operation o1('*');
    Value v2(1, 1, false, 'x');
        line1.pushBlock(&v1);
        line1.pushBlock(&o1);
        line1.pushBlock(&v2);

    // Exponent Line
    Line line2 = {};
    Value v3(1, 1, false, 'x');
    Operation o2('+');
    Value v4(1, 1, false, ' ');
        line2.pushBlock(&v3);
        line2.pushBlock(&o2);
        line2.pushBlock(&v4);

    // Attaching both lines
    line1.powerData[&v2] = &line2;

    std::cout << "&v2:" << &v2 << std::endl;
    line1.output();
    return 0;
}

// 2 * x * x ^ (x+1)
// (2 * x * x ^ (x+1)) * x

// Each line is a line
// Each value and operation is a block
