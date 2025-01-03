#include <iostream>
#include <thread>
#include <string>
#include <chrono>

bool stoppedTimer = false;

bool isNumber(std::string &string) {
    const int stringLength = string.length();
    for (int i = 0; i < stringLength; i++) {
        if (!std::isdigit(string[i])) {
            return false;
        }
    }
    if (stringLength > 0) {
        return true;
    } else {
        return false;
    }
}

void countDown(float startValue) {
    for (float i = startValue*100; i >= 0; i--) {
        if (stoppedTimer) {
            return;
        }
        std::cout << i/100 << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
    std::cout << "Timer finished counting!" << std::endl;
}

int main() {
    do {
        stoppedTimer = false;
        std::string timerAmount;
        do {
            std::cout << "Timer  amount: ";
            std::getline(std::cin, timerAmount);
        } while(!isNumber(timerAmount));
        std::thread newThread(countDown, stoi(timerAmount));
        newThread.detach();
        std::string stopTimer;
        std::getline(std::cin, stopTimer);
        std::cout << "Timer Stopped!" << std::endl;
        stoppedTimer = true;
        std::getline(std::cin, stopTimer);
    } while (true);
    return 0;
}