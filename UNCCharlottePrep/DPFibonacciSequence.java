import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        System.out.println(Fibonacci.generate(15, new HashMap<>()));
    }
}

class Fibonacci {
    public static long generate(long n, Map<Long, Long> m) {
        if (n <= 1) {
            return n;
        }
        long v1 = n-1;
        long v2 = n-2;

        if (m.containsKey(v1)) {
            v1 = m.get(v1);
        } else {
            v1 = Fibonacci.generate(v1, m);
            m.put(n-1, v1);
        }

        if (m.containsKey(v2)) {
            v2 = m.get(v2);
        } else {
            v2 = Fibonacci.generate(v2, m);
            m.put(n-2, v2);
        }
        return v1 + v2;
    }
}