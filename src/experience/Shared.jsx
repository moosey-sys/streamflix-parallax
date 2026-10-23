import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { Header, Footer, useMotion } from "./Experience";
import "./screens.css";
export function Screen({ children, className = "" }) {
  const { pathname } = useLocation();
  let disabled = false;
  try {
    disabled = localStorage.getItem("streamflix-motion") === "off";
  } catch {}
  useMotion(disabled, pathname);
  return (
    <div
      className={`sf-app screen-app ${disabled ? "motion-off" : ""} ${className}`}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <div className="screen-aura" aria-hidden="true" />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
export function ErrorState({ message, onRetry, back = "/dashboard" }) {
  return (
    <div className="state-panel" role="alert">
      <span className="eyebrow">LET'S TRY THAT AGAIN</span>
      <h2>We couldn't load this.</h2>
      <p>{message}</p>
      <div className="button-row">
        {onRetry && (
          <button className="button primary" onClick={onRetry}>
            <FiRefreshCw /> Try again
          </button>
        )}
        <Link className="button secondary" to={back}>
          <FiArrowLeft /> Go back
        </Link>
      </div>
    </div>
  );
}
export function Loading() {
  return (
    <div className="state-panel" role="status">
      <div className="loading-line" />
      <p>Getting things ready…</p>
    </div>
  );
}
