let allWords: [String] = ["aah","aba","abs","ace","ach","act","add","ado","adz","aft","aga","age","ago","aha","ahi","aid","ail","aim","ain","air","ait","ala","alb","ale","all","alp","alt","amp","amu","ana","and","ane","ani","ant","any","ape","app","apt","arb","arc","are","arf","ark","arm","art","ash","ask","asp","ass","ate","auk","ave","avo","awe","awl","awn","axe","aye","azo","baa","bad","bag","bah","ban","bap","bar","bat","bay","bed","bee","beg","bel","ben","bet","bey","bib","bid","big","bin","bio","bis","bit","biz","boa","bob","bod","bog","boo","bop","bot","bow","box","boy","bra","bro","bub","bud","bug","bum","bun","bur","bus","but","buy","bye","cab","cad","cal","cam","can","cap","car","cat","caw","cay","cee","cel","cep","chi","cig","cob","cod","cog","col","con","coo","cop","cor","cos","cot","cow","cox","coy","coz","cru","cry","cub","cud","cue","cum","cup","cur","cut","cwm","dab","dad","dag","dah","dak","dal","dam","dan","dap","daw","day","deb","dee","def","del","den","dew","dex","dey","dib","did","die","dig","dim","din","dip","dis","dit","div","doc","doe","dof","dog","doh","don","dop","dor","dot","dry","dub","dud","due","dug","duh","dun","duo","dux","dye","dzo","ear","eat","ebb","ecu","edh","eek","eel","eff","eft","egg","ego","eke","eld","elf","elk","ell","elm","emo","emu","end","eon","era","ere","erf","erg","erk","err","ess","eta","eth","eve","ewe","eye","fab","fad","fag","fah","fan","far","fat","fax","fay","fed","fee","feh","fen","feu","few","fey","fez","fib","fid","fie","fig","fin","fir","fit","fix","flu","fly","fob","foe","fog","fop","for","fou","fox","foy","fro","fry","fug","fun","fur","gab","gad","gag","gal","gam","gap","gar","gas","gat","gay","gee","gel","gem","geo","get","gey","gib","gid","gie","gig","gin","gip","git","gnu","goa","gob","god","goo","got","goy","gub","gul","gum","gun","gur","gut","guv","guy","gym","gyp","had","hae","hag","hah","haj","ham","hao","hap","has","hat","haw","hay","hem","hen","hep","her","hew","hex","hey","hic","hid","hie","him","hin","hip","his","hit","hob","hod","hoe","hog","hom","hon","hop","hot","how","hoy","hub","hue","hug","huh","hum","hut","ice","ich","ick","icy","ide","iff","igg","ilk","ill","imp","ink","inn","ion","ire","irk","ism","its","ivy","iwi","jab","jag","jam","jar","jaw","jay","jee","jet","jew","jib","jig","job","joe","jog","jol","jot","joy","jug","jun","jus","jut","kab","kai","kay","kea","ked","kef","keg","ken","kep","key","khi","kid","kif","kin","kip","kir","kit","koa","kob","koi","kop","kor","kyu","lab","lac","lad","lag","lah","lam","lap","lat","law","lax","lay","lea","led","lee","leg","lei","lek","les","let","leu","lev","lex","ley","lez","lib","lid","lie","lig","lip","lis","lit","lob","log","loo","lop","lor","lot","low","lox","lud","lug","lum","lur","lux","lye","mac","mad","mag","mam","man","map","mar","mas","mat","maw","max","may","med","meg","mem","men","met","mew","mho","mic","mid","mil","mim","mir","mix","moa","mob","moc","mod","mog","moi","mol","mom","mon","moo","mop","mot","mow","mud","mug","mum","mun","mux"];
var allConnections: [String: [String]] = [:];

func offBy(fWord: [Character], lWord: [Character]) -> Int {
    var mismatches: Int = 0;
    for i in 0..<3 {
        if fWord[i] != lWord[i] {
            mismatches += 1;
        }
    }
    return mismatches;
}

for connectWord in allWords {
    let fWord: [Character] = Array(connectWord);
    for branchWord in allWords {
        if connectWord == branchWord {
            continue;
        }
        let lWord: [Character] = Array(branchWord);
        if offBy(fWord: fWord, lWord: lWord) == 1 {
            allConnections[connectWord, default: []].append(branchWord);
        }
    }
}

func getUnusedConnections(word: String, usedConnections: Set<String>) -> [String] {
    var unusedConnections: [String] = [];
    for connection in allConnections[word]! {
        if !usedConnections.contains(connection) {
            unusedConnections.append(connection);
        }
    }
    return unusedConnections;
}

func getShortestPath(sWord: String, eWord: String) -> [String] {
    var usedConnections: Set<String> = [sWord];
    var nextPathWays: [[String]] = [];
    var pathWays: [[String]] = [];

    let initialConnections: [String] = getUnusedConnections(word: sWord, usedConnections: usedConnections);
    for connection in initialConnections {
        pathWays.append([sWord, connection]);
    }

    var iterations: Int = 0;
    while true {
        for path in pathWays {
            let pathLen: Int = path.count;
            let newConnections: [String] = getUnusedConnections(word: path[pathLen-1], usedConnections: usedConnections);
            for newConnection in newConnections {
                usedConnections.insert(newConnection);
                nextPathWays.append(path + [newConnection]);

                if newConnection == eWord {
                    return nextPathWays[nextPathWays.count-1];
                }
            }
        }
        if nextPathWays.isEmpty {
            return ["Not possible"];
        }
        pathWays = nextPathWays;
        nextPathWays.removeAll();
        iterations += 1;
    }
}

func getAllPaths(sWord: String, eWord: String, maxIterations: Int, maxSize: Int) -> Set<[String]> {
    var allPaths: Set<[String]> = [];
    var neighboringNodes: [[String]] = [];
    var currentPath: [String] = [sWord];
    var currentPathNodes: Set<String> = [sWord];

    var initialConnections: [String] = getUnusedConnections(word: sWord, usedConnections: currentPathNodes);
    if initialConnections.isEmpty {return allPaths};
    let addTo: String = initialConnections[initialConnections.count-1];
    currentPath.append(addTo);
    currentPathNodes.insert(addTo);
    initialConnections.removeLast();
    neighboringNodes.append(initialConnections);

    func goBack() -> Bool {
        let firstRemoved: String = currentPath.removeLast();
        currentPathNodes.remove(firstRemoved); 

        while neighboringNodes.count > 1 && neighboringNodes[neighboringNodes.indices.last!].isEmpty {
            if neighboringNodes.isEmpty {return true};
            neighboringNodes.removeLast();
            let nthRemoved: String = currentPath.removeLast();
            currentPathNodes.remove(nthRemoved);
        }
        if neighboringNodes.count == 1 && neighboringNodes[0].isEmpty {return true};
        var priorNeighbors: [String] = neighboringNodes.removeLast();
        let nextNeighbor: String = priorNeighbors.removeLast();
        neighboringNodes.append(priorNeighbors);
        currentPath.append(nextNeighbor);
        currentPathNodes.insert(nextNeighbor);
        return false;
    }

    var iterations: Int = -1;
    repeat {
        iterations += 1;
        if iterations == maxIterations {break};
        var nextConnections: [String] = getUnusedConnections(word: currentPath[currentPath.count-1], usedConnections: currentPathNodes);
        if let index = nextConnections.firstIndex(of: eWord) {
            allPaths.insert(currentPath+[eWord]);
            nextConnections.remove(at: index);
        }
        if nextConnections.isEmpty || currentPath.count >= maxSize-1 {
            if goBack() {break};
        } else {
            let next: String = nextConnections[nextConnections.count-1];
            currentPath.append(next);
            currentPathNodes.insert(next);
            nextConnections.removeLast();
            neighboringNodes.append(nextConnections);
        }
    } while !neighboringNodes.isEmpty;
    if allPaths.isEmpty {return [["Not possible"]]} else {return allPaths};
}

print("Shortest Answer:");
let shortestAnswer: [String] = getShortestPath(sWord: "cat", eWord: "fin");
print(shortestAnswer);

print("All Answers:");
let allAnswers: Set<[String]> = getAllPaths(sWord: "cat", eWord: "fin", maxIterations: 999999, maxSize: 5);
for answer in allAnswers {
    print("\(answer),");
}

print("Finished Executing!");