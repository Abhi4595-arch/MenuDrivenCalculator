import { useState } from "react";
import { Link } from "react-router-dom";
import { calculateExpression } from "../api";
import MobileMenu from "../components/MobileMenu";

function ExpressionCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const appendKey = (key) => {
    setExpression((current) => `${current}${key}`);
    setResult(null);
    setError("");
  };

  const handleClear = () => {
    setExpression("");
    setResult(null);
    setError("");
  };

  const handleEvaluate = async () => {
    const value = expression.trim();

    setError("");
    setResult(null);

    if (!value) {
      setError("Enter an expression before evaluating.");
      return;
    }

    setLoading(true);

    try {
      const data = await calculateExpression(value);

      if (data?.success === false) {
  throw new Error(
    data?.error ||
      data?.message ||
      "The expression could not be evaluated."
  );
}

const calculatedResult =
  data?.result ??
  data?.value ??
  data?.output ??
  data?.answer;

if (calculatedResult === undefined || calculatedResult === null) {
  throw new Error(
    data?.error ||
      data?.message ||
      "The server returned no calculation result."
  );
}

setResult(calculatedResult);
    } catch (err) {
      setResult(null);
      setError(
        err?.message ||
          "Unable to connect to the CALCUX C++ expression engine."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app expression-page">
      {/* NAVBAR */}
      <MobileMenu />
      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          CALCUX
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/calculator">Calculator</Link>
          <Link to="/advanced">Advanced</Link>
          <Link to="/expression" className="active">
            Expression
          </Link>
          <Link to="/history">History</Link>
          <Link to="/about">About</Link>
        </nav>

        <Link to="/calculator" className="nav-button">
          Open Calculator <span>↗</span>
        </Link>
      </header>

      <main className="expression-page-content">
        {/* EXPRESSION WORKSPACE */}
        <section className="expression-workspace">
          <div className="expression-info">
            <span className="section-label">CALCULATION ENGINE</span>

            <h2>
              One line.
              <br />
              <span>Any calculation.</span>
            </h2>

            <p>
              Build expressions naturally using numbers, operators and
              parentheses. CALCUX evaluates the complete expression instead
              of limiting you to two-number calculations.
            </p>

            <div className="expression-examples">
              <div className="expression-example">
                <span>01</span>
                <strong>5 + 10 × 2</strong>
                <b>= 25</b>
              </div>

              <div className="expression-example">
                <span>02</span>
                <strong>(5 + 5) × 2</strong>
                <b>= 20</b>
              </div>

              <div className="expression-example">
                <span>03</span>
                <strong>100 / (5 × 2)</strong>
                <b>= 10</b>
              </div>
            </div>
          </div>

          <div className="expression-calculator-shell">
            <div className="expression-calculator-header">
              <div>
                <span>EXPRESSION CALCULATOR</span>
                <small>CALCUX ENGINE</small>
              </div>

              <div className="calculator-status">
                <i></i>
                {loading ? "CALCULATING" : "READY"}
              </div>
            </div>

            <div className="expression-display">
              <span>EXPRESSION</span>

              <div className="expression-display-value">
                {expression || "Enter an expression"}
              </div>

              <small>Result preview</small>

              <strong>
                {loading ? "..." : result !== null ? String(result) : "—"}
              </strong>
            </div>

            <div className="expression-keypad">
              {[
                { label: "(", value: "(" },
                { label: ")", value: ")" },
                { label: "^", value: "^" },
                { label: "÷", value: "/" },
                { label: "7", value: "7" },
                { label: "8", value: "8" },
                { label: "9", value: "9" },
                { label: "×", value: "*" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
                { label: "6", value: "6" },
                { label: "−", value: "-" },
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "+", value: "+" },
                { label: "0", value: "0" },
                { label: ".", value: "." },
              ].map((key) => (
                <button
                  key={key.label}
                  type="button"
                  className={
                    ["(", ")", "^", "÷", "×", "−", "+"].includes(key.label)
                      ? "expression-operator"
                      : ""
                  }
                  onClick={() => appendKey(key.value)}
                >
                  {key.label}
                </button>
              ))}

              <button
                type="button"
                className="expression-clear"
                onClick={handleClear}
              >
                C
              </button>

              <button
                type="button"
                className="expression-equals"
                onClick={handleEvaluate}
                disabled={loading}
              >
                =
              </button>
            </div>

            {error && (
              <div className="expression-error">
                {error}
              </div>
            )}

            <div className="expression-result">
              <div>
                <span>RESULT</span>
                <small>CALCUX C++ ENGINE</small>
              </div>

              <strong>
                {loading ? "..." : result !== null ? String(result) : "—"}
              </strong>
            </div>
          </div>
        </section>

        {/* SUPPORTED SYNTAX */}
        <section className="expression-syntax">
          <div className="expression-syntax-heading">
            <span className="section-label">SUPPORTED SYNTAX</span>

            <h2>
              Built for
              <br />
              <span>real expressions.</span>
            </h2>

            <p>
              The expression engine supports the core mathematical syntax
              required for everyday calculations.
            </p>
          </div>

          <div className="expression-syntax-grid">
            <article className="expression-syntax-card">
              <span>01</span>

              <div>
                <h3>Operators</h3>
                <p>
                  Use +, -, *, / and ^ for arithmetic and power operations.
                </p>
              </div>

              <b>+ − × ÷ ^</b>
            </article>

            <article className="expression-syntax-card">
              <span>02</span>

              <div>
                <h3>Parentheses</h3>
                <p>
                  Group calculations to control the order in which
                  expressions are evaluated.
                </p>
              </div>

              <b>( )</b>
            </article>

            <article className="expression-syntax-card">
              <span>03</span>

              <div>
                <h3>Precedence</h3>
                <p>
                  Multiplication and division are evaluated before addition
                  and subtraction.
                </p>
              </div>

              <b>ORDER</b>
            </article>

            <article className="expression-syntax-card">
              <span>04</span>

              <div>
                <h3>Validation</h3>
                <p>
                  Invalid expressions and division-by-zero conditions are
                  detected by the calculation engine.
                </p>
              </div>

              <b>SAFE</b>
            </article>
          </div>
        </section>

        {/* EXAMPLES */}
        <section className="expression-preview">
          <div className="expression-preview-card">
            <div className="expression-preview-top">
              <span>EXPRESSION EXAMPLE</span>
              <small>VALID</small>
            </div>

            <div className="expression-preview-main">
              <span>(18 + 6) / 4</span>
              <strong>= 6</strong>
            </div>

            <div className="expression-preview-bottom">
              <span>EVALUATED BY CALCUX C++ ENGINE</span>
              <b>READY</b>
            </div>
          </div>

          <div className="expression-preview-copy">
            <span className="section-label">PRECISION</span>

            <h2>
              From input
              <br />
              <span>to result.</span>
            </h2>

            <p>
              Every expression follows the same modular calculation service
              used by the rest of CALCUX, keeping the interface separate from
              the underlying C++ engine.
            </p>

            <Link to="/history" className="text-link">
              View calculation history <span>→</span>
            </Link>
          </div>
        </section>

        {/* VALIDATION */}
        <section className="expression-validation">
          <div className="expression-validation-heading">
            <span className="section-label">ENGINE BEHAVIOUR</span>

            <h2>
              Clear input.
              <br />
              <span>Clear output.</span>
            </h2>

            <p>
              CALCUX handles common expression errors before returning a
              result, keeping calculations predictable and understandable.
            </p>
          </div>

          <div className="expression-validation-grid">
            <article className="expression-validation-card">
              

              <div>
                <h3>Invalid Expression</h3>
                <p>
                  Incorrect or incomplete expressions are rejected instead of
                  producing an unreliable result.
                </p>
              </div>
            </article>

            <article className="expression-validation-card">
              

              <div>
                <h3>Division by Zero</h3>
                <p>
                  Division by zero is detected and handled safely by the
                  calculation engine.
                </p>
              </div>
            </article>

            <article className="expression-validation-card">
              

              <div>
                <h3>Modular Service</h3>
                <p>
                  Expression evaluation remains separated from the frontend
                  through the CALCUX service architecture.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* NEXT */}
        <section className="expression-next">
          <div>
            <span className="section-label">CONTINUE</span>

            <h2>
              Keep every
              <br />
              <span>calculation.</span>
            </h2>
          </div>

          <Link to="/history" className="secondary-button">
            Open History <span>→</span>
          </Link>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <span>CALCUX · C++ CALCULATION ENGINE</span>
        <span>BUILT FOR B.TECH CSE</span>
      </footer>
    </div>
  );
}

export default ExpressionCalculator;