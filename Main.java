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
            default:
                this.faceId = String.valueOf(id);
        }
    }
}

abstract class GameHandler {

    abstract void setupDeck(); // Establishes the current deck

    abstract int playGame(); // One game function/action

    abstract String getInput(); // Gets user input

    public static ArrayList<Card> makeDeck(Map<Integer, Integer> worthMap) {
        ArrayList<Card> deck = new ArrayList<>();
        for (int s = 0; s < 4; s++) {
            String suit = (s == 0 ? "♥️" : (s == 1 ? "♠️" : (s == 2 ? "♦️" : "♣️")));
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
    ArrayList<Card> player2Deck;

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
    }

    @Override
    int playGame() {
        ArrayList<Card> winPool = new ArrayList<>();
        int useIndex = 0;
        while (true) {
            // If you run out of cards you lose
            if (useIndex != 0) {
                int p1Size = player1Deck.size();
                int p2Size = player2Deck.size();
                if (p1Size == p2Size && p1Size < 3) {
                    System.out.println("Stalemate! Game Over!");
                    return 0;
                } else if (p1Size < 3) {
                    System.out.println("Player 2 won!");
                    return 2;
                } else if (p2Size < 3) {
                    System.out.println("Player 1 won!");
                    return 1;
                }
            }

            Card player1Card = player1Deck.get(useIndex);
            Card player2Card = player2Deck.get(useIndex);
            System.out.println("Player1 drew "+ player1Card.faceId + player1Card.suit);
            System.out.println("Player2 drew "+ player2Card.faceId + player2Card.suit);
            player1Deck.remove(useIndex);
            player2Deck.remove(useIndex);
            winPool.add(player1Card);
            winPool.add(player2Card);

            for (int i = useIndex - 1; i >= 0; i--) {
                Card card1 = player1Deck.get(i);
                Card card2 = player2Deck.get(i);
                player1Deck.remove(i);
                player2Deck.remove(i);
                winPool.add(card1);
                winPool.add(card2);
            }

            if (player1Card.value > player2Card.value) {
                System.out.print("Player1 won the battle and won ");
                Collections.shuffle(winPool);
                for (Card c : winPool) {
                    System.out.print(c.faceId + c.suit + " , ");
                    player1Deck.add(c);
                }
                System.out.println("");
                break;
            } else if (player1Card.value < player2Card.value) {
                System.out.print("Player2 won the battle and won ");
                Collections.shuffle(winPool);
                for (Card c : winPool) {
                    System.out.print(c.faceId + c.suit + " , ");
                    player2Deck.add(c);
                }
                System.out.println("");
                break;
            } else {
                System.out.println("A draw! This means WAR!");
                useIndex = 2;
            }
        }
        return -1;
    }

    @Override
    String getInput() {
        System.out.println("Continue ...");
        Scanner input = new Scanner(System.in);
        String text = input.nextLine();
        return text;
    }
}

// class BlackJack extends GameHandler {

// }

// class CrazyEights extends GameHandler {

// }

// class GoFish extends GameHandler {
// }

public class Main {

    public static void main(String[] args) {
        War game = new War();
        game.setupDeck();
        while (true) {
            int results = game.playGame();
            if (results != -1) {
                break;
            }
            String text = game.getInput();
        }
    }
}