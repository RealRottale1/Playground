/**
 * Christopher Markham
 * 4/9/2026
 * Basic Calculator
 * Handles basic math operations including sqrt and power
 */
public class Main {

    /*
     * Calculates the sum of two numbers.
     * @param a The first operand
     * @param b The second operand
     * @return The sum of a and b
     */
    public static double add(double a, double b) {
        return a + b;
    }

    /*
     * Calculates the difference between two numbers.
     * @param a The number to be subtracted from b
     * @param b The number to subtract a
     * @return The result of a minus b
     */
    public static double subtract(double a, double b) {
        return a - b;
    }

    /*
     * Calculates the product of two numbers.
     * @param a The first factor
     * @param b The second factor
     * @return The product of a and b
     */
    public static double multiply(double a, double b) {
        return a * b;
    }

    /*
     * Performs division between two numbers.
     * @param a The dividend
     * @param b The divisor
     * @return The quotient
     * @throws ArithmeticException if b is zero
     */
    public static double divide(double a, double b) {
        // Explicit check to prevent undefined behavior in floating point division
        if (b == 0) {
            throw new ArithmeticException("Divide by 0 Error!");
        }
        return a / b;
    }

    /*
     * Raises a base to a non-negative integer power.
     * @param base The number to be raised
     * @param exp The exponent (must be 0 or greater)
     * @return The result of base raised to the power of exp
     * @throws IllegalArgumentException if the exponent is negative
     */
    public static double power(double base, int exp) {
        if (exp < 0) {
            throw new IllegalArgumentException("Exp can't be less than 0");
        }
        return Math.pow(base, exp);
    }

    /*
     * Calculates the square root of a non-negative number.
     * @param n The value to calculate the square root of
     * @return The square root of n
     * @throws IllegalArgumentException if n is less than 0
     */
    public static double sqrt(double n) {
        if (n < 0) {
            throw new IllegalArgumentException("N can't be less than 0");
        }
        return Math.sqrt(n);
    }

    /*
     * Main entry point for the application.
     * @param args Command line arguments
     */
    public static void main(String[] args) {
    }
}