#ifndef HISTORY_H
#define HISTORY_H

#include <string>

void addToHistory(
    const std::string &calculation,
    const std::string &category = ""
);

void showHistory();

void searchHistory();

void showHistoryStatistics();

void clearHistory();

std::string formatNumber(double number);

void saveCalculation(
    double a,
    const std::string &operation,
    double b,
    double result,
    const std::string &category = "ARITHMETIC"
);

#endif