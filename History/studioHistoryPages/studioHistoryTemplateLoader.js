const templateData = {
    '0': {
        pointName: 'Early Studio',
        description: 'This time period is between the creation of Dream world I (started on 12/29/2020) and the creation of Car Obby (started on 6/30/2021). This time period is mainly defined by its lag and primitive code (excluding the new stuff I added in after this time period). My most advanced game would have to be Car Obby because of its explosion technology (still very primitive).',
        importance: 'This time period is important because it played an important role in getting me hooked on Roblox Studio. The only reason I am a good programmer today or even interested in programming is because Roblox Studio was so fun it made me not want to give up even when my code did not work, which allowed me to grow my programming skills.',
        firstName: 'Dream world I',
        firstImage: '../images/dreamworldI.png',
        firstLink: 'https://www.roblox.com/games/6157355653/Dream-world-I',
        secondName: 'Car Obby',
        secondImage: '../images/carObby.png',
        secondLink: 'https://www.roblox.com/games/7028222897/Car-Obby',
    },
    '1': {
        pointName: 'The Click',
        description: 'This time period was very short, only lasting the duration it took me to make the game, King of the hill (started on 7/5/2021). This time period is mainly defined by my first-ever original code (code made by me without any tutorial help).',
        importance: 'This time period is extremely important because it was when I first realized how to program in Luau (before this I relied on tutorials and splicing code). After this time period, I would no longer be reliant on video tutorials and would be able to write my own code and make them however I wanted to.',
        firstName: 'King of the hill',
        firstImage: '../images/kingOfTheHill.png',
        firstLink: 'https://www.roblox.com/games/7051196764/King-of-the-hill',
    },
    '2': {
        pointName: 'Middle Studio',
        description: 'This time period is between the creation of Pirate Ship Island (started on 7/8/2021) and the creation of (started on 5/29/2022). This period is defined by its revolutionary breakthroughs and its unique and creative games (pirates, horror, zombies, puzzles, etc.). My most advanced game would have to be either Protect the server or Build, as the first one revolutionized viewport frames (rendering 3D objects in a 2D frame) and data storage, while the second one revolutionized remote events (server-to-client or client-to-server communication) and raycasting.',
        importance: 'This time period is important because it is when I pushed the boundaries of my coding knowledge. A few things I learned in this time period are viewport frames, data storage, client-server communication, and raycasting.',
        firstName: 'Pirate Ship Island',
        firstImage: '../images/pirateShipIsland.png',
        firstLink: 'https://www.roblox.com/games/7066808794/Pirate-Ship-Island',
        secondName: 'Protect the server',
        secondImage: '../images/protectTheServer.png',
        secondLink: 'https://www.roblox.com/games/9763741821/Protect-the-server',
    },
    '3': {
        pointName: 'Late Studio',
        description: 'This time period is between the creation of the SciTech Underground Facility (started on 12/29/2022) and the creation of Protect The Server (started on 7/13/2024). This time period is defined by its professionalism and the fact that each game got its own Roblox group. Objectively, my most advanced Roblox Studio game ever has to be Protect The Server. Not only does the game have over 38 minigames, each containing unique code, but the game also has many features only present in real professional games, like a dynamic 3D rendering shop, multiple monetization features, a daily reward system, a game pass gifting system, and a dynamic and flexible data storage system.',
        importance: 'This time period is important because it cemented my desire to become a computer programmer after I leave high school. This time period is also important because it showed me that making video games can 100% be a viable career path.',
        firstName: 'SciTech Underground Facility',
        firstImage: '../images/scitechUndergoundFacility.png',
        firstLink: 'https://www.roblox.com/games/14337062579/SciTech-Underground-Facility',
        secondName: 'Protect The Server',
        secondImage: '../images/protectTheServer2.png',
        secondLink: 'https://www.roblox.com/games/18475941513/Protect-The-Server',
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
const game1Image = document.getElementById('gameplay1_img');
const playGame1 = document.getElementById('play_button1');
const secondName = document.getElementById('game_title2');
const game2Image = document.getElementById('gameplay2_img');
const playGame2 = document.getElementById('play_button2');

aboutTitle.textContent = templateData[pageID].pointName;
aboutDescription.textContent = templateData[pageID].description;
aboutImportance.textContent = templateData[pageID].importance;
firstName.textContent = templateData[pageID].firstName;
game1Image.src = templateData[pageID].firstImage;

playGame1.addEventListener('click', function() {
    window.open(templateData[pageID].firstLink, '_blank');
});

for (let text of [aboutDescription, aboutImportance]) {
    const textLength = text.textContent.split(' ').length;
    if (textLength >= 75) {
        text.style.fontSize = '28px';
        if (textLength >= 100) {
            text.style.fontSize = '25px';
        };
    };
};


if (templateData[pageID].secondName) {
    secondName.textContent = templateData[pageID].secondName;
    game2Image.src = templateData[pageID].secondImage;

    playGame2.addEventListener('click', function() {
        window.open(templateData[pageID].secondLink, '_blank');
    });
} else {
    secondName.remove();
    game2Image.remove();
    playGame2.remove();
    const game1 = document.getElementById('game1');
    game1.style.top = '255px';
};