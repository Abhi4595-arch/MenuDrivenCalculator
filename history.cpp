#include "history.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <string>

using namespace std;

const string HISTORY_FILE = "history.txt";


// ============================================================
// FORMAT NUMBER
// ============================================================

string formatNumber(double number)
{
    ostringstream output;

    output << fixed << setprecision(10) << number;

    string result = output.str();

    // Remove unnecessary trailing zeros
    result.erase(
        result.find_last_not_of('0') + 1
    );

    // Remove trailing decimal point
    if (!result.empty() && result.back() == '.')
    {
        result.pop_back();
    }

    return result;
}


// ============================================================
// ADD TO HISTORY
// ============================================================

void addToHistory(
    const string &calculation,
    const string &category
)
{
    ofstream file(HISTORY_FILE, ios::app);

    if (!file)
    {
        cout << "Warning: Unable to save calculation history.\n";
        return;
    }

    // Store category only when provided
    if (!category.empty())
    {
        file << "[" << category << "] "
             << calculation
             << endl;
    }
    else
    {
        file << calculation << endl;
    }

    file.close();
}


// ============================================================
// SAVE STANDARD CALCULATION
// ============================================================

void saveCalculation(
    double a,
    const string &operation,
    double b,
    double result,
    const string &category
)
{
    string calculation =
        formatNumber(a) + " " +
        operation + " " +
        formatNumber(b) + " = " +
        formatNumber(result);

    addToHistory(calculation, category);
}


// ============================================================
// VIEW HISTORY
// ============================================================

void showHistory()
{
    ifstream file(HISTORY_FILE);

    cout << "\n========================================\n";
    cout << "          CALCULATION HISTORY\n";
    cout << "========================================\n";

    if (!file)
    {
        cout << "No calculation history found.\n";
        cout << "========================================\n";
        return;
    }

    string line;
    int count = 1;
    bool hasHistory = false;

    while (getline(file, line))
    {
        if (!line.empty())
        {
            cout << count << ". " << line << endl;

            count++;
            hasHistory = true;
        }
    }

    if (!hasHistory)
    {
        cout << "No calculation history available.\n";
    }

    cout << "========================================\n";

    file.close();
}


// ============================================================
// SEARCH HISTORY
// ============================================================

void searchHistory()
{
    cin.ignore();

    string keyword;

    cout << "\nEnter search keyword: ";
    getline(cin, keyword);

    ifstream file(HISTORY_FILE);

    if (!file)
    {
        cout << "\nNo calculation history found.\n";
        return;
    }

    string line;

    int count = 1;
    int matches = 0;

    cout << "\n========================================\n";
    cout << "           SEARCH RESULTS\n";
    cout << "========================================\n";

    while (getline(file, line))
    {
        if (line.find(keyword) != string::npos)
        {
            cout << count << ". " << line << endl;

            matches++;
        }

        count++;
    }

    if (matches == 0)
    {
        cout << "No matching calculations found.\n";
    }
    else
    {
        cout << "\nMatches found: " << matches << endl;
    }

    cout << "========================================\n";

    file.close();
}


// ============================================================
// HISTORY STATISTICS
// ============================================================

void showHistoryStatistics()
{
    ifstream file(HISTORY_FILE);

    cout << "\n========================================\n";
    cout << "          HISTORY STATISTICS\n";
    cout << "========================================\n";

    if (!file)
    {
        cout << "Total Calculations : 0\n";
        cout << "========================================\n";
        return;
    }

    string line;

    int total = 0;

    int addition = 0;
    int subtraction = 0;
    int multiplication = 0;
    int division = 0;
    int modulus = 0;
    int powerOperations = 0;
    int otherOperations = 0;

    while (getline(file, line))
    {
        if (line.empty())
            continue;

        total++;

        if (line.find(" + ") != string::npos)
        {
            addition++;
        }
        else if (line.find(" - ") != string::npos)
        {
            subtraction++;
        }
        else if (line.find(" * ") != string::npos)
        {
            multiplication++;
        }
        else if (line.find(" / ") != string::npos)
        {
            division++;
        }
        else if (line.find(" % ") != string::npos)
        {
            modulus++;
        }
        else if (line.find(" ^ ") != string::npos)
        {
            powerOperations++;
        }
        else
        {
            otherOperations++;
        }
    }

    cout << "Total Calculations : " << total << endl;

    cout << "\nOperation Breakdown\n";
    cout << "----------------------------\n";

    cout << "Addition           : "
         << addition << endl;

    cout << "Subtraction        : "
         << subtraction << endl;

    cout << "Multiplication     : "
         << multiplication << endl;

    cout << "Division           : "
         << division << endl;

    cout << "Modulus            : "
         << modulus << endl;

    cout << "Power              : "
         << powerOperations << endl;

    cout << "Other Operations   : "
         << otherOperations << endl;

    cout << "========================================\n";

    file.close();
}


// ============================================================
// CLEAR HISTORY
// ============================================================

void clearHistory()
{
    ofstream file(HISTORY_FILE, ios::trunc);

    if (!file)
    {
        cout << "Error: Unable to clear history.\n";
        return;
    }

    file.close();

    cout << "\nCalculation history cleared successfully.\n";
}