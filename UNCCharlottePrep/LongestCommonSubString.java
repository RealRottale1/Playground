

public class Main {
    public static void main(String[] args) {
        System.out.println(LCS.findNonDP("ABCDE", "ACE"));
    }
}

class LCS {
    static public String findNonDP(String s1, String s2) {
        int s1Size = s1.length();
        int s2Size = s2.length();

        // Gets all occurances of chars from s2 in s1
        boolean[][] data = new boolean[s1Size][s2Size];
        for (int i = 0; i < s1Size; i++) {
            char iChar = s1.charAt(i);
            for (int j = 0; j < s2Size; j++) {
                char jChar = s2.charAt(j);
                if (iChar == jChar) {
                    data[i][j] = true;
                }
            }
        }

        // Finds longest occurance of s2 in s1
        int lStartIndex = 0;
        int lStartValue = 0;
        int startIndex = 0;
        int cI = 0;
        for (int i = 0; i < s1Size; i++) {
            if (data[i][cI]) {
                if (cI == 0) {
                    startIndex = i;
                }
                cI++;
                if (lStartValue < cI) {
                    lStartIndex = startIndex;
                    lStartValue = cI;
                    if (cI >= s2Size) {
                        cI--;
                        break;
                    }
                }
            } else {
                cI = 0;
            }
        }
        return s1.substring(lStartIndex, lStartIndex+lStartValue);
    }
}