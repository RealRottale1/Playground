import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

class PremutationGenerator {

    private gen(char[] wordArray) {
        if (wordArray.size() <= 0) {
            List<List<>>
        }
        for (char c : wordArray) {
            char[] alteredWordArray = wordArray.clone();
            alteredWordArray.remove(c);
            gen(alteredWordArray);
        }
    }

    public Set<String> generate(String word) {
        char[] wordArray = word.toCharArray();
        for (char c : wordArray) {
            char[] alteredWordArray = wordArray.clone();
            alteredWordArray.remove(c);
            gen(alteredWordArray);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        String test = "ABC";
        Set<String> allPremutations = PremutationGenerator.generate(test);
        System.out.println(allPremutations);
    }
}

/*
A B C

A B
A C
ABC
ACB

*/