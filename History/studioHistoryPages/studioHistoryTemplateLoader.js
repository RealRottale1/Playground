const templateData = {
    '0': {
        pointName: 'Early Studio',
        description: 'In this game you find yourself in a wacky dream world filled with loads of people to meet and places to explore. Your main objective is to find a way out of the dream.',
        importance: 'As this is my first real Roblox game, it has loads of achievements. For starters, this game was my first Roblox game where I actually programmed stuff. This game was also my first time using a real programming language (that being Luau).',
        firstName: 'Dream World I',
        firstImage: '../images/dreamworldI.png',
        firstLink: 'https://www.roblox.com/games/6157355653/Dream-world-I',
        secondName: 'Car Obby',
        secondImage: '../images/carObby.png',
        secondLink: 'https://www.roblox.com/games/7028222897/Car-Obby',
    },
};

let pageID = window.location.search.replace('?pageID=','');
if (!templateData[pageID]) {
    pageID = '0';
};

const aboutTitle = document.getElementById('about_title');
const aboutDiv = document.getElementById('about');
const aboutDescription = document.getElementById('about_description');
const aboutImportance = document.getElementById('importance_description');
const playGameButton = document.getElementById('play_button');
const firstName = document.getElementById('game_title1');
const secondName = document.getElementById('game_title2');
const game1Image = document.getElementById('gameplay1_img');
const game2Image = document.getElementById('gameplay2_img');
const playGame1 = document.getElementById('play_button1');
const playGame2 = document.getElementById('play_button2');

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