const equationHolder = document.getElementById('equationHolder');
const balanceButton = document.getElementById('balanceButton');
const answerText = document.getElementById('answer');

async function waitTick() {
    return new Promise((results) => {
        setTimeout(() => {
            results();
        }, 0.0025);
    });
};

async function balance(source) {
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
            console.log(portionSize);
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
            if (number) {
                portionTable[element] = number;
                element = '';
                number = ''
            };
            equationSection.push(portionTable);
            part = part.replace('+', '');
            startIndex = endIndex;
        };
        return(sections);
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
                answerText.textContent = 'Unclosed Equation!';
                throw new Error('Unclosed Equation!');
            };
        };
        return(true);
    };

    function nextMultiplier(index, length, reverse) {
        const combination = [];
        for (let i = 0; i < length; i++) {
            const digit = (!reverse ? (index%9)+1 : 9 - (index%9));
            combination.unshift(digit);
            index = Math.floor(index/9);
        };
        return(combination);
    };
    let equation = source.replaceAll(' ','');
    const midPoint = equation.indexOf('>');
    if (midPoint <= 0) {
        answerText.textContent = 'Invalid Equation!';
        throw new Error('Invalid Equation!');
    };
    let reactants = equation.slice(0, midPoint);
    let products = equation.slice(midPoint+1, equation.length);
    const equationTable = new equationClass;
    let totalParts = 0;
    totalParts += makeParts(equationTable.reactants, reactants, true);
    totalParts += makeParts(equationTable.products, products, false);
    let multiplier = [];
    const multiplierLength = equationTable.reactants.length + equationTable.products.length;
    for (let i = 0; i < multiplierLength; i++) {
        multiplier.push(1);
    };
    let multiplierI = 1;
    const maxLimit = (9**totalParts)/2;

    function tryMultiplier(reverse) {
        multiplier = nextMultiplier(multiplierI, multiplierLength, reverse);
        const solvedEquation = multiplyAndCalculate(structuredClone(equationTable), multiplier);
        return(solvedEquation);
    };

    while (true) {;
        answerText.textContent = `Max wait time: ~${(Math.round((maxLimit-multiplierI)*0.0000125)*1000)/1000}sec`
        const solvedEquation = tryMultiplier(false);
        if (solvedEquation) {
            return(`Multipliers are: ${multiplier}`);
        };

        const solvedReverseEquation = tryMultiplier(true);
        if (solvedReverseEquation) {
            return(`Multipliers are: ${multiplier}`);
        };

        multiplierI += 1;
        if (multiplierI >= maxLimit) {
            answerText.textContent = 'Equation Unsolvable/Too Big!';
            throw new Error('Equation Unsolvable/Too Big!');
        };

        if (!(multiplierI % 1000)) {
            await waitTick();
        };
    };
};

//Example Problem: Rb3P1O4 + H2O1 > Rb1O1H1 + H3P1O4 
balanceButton.addEventListener('click', async function() {
    answerText.textContent = 'Multiplier: Waiting!'
    const multiplier =  await balance(equationHolder.value);
    answerText.textContent = multiplier;
});