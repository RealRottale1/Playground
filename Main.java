/* Name: Christopher Markham
 * Date: 10/20/2025
 * Project Name: BigInteger Practice
 * Description: Calculates combinations from two numbers
 */

import java.math.BigInteger;
import java.util.Scanner;

public class Main {

    public static BigInteger getNumberOfCombinations(int n, int k) {
        BigInteger numerator = BigInteger.ONE;
        BigInteger denominator = BigInteger.ONE;
        for (int i = 0; i < k; i++) {
            numerator = numerator.multiply(BigInteger.valueOf(n - i));
            denominator = denominator.multiply(BigInteger.valueOf(i + 1));
        }
        return numerator.divide(denominator);
    }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter n:");
        int n = scanner.nextInt();
        System.out.println("Enter k:");
        int k = scanner.nextInt();
        System.out.println("The C(n, k) is "+getNumberOfCombinations(n, k));
    }
}