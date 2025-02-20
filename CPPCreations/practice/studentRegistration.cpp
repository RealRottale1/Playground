#include <iostream>
#include <string>
#include <map>
#include <array>

struct student {
    std::string studentId;
    std::string fName;
    std::string lName;
    int gradeLevel;
    int age;
};

int main() {
    std::map<std::string, student> studentRoster;

    student tom =   {.studentId="0", .fName="Tom", .lName="Samuel", .gradeLevel=2, .age=6};
    student bob =   {.studentId="1", .fName="Bob", .lName="Smith", .gradeLevel=5, .age=11};
    student sarah = {.studentId="2", .fName="Sarah", .lName="Dunam", .gradeLevel=11, .age=17};

    std::array<student, 3> unRegisteredStudents = {tom, bob, sarah};
    for (const auto &unRegisteredStudent : unRegisteredStudents) {
        studentRoster.emplace(unRegisteredStudent.studentId, unRegisteredStudent);
    }

    const int studentRosterSize = studentRoster.size();
    for (auto &studentEntry : studentRoster) {
        std::cout << "ID:" << studentEntry.first << ", fName:" << studentEntry.second.fName << std::endl;
    }
    
    
    return 0;
}