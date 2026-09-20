import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { clearHistory, getHistory } from "../api";

function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const data = await getHistory();

      const historyData =
        Array.isArray(data)
          ? data
          : data?.history ??
            data?.records ??
            data?.calculations ??
            [];

      setRecords(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to connect to the CALCUX history service."
      );

      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    if (clearing) return;

    setClearing(true);
    setError("");

    try {
      await clearHistory();
      setRecords([]);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to clear calculation history."
      );
    } finally {
      setClearing(false);
    }
  }


  // ============================================================
  // BACKEND HISTORY NORMALIZATION
  // ============================================================
  //
  // Backend now returns records like:
  //
  // [ARITHMETIC] 12 + 2 = 14
  // [ADVANCED] 2 ^ 10 = 1024
  // [EXPRESSION] 8*2+5 = 21
  //
  // The category is now read directly from the backend instead
  // of being guessed from the calculation text.
  // ============================================================

  function normalizeRecord(record, index) {
    if (typeof record === "string") {
      const text = record.trim();

      const categoryMatch = text.match(
        /^\[(ARITHMETIC|ADVANCED|EXPRESSION)\]\s*/i
      );

      const category = categoryMatch
        ? categoryMatch[1].toUpperCase()
        : "EXPRESSION";

      const expression = categoryMatch
        ? text.replace(categoryMatch[0], "").trim()
        : text;

      // Extract the result from the stored calculation.
      // Examples:
      // 12 + 2 = 14
      // 2 ^ 10 = 1024
      // 8*2+5 = 21
      const equalsIndex = expression.lastIndexOf("=");

      let result = "";

      if (equalsIndex !== -1) {
        result = expression
          .substring(equalsIndex + 1)
          .trim();
      }

      return {
        expression,
        result,
        operation: category,
        index,
      };
    }

    const expression =
      record?.expression ??
      record?.calculation ??
      record?.input ??
      "Calculation";

    const result =
      record?.result ??
      record?.value ??
      record?.answer ??
      "";

    const category =
      record?.category ??
      record?.type ??
      record?.operationName ??
      "EXPRESSION";

    return {
      expression,
      result,
      operation: String(category).toUpperCase(),
      index,
    };
  }


  const normalizedRecords = useMemo(() => {
    return records.map((record, index) =>
      normalizeRecord(record, index)
    );
  }, [records]);


  // ============================================================
  // SEARCH
  // ============================================================

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return normalizedRecords;
    }

    return normalizedRecords.filter((record) =>
      `${record.expression} ${record.result} ${record.operation}`
        .toLowerCase()
        .includes(query)
    );
  }, [normalizedRecords, search]);


  // ============================================================
  // CATEGORY COUNTS
  // ============================================================

  const expressionCount = normalizedRecords.filter(
    (record) =>
      record.operation === "EXPRESSION"
  ).length;

  const advancedCount = normalizedRecords.filter(
    (record) =>
      record.operation === "ADVANCED"
  ).length;

  const arithmeticCount = normalizedRecords.filter(
    (record) =>
      record.operation === "ARITHMETIC"
  ).length;


  return (
    <div className="app history-page">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

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

          <Link
            to="/history"
            className="active"
          >
            History
          </Link>

          <Link to="/about">About</Link>
        </nav>

        <Link
          to="/calculator"
          className="nav-button"
        >
          Open Calculator <span>↗</span>
        </Link>
      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="history-page-content">

        {/* ===================================================
            HISTORY COMMAND CENTER
        ==================================================== */}

        <section className="history-command-center">

          {/* LEFT SIDE */}

          <div className="history-command-intro">

            <div className="eyebrow">
              <span className="status-dot"></span>
              CALCULATION HISTORY · CALCUX
            </div>

            <h1>
              Your results.
              <br />
              <span>In one place.</span>
            </h1>

            <p>
              Review, search and manage calculations recorded
              by the CALCUX C++ calculation engine.
            </p>


            {/* STATS */}

            <div className="history-stats">

              {/* TOTAL */}

              <div className="history-stat">
                <span>TOTAL</span>

                <strong>
                  {normalizedRecords.length
                    .toString()
                    .padStart(2, "0")}
                </strong>

                <small>
                  Recorded calculations
                </small>
              </div>


              {/* EXPRESSIONS */}

              <div className="history-stat">
                <span>EXPRESSIONS</span>

                <strong>
                  {expressionCount
                    .toString()
                    .padStart(2, "0")}
                </strong>

                <small>
                  Expression evaluations
                </small>
              </div>


              {/* ADVANCED */}

              <div className="history-stat">
                <span>ADVANCED</span>

                <strong>
                  {advancedCount
                    .toString()
                    .padStart(2, "0")}
                </strong>

                <small>
                  Advanced operations
                </small>
              </div>


              {/* ARITHMETIC */}

              <div className="history-stat">
                <span>ARITHMETIC</span>

                <strong>
                  {arithmeticCount
                    .toString()
                    .padStart(2, "0")}
                </strong>

                <small>
                  Basic calculations
                </small>
              </div>

            </div>
          </div>


          {/* =================================================
              RIGHT SIDE — RECORDS
          ================================================== */}

          <div className="history-command-records">

            <div className="history-records-header">

              <div>

                <span className="section-label">
                  RECENT CALCULATIONS
                </span>

                <h2>
                  Calculation <span>records.</span>
                </h2>

              </div>


              <button
                type="button"
                className="history-clear-button"
                onClick={handleClearHistory}
                disabled={
                  clearing ||
                  loading ||
                  records.length === 0
                }
              >
                {clearing
                  ? "Clearing..."
                  : "Clear History"}

                <span>×</span>
              </button>

            </div>


            {/* SEARCH */}

            <div className="history-search">

              <input
                id="history-search-input"
                type="text"
                value={search}
                placeholder="Search calculations..."
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>


            {/* ERROR */}

            {error && (
              <div className="history-error">

                {error}

                <button
                  type="button"
                  onClick={loadHistory}
                >
                  Retry
                </button>

              </div>
            )}


            {/* HISTORY TABLE */}

            <div className="history-table">

              {loading ? (

                <div className="history-empty">

                  <strong>
                    Loading history...
                  </strong>

                  <span>
                    Connecting to the CALCUX C++ history service.
                  </span>

                </div>

              ) : filteredRecords.length === 0 ? (

                <div className="history-empty">

                  <strong>
                    {search
                      ? "No matching records."
                      : "No calculations recorded."}
                  </strong>

                  <span>
                    {search
                      ? "Try a different search term."
                      : "Complete a calculation and it will appear here."}
                  </span>

                </div>

              ) : (

                filteredRecords.map(
                  (record, index) => (

                    <div
                      className="history-record"
                      key={`${record.expression}-${index}`}
                    >

                      <div className="history-record-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>


                      <div className="history-record-main">

                        <strong>
                          {record.expression}
                        </strong>

                        <small>
                          {record.operation}
                        </small>

                      </div>


                      <div className="history-record-time">

                        <span>
                          RESULT
                        </span>

                        <small>
                          RECORDED
                        </small>

                      </div>


                      <div className="history-record-result">

                        {record.result !== ""
                          ? String(record.result)
                          : "—"}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>


        {/* ===================================================
            HISTORY INFORMATION
        ==================================================== */}

        <section className="history-information">

          <div className="history-information-copy">

            <span className="section-label">
              LOCAL RECORDS
            </span>

            <h2>
              Simple.
              <br />
              <span>Persistent.</span>
            </h2>

            <p>
              CALCUX keeps calculation records in its
              history system so previous operations can be
              reviewed without repeating the calculation.
            </p>

            <Link
              to="/calculator"
              className="text-link"
            >
              Start a new calculation
              <span>→</span>
            </Link>

          </div>


          <div className="history-information-card">

            <div className="history-information-top">

              <span>
                HISTORY SERVICE
              </span>

              <small>
                ACTIVE
              </small>

            </div>


            <div className="history-information-center">

              <strong>
                history.txt
              </strong>

              <span>
                Calculation records
                <br />
                stored by CALCUX
              </span>

            </div>


            <div className="history-information-bottom">

              <span>
                LOCAL STORAGE
              </span>

              <b>
                READY
              </b>

            </div>

          </div>

        </section>


        {/* ===================================================
            HISTORY CONTROLS
        ==================================================== */}

        <section className="history-safety">

          <div className="history-safety-heading">

            <span className="section-label">
              HISTORY CONTROLS
            </span>

            <h2>
              Keep control
              <br />
              <span>of your records.</span>
            </h2>

            <p>
              History is designed to remain simple:
              view previous calculations, review results
              and clear stored records when required.
            </p>

          </div>


          <div className="history-safety-grid">

            <article className="history-safety-card">

              <span>01</span>

              <div>

                <h3>
                  View Records
                </h3>

                <p>
                  Review previous calculations and
                  their corresponding results.
                </p>

              </div>

            </article>


            <article className="history-safety-card">

              <span>02</span>

              <div>

                <h3>
                  Search Records
                </h3>

                <p>
                  Locate calculations quickly when
                  the history grows over time.
                </p>

              </div>

            </article>


            <article className="history-safety-card">

              <span>03</span>

              <div>

                <h3>
                  Clear History
                </h3>

                <p>
                  Remove stored calculation records
                  whenever a clean history is required.
                </p>

              </div>

            </article>

          </div>

        </section>


        {/* ===================================================
            NEXT
        ==================================================== */}

        <section className="history-next">

          <div>

            <span className="section-label">
              CONTINUE
            </span>

            <h2>
              Return to
              <br />
              <span>calculations.</span>
            </h2>

          </div>

          <Link
            to="/calculator"
            className="secondary-button"
          >
            Open Calculator
            <span>→</span>
          </Link>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer>

        <span>
          CALCUX · C++ CALCULATION ENGINE
        </span>

      </footer>

    </div>
  );
}

export default History;