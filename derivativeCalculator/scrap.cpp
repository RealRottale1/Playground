        static bool solveSimpleMath(nugget& n, nugget& prevNugget, nugget& nextNugget) {
            int newNumerator = 0;
            int newDenominator = 0;
            bool bothAreNumbers = (!prevNugget.isVariable && !nextNugget.isVariable);
            bool bothAreVariables = (prevNugget.isVariable && nextNugget.isVariable);
            if (n.operation == '^') { // Power
                if (nextNugget.numerator < 0) {
                    nextNugget.numerator *= -1;
                    int savedNumerator = prevNugget.numerator;
                    prevNugget.numerator = prevNugget.denominator;
                    prevNugget.denominator = savedNumerator;
                }
                long long powerNum = std::pow(prevNugget.numerator, nextNugget.numerator);
                long long powerDen = std::pow(prevNugget.denominator, nextNugget.numerator);
                std::optional<int> rootNum = getPerfectRoot(powerNum, nextNugget.denominator);
                std::optional<int> rootDen = getPerfectRoot(powerDen, nextNugget.denominator);
                if (rootNum.has_value() && rootDen.has_value()) {
                    newNumerator = rootNum.value();
                    newDenominator = rootDen.value();
                } else {
                    return false;
                }
            } else if (n.operation == '*') { // Multiplication
                newNumerator = prevNugget.numerator * nextNugget.numerator;
                newDenominator = prevNugget.denominator * nextNugget.denominator;
                if (bothAreVariables) {
                    
                }
                if (nextNugget.isVariable) {
                    prevNugget.isVariable = true;
                }
            } else if (n.operation == '/') { // Division
                newNumerator = prevNugget.numerator * nextNugget.denominator;
                newDenominator = prevNugget.denominator * nextNugget.numerator;
                if (bothAreVariables) {
                    prevNugget.isVariable = false;
                }
            } else { // Addition & Subtraction
                if (bothAreVariables || bothAreNumbers) {
                    int cross1 = prevNugget.numerator * nextNugget.denominator;
                    int cross2 = prevNugget.denominator * nextNugget.numerator;
                    if (n.operation == '+') {
                        newNumerator = cross1 + cross2;
                    } else {
                        newNumerator = cross1 - cross2;
                    }
                    newDenominator = prevNugget.denominator * nextNugget.denominator;
                } else {
                    return false; // Cant simplify x + 2
                }
            }

            // ensures numerator is the only one negative
            if (newDenominator < 0) {
                newDenominator *= -1;
                newNumerator *= -1;
            }

            prevNugget.numerator = newNumerator;
            prevNugget.denominator = newDenominator;
            return true;
        }

        static void simplifyEquation(std::map<int, std::unordered_map<int, std::vector<nugget>>> &chunckedEquation, std::pair<std::unordered_map<int, int>, std::unordered_map<int, int>> &SEESRange) {
            std::cout << "--- ___ --- ___ ---" << std::endl;
            for (auto it = chunckedEquation.rbegin(); it != chunckedEquation.rend(); it++) {
                for (auto& [eI, equationData] : it->second) {

                    std::vector<std::set<char>> EMDAS = {{'^'},{'/','*'},{'+','-'}};
                    for (int i = 0; i < EMDAS.size(); i++) {
                        std::set<char> currentOperations = EMDAS[i];

                        auto it2 = equationData.rbegin();
                        while (it2 != equationData.rend()) {
                            auto& n = *it2;
                            if (n.isOperation && currentOperations.count(n.operation)) {
                                std::cout << "Operation: " << n.operation << std::endl;
                                auto& prevNugget = *std::prev(it2);
                                auto& nextNugget = *std::next(it2);
                                if (!prevNugget.isReference && !nextNugget.isReference) {
                                    bool simplified = solveSimpleMath(n, prevNugget, nextNugget);
                                    if (simplified) {
                                        auto opBaseIt = it2.base(); 
                                        equationData.erase(opBaseIt - 1);
                                        equationData.erase(opBaseIt - 2);
                                        it2 = equationData.rbegin();
                                    } else {
                                        ++it2;
                                    }
                                } else {
                                    ++it2;
                                }
                            } else {
                                ++it2;
                            }
                        }
                    }
                }
           }
        }

                static std::optional<int> getPerfectRoot(long long base, int rootIndex) {
            if (rootIndex < 1) return std::nullopt; 
            if (base == 0) return 0;
            if (base == 1) return 1;
            bool isNegative = (base < 0);
            if (isNegative && (rootIndex % 2 == 0)) return std::nullopt;
            double guess = std::pow(static_cast<double>(std::abs(base)), 1.0 / rootIndex);
            int roundedGuess = static_cast<int>(std::round(guess));
            long long check = 1;
            for (int i = 0; i < rootIndex; ++i) {
                check *= roundedGuess;
                if (check > std::abs(base) && i < rootIndex - 1) return std::nullopt;
            }
            if (check == std::abs(base)) {
                return isNegative ? -roundedGuess : roundedGuess;
            }
            return std::nullopt;
        }