#include <iostream>
#include <map>
#include <string>
#include <vector>

class student
{
public:
    std::string name;
    int age;
    float grade;
    student(std::string name, int age, float grade)
    {
        this->name = name;
        this->age = age;
        this->grade = grade;
    }
    void displayDetails()
    {
        std::cout << "Name: " << this->name << ", Age: " << this->age << ", Grade: " << this->grade << std::endl;
    }
};

int main()
{
    std::vector<student> allStudents = {};
    std::string command;
    do
    {
        std::cout << "0 = Add a student\n1 = Display all student info\n2 = Find student with highest grade\n3 = Quit" << std::endl;
        std::getline(std::cin, command);
        switch (std::stoi(command))
        {
        case (0):
            {
                std::string name;
                std::string age;
                std::string grade;
                std::cout << "Student name: ";
                std::getline(std::cin, name);
                std::cout << "Student age: ";
                std::getline(std::cin, age);
                std::cout << "Student grade: ";
                std::getline(std::cin, grade);
                student newStudent(name, stoi(age), stof(grade));
                allStudents.push_back(newStudent);
                break;
            }
        case (1):
            {
                for (auto &student : allStudents)
                {
                    student.displayDetails();
                }
                break;
            }
        case (2):
            {
                student *bestStudent = nullptr;
                for (auto &student : allStudents)
                {
                    if (bestStudent == nullptr || bestStudent != nullptr && bestStudent->grade < student.grade)
                    {
                        bestStudent = &student;
                    }
                }
                if (bestStudent == nullptr)
                {
                    std::cout << "There are no students!" << std::endl;
                }
                else
                {
                    std::cout << "The student with the highest grade is " << bestStudent->name << " with a grade of " << bestStudent->grade << std::endl;
                }
                break;
            }
        case (3):
            return 0;
        default:
            std::cout << "Not a valid input!" << std::endl;
        }
    } while (true);
    return 0;
};