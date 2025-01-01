#include <iostream>
#include <thread>

bool finishedCounting = false;

void countTo(int endNumber) {
    for (int i = 1; i < endNumber+1; i++) {
        std::cout << i << ", ";
    }
    finishedCounting = true;
}

int main() {
    std::thread thread_object(countTo, 25);
    thread_object.detach();
    std::cout << "Done!";
    return 0;
}