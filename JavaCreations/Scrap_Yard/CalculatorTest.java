import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {

    private Main calculator;
    private final double DELTA = 0.0001;

    @BeforeEach
    void setUp() {
        calculator = new Main();
    }

    @Test
    @DisplayName("Addition: Should correctly sum two positive doubles")
    void testAdd() {
        assertEquals(5.5, calculator.add(2.2, 3.3), DELTA);
    }

    @Test
    @DisplayName("Subtraction: Should correctly find the difference between doubles")
    void testSubtract() {
        assertEquals(2.0, calculator.subtract(10.5, 8.5), DELTA);
    }

    @Test
    @DisplayName("Multiplication: Should correctly multiply two doubles")
    void testMultiply() {
        assertEquals(12.5, calculator.multiply(2.5, 5.0), DELTA);
    }

    @Test
    @DisplayName("Division: Should correctly divide doubles")
    void testDivide() {
        assertEquals(4.0, calculator.divide(10.0, 2.5), DELTA);
    }

    @Test
    @DisplayName("Power: Should correctly calculate base raised to a positive integer exponent")
    void testPower() {
        assertEquals(8.0, calculator.power(2.0, 3), DELTA);
    }

    @Test
    @DisplayName("Square Root: Should correctly calculate the square root of a positive double")
    void testSqrt() {
        assertEquals(3.0, calculator.sqrt(9.0), DELTA);
    }

    @Nested
    @DisplayName("Edge Case Tests")
    class EdgeCases {

        @ParameterizedTest
        @DisplayName("Addition with negative numbers")
        @CsvSource({
            "-1.0, -2.0, -3.0",
            "-5.5, 2.5, -3.0",
            "10.0, -15.0, -5.0"
        })
        void testAddNegatives(double a, double b, double expected) {
            assertEquals(expected, calculator.add(a, b), DELTA);
        }

        @ParameterizedTest
        @DisplayName("Subtraction with negative numbers")
        @CsvSource({
            "-1.0, -1.0, 0.0",
            "-5.0, -10.0, 5.0",
            "0.0, -5.5, 5.5"
        })
        void testSubtractNegatives(double a, double b, double expected) {
            assertEquals(expected, calculator.subtract(a, b), DELTA);
        }

        @ParameterizedTest
        @DisplayName("Multiplication with negative numbers")
        @CsvSource({
            "-2.0, -3.0, 6.0",
            "-4.0, 5.0, -20.0",
            "-1.5, 2.0, -3.0"
        })
        void testMultiplyNegatives(double a, double b, double expected) {
            assertEquals(expected, calculator.multiply(a, b), DELTA);
        }

        @ParameterizedTest
        @DisplayName("Division with negative numbers")
        @CsvSource({
            "-10.0, -2.0, 5.0",
            "-10.0, 2.0, -5.0",
            "5.0, -2.0, -2.5"
        })
        void testDivideNegatives(double a, double b, double expected) {
            assertEquals(expected, calculator.divide(a, b), DELTA);
        }

        @ParameterizedTest
        @DisplayName("Multiplication by zero should always be zero")
        @ValueSource(doubles = {-100.0, 0.0, 55.5, 1234.567})
        void testMultiplyByZero(double operand) {
            assertEquals(0.0, calculator.multiply(operand, 0.0), DELTA);
            assertEquals(0.0, calculator.multiply(0.0, operand), DELTA);
        }

        @ParameterizedTest
        @DisplayName("Additive Inverse: add(a, -a) should be zero")
        @ValueSource(doubles = {-10.5, 0.0, 100.25})
        void testAdditiveInverse(double a) {
            assertEquals(0.0, calculator.add(a, -a), DELTA);
        }

        @ParameterizedTest
        @DisplayName("Power: Any base to the power of 0 should be 1")
        @ValueSource(doubles = {-5.0, 1.0, 10.0, 0.0})
        void testPowerZero(double base) {
            assertEquals(1.0, calculator.power(base, 0), DELTA);
        }

        @ParameterizedTest
        @DisplayName("Square Root: Identity values for 0 and 1")
        @CsvSource({
            "0.0, 0.0",
            "1.0, 1.0"
        })
        void testSqrtIdentities(double input, double expected) {
            assertEquals(expected, calculator.sqrt(input), DELTA);
        }
    }
    
    @Nested
    @DisplayName("Validation Tests")
    class Validation {

        @Test
        @DisplayName("Division: Should throw ArithmeticException when divisor is 0")
        void testDivideByZero() {
            ArithmeticException exception = assertThrows(ArithmeticException.class, () -> {
                calculator.divide(10.0, 0.0);
            });
            
            // Your code uses "0", so we check for "0" or "zero" to be safe
            String message = exception.getMessage().toLowerCase();
            assertTrue(message.contains("0") || message.contains("zero"), 
                "Exception message should mention zero");
        }

        @ParameterizedTest
        @DisplayName("Square Root: Should throw IllegalArgumentException for negative inputs")
        @ValueSource(doubles = {-1.0, -0.001, Double.NEGATIVE_INFINITY})
        void testSqrtNegative(double input) {
            assertThrows(IllegalArgumentException.class, () -> calculator.sqrt(input));
        }

        @ParameterizedTest
        @DisplayName("Power: Should throw IllegalArgumentException for negative exponents")
        @ValueSource(ints = {-1, -5, -100})
        void testPowerNegative(int exp) {
            assertThrows(IllegalArgumentException.class, () -> calculator.power(2.0, exp));
        }

        @Test
        @DisplayName("Sequence: Verify a chain of operations using assertAll")
        void testOperationSequence() {
            // Running a sequence of calculations
            double sum = calculator.add(10.0, 5.0);        // 15.0
            double product = calculator.multiply(sum, 2.0); // 30.0
            double result = calculator.subtract(product, 5.0); // 25.0
            double finalVal = calculator.sqrt(result);      // 5.0

            assertAll("Calculator running results",
                () -> assertEquals(15.0, sum, DELTA),
                () -> assertEquals(30.0, product, DELTA),
                () -> assertEquals(25.0, result, DELTA),
                () -> assertEquals(5.0, finalVal, DELTA)
            );
        }
    }
}