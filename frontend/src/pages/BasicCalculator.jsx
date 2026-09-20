import { useState } from "react";
import { Link } from "react-router-dom";
import { calculate } from "../api";

function BasicCalculator() {
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [operation, setOperation] = useState("add");

  const [result, setResult] = useState(null);
  const [expression, setExpression] = useState("25 + 15");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const operations = [
    {
      id: "add",
      symbol: "+",
      name: "Addition",
    },
    {
      id: "subtract",
      symbol: "−",
      name: "Subtraction",
    },
    {
      id: "multiply",
      symbol: "×",
      name: "Multiplication",
    },
    {
      id: "divide",
      symbol: "÷",
      name: "Division",
    },
    {
      id: "modulus",
      symbol: "%",
      name: "Modulus",
    },
  ];

  const selectedOperation =
    operations.find((item) => item.id === operation) || operations[0];

  const buildExpression = () => {
    const first = firstNumber === "" ? "?" : firstNumber;
    const second = secondNumber === "" ? "?" : secondNumber;

    return `${first} ${selectedOperation.symbol} ${second}`;
  };

  const handleCalculate = async () => {
    setError("");

    if (firstNumber === "" || secondNumber === "") {
      setError("Enter both numbers before calculating.");
      return;
    }

    const a = Number(firstNumber);
    const b = Number(secondNumber);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setError("Please enter valid numeric values.");
      return;
    }

    const currentExpression = `${a} ${selectedOperation.symbol} ${b}`;

    setExpression(currentExpression);
    setLoading(true);

    try {
      const data = await calculate(operation, a, b);

      if (data?.success === false) {
        throw new Error(
          data?.error ||
            data?.message ||
            "The CALCUX C++ calculation service rejected the calculation."
        );
      }

      const calculatedResult =
        data?.result ??
        data?.value ??
        data?.answer;

      if (calculatedResult === undefined || calculatedResult === null) {
        throw new Error(
          data?.error ||
            data?.message ||
            "The server returned an invalid result."
        );
      }

      setResult(calculatedResult);
    } catch (err) {
      setResult(null);

      setError(
        err?.message ||
          "Unable to connect to the CALCUX C++ calculation engine."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOperationChange = (nextOperation) => {
    setOperation(nextOperation);
    setResult(null);
    setError("");
  };

  return (
    <div className="app calculator-page">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          CALCUX
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/calculator" className="active">
            Calculator
          </Link>

          <Link to="/advanced">Advanced</Link>

          <Link to="/expression">Expression</Link>

          <Link to="/history">History</Link>

          <Link to="/about">About</Link>
        </nav>

        <Link to="/calculator" className="nav-button">
          Open Calculator
          <span>↗</span>
        </Link>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="calculator-page-content">
        {/* ===================================================
            01 — CALCULATOR WORKSPACE
        =================================================== */}

        <section className="calculator-workspace">
          {/* LEFT — CALCULATOR + RESULT */}

          <div className="basic-calculator-shell">
            <div className="basic-calculator-header">
              <div>
                <span>CALCUX</span>
                <small>BASIC MODE</small>
              </div>

              <div className="calculator-status">
                <i></i>
                {loading ? "CALCULATING" : "READY"}
              </div>
            </div>

            <div className="basic-display">
              <span>{expression}</span>

              <strong>
                {loading
                  ? "..."
                  : result !== null
                    ? result
                    : "—"}
              </strong>
            </div>

            <div className="number-inputs">
              <div className="number-input">
                <label>FIRST NUMBER</label>

                <div>
                  
                  <input
                    type="number"
                    value={firstNumber}
                    onChange={(event) => {
                      setFirstNumber(event.target.value);
                      setError("");
                    }}
                    placeholder="25"
                    aria-label="First number"
                  />
                </div>
              </div>

              <div className="number-input">
                <label>SECOND NUMBER</label>

                <div>
                  

                  <input
                    type="number"
                    value={secondNumber}
                    onChange={(event) => {
                      setSecondNumber(event.target.value);
                      setError("");
                    }}
                    placeholder="15"
                    aria-label="Second number"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="calculate-button"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
              <span>→</span>
            </button>

            {error && (
              <div className="calculator-error">
                <span>ERROR</span>
                <p>{error}</p>
              </div>
            )}

            <div className="result-preview">
              <div>
                <span>CALCULATION OUTPUT</span>
                <small>
                  {result !== null
                    ? "Powered by the CALCUX C++ calculation service"
                    : "Waiting for a calculation"}
                </small>
              </div>

              <strong>
                {loading
                  ? "..."
                  : result !== null
                    ? result
                    : "—"}
              </strong>
            </div>
          </div>

          {/* RIGHT — OPERATION MENU */}

          <aside className="calculator-operation-menu">
            <div className="calculator-menu-header">
              <div>
                <span>CALCULATION MENU</span>
                <small>SELECT AN OPERATION</small>
              </div>

              <span className="calculator-menu-count">05</span>
            </div>

            <div className="calculator-menu-list">
              {operations.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`calculator-menu-item ${
                    operation === item.id ? "active" : ""
                  }`}
                  onClick={() => handleOperationChange(item.id)}
                >
                  <span className="calculator-menu-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="calculator-menu-symbol">
                    {item.symbol}
                  </span>

                  <span className="calculator-menu-name">
                    {item.name}
                  </span>

                  <span className="calculator-menu-arrow">
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="calculator-menu-note">
              <span>ENGINE</span>
              <strong>C++ CALCULATION SERVICE</strong>
              <small>
                Select an operation, enter both values,
                then calculate.
              </small>
            </div>
          </aside>
        </section>

        {/* ===================================================
            02 — SIMPLE / PRECISE
        =================================================== */}

        <section className="calculator-hero">
          <div className="calculator-hero-copy">
            <div className="eyebrow">
              <span className="status-dot"></span>

              BASIC CALCULATOR · CALCUX
            </div>

            <h1>
              Simple.
              <br />
              <span>Precise.</span>
            </h1>

            <p>
              Perform everyday arithmetic operations with a
              clean interface backed by the CALCUX C++
              calculation engine.
            </p>
          </div>

          <div className="calculator-hero-meta">
            <span>SUPPORTED OPERATIONS</span>

            <strong>05</strong>

            <small>
              Addition · Subtraction · Multiplication ·
              Division · Modulus
            </small>
          </div>
        </section>

        {/* ===================================================
            03 — VALIDATION
        =================================================== */}

        <section className="calculator-safety">
          <div className="safety-heading">
            <span className="section-label">
              VALIDATION
            </span>

            <h2>
              Built to handle
              <br />
              <span>edge cases.</span>
            </h2>
          </div>

          <div className="safety-grid">
            <div className="safety-card">
              <span>01</span>

              <h3>Division by zero</h3>

              <p>
                Invalid division operations are detected
                before producing a result.
              </p>
            </div>

            <div className="safety-card">
              <span>02</span>

              <h3>Modulus by zero</h3>

              <p>
                Modulus operations validate the divisor
                before calculation.
              </p>
            </div>

            <div className="safety-card">
              <span>03</span>

              <h3>Input validation</h3>

              <p>
                Numeric input is validated before being
                passed to the calculation service.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            04 — NEXT
        =================================================== */}

        <section className="calculator-next">
          <div>
            <span className="section-label">NEXT</span>

            <h2>
              Explore advanced
              <br />
              <span>operations.</span>
            </h2>
          </div>

          <Link
            to="/advanced"
            className="secondary-button"
          >
            Advanced Operations
            <span>→</span>
          </Link>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>
        <span>
          CALCUX · C++ CALCULATOR SYSTEM
        </span>

        <span>
          B.TECH CSE · 2025 CURRICULUM
        </span>
      </footer>
    </div>
  );
}

export default BasicCalculator;