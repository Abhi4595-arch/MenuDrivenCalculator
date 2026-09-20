#ifndef CALCUX_API_H
#define CALCUX_API_H

#include <string>

std::string handleCalculateRequest(const std::string &body);
std::string handleExpressionRequest(const std::string &body);
std::string handleHistoryRequest();
std::string clearHistoryRequest();

#endif
