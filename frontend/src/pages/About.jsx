import { Link } from "react-router-dom";

function About() {
  return (
    <div className="app about-page">
      {/* NAVBAR */}
      <header className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">C</span>
          CALCUX
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/calculator">Calculator</Link>
          <Link to="/advanced">Advanced</Link>
          <Link to="/expression">Expression</Link>
          <Link to="/history">History</Link>
          <Link to="/about" className="active">
            About
          </Link>
        </nav>

        <Link to="/calculator" className="nav-button">
          Open Calculator <span>↗</span>
        </Link>
      </header>

      <main className="about-page-content">
        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-copy">
            <div className="eyebrow">
              <span className="status-dot"></span>
              ABOUT CALCUX · C++ PROJECT
            </div>

            <h1>
              More than
              <br />
              <span>a calculator.</span>
            </h1>

            <p>
              CALCUX is a menu-driven calculator system built around a modular
              C++ calculation engine, designed to bring together basic
              arithmetic, advanced mathematics, expression evaluation and
              calculation history in one system.
            </p>
          </div>

          <div className="about-hero-meta">
            <span>CORE ENGINE</span>
            <strong>C++</strong>
            <small>
              Modular calculation service with frontend and backend
              integration.
            </small>
          </div>
        </section>

        {/* WHAT IS CALCUX */}
        <section className="about-introduction">
          <div className="about-introduction-copy">
            <span className="section-label">THE PROJECT</span>

            <h2>
              Built around
              <br />
              <span>the engine.</span>
            </h2>

            <p>
              CALCUX started as a menu-driven C++ calculator and evolved into
              a structured software system. The calculation logic is separated
              into reusable modules so that the same engine can power multiple
              interfaces.
            </p>

            <p>
              The system combines mathematical operations, expression
              processing, history management and an HTTP API into a single
              project architecture.
            </p>
          </div>

          <div className="about-introduction-card">
            <div className="about-card-top">
              <span>CALCUX ENGINE</span>
              <small>ACTIVE</small>
            </div>

            <div className="about-engine-mark">
              <strong>C++</strong>

              <span>
                CALCULATION
                <br />
                ENGINE
              </span>
            </div>

            <div className="about-card-bottom">
              <span>MODULAR ARCHITECTURE</span>
              <b>READY</b>
            </div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="about-capabilities">
          <div className="about-section-heading">
            <span className="section-label">CAPABILITIES</span>

            <h2>
              One system.
              <br />
              <span>Multiple layers.</span>
            </h2>

            <p>
              Each part of CALCUX has a defined responsibility, allowing the
              system to remain organized as new functionality is introduced.
            </p>
          </div>

          <div className="about-capability-grid">
            <article className="about-capability-card">
              <span>01</span>

              <div>
                <h3>Basic Arithmetic</h3>
                <p>
                  Addition, subtraction, multiplication, division and modulus
                  operations handled through the core calculator service.
                </p>
              </div>

              <b>01 — 05</b>
            </article>

            <article className="about-capability-card">
              <span>02</span>

              <div>
                <h3>Advanced Mathematics</h3>
                <p>
                  Power, square root, percentage, factorial, prime checking,
                  even/odd, GCD and LCM operations.
                </p>
              </div>

              <b>08 OPS</b>
            </article>

            <article className="about-capability-card">
              <span>03</span>

              <div>
                <h3>Expression Engine</h3>
                <p>
                  Complete mathematical expressions with operators,
                  parentheses and expression validation.
                </p>
              </div>

              <b>EXPR</b>
            </article>

            <article className="about-capability-card">
              <span>04</span>

              <div>
                <h3>History System</h3>
                <p>
                  Calculation records can be stored, viewed, searched,
                  cleared and analyzed through the history module.
                </p>
              </div>

              <b>HISTORY</b>
            </article>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="about-architecture">
          <div className="about-architecture-copy">
            <span className="section-label">SYSTEM ARCHITECTURE</span>

            <h2>
              Separate layers.
              <br />
              <span>One system.</span>
            </h2>

            <p>
              CALCUX separates calculation logic from the interface. The C++
              service layer handles operations and expressions, while the API
              layer exposes those capabilities to the frontend.
            </p>
          </div>

          <div className="about-architecture-flow">
            <div className="about-architecture-node">
              <span>01</span>

              <strong>Frontend</strong>

              <small>React + Vite</small>
            </div>

            <div className="about-architecture-line"></div>

            <div className="about-architecture-node about-architecture-highlight">
              <span>02</span>

              <strong>API Layer</strong>

              <small>C++ HTTP Server</small>
            </div>

            <div className="about-architecture-line"></div>

            <div className="about-architecture-node">
              <span>03</span>

              <strong>Core Engine</strong>

              <small>C++ Modules</small>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="about-technology">
          <div className="about-technology-heading">
            <span className="section-label">TECHNOLOGY</span>

            <h2>
              The stack
              <br />
              <span>behind CALCUX.</span>
            </h2>
          </div>

          <div className="about-technology-list">
            <div className="about-tech-row">
              <span>CORE LANGUAGE</span>
              <strong>C++</strong>
              <small>Calculation engine</small>
            </div>

            <div className="about-tech-row">
              <span>FRONTEND</span>
              <strong>React + Vite</strong>
              <small>Web interface</small>
            </div>

            <div className="about-tech-row">
              <span>API</span>
              <strong>C++ HTTP</strong>
              <small>Frontend communication</small>
            </div>

            <div className="about-tech-row">
              <span>HISTORY</span>
              <strong>File System</strong>
              <small>Calculation records</small>
            </div>
          </div>
        </section>

        {/* PROJECT PURPOSE */}
        <section className="about-purpose">
          <div className="about-purpose-card">
            <div className="about-purpose-top">
              <span>ACADEMIC PROJECT</span>
              <small>B.TECH CSE</small>
            </div>

            <div className="about-purpose-main">
              <strong>CALCUX</strong>

              <p>
                A practical implementation of programming fundamentals,
                modular software design, mathematical algorithms and
                frontend-backend integration.
              </p>
            </div>

            <div className="about-purpose-bottom">
              <span>MENU-DRIVEN CALCULATOR</span>
              <b>C++</b>
            </div>
          </div>

          <div className="about-purpose-copy">
            <span className="section-label">PURPOSE</span>

            <h2>
              Learn by
              <br />
              <span>building.</span>
            </h2>

            <p>
              The project demonstrates how a simple programming assignment can
              be expanded into a complete software application with reusable
              modules, persistent records, an API and a modern web interface.
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="about-final">
          <span className="section-label">CALCUX</span>

          <h2>
            Ready to
            <br />
            <span>calculate?</span>
          </h2>

          <p>
            Explore the calculator, run advanced operations or evaluate a
            complete mathematical expression.
          </p>

          <div className="about-final-actions">
            <Link to="/calculator" className="primary-button">
              Open Calculator <span>↗</span>
            </Link>

            <Link to="/expression" className="secondary-button">
              Expression Engine <span>→</span>
            </Link>
          </div>
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

export default About;