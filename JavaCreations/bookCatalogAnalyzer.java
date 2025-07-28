import java.util.*;

class Book {
    public static Integer masterId = 0;
    public static HashMap<String, Integer> existingBooks = new HashMap<String, Integer>();

    private Integer id;
    private String title;
    private String author;
    private String genre;
    private boolean inLibrary;
    private String owner;

    public Integer getId() {
        return this.id;
    }

    public void changeInLibraryStatus(String owner, boolean setTo) {
        if (this.owner == owner) {
            this.inLibrary = setTo;
        }
    }

    public Book(String title, String author, String genre, String owner) {
        String currentBook = title + author;
        if (existingBooks.containsKey(currentBook)) {
            this.id = existingBooks.get(currentBook);
        } else {
            this.id = masterId;
            masterId += 1;
        }
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.owner = owner;
    }
}

class Library {
    private static String libraryName;
    private static HashMap<Integer, Set<Book>> libraryBooks = new HashMap<Integer, Set<Book>>();
    private static HashMap<Integer, Integer> ongoingBookRequests = new HashMap<Integer, Integer>();
    
    public static void addBook(Book book) {
        Integer id = book.getId();
        book.changeInLibraryStatus(libraryName, true);
        libraryBooks.computeIfAbsent(id, t -> new HashSet<Book>()).add(book);
        if (ongoingBookRequests.containsKey(id)) {
            int currentCount = ongoingBookRequests.get(id);
            if (currentCount == 0) {
                ongoingBookRequests.remove(id);
            } else {
                ongoingBookRequests.put(id, currentCount - 1);
            }
        }
    }

    public void establishLibrary(String name) {
        if (libraryName == null) {
            libraryName = name;
        }
    }

    private void Library(){}
}

public class Main {
    public static void main(String[] args) {
        Book b1 = new Book("Minecraft", "Notch", "Adventure", "Daves Library");
        Book b2 = new Book("Minecraft", "Notch", "Adventure", "Daves Library");
        Book b3 = new Book("Moby Dick", "George", "Boring", "Daves Library");
        
        Library.addBook(b1);
        Library.addBook(b2);
        Library.addBook(b3);
    }
}