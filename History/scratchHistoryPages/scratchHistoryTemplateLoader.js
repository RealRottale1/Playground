const templateData = {
    '0': {
        pointName: 'Early Scratch',
        description: 'This time period is between the time I created my Scratch account (some time in February of 2019) and right before I created the game titled THE ROAD (exact date lost to time). This time period is mainly defined by my very primitive code, which lacked many variables and if statements. The most advanced game from this time period has to be my game titled Dart Thrower as it is one of the first games.',
        importance: 'This time period is very important because it is responsible for me falling in love with programming. Without Scratch I would not have found my passion and future career.',
        firstName: 'bear',
        firstImage: '../images/bear.png',
        firstLink: 'https://scratch.mit.edu/projects/305376524/',
        secondName: 'Dart Thrower',
        secondImage: '../images/dartThrower.png',
        secondLink: 'https://scratch.mit.edu/projects/445073081/',
    },
    '1': {
        pointName: 'If Revolution',
        description: 'This time period is between the creation of THE ROAD and the creation of MAKE MONEY. This period is mainly defined by the character (a simple 2D person) and the first mass use of variables and if statements. The most advanced game from this time period has to be MAKE MONEY because it was the first game to have working NPCs and a fully functioning multi-tile system (multiple rooms separated by the screen).',
        importance: 'This time period is important because it revolutionized not only how I make games but also what games I could make. This time period is also important because it was responsible for getting me into Roblox Studio, which would become the next big step in my coding journey.',
        firstName: 'THE ROAD',
        firstImage: '../images/theRoad.png',
        firstLink: 'https://scratch.mit.edu/projects/462659393/',
        secondName: 'MAKE MONEY',
        secondImage: '../images/makeMoney.png',
        secondLink: 'https://scratch.mit.edu/projects/462991327/',
    },
    '2': {
        pointName: 'Late Scratch',
        description: 'This time period is between the creation of Untitled-8 and my last Scratch game (Red Battle). This time period is mainly defined by heavy innovation, as every game I made used newer technology than the previous one. The most advanced game from this time period has to be Red Battle because of its state-of-the-art technology, like enemy AIs and a working checkpoint system.',
        importance: 'This time period is very important because it is where I learned the most about programming concepts. This time period is also important because it is when I started to see the limitations of Scratch and is responsible for making me fully switch over to Roblox Studio.',
        firstName: 'Untitled-8',
        firstImage: '../images/untitled-8.png',
        firstLink: 'https://scratch.mit.edu/projects/469755083/',
        secondName: 'Red Battle',
        secondImage: '../images/redBattle.png',
        secondLink: 'https://scratch.mit.edu/projects/631315810/',
    },
};

let pageID = window.location.search.replace('?pageID=','');
if (!templateData[pageID]) {
    pageID = '0';
};

const aboutTitle = document.getElementById('about_title');
const aboutDescription = document.getElementById('about_description');
const aboutImportance = document.getElementById('importance_description');
const firstName = document.getElementById('first_name');
const secondName = document.getElementById('second_name');
const game1Image = document.getElementById('game_1_img');
const game2Image = document.getElementById('game_2_img');
const playGame1 = document.getElementById('first_game');
const playGame2 = document.getElementById('second_game');
const seeGame1 = document.getElementById('see_inside_1');
const seeGame2 = document.getElementById('see_inside_2');

aboutTitle.textContent = templateData[pageID].pointName;
aboutDescription.textContent = templateData[pageID].description;
aboutImportance.textContent = templateData[pageID].importance;
firstName.textContent = templateData[pageID].firstName;
secondName.textContent = templateData[pageID].secondName;
game1Image.src = templateData[pageID].firstImage;
game2Image.src = templateData[pageID].secondImage;

playGame1.addEventListener('click', function() {
    window.open(templateData[pageID].firstLink, '_blank');
});

playGame2.addEventListener('click', function() {
    window.open(templateData[pageID].secondLink, '_blank');
});

seeGame1.addEventListener('click', function() {
    window.open(templateData[pageID].firstLink+'editor/', '_blank');
});

seeGame2.addEventListener('click', function() {
    window.open(templateData[pageID].secondLink+'editor/', '_blank');
});