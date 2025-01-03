#include <iostream>
#include <string>

int totalTime = 0;

void outputTime() {
    const int hours = totalTime/3600;
    const int minutes = (totalTime - (hours*3600))/60;
    const int seconds = (totalTime - ((hours*3600)+(minutes*60)));
    std::cout << "Hours: " << hours << std::endl;
    std::cout << "Minutes: " << minutes << std::endl;
    std::cout << "Seconds: " << seconds << std::endl << std::endl;
}

void inputTime() {
    std::string addTime;
    std::cout << "Add time: ";
    std::getline(std::cin, addTime);
    const int subtract = (addTime.find('-') == std::string::npos ? 1 : -1);
    const int delimiterIndex = addTime.find(':');
    if (delimiterIndex != std::string::npos) {
        std::string minutes = addTime.substr(0, delimiterIndex);
        std::string seconds = addTime.substr(delimiterIndex+1, addTime.length());
        totalTime += stoi(minutes) * 60;
        totalTime += stoi(seconds) * subtract;
    }
    std::cout << std::endl;
}

int main() {
    do {
        outputTime();
        inputTime();
    } while (true);
    return 0;
}