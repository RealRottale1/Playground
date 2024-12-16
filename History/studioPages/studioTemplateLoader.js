const templateData = {
    '0': {
        name: 'Dream World I',
        image: '../images/dreamworldI.png',
        description: 'In this game you find yourself in a wacky dream world filled with loads of people to meet and places to explore. Your main objective is to find a way out of the dream.',
        importance: 'As this is my first real Roblox game, it has loads of achievements. For starters, this game was my first Roblox game where I actually programmed stuff. This game was also my first time using a real programming language (that being Luau).',
        playPage: 'https://www.roblox.com/games/6157355653/Dream-world-I',
    },
    '1': {
        name: 'Line Obby',
        image: '../images/lineObby.png',
        description: 'In this game your goal is to make it to the end of the line obby. Each stage is unique, and the prizes at the end make it worth the challenge.',
        importance: "When I made this game, I heavily relied on free assets and YouTube tutorials. While this means that most of the code shown in the game is not mine, it's still important to remember this game because it is where I was introduced to many programming concepts like cloning objects and making GUIs.",
        playPage: 'https://www.roblox.com/games/6883071735/Line-Obby',
    },
    '2': {
        name: 'HOUSE',
        image: '../images/HOUSE.png',
        description: "In this game you find yourself lost in a forest when suddenly you see a house in the distance. You feel uneasy about the house, but it's getting dark, and it's not safe outside. Can you survive and escape the house, or will it claim you?",
        importance: "This game was my first game ever where I went out of my way to learn how to use audio (you can't have scary without scary music). This game was also my first game where I utilized the Roblox kick feature (which happens on death) and the Roblox dialog system (speech bubbles).",
        playPage: 'https://www.roblox.com/games/6948651149/HOUSE',
    },
    '3': {
        name: 'Battle island',
        image: '../images/battleIsland.png',
        description: 'In this game you collect coins, buy weapons, and fight players to the death! This game contains 7 deadly areas, each with their own traps, challenges, and rewards.',
        importance: 'This game is important for two major reasons. The first reason being that I started to learn how to animate on Roblox in this game. The second reason being that I learned a lot about the humanoid (Roblox part that allows for an NPC or player character to exist and live).',
        playPage: 'https://www.roblox.com/games/6957463701/Battle-island',
    },
    '4': {
        name: 'Car Obby',
        image: '../images/carObby.png',
        description: 'In this game you must complete an obby while in a car. You must dodge landmines and barriers while also avoiding lava pits and open gaps. The prizes at the end are well worth the risk.',
        importance: 'This game heavily introduced me to Roblox explosions, Roblox deletion, and other Roblox properties like collision and transparency.',
        playPage: 'https://www.roblox.com/games/7028222897/Car-Obby',
    },
    '5': {
        name: 'King of the hill',
        image: '../images/kingOfTheHill.png',
        description: 'In this game you fight and kill others to become king of the hill. You can buy a multitude of different offensive and defensive traps to keep everyone else at bay.',
        importance: 'During the process of making this game, my brain finally clicked, and I began to understand Luau. This newfound understanding of the syntax is what allowed me to move away from copying scripts from online to making my own unique scripts.',
        playPage: 'https://www.roblox.com/games/7051196764/King-of-the-hill',
    },
    '6': {
        name: 'Pirate Ship Island',
        image: '../images/pirateShipIsland.png',
        description: 'In this game you play as a pirate and get to sail the seven seas for booty. You can purchase ships and get into naval combat with your enemies, or you can team up and explore the sea and islands as a group. Each island is unique and has its own quest, people, and booty.',
        importance: 'This game is very important as it was the first game I created where I actually knew (very limited) how to code. Because of this, the game had a variety of never-before-seen content like a boat system, a shop system, dungeons, boss battles, teleportation, and even a casino. I would use the knowledge I got from making this game and revamp some of my older games, adding stuff like new bosses, shops, and endings.',
        playPage: 'https://www.roblox.com/games/7066808794/Pirate-Ship-Island',
    },
    '7': {
        name: 'Climb the Tower',
        image: '../images/climbTheTower.png',
        description: 'In this game you are tasked with making it to the top of the game show tower where your one hundred million dollars awaits! There is a catch though. This tower is full of parkour and timing puzzles that require certain tools like hammers and gears.',
        importance: 'This game is very important because it saw lots of innovation. Similarly to Pirate Ship Island (the game I made before this game), this game has lots of new, never-before-seen features like slippery tiles, speed tiles, hammers that break glass, placeable wood planks, gears that move platforms up and down, and temporary tiles.',
        playPage: 'https://www.roblox.com/games/7136220587/Climb-the-Tower',
    },
    '8': {
        name: 'Destroy the community',
        image: '../images/climbTheTower.png',
        description: 'In this game (a parody of one of my favorite games called Destroy the Neighborhood), you get tools to destroy the local neighborhood. Destroying stuff gives you money, which can be used to buy more tools and even power up disaster machines. There are many secrets hidden around the map waiting to be found.',
        importance: 'This game is very important because it saw lots of innovation. Similarly to Pirate Ship Island (the game I made before this game), this game has lots of new, never-before-seen features like slippery tiles, speed tiles, hammers that break glass, placeable wood planks, gears that move platforms up and down, and temporary tiles.',
        playPage: 'https://www.roblox.com/games/7291473062/Destroy-the-Community',
    },
};

let pageID = window.location.search.replace('?pageID=','');
if (!templateData[pageID]) {
    pageID = '0';
};

const gameTitle = document.getElementById('game_name');
const secondGameTitle = document.getElementById('name_of_game');
const gameImage = document.getElementById('gameplay_img');
const aboutDescription = document.getElementById('about_description');
const aboutImportance = document.getElementById('importance_description');
const playGameButton = document.getElementById('play_button');

gameTitle.textContent = templateData[pageID].name;
secondGameTitle.textContent = templateData[pageID].name;
gameImage.src = templateData[pageID].image;
aboutDescription.textContent = templateData[pageID].description;
aboutImportance.textContent = templateData[pageID].importance;

playGameButton.addEventListener('click', function() {
    window.open(templateData[pageID].playPage, '_blank');
});
