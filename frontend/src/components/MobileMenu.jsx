import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    to: "/",
    label: "Home",
    number: "01",
    end: true,
  },
  {
    to: "/calculator",
    label: "Calculator",
    number: "02",
  },
  {
    to: "/advanced",
    label: "Advanced",
    number: "03",
  },
  {
    to: "/expression",
    label: "Expression",
    number: "04",
  },
  {
    to: "/history",
    label: "History",
    number: "05",
  },
  {
    to: "/about",
    label: "About",
    number: "06",
  },
];

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="mobile-header">
        <NavLink to="/" className="mobile-logo" onClick={closeMenu}>
          <span className="logo-mark">C</span>
          <span>CALCUX</span>
        </NavLink>

        <button
          type="button"
          className={`mobile-menu-toggle ${
            isOpen ? "open" : ""
          }`}
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu-overlay ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="mobile-menu-inner">

          <div className="mobile-menu-heading">
            <span>CALCUX NAVIGATION</span>
            <span>06 PAGES</span>
          </div>

          <nav className="mobile-menu-links">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `mobile-menu-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <span className="mobile-menu-number">
                  {item.number}
                </span>

                <span className="mobile-menu-label">
                  {item.label}
                </span>

                <span className="mobile-menu-arrow">
                  ↗
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            <span>CALCUX · C++ CALCULATION ENGINE</span>

            <NavLink
              to="/calculator"
              className="mobile-menu-action"
              onClick={closeMenu}
            >
              Open Calculator
              <span>↗</span>
            </NavLink>
          </div>

        </div>
      </div>
    </>
  );
}

export default MobileMenu;