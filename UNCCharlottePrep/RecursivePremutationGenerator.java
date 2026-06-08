import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

class PremutationGenerator {

    static private char[] makeNewWordArray(char[] wordArray, int removeIndex) {
        char[] newWordArray = new char[wordArray.length - 1];
        int eI = 0;
        for (int i = 0; i < wordArray.length; i++) {
            if (i != removeIndex) {
                newWordArray[eI] = wordArray[i];   
                eI++;
            }
        }
        return newWordArray;
    }

    static public ArrayList<String> toString(ArrayList<ArrayList<Character>> data) {
        ArrayList<String> container = new ArrayList<>();
        if (data.size() <= 0) {return container;}
        int wordSize = data.get(0).size();
        for (ArrayList<Character> word : data) {
            StringBuilder sb = new StringBuilder(wordSize);
            for (char c : word) {
                sb.append(c);
            }
            container.add(sb.toString());
        }
        return container;
    }

    static private ArrayList<ArrayList<Character>> cycleGen(ArrayList<ArrayList<Character>> mutationList, int setSize, char[] possibleChars, int offset) {
        for (int i = 0; i < mutationList.size(); i++) {
            mutationList.get(i).add(possibleChars[(i+offset)%setSize]);
        }
        offset++;
        if (offset >= setSize) {
            return mutationList;
        }
        return cycleGen(mutationList, setSize, possibleChars, offset);
    }
    static public ArrayList<ArrayList<Character>> generateCycle(String word) {
        char[] wordArray = word.toCharArray();
        int setSize = wordArray.length - 1;

        ArrayList<ArrayList<Character>> globalMutations = new ArrayList<>();
        int eI = 0;
        for (char c : wordArray) {
            ArrayList<ArrayList<Character>> localMutations = new ArrayList<>();
            char[] newWordArray = makeNewWordArray(wordArray, eI);
            for (int i = 0; i < setSize; i++) {
                ArrayList<Character> localList = new ArrayList<>();
                localList.add(c);
                localMutations.add(localList);
            }
            globalMutations.addAll(cycleGen(localMutations, setSize, newWordArray, 0));
            eI++;
        }
        return globalMutations;
    }

    static private ArrayList<ArrayList<Character>> fullGen(ArrayList<Character> wordArray, int wordSize) {
        if (wordArray.size() == 1) {
            ArrayList<ArrayList<Character>> container = new ArrayList<>();
            ArrayList<Character> word = new ArrayList<>();
            word.add(wordArray.get(0));
            container.add(word);
            return container;
        }

        ArrayList<ArrayList<Character>> globalContainer = new ArrayList<>();
        for (int i = 0; i < wordArray.size(); i++) {
            ArrayList<Character> newWordArray = new ArrayList<>(wordArray);
            newWordArray.remove(i);
            ArrayList<ArrayList<Character>> localContainer = fullGen(newWordArray, wordSize);
            for (ArrayList<Character> word : localContainer) {
                word.add(wordArray.get(i));
                globalContainer.add(word);
            }
        }
        return globalContainer;
    }
    static public ArrayList<ArrayList<Character>> generateFull(String word) {
        ArrayList<Character> wordArray = new ArrayList<>();
        for (int i = 0; i < word.length(); i++) {
            wordArray.add(word.charAt(i));
        }
        return fullGen(wordArray, wordArray.size());
    }
}

public class Main {
    public static void main(String[] args) {
        String test = "ABCD";

        ArrayList<ArrayList<Character>> somePremutations = PremutationGenerator.generateCycle(test);
        System.out.println(PremutationGenerator.toString(somePremutations));
        System.out.println(somePremutations.size());

        ArrayList<ArrayList<Character>> allPremutations = PremutationGenerator.generateFull(test);
        System.out.println(PremutationGenerator.toString(allPremutations));
        System.out.println(allPremutations.size());
    }
}