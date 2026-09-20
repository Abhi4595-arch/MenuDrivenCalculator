const API_BASE_URL = "http://localhost:8080";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Server error: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.error) {
        message = errorData.error;
      } else if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

/* =========================================================
   HEALTH
   ========================================================= */

export async function checkHealth() {
  return request("/health");
}

/* =========================================================
   BASIC / ADVANCED CALCULATIONS
   ========================================================= */

export async function calculate(operation, a, b) {
  return request("/calculate", {
    method: "POST",

    body: JSON.stringify({
      operation,
      a,
      b,
    }),
  });
}

/* =========================================================
   UNARY CALCULATIONS
   ========================================================= */

export async function calculateUnary(operation, value) {
  return request("/calculate", {
    method: "POST",

    body: JSON.stringify({
      operation,
      value,
    }),
  });
}

/* =========================================================
   EXPRESSION CALCULATOR
   ========================================================= */

export async function calculateExpression(expression) {
  return request("/expression", {
    method: "POST",

    body: JSON.stringify({
      expression,
    }),
  });
}

/* =========================================================
   HISTORY
   ========================================================= */

export async function getHistory() {
  return request("/history");
}

/* =========================================================
   CLEAR HISTORY
   ========================================================= */

export async function clearHistory() {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = `Server error: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.error) {
        message = errorData.error;
      } else if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}