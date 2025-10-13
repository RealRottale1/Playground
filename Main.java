/* Name: Christopher Markham
 * Date: 10/13/2025
 * Project Name: Account Class
 * Description: An account class which handles finacial transactions
 */

import java.util.Date;

public class Main {

    public static  class Account {
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
        public Account(int id, double balence, double annualInterestRate) {
            this.id = id;
            this.balence = balence;
            this.annualInterestRate = annualInterestRate;
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
        public double withdraw(double amount) {
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
        /* We create the object here */
        Account christopher = new Account(1122, 20000, 4.5);
        
        /* We withdraw money here */
        double housePayment = christopher.withdraw(2500);

        /* We deposit money here */
        christopher.deposit(3000);

        /* We get output here */
        System.out.println("Balence: "+christopher.getBalence());
        System.out.println("Monthly Interest: "+christopher.getMonthlyInterestRate());
        System.out.println("Date Created: "+christopher.getDateCreated());
    }
}