import java.util.Scanner;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

class Card {
    String suit = "";
    String faceId = "";
    int id = 0;
    int value = 0;
    Card(String suit, int id, int value) {
        this.suit = suit;
        this.id = id;
        this.value = value;
        switch (id) {
            case 0:
                this.faceId = "A";
                break;
            case 10:
                this.faceId = "J";
                break;
            case 11:
                this.faceId = "Q";
                break;
            case 12:
                this.faceId = "K";
                break;
            default
                this.faceId = String.valueOf(id);
        }
    }
}

abstract class GameHandler {

    abstract void setupDeck(); // Establishes the current deck

    abstract void playGame(); // One game function/action

    public static ArrayList<Card> makeDeck(Map<Integer, Integer> worthMap) {
        ArrayList<Card> deck = new ArrayList<>();
        for (int s = 0; s < 4; s++) {
            String suit = (s == 0 ? "\u2665" : (s == 1 ? "\u2666" : (s == 2 ? "\u2663" : "\u2660")));
            for (int i = 0; i < 13; i++) {
                Card newCard = new Card(suit, i, worthMap.get(i));
                deck.add(newCard);
            }
        }
        return deck;
    }
}

class War extends GameHandler {
    ArrayList<Card> player1Deck;
    ArrayList<Card> player1Used;
    ArrayList<Card> player2Deck;
    ArrayList<Card> player2Used;

    @Override
    void setupDeck() {
        // Establishes worthMap, id = worth
        Map<Integer, Integer> worthMap = new HashMap<>();
        for (int i = 0; i < 13; i++) {
            worthMap.put(i, i+1);
        }

        // Makes and scrambles deck
        ArrayList<Card> deck = GameHandler.makeDeck(worthMap);
        Collections.shuffle(deck);

        // Splits deck
        int middleIndex = deck.size()/2;
        player1Deck = new ArrayList<>(deck.subList(0, middleIndex));
        player2Deck = new ArrayList<>(deck.subList(middleIndex, deck.size()));
        player1Used = new ArrayList<>();
        player2Used = new ArrayList<>();
    }

    @Override
    void playGame() {
        
    }
}

class BlackJack extends GameHandler {

}

class CrazyEights extends GameHandler {

}

class GoFish extends GameHandler {
}

public class Main {

    public static void main(String[] args) {
        
    }
}