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
#include <memory>

enum class BlockType {Constant, Operation, Add, Multiply, Root, Variable};

struct Block {
    virtual std::string output() const = 0;
    virtual BlockType type() const = 0;
    virtual std::unique_ptr<Block> simplify() = 0;
    virtual ~Block() = default;
};

struct Root : Block {
    std::unique_ptr<Block> childPointer;
    std::string output() const override {
        return childPointer->output();
    }

    Root(std::unique_ptr<Block> c) {
        childPointer = std::move(c);
    }

    std::unique_ptr<Block> simplify() override {
        auto simpChild = childPointer->simplify();
        if (simpChild) {childPointer = std::move(simpChild);}
        return nullptr;
    }

    BlockType type() const override {
        return BlockType::Root;
    }
};

struct Constant : Block {
    long long numerator;
    long long denominator;
    bool isNegative;

    Constant(long long n, long long d, bool iN) {
        numerator = n;
        denominator = d;
        isNegative = iN;
    }

    std::string output() const override {
        return (isNegative ? '-' : ' ') + std::to_string(numerator) + '/' + std::to_string(denominator);
    }

    std::unique_ptr<Block> simplify() override {
        return nullptr;
    }

    BlockType type() const override {
        return BlockType::Constant;
    }
};

struct Variable : Block {
    std::string output() const override {
        return "x";
    }

    std::unique_ptr<Block> simplify() override {
        return nullptr;
    }

    BlockType type() const override {
        return BlockType::Variable;
    }
};

struct Operation : Block {
    std::vector<std::unique_ptr<Block>> children;
    std::string sign;

    std::string output() const override {
        std::string t = "(";
        int childrenSize = children.size();
        for (int i = 0; i < childrenSize; i++) {
            t += children[i]->output();
            if (i+1 != childrenSize) {t += sign;}
        }
        return t + ")";
    }

    virtual std::pair<long long, long long> solve(std::unique_ptr<Block> l, std::unique_ptr<Block> r) const = 0;

    Operation(std::unique_ptr<Block> l, std::unique_ptr<Block> r, std::string s) {
        children.push_back(std::move(l));
        children.push_back(std::move(r));
        sign = s;
    }
    
    void insert(std::unique_ptr<Block> m) {
        children.push_back(std::move(m));
    }

    std::unique_ptr<Block> simplify() override {
        for (auto& child : children) {
            auto simpChild = child->simplify();
            if (simpChild) {child = std::move(simpChild);}
        }
        std::vector<std::unique_ptr<Block>> flatChildren;
        for (auto& child : children) {
            if (child->type() == this->type()) {
                auto* childAdd = static_cast<Operation*>(child.get());
                for (auto& grandChild : childAdd->children) {
                    flatChildren.push_back(std::move(grandChild));
                }
            } else {
                flatChildren.push_back(std::move(child));
            }
        }
        children = std::move(flatChildren);

        for (int i = 0; i < children.size(); i++) {
            if (children[i]->type() == BlockType::Constant) {
                for (int j = children.size() - 1; j > i; j--) {
                    if (children[j]->type() == BlockType::Constant) {
                        std::pair<long long, long long> result = this->solve(std::move(children[i]), std::move(children[j]));
                        children.erase(children.begin() + j);
                        children[i] = std::make_unique<Constant>(std::abs(result.first), result.second, (result.first < 0));
                    }
                }
                break;
            }
        }

        if (children.size() == 1) {return std::move(children[0]);}
        return nullptr;
    }

    BlockType type() const override {
        return BlockType::Operation;
    }
};

struct Add : Operation {

    Add(std::unique_ptr<Block> l, std::unique_ptr<Block> r) : Operation(std::move(l), std::move(r), "+") {}

    std::pair<long long, long long> solve(std::unique_ptr<Block> ll, std::unique_ptr<Block> rr) const override {
        auto* l = static_cast<Constant*>(std::move(ll).get());
        auto* r = static_cast<Constant*>(std::move(rr).get());
        long long c1 = l->numerator * r->denominator;
        long long c2 = l->denominator * r->numerator;
        long long n = (l->isNegative ? -1 : 1) * c1 + (r->isNegative ? -1 : 1) * c2;
        long long d = l->denominator * r->denominator;
        return {n, d};
    }

    BlockType type() const override {
        return BlockType::Add;
    }
};

struct Multiply : Operation {

    Multiply(std::unique_ptr<Block> l, std::unique_ptr<Block> r) : Operation(std::move(l), std::move(r), "*") {}

    std::pair<long long, long long> solve(std::unique_ptr<Block> ll, std::unique_ptr<Block> rr) const override {
        auto* l = static_cast<Constant*>(std::move(ll).get());
        auto* r = static_cast<Constant*>(std::move(rr).get());
        long long n = ((l->isNegative ? -1 : 1) * l->numerator) * ((r->isNegative ? -1 : 1) * r->numerator);
        long long d = l->denominator * r->denominator;
        return {n, d};
    }

    BlockType type() const override {
        return BlockType::Multiply;
    }
};

int main() {
    auto c1 = std::make_unique<Constant>(2, 1, false);
    auto c2 = std::make_unique<Constant>(3, 1, false);
    auto c2 = std::make_unique<Constant>(0, 1, false);
    auto v1 = std::make_unique<Variable>();
    auto e1 = std::make_unique<Multiply>(std::move(c1), std::move(v1));
    e1->insert(std::move(c2));

    auto r = std::make_unique<Root>(std::move(e1));
    r->simplify();

    std::cout << r->output() << std::endl;
    return 0;
}