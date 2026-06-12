import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Main {
    public static void main(String[] args) {
        int maxWeight = 15;
        House home = new House(maxWeight);
        char[] itemNames = new char[]{'A', 'B', 'C', 'D', 'E'};
        Random rand = new Random();
        for (char name : itemNames) {
            Item item = new Item(name, rand.nextInt(maxWeight+2), rand.nextInt(25));
            home.addItem(item);
        }
        home.printItems();
        home.printKnapsack();
    }
}

class House {
    private ArrayList<Item> items = new ArrayList<>();
    private int maxWeight;

    public House(int maxWeight) {
        this.maxWeight = maxWeight;
    }

    public void printKnapsack() {
        int itemsCount = this.items.size() + 1;
        int weightRange = this.maxWeight + 1;

        int[][] data = new int[itemsCount][weightRange];
        
        // Solves
        for (int n = 1; n < itemsCount; n++) {
            Item thisItem = this.items.get(n-1);
            for (int w = 0; w < weightRange; w++) {
                if (thisItem.getWeight() <= w) {
                    data[n][w] = Math.max(data[n-1][w], (data[n-1][w - thisItem.getWeight()] + thisItem.getValue()));
                } else {
                    data[n][w] = data[n-1][w];
                }
            } 
        }
        
        // Gathers data
        System.out.println("Stole:");
        int w = this.maxWeight;
        for (int i = itemsCount - 1; i > 0; i--) {
            if (data[i][w] != data[i - 1][w]) {
                Item stolenItem = this.items.get(i-1);
                System.out.print(stolenItem.getName() + ": W=" + stolenItem.getWeight() + ", $=" + stolenItem.getValue() + ", ");
                w -= stolenItem.getWeight();
            }
        }
        System.out.println();
    }

    public ArrayList<Item> getItems() {
        return this.items;
    }
    public void addItem(Item item) {
        this.items.add(item);
    }
    public void printItems() {
        System.out.println("Total Weight=" + this.maxWeight);
        for (Item item : this.items) {
            System.out.print(item.getName() + ": W=" + item.getWeight() + " V=" + item.getValue() + ", ");
        }
        System.out.println("");
    }

    public Integer getMaxWeight() {
        return this.maxWeight;
    }

}

class Item {
    private Character name;
    private int weight;
    private int value;

    public Item(Character name, int weight, int value) {
        this.name = name;
        this.weight = weight;
        this.value = value;
    }
    public Character getName() {
        return this.name;
    }
    public int getWeight() {
        return this.weight;
    }
    public int getValue() {
        return this.value;
    }
}