import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void wordFrequency() {
        Scanner scanner = new Scanner(System.in);
        String userInput = scanner.nextLine();
        List<String> words = Arrays.stream(userInput.toLowerCase().split(" ")).collect(Collectors.toList());

        Set<String> uniqueWords = new HashSet<String>();
        HashMap<String, Integer> wordFrequency = new HashMap<String, Integer>();
        for (String word : words) {
            wordFrequency.put(word, wordFrequency.getOrDefault(word, 0) + 1);
            uniqueWords.add(word);
        }
        System.out.println(uniqueWords);
        System.out.println(wordFrequency);
    }

    public static void emailDomainAnalyzer() {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        String[] emails = input.split(" ");
        List<String> domains = Arrays.stream(emails).map(email -> email.split("@")[1]).collect(Collectors.toList());
        Set<String> uniqueDomains = new HashSet<String>(); 
        uniqueDomains.addAll(domains);
        System.out.println(domains);
        System.out.println(uniqueDomains);
    }

    public static void main(String[] args) {
    }
}