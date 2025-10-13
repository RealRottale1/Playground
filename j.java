import java.util.Scanner;
import java.util.Date;

public class Main {

    public class Account {
        private int id;
        private double balence;
        private double annualInterestRate;
        private Date dateCreated;

        /* Constructor method for object without any predefined data */
        public Account() {
            this.id = 0;
            this.balence = 0.0;
            this.annualInterestRate = 0.0;
            this.dateCreated = new Date();
        }

        /* Constructor method for objects with predefined id and balence */
        public Account(int id, double balence) {
            this.id = id;
            this.balence = balence;
            this.annualInterestRate = 0.0;
            this.dateCreated = new Date();
        }

        /* Accessor methods */
        public int getId() {
            return this.id;
        }
        public double getBalence() {
            return this.balence;
        }
        public double getAnnualInterestRate() {
            return this.annualInterestRate;
        }
        public Date getDateCreated() {
            return this.dateCreated;
        }

        /* Mutator methods */
        public void setId(int id) {
            this.id = id;
        }
        public void setBalence(double balence) {
            this.balence = balence;
        }
        public void setAnnualInterestRate(double annualInterestRate) {
            this.annualInterestRate = annualInterestRate;
        }

        /* Method to get monthly interest rate */
        public double getMonthlyInterestRate() {
            return (this.annualInterestRate / 100) / 12;
        }

        /* Withdraw method that withdraws unless amount is greater than current balence */
        public int withdraw(int amount) {
            if (amount > this.balence) {
                return 0;
            }
            this.balence -= amount;
            return amount;
        }

        /* Deposit method which adds amount to current balence */
        public void deposit(int amount) {
            this.balence += amount;
        }
    }

    public static void main(String[] args) {
        Account Christopher = new Account(1122, 20000, 4.5);
        Christopher.withdraw(2500);
    }
}