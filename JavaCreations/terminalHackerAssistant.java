import java.util.Scanner;
import java.util.Vector;

class Main {
    public static int phraseSize = 0;
    public static Vector<String> phrases = new Vector<>();

    public static void loadPhrases() {
        Scanner scanner = new Scanner(System.in);
        String input;
        System.out.println("Input size of phrases.");
        do {
            phraseSize = scanner.nextInt();
        } while (phraseSize <= 0);
        
        scanner.nextLine();
        System.out.println("Input phrases. Input nothing to finish.");
        do {
            input = scanner.nextLine();
            if (input.equals("")) {
                return;
            } else {
                if (input.length() == phraseSize) {
                    phrases.add(input.toLowerCase());
                } else {
                    System.out.println("Phrase must match specified size.");
                }
            }
        } while (true);
    }

    public static int getPhrase() {
        if (phrases.size() <= 0) {
            return -1;
        }

        int[] bestPhrases = new int[phrases.size()];
        for (int i = 0; i < phrases.size(); i++) {
            char[] iPhraseArray = phrases.get(i).toCharArray();
            for (int j = i+1; j < phrases.size(); j++) {
                char[] jPhraseArray = phrases.get(j).toCharArray();
                int matchingChars = 0;
                for (int k = 0; k < phraseSize; k++) {
                    if (iPhraseArray[k] == jPhraseArray[k]) {
                        matchingChars++;
                    }
                }
                bestPhrases[i] += matchingChars;
                bestPhrases[j] += matchingChars;
            }
        }

        int mI = 0;
        for (int i = 0; i < bestPhrases.length; i++) {
            if (bestPhrases[i] > bestPhrases[mI]) {
                mI = i;
            }
        }
        return mI;
    }

    public static int eliminatePhrases(int phraseIndex) {
        Scanner scanner = new Scanner(System.in);
        int matchedChars = -1;
        System.out.println("How many characters matched?");
        do {
            matchedChars = scanner.nextInt();
        } while (matchedChars < 0 || matchedChars > phraseSize);
        if (matchedChars == phraseSize) {
            return 1;
        }

        char[] selectedPhraseChars = phrases.get(phraseIndex).toCharArray();
        Vector<String> nextPhrases = new Vector<>();
        for (int i = 0; i < phrases.size(); i++) {
            if (i == phraseIndex) {
                continue;
            }
            String phrase = phrases.get(i);
            int j = 0;
            int m = 0;
            for (char c : phrase.toCharArray()) {
                if (selectedPhraseChars[j] == c) {
                    m++;
                }
                j++;
            }
            if (m == matchedChars) {
                nextPhrases.add(phrase);
            }
        }
        phrases = nextPhrases;
        return 0;
    }

    public static void main(String[] args) {
        System.out.println("This program is designed to help solve any Fallout terminal hacking mini game.");
        loadPhrases();
        if (phrases.size() <= 0) {return;}
        int phraseIndex;
        do {
            phraseIndex = getPhrase();
            if (phraseIndex == -1) {
                break;
            }
            System.out.println("Try " + phrases.get(phraseIndex));
        } while (eliminatePhrases(phraseIndex) == 0);
        System.out.println("Completed!");
    }
}