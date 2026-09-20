import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calculate, checkHealth } from "../api";

function Home() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [healthLoading, setHealthLoading] = useState(true);

  // ------------------------------------------------------------
  // HERO MINI CALCULATOR
  // ------------------------------------------------------------

  const [heroDisplay, setHeroDisplay] = useState("0");
  const [heroFirstNumber, setHeroFirstNumber] = useState("");
  const [heroOperator, setHeroOperator] = useState("");
  const [heroWaitingForSecond, setHeroWaitingForSecond] = useState(false);
  const [heroCalculating, setHeroCalculating] = useState(false);
  const [heroError, setHeroError] = useState("");

  function handleHeroNumber(value) {
    setHeroError("");

    if (heroWaitingForSecond) {
      setHeroDisplay(value);
      setHeroWaitingForSecond(false);
      return;
    }

    setHeroDisplay((current) =>
      current === "0" ? value : current + value
    );
  }

  function handleHeroDecimal() {
    setHeroError("");

    if (heroWaitingForSecond) {
      setHeroDisplay("0.");
      setHeroWaitingForSecond(false);
      return;
    }

    if (!heroDisplay.includes(".")) {
      setHeroDisplay((current) => current + ".");
    }
  }

  function handleHeroOperator(operator) {
    setHeroError("");

    if (heroOperator && !heroWaitingForSecond) {
      handleHeroEquals();
    }

    setHeroFirstNumber(heroDisplay);
    setHeroOperator(operator);
    setHeroWaitingForSecond(true);
  }

  async function handleHeroEquals() {
    if (
      !heroOperator ||
      heroFirstNumber === "" ||
      heroDisplay === ""
    ) {
      return;
    }

    setHeroCalculating(true);
    setHeroError("");

    const operationMap = {
      "+": "add",
      "−": "subtract",
      "×": "multiply",
      "÷": "divide",
    };

    try {
      const data = await calculate(
        operationMap[heroOperator],
        Number(heroFirstNumber),
        Number(heroDisplay)
      );

      if (data?.success === false) {
        throw new Error(
          data?.error ||
            data?.message ||
            "The CALCUX calculation service rejected the calculation."
        );
      }

      const calculatedResult =
        data?.result ??
        data?.value ??
        data?.answer;

      if (
        calculatedResult === undefined ||
        calculatedResult === null
      ) {
        throw new Error(
          data?.error ||
            data?.message ||
            "The server returned no calculation result."
        );
      }

      setHeroDisplay(String(calculatedResult));
      setHeroFirstNumber("");
      setHeroOperator("");
      setHeroWaitingForSecond(false);
    } catch (err) {
      setHeroError(
        err?.message ||
          "Unable to calculate with the CALCUX backend."
      );
    } finally {
      setHeroCalculating(false);
    }
  }

  function handleHeroClear() {
    setHeroDisplay("0");
    setHeroFirstNumber("");
    setHeroOperator("");
    setHeroWaitingForSecond(false);
    setHeroCalculating(false);
    setHeroError("");
  }

  useEffect(() => {
    let mounted = true;

    async function checkBackend() {
      try {
        await checkHealth();

        if (mounted) {
          setBackendOnline(true);
        }
      } catch {
        if (mounted) {
          setBackendOnline(false);
        }
      } finally {
        if (mounted) {
          setHealthLoading(false);
        }
      }
    }

    checkBackend();

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="app calcux-home">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          CALCUX
        </Link>

        <nav className="nav-links">
          <Link to="/" className="active">
            Home
          </Link>

          <Link to="/calculator">
            Calculator
          </Link>

          <Link to="/advanced">
            Advanced
          </Link>

          <Link to="/expression">
            Expression
          </Link>

          <Link to="/history">
            History
          </Link>

          <Link to="/about">
            About
          </Link>
        </nav>

        <Link to="/calculator" className="nav-button">
          Open Calculator
          <span>↗</span>
        </Link>
      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="home-page">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="home-hero">

          <div className="home-hero-content">

            <div className="eyebrow">
              <span
                className="status-dot"
                title={
                  healthLoading
                    ? "Checking CALCUX backend"
                    : backendOnline
                    ? "CALCUX backend online"
                    : "CALCUX backend offline"
                }
              ></span>
              {healthLoading
                ? "CONNECTING · CALCUX"
                : backendOnline
                ? "SYSTEM ONLINE · CALCUX"
                : "BACKEND OFFLINE · CALCUX"}
            </div>

            <h1>
              Your calculations,
              <br />
              <span>simplified.</span>
            </h1>

            <p>
              A modular calculator system built with C++,
              designed for accurate everyday calculations,
              advanced operations, and mathematical expressions.
            </p>

            <div className="home-actions">

              <Link
                to="/calculator"
                className="primary-button"
              >
                Start Calculating
                <span>→</span>
              </Link>

              <Link
                to="/about"
                className="secondary-button"
              >
                Explore CALCUX
              </Link>

            </div>

          </div>


          {/* =================================================
              CALCULATOR VISUAL
          ================================================= */}

          <div className="home-calculator-visual">

            <div className="calculator-window">

              <div className="calculator-top">

                <span>CALCUX</span>

                <div className="window-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

              </div>


              <div className="calculator-display">

                <span>
                  {heroFirstNumber && heroOperator
                    ? `${heroFirstNumber} ${heroOperator}`
                    : heroOperator
                    ? heroOperator
                    : "CALCUX"}
                </span>

                <strong>
                  {heroCalculating ? "..." : heroDisplay}
                </strong>

              </div>

              {heroError && (
                <div
                  style={{
                    minHeight: "16px",
                    margin: "8px 2px 0",
                    color: "#b8b0ff",
                    fontSize: "9px",
                    lineHeight: 1.4,
                    textAlign: "right",
                  }}
                >
                  {heroError}
                </div>
              )}


              <div className="calculator-grid">

                <button
                  type="button"
                  onClick={handleHeroClear}
                  disabled={heroCalculating}
                >
                  C
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroNumber("7")}
                  disabled={heroCalculating}
                >
                  7
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroNumber("8")}
                  disabled={heroCalculating}
                >
                  8
                </button>

                <button
                  type="button"
                  className="operator"
                  onClick={() => handleHeroOperator("÷")}
                  disabled={heroCalculating}
                >
                  ÷
                </button>


                <button
                  type="button"
                  onClick={() => handleHeroNumber("4")}
                  disabled={heroCalculating}
                >
                  4
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroNumber("5")}
                  disabled={heroCalculating}
                >
                  5
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroNumber("6")}
                  disabled={heroCalculating}
                >
                  6
                </button>

                <button
                  type="button"
                  className="operator"
                  onClick={() => handleHeroOperator("×")}
                  disabled={heroCalculating}
                >
                  ×
                </button>


                <button
                  type="button"
                  onClick={() => handleHeroNumber("1")}
                  disabled={heroCalculating}
                >
                  1
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroNumber("2")}
                  disabled={heroCalculating}
                >
                  2
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroNumber("3")}
                  disabled={heroCalculating}
                >
                  3
                </button>

                <button
                  type="button"
                  className="operator"
                  onClick={() => handleHeroOperator("−")}
                  disabled={heroCalculating}
                >
                  −
                </button>


                <button
                  type="button"
                  onClick={() => handleHeroNumber("0")}
                  disabled={heroCalculating}
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handleHeroDecimal}
                  disabled={heroCalculating}
                >
                  .
                </button>

                <button
                  type="button"
                  className="equals"
                  onClick={handleHeroEquals}
                  disabled={heroCalculating}
                >
                  =
                </button>

                <button
                  type="button"
                  className="operator"
                  onClick={() => handleHeroOperator("+")}
                  disabled={heroCalculating}
                >
                  +
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            CORE CAPABILITIES
        =================================================== */}

        <section className="home-features">

          <div className="section-heading">

            <span className="section-label">
              CORE CAPABILITIES
            </span>

            <h2>
              Built around
              <br />
              <span>precision.</span>
            </h2>

          </div>


          <div className="feature-grid">

            <Link
              to="/calculator"
              className="feature-card"
            >
              <span className="feature-number">
                01
              </span>

              <div>
                <h3>
                  Basic Operations
                </h3>

                <p>
                  Addition, subtraction,
                  multiplication, division
                  and modulus with validation.
                </p>
              </div>

              <span className="feature-arrow">
                ↗
              </span>
            </Link>


            <Link
              to="/advanced"
              className="feature-card"
            >
              <span className="feature-number">
                02
              </span>

              <div>
                <h3>
                  Advanced Operations
                </h3>

                <p>
                  Power, square root, percentage,
                  factorial, GCD, LCM and more.
                </p>
              </div>

              <span className="feature-arrow">
                ↗
              </span>
            </Link>


            <Link
              to="/expression"
              className="feature-card"
            >
              <span className="feature-number">
                03
              </span>

              <div>
                <h3>
                  Expression Engine
                </h3>

                <p>
                  Evaluate mathematical expressions
                  using operators and parentheses.
                </p>
              </div>

              <span className="feature-arrow">
                ↗
              </span>
            </Link>

          </div>

        </section>


        {/* ===================================================
            SYSTEM ARCHITECTURE
        =================================================== */}

        <section className="home-system">

          <div className="system-copy">

            <span className="section-label">
              SYSTEM ARCHITECTURE
            </span>

            <h2>
              Simple on the surface.
              <br />
              <span>Modular underneath.</span>
            </h2>

            <p>
              CALCUX separates the interface,
              calculator service, calculation core,
              expression engine, history system and
              HTTP backend into focused modules.
            </p>

            <Link
              to="/about"
              className="text-link"
            >
              View architecture
              <span>→</span>
            </Link>

          </div>


          <div className="system-flow">

            <div className="system-node">

              <span>01</span>

              <strong>
                Interface
              </strong>

              <small>
                React
              </small>

            </div>


            <div className="system-line"></div>


            <div className="system-node highlighted">

              <span>02</span>

              <strong>
                Service
              </strong>

              <small>
                C++
              </small>

            </div>


            <div className="system-line"></div>


            <div className="system-node">

              <span>03</span>

              <strong>
                Core
              </strong>

              <small>
                Calculation
              </small>

            </div>

          </div>

        </section>


        {/* ===================================================
            HISTORY PREVIEW
        =================================================== */}

        <section className="home-history">

          <div className="history-heading">

            <div>

              <span className="section-label">
                CALCULATION HISTORY
              </span>

              <h2>
                Every calculation,
                <br />
                <span>kept clear.</span>
              </h2>

            </div>


            <Link
              to="/history"
              className="text-link"
            >
              View history
              <span>→</span>
            </Link>

          </div>


          <div className="history-preview">

            <div className="history-row">

              <span>01</span>

              <strong>
                25 + 15
              </strong>

              <small>
                ADDITION
              </small>

              <b>
                40
              </b>

            </div>


            <div className="history-row">

              <span>02</span>

              <strong>
                100 / 4
              </strong>

              <small>
                DIVISION
              </small>

              <b>
                25
              </b>

            </div>


            <div className="history-row">

              <span>03</span>

              <strong>
                2 ^ 10
              </strong>

              <small>
                POWER
              </small>

              <b>
                1024
              </b>

            </div>

          </div>

        </section>


        {/* ===================================================
            FINAL CTA
        =================================================== */}

        <section className="home-final">

          <span className="section-label">
            READY WHEN YOU ARE
          </span>

          <h2>
            Calculate with
            <br />
            <span>clarity.</span>
          </h2>

          <p>
            Explore the calculator and experience
            the complete CALCUX system.
          </p>

          <Link
            to="/calculator"
            className="final-button"
          >
            Open CALCUX
            <span>↗</span>
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

export default Home;