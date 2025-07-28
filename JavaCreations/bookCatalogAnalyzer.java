import java.util.*;

class Book {
    public static Integer masterId = 0;
    public static Integer bookCount = 0;
    public static HashMap<String, Integer> existingBooks = new HashMap<String, Integer>();

    private Integer id;
    private Integer ownerId;
    private Integer bookId;
    private String title;
    private String author;
    private String genre;
    private boolean inLibrary;

    public Integer getBookId() {
        return this.bookId;
    }

    public Integer getOwnerId() {
        return this.ownerId;
    }

    public Integer getId() {
        return this.id;
    }

    public boolean isInLibrary() {
        return this.inLibrary;
    }

    public void changeInLibraryStatus(Integer ownerId, boolean setTo) {
        if (this.ownerId == ownerId) {
            this.inLibrary = setTo;
        }
    }
    
    public String info() {
        String info = "Title: " + this.title + ", Author: " + this.author + ", Genre: " + this.genre;
        return info;
    }

    public Book(String title, String author, String genre, Integer ownerId) {
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
        this.ownerId = ownerId;
        this.bookId = bookCount;
        bookCount += 1;
    }
}

class Library {
    private static Integer masterId = 0;

    private Integer ownerId;
    private Integer libraryId;
    private String libraryName;

    private HashMap<Integer, HashMap<Integer, Book>> libraryBooks = new HashMap<Integer, HashMap<Integer, Book>>();
    private HashMap<Integer, Integer> ongoingBookRequests = new HashMap<Integer, Integer>();
    private Integer totalBooks = 0;
    private Integer totalBooksInStore = 0;

    public Integer getOwnerId() {
        return this.ownerId;
    }

    public Integer getId() {
        return this.libraryId;
    }

    public boolean requestBook(Integer id) {
        Integer requests = this.ongoingBookRequests.get(id);
        this.ongoingBookRequests.put(id, (requests == null ? 0 : requests) + 1);
        return true;
    }

    public Book checkInBook(Book book) {
        if (book.getOwnerId() == this.libraryId) {
            Integer id = book.getId();
            if (this.libraryBooks.containsKey(id)) {
                HashMap<Integer, Book> booksById = this.libraryBooks.get(id);
                Integer bookId = book.getBookId();
                if (booksById.containsKey(bookId)) {
                    booksById.put(bookId, book);
                    this.totalBooksInStore += 1;
                    return null;
                }
            }
        }
        return book;
    }

    public Book checkOutBook(Integer id) {
        if (this.libraryBooks.containsKey(id)) {
            HashMap<Integer, Book> booksById = this.libraryBooks.get(id);
            for (HashMap.Entry<Integer, Book> entry : booksById.entrySet()) {
                Book book = entry.getValue();
                if (book != null && book.isInLibrary()) {
                    book.changeInLibraryStatus(this.libraryId, false);
                    booksById.put(entry.getKey(), null);
                    this.totalBooksInStore -= 1;
                    return book;
                }
            }
        }
        return null;
    }

    public void addBook(Book book) {
        Integer id = book.getId();
        book.changeInLibraryStatus(this.libraryId, true);
        this.libraryBooks.computeIfAbsent(id, t -> new HashMap<Integer, Book>()).put(book.getBookId(), book);
        this.totalBooks += 1;
        this.totalBooksInStore += 1;
        if (this.ongoingBookRequests.containsKey(id)) {
            int currentCount = this.ongoingBookRequests.get(id);
            if (currentCount == 0) {
                this.ongoingBookRequests.remove(id);
            } else {
                this.ongoingBookRequests.put(id, currentCount - 1);
            }
        }
    }

    public Integer getTotalBooks() {
        return this.totalBooks;
    }

    public Integer getTotalBooksInStore() {
        return this.totalBooksInStore;
    }

    public Library(String libraryName, Integer ownerId) {
        this.libraryName = libraryName; 
        this.libraryId = masterId;
        this.ownerId = ownerId;
        masterId += 1;
    }
}

class User {
    private static Integer masterId = 0;

    private Integer id;
    private String name;
    private String userName;
    private String password;

    private boolean myLibrary(Library library) {
        return (library.getOwnerId() == this.id);
    }

    private boolean myBook(Library library, Book book) {
        return (library.getId() == book.getOwnerId());
    }

    public Book registerBook(Library library, String title, String author, String genre) {
        if (this.myLibrary(library)) {
            Book book = new Book(title, author, genre, library.getId());
            return book;
        }
        return null;
    }

    public void addBook(Library library, Book book) {
        if (this.myLibrary(library)) {
            if (this.myBook(library, book)) {
                library.addBook(book);
            }
        }
    }

    public Library createLibrary(String libraryName) {
        Library library = new Library(libraryName, this.id);
        return library;
    }

    public User(String name, String userName, String password) {
        this.id = masterId;
        this.name = name;
        this.userName = userName;
        this.password = password;
        masterId += 1;
    }
}

public class Main {
    public static void main(String[] args) {
        /* Daves backend */
        User dave = new User("Dave Henry", "Dave", "D@^3!"); // Makes account
        Library davesLibrary = dave.createLibrary("Daves Library"); // Makes library

        Integer davesLibraryId = davesLibrary.getId(); // Gets library id
        Book b1 = dave.registerBook(davesLibrary, "Minecraft", "Notch", "Adventure"); // Registers book
        Book b2 = dave.registerBook(davesLibrary, "Minecraft", "Notch", "Adventure"); // Registers book
        Book b3 = dave.registerBook(davesLibrary, "Moby Dick", "George", "Boring");   // Registers book
        
        dave.addBook(davesLibrary, b1); // Adds book to shelf
        dave.addBook(davesLibrary, b2); // Adds book to shelf
        dave.addBook(davesLibrary, b3); // Adds book to shelf

        /* John using daves library computer*/
        User john = new User("John Brown", "John", "Password123"); // Makes account
        Book jb1 = davesLibrary.checkOutBook(b1.getBookId()); // Checks out book
        System.out.println(jb1.info()); // Outputs book info
        jb1 = davesLibrary.checkInBook(jb1); // Checks in book
        System.out.println(jb1);

        /* Daves backend */
        System.out.println("Total books: " + davesLibrary.getTotalBooks()); // Gets total books
        System.out.println("Total books in store: " + davesLibrary.getTotalBooksInStore()); // Gets total books curently in the library
    
        /* John using daves library computer*/
        Book jb2 = davesLibrary.checkOutBook(b3.getBookId()); // Checks out book

        /* Rick using daves library computer*/
        User rick = new User("Rick Danger", "RICK", "Rick_Is_Awsome"); // Makes account
        davesLibrary.requestBook(b3.getBookId()); // Requests a book
    
        /* Daves backend */
        Book b4 = dave.registerBook(davesLibrary, "Moby Dick", "George", "Boring");   // Registers book
        dave.addBook(davesLibrary, b4); // Adds book to shelf
    }
}