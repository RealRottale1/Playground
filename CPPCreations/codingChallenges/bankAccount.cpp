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
    void withdraw(double amount)
    {
        if (this->balance < amount)
        {
            std::cout << "Withdraw amount exceeds current balance amount!" << std::endl;
        }
        else
        {
            this->balance -= amount;
        }
    }
    void displayDetails()
    {
        std::cout << "Acount name: " << this->accountHolderName << ", Account number: " << this->accountNumber << ", Balance: " << this->balance << std::endl;
    };
}

std::string
getAccountNumber()
{
    std::string accountNumber;
    std::cout << "Account Number: ";
    std::getline(std::cin, accountNumber);
    if (allAccounts.find(accountNumber) != allAccounts.end())
    {
        return accountNumber;
    }
    else
    {
        std::cout << "User does not exist!" << std::endl;
        return "null";
    }
}

main()
{
    std::map<std::string, bankAccount> allAccounts;
    do
    {
        std::string command;
        std::cout << "0 = Create account\n1 = Deposit money\n2 = Withdraw money\n3 = Display account details\n4 = Quit" << std::endl;
        std::getline(std::cin, command);

        switch (std::stoi(command))
        {
        case (0):
        {
            std::string accountName;
            std::string accountNumber;
            std::string balance;
            std::cout << "Name: ";
            std::getline(std::cin, accountName);
            std::cout << "Account Number: ";
            std::getline(std::cin, accountNumber);
            std::cout << "Balance: ";
            std::getline(std::cin, balance);
            bankAccount newAccount(accountName, accountNumber, std::stod(balance));
            allAccounts.insert({accountNumber, bankAccount});
            break;
        }
        case (1):
        {
            std::string accountNumber = getAccountNumber() if (accountNumer != "null")
            {
                std::string amount;
                std::cout << "Deposit Amount: ";
                std::getline(std::cin, amount);
                allAccounts[accountNumber].deposit(std::stod(amount));
            }
            break;
        }
        case (2):
        {
            std::string accountNumber = getAccountNumber() if (accountNumer != "null")
            {
                std::string amount;
                std::cout << "Withdraw Amount: ";
                std::getline(std::cin, amount);
                allAccounts[accountNumber].withdraw(std::stod(amount));
            }
            break;
        }
        case (3):
        {
            std::string accountNumber = getAccountNumber() 
            if (accountNumer != "null")
            {
                allAccounts[accountNumber].displayDetails();
            }
            break;
        }
        case(4):
            return 0;
        default:
            std::cout << "Invalid Command!" << std::endl;
        }

    } while (true);
    return 0;
}