#include <iostream>
#include <string>
#include <map>

class bankAccount
{
public:
    std::string accountHolderName;
    std::string accountNumber;
    double balance;
bankAccount(std::string accountHolderName, std::string accountNumber, double balance)
{
    this->accountHolderName = accountHolderName;
    this->accountNumber = accountNumber;
    this->balance = balance;
}
void deposit(double amount)
{
    this->balance += amount;
}
};