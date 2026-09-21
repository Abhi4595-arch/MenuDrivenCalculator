import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { calculate, calculateUnary } from "../api";
import MobileMenu from "../components/MobileMenu";

const OPERATIONS = {
  power: {
    label: "Power (a^b)",
    title: "Power",
    symbol: "ϟ",
    type: "binary",
    apiOperation: "power",
    fields: [
      { key: "a", label: "BASE (a)", placeholder: "2" },
      { key: "b", label: "EXPONENT (b)", placeholder: "10" },
    ],
    example: "2 ^ 10 = 1024",
  },
  squareRoot: {
    label: "Square Root (√)",
    title: "Square Root",
    symbol: "√",
    type: "unary",
    apiOperation: "squareRoot",
    fields: [
      { key: "value", label: "NUMBER", placeholder: "144" },
    ],
    example: "√144 = 12",
  },
  percentage: {
    label: "Percentage (%)",
    title: "Percentage",
    symbol: "%",
    type: "binary",
    apiOperation: "percentage",
    fields: [
      { key: "a", label: "VALUE", placeholder: "250" },
      { key: "b", label: "PERCENTAGE", placeholder: "20" },
    ],
    example: "20% of 250 = 50",
  },
  factorial: {
    label: "Factorial (n!)",
    title: "Factorial",
    symbol: "!",
    type: "unary",
    apiOperation: "factorial",
    fields: [
      { key: "value", label: "INTEGER", placeholder: "5" },
    ],
    example: "5! = 120",
  },
  primeCheck: {
    label: "Prime Check",
    title: "Prime Check",
    symbol: "⌕",
    type: "unary",
    apiOperation: "primeCheck",
    fields: [
      { key: "value", label: "INTEGER", placeholder: "17" },
    ],
    example: "17 → Prime",
  },
  evenOddCheck: {
    label: "Even / Odd",
    title: "Even / Odd",
    symbol: "∞",
    type: "unary",
    apiOperation: "evenOddCheck",
    fields: [
      { key: "value", label: "INTEGER", placeholder: "24" },
    ],
    example: "24 → Even",
  },
  gcd: {
    label: "GCD",
    title: "GCD",
    symbol: "G",
    type: "binary",
    apiOperation: "gcd",
    fields: [
      { key: "a", label: "NUMBER 1", placeholder: "48" },
      { key: "b", label: "NUMBER 2", placeholder: "18" },
    ],
    example: "GCD(48, 18) = 6",
  },
  lcm: {
    label: "LCM",
    title: "LCM",
    symbol: "↻",
    type: "binary",
    apiOperation: "lcm",
    fields: [
      { key: "a", label: "NUMBER 1", placeholder: "12" },
      { key: "b", label: "NUMBER 2", placeholder: "18" },
    ],
    example: "LCM(12, 18) = 36",
  },
};

const OPERATION_LIST = [
  ["power", "ϟ", "01", "Power (a^b)"],
  ["squareRoot", "√", "02", "Square Root (√)"],
  ["percentage", "%", "03", "Percentage (%)"],
  ["factorial", "!", "04", "Factorial (n!)"],
  ["primeCheck", "⌕", "05", "Prime Check"],
  ["evenOddCheck", "∞", "06", "Even / Odd"],
  ["gcd", "G", "07", "GCD"],
  ["lcm", "↻", "08", "LCM"],
];

function AdvancedOperations() {
  const [operation, setOperation] = useState("power");

  const [values, setValues] = useState({
    a: "2",
    b: "10",
    value: "",
  });

  const [result, setResult] = useState(null);
  const [expression, setExpression] = useState("2 ^ 10");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = OPERATIONS[operation];

  const previewExpression = useMemo(() => {
    const a = values.a || selected.fields[0]?.placeholder || "";
    const b = values.b || selected.fields[1]?.placeholder || "";
    const value = values.value || selected.fields[0]?.placeholder || "";

    switch (operation) {
      case "power":
        return `${a} ^ ${b}`;

      case "squareRoot":
        return `√${value}`;

      case "percentage":
        return `${b}% of ${a}`;

      case "factorial":
        return `${value}!`;

      case "primeCheck":
        return `${value} → ?`;

      case "evenOddCheck":
        return `${value} → ?`;

      case "gcd":
        return `GCD(${a}, ${b})`;

      case "lcm":
        return `LCM(${a}, ${b})`;

      default:
        return "";
    }
  }, [operation, selected, values]);

  const changeOperation = (nextOperation) => {
    const next = OPERATIONS[nextOperation];

    const nextValues = {
      a: next.fields.find((field) => field.key === "a")
        ? next.fields.find((field) => field.key === "a").placeholder
        : "",
      b: next.fields.find((field) => field.key === "b")
        ? next.fields.find((field) => field.key === "b").placeholder
        : "",
      value: next.fields.find((field) => field.key === "value")
        ? next.fields.find((field) => field.key === "value").placeholder
        : "",
    };

    setOperation(nextOperation);
    setValues(nextValues);
    setResult(null);
    setError("");
    setExpression("");
  };

  const handleChange = (key, value) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setResult(null);
    setError("");
    setExpression("");
  };

  const handleCalculate = async () => {
    setError("");
    setResult(null);

    for (const field of selected.fields) {
      const rawValue = values[field.key];

      if (rawValue === "" || rawValue === undefined) {
        setError(`Please enter ${field.label.toLowerCase()}.`);
        return;
      }

      if (!Number.isFinite(Number(rawValue))) {
        setError(
          `Please enter a valid number for ${field.label.toLowerCase()}.`
        );
        return;
      }
    }

    if (operation === "factorial") {
      const n = Number(values.value);

      if (!Number.isInteger(n) || n < 0 || n > 20) {
        setError("Factorial accepts an integer from 0 to 20.");
        return;
      }
    }

    if (
      operation === "primeCheck" ||
      operation === "evenOddCheck" ||
      operation === "gcd" ||
      operation === "lcm"
    ) {
      for (const field of selected.fields) {
        if (!Number.isInteger(Number(values[field.key]))) {
          setError(`${field.label} must be an integer.`);
          return;
        }
      }
    }

    if (operation === "squareRoot" && Number(values.value) < 0) {
      setError("Square root requires a non-negative number.");
      return;
    }

    setLoading(true);

    try {
      let data;

      if (selected.type === "binary") {
        data = await calculate(
          selected.apiOperation,
          Number(values.a),
          Number(values.b)
        );
      } else {
        data = await calculateUnary(
          selected.apiOperation,
          Number(values.value)
        );
      }

      const isStatusOperation =
  operation === "primeCheck" ||
  operation === "evenOddCheck";

const calculatedResult = isStatusOperation
  ? data?.message
  : (
      data?.result ??
      data?.value ??
      data?.output
    );

if (
  calculatedResult === undefined ||
  calculatedResult === null ||
  calculatedResult === ""
) {
  throw new Error(
    data?.message ||
      "The server returned no calculation result."
  );
}

setResult(calculatedResult);

setExpression(
  data?.expression ||
    `${previewExpression} = ${String(calculatedResult)}`
);
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Calculation failed. Make sure the CALCUX C++ server is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app advanced-page">
      <MobileMenu />
      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          CALCUX
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/calculator">Calculator</Link>
          <Link to="/advanced" className="active">
            Advanced
          </Link>
          <Link to="/expression">Expression</Link>
          <Link to="/history">History</Link>
          <Link to="/about">About</Link>
        </nav>

        <Link to="/calculator" className="nav-button">
          Open Calculator
          <span>↗</span>
        </Link>
      </header>

      <main className="advanced-page-content">

        {/* HERO + OPERATION MENU */}
        <section className="advanced-hero">
          <div className="advanced-hero-menu">
            <div className="eyebrow">
              <span className="status-dot"></span>
              ADVANCED OPERATIONS · CALCUX
            </div>

            <div className="advanced-menu-heading">
              <span>CALCULATION MENU</span>
              <small>SELECT AN OPERATION</small>
            </div>

            <div className="advanced-operation-menu">
              {OPERATION_LIST.map(
                ([key, symbol, number, label]) => (
                  <button
                    type="button"
                    className={`advanced-menu-item ${
                      operation === key ? "active" : ""
                    }`}
                    key={key}
                    onClick={() => changeOperation(key)}
                  >
                    <span className="advanced-menu-number">
                      {number}
                    </span>

                    <span className="advanced-menu-symbol">
                      {symbol}
                    </span>

                    <span className="advanced-menu-label">
                      {label}
                    </span>

                    <span className="advanced-menu-arrow">
                      →
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* MAIN CALCULATOR */}
          <div className="advanced-calculator-shell">
            <div className="advanced-calculator-header">
              <div>
                <span>CALCUX</span>
                <small>ADVANCED MODE</small>
              </div>

              <div className="calculator-status">
                <i></i>
                {loading ? "CALCULATING" : "READY"}
              </div>
            </div>

            <div className="advanced-operation-selector">
              <label htmlFor="advanced-operation">
                OPERATION
              </label>

              <div className="advanced-select-wrap">
                <select
                  id="advanced-operation"
                  className="advanced-select"
                  value={operation}
                  onChange={(event) =>
                    changeOperation(event.target.value)
                  }
                >
                  {Object.entries(OPERATIONS).map(
                    ([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    )
                  )}
                </select>

                <span className="advanced-select-arrow">
                 ⌄
                </span>
              </div>
            </div>

            <div className="advanced-inputs">
              {selected.fields.map((field) => (
                <div className="advanced-field" key={field.key}>
                  <label htmlFor={`advanced-${field.key}`}>
                    {field.label}
                  </label>

                  <input
                    id={`advanced-${field.key}`}
                    type="number"
                    inputMode="decimal"
                    value={values[field.key]}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      handleChange(
                        field.key,
                        event.target.value
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <div className="advanced-result">
              <div>
                <span>RESULT</span>
                <small>
                  {expression || previewExpression}
                </small>
              </div>

              <strong>
                {result === null || result === undefined
                  ? "—"
                  : String(result)}
              </strong>
            </div>

            <div className="advanced-example">
              Example · <strong>{selected.example}</strong>
            </div>

            <button
              type="button"
              className="advanced-calculate-button"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate"}
              <span>→</span>
            </button>

            {error && (
              <div className="advanced-error">
                {error}
              </div>
            )}
          </div>
        </section>


        {/* TWO COLUMN CONTENT */}
        <section className="advanced-operations">
          <div className="advanced-lower-grid">

            {/* ALL OPERATIONS */}
            <div className="advanced-operations-list">
              <div className="advanced-mini-label">
                <i></i>
                ALL OPERATIONS
              </div>

              <h2 className="advanced-lower-title">
                One selector.
                <br />
                <span>Multiple possibilities.</span>
              </h2>

              <p className="advanced-lower-copy">
                Choose an operation from the dropdown and enter
                the required values. Each operation is handled
                by the modular CALCUX C++ calculation service.
              </p>

              <div className="advanced-operation-list">
                {OPERATION_LIST.map(
                  ([key, symbol, number, label]) => (
                    <button
                      type="button"
                      className="advanced-operation-item"
                      key={key}
                      onClick={() => changeOperation(key)}
                    >
                      <b>{symbol}</b>

                      <div>
                        <small>{number}</small>
                        <strong>{label}</strong>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>


            {/* WHY ADVANCED */}
            <div className="advanced-why-card">
              <div className="advanced-mini-label">
                <i></i>
                WHY ADVANCED?
              </div>

              <h2 className="advanced-lower-title">
                More than
                <br />
                <span>everyday math.</span>
              </h2>

              <p className="advanced-lower-copy">
                From number theory to real-world percentages,
                CALCUX helps you explore mathematical operations
                with clarity while keeping the calculation logic
                inside the C++ backend.
              </p>

              <div className="advanced-why-points">
                <div className="advanced-why-point">
                  <i>◌</i>
                  <span>REAL CALCULATIONS</span>
                </div>

                <div className="advanced-why-point">
                  <i>◌</i>
                  <span>INPUT VALIDATION</span>
                </div>

                <div className="advanced-why-point">
                  <i>◌</i>
                  <span>ERROR HANDLING</span>
                </div>

                <div className="advanced-why-point">
                  <i>◌</i>
                  <span>C++ BACKEND</span>
                </div>
              </div>
            </div>
          </div>


          {/* RULES */}
          <div className="advanced-rules">
            <div className="advanced-rules-heading">
              <div className="advanced-mini-label">
                <i></i>
                MATHEMATICAL RULES
              </div>

              <h2>
                Stay accurate.
                <br />
                <span>Stay reliable.</span>
              </h2>

              <p>
                Built-in validation keeps advanced calculations
                meaningful and prevents unsupported input from
                reaching the calculation engine.
              </p>
            </div>

            <div className="advanced-validation-grid">
              <div className="advanced-validation-item">
                <span>01</span>

                <h3>Valid Inputs</h3>

                <p>
                  Negative square-root inputs are rejected.
                </p>
              </div>

              <div className="advanced-validation-item">
                <span>02</span>

                <h3>Safe Limits</h3>

                <p>
                  Factorial is limited to supported integer
                  values.
                </p>
              </div>

              <div className="advanced-validation-item">
                <span>03</span>

                <h3>Integer Logic</h3>

                <p>
                  Prime, parity, GCD and LCM use integers.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* NEXT */}
        <section className="advanced-next">
          <div>
            <span className="section-label">NEXT</span>

            <h2>
              Build complete
              <br />
              <span>expressions.</span>
            </h2>
          </div>

          <Link
            to="/expression"
            className="secondary-button"
          >
            Expression Calculator
            <span>→</span>
          </Link>
        </section>
      </main>

      <footer>
        <span>CALCUX · C++ CALCULATOR SYSTEM</span>
        <span>B.TECH CSE · 2025 CURRICULUM</span>
      </footer>
    </div>
  );
}

export default AdvancedOperations;
