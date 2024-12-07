
function balance(source) {
    class equationClass {
        reactants = [];
        products = [];
    };

    function makeParts(equationSection, part) {
        const sections = part.split('+').length;

        let startIndex = 0;
        for (let i = 0; i < sections; i++) {
            const endIndex = (part.indexOf('+') != -1 ? part.indexOf('+') : part.length);
            const portion = part.slice(startIndex, endIndex);

            const portionSize = portion.length;

            const portionTable = {}
            let element = '';
            let number = '';
            for (let j = 0; j < portionSize; j++) {
                const character = portion[j];
                if (isNaN(character)) {
                    if (number) {
                        portionTable[element] = number;
                        element = '';
                        number = ''
                    };
                    element += character;
                } else {
                    number += character;
                };
            };
            equationSection.push(portionTable);

            part = part.replace('+', '');
            startIndex = endIndex;
        };
    };

    function multiplyAndCalculate(equationTable, multiplier) {
        function multiply(section, sectionLength, multiplierStart) {
            for (let i = 0; i < sectionLength; i++) {
                const portion = section[i];
                const portionLength = Object.keys(portion).length;
                for (let j = 0; j < portionLength; j++) {
                    const element = Object.keys(portion)[j];
                    portion[element] *= multiplier[i+multiplierStart];
                };
            };
        };

        function merge(section, sectionLength) {
            for (let i = 1; i < sectionLength; i++) {
                const portion = section[i];
                const portionLength = Object.keys(portion).length;
                for (let j = 0; j < portionLength; j++) {
                    const element = Object.keys(portion)[j];
                    if (element in section[0]) {
                        section[0][element] += portion[element];
                    } else {
                        section[0][element] = portion[element];
                    };
                };
            };
            section.splice(1, sectionLength);
        };

        const reactantsLength = equationTable.reactants.length;
        const productsLength = equationTable.products.length;
        multiply(equationTable.reactants, reactantsLength, 0);
        multiply(equationTable.products, productsLength, reactantsLength);
        merge(equationTable.reactants, reactantsLength);
        merge(equationTable.products, productsLength);

        
        const allReactantsLength = Object.keys(equationTable.reactants[0]).length;
        for (let i = 0; i < allReactantsLength; i++) {
            const element = Object.keys(equationTable.reactants[0])[i]
            if (element in equationTable.products[0]) {
                if (equationTable.reactants[0][element] != equationTable.products[0][element]) {
                    return(false);
                };
            } else {
                throw new Error('Equation is missing 1 or more elements!');
            };
        };

        return(true);
    };

    function nextMultiplier(index, length) {
        const combination = [];
        for (let i = 0; i < length; i++) {
            const digit = (index%9)+1;
            combination.unshift(digit);
            index = Math.floor(index/9);
        };
        return(combination);
    };

    let equation = source.replaceAll(' ','');
    const midPoint = source.indexOf('>')-2;
    let reactants = equation.slice(0, midPoint-1);
    let products = equation.slice(midPoint, equation.length);
    
    const equationTable = new equationClass;
    makeParts(equationTable.reactants, reactants)
    makeParts(equationTable.products, products)


    console.log(equationTable);
    let multiplier = [];
    const multiplierLength = equationTable.reactants.length + equationTable.products.length;
    for (let i = 0; i < multiplierLength; i++) {
        multiplier.push(1);
    };

    let multiplierI = 1;
    while (true) {
        const solvedEquation = multiplyAndCalculate(structuredClone(equationTable), multiplier);
        if (solvedEquation) {
            return(`Multipliers are: ${multiplier}`);
        } else {
            multiplier = nextMultiplier(multiplierI, multiplierLength);
            multiplierI += 1;
            if (multiplierI >= 6562) {
                throw new Error('Equation went past 6561 combo limit!');
            };
        };
    };
};




//Rb3P1O4 + H2O1 > Rb1O1H1 + H3P1O4
const equation = 'Al2S3O12 + K1O1H1 > Al1O3H3 + K2S1O4';
console.log(balance(equation));