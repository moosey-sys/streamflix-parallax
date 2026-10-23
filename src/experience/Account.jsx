import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { Screen } from "./Shared";
import { apiRequest, liveCatalog } from "./service";
export default function Account() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const signup = pathname === "/sign-up";
  const signout = pathname === "/sign-out";
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    repeat: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setError("");
    setSuccess(false);
    setValues({ username: "", email: "", password: "", repeat: "" });
    if (signout) {
      sessionStorage.removeItem("userID");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("user");
      navigate("/settings", { replace: true });
    }
  }, [pathname, signout, navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (signup && values.password !== values.repeat) {
      setError("Your passwords do not match. Please try again.");
      return;
    }
    setBusy(true);
    try {
      const data = await apiRequest(signup ? "register" : "login", {
        method: "POST",
        body: JSON.stringify({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      });
      if (signup) {
        setSuccess(true);
        setValues({ ...values, password: "", repeat: "" });
      } else {
        if (!data.user_id)
          throw Error("Sign-in returned an incomplete response.");
        sessionStorage.setItem("userID", data.user_id);
        sessionStorage.setItem("email", values.email.trim());
        navigate("/");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const change = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  return (
    <Screen className="account-screen">
      <section className="account-layout section-wrap">
        <div className="account-story">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>
            Stories bring
            <br />
            us together.
          </h1>
          <p>
            A familiar favorite. A new obsession.
            <br />
            Make a little room for the extraordinary.
          </p>
          <div className="account-story-art" />
        </div>
        <div className="account-panel">
          <span className="eyebrow">WELCOME TO STREAMFLIX</span>
          <h2>{signup ? "Start your story." : "Good to see you again."}</h2>
          <p className="muted">
            {signup
              ? "Create an account with your connected library."
              : "Sign in to your connected library."}
          </p>
          {!liveCatalog && (
            <div className="inline-notice">
              You're using the local edition. Account services are not
              connected; browsing and your saved list work without signing in.
            </div>
          )}
          {success ? (
            <div className="account-success" role="status">
              <FiCheck />
              <h3>Your account is ready.</h3>
              <p>Sign in with the email and password you just created.</p>
              <Link className="button primary" to="/sign-in">
                Continue to sign in <FiArrowRight />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="account-form">
              {error && (
                <p className="inline-error" role="alert">
                  {error}
                </p>
              )}
              {signup && (
                <label className="field">
                  Name
                  <input
                    name="username"
                    autoComplete="nickname"
                    value={values.username}
                    onChange={change}
                    required
                    maxLength={80}
                    disabled={!liveCatalog}
                  />
                </label>
              )}
              <label className="field">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={change}
                  placeholder="you@example.com"
                  required
                  disabled={!liveCatalog}
                />
              </label>
              <label className="field">
                Password
                <div className="password-field">
                  <input
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete={signup ? "new-password" : "current-password"}
                    minLength={signup ? 8 : undefined}
                    value={values.password}
                    onChange={change}
                    required
                    disabled={!liveCatalog}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </label>
              {signup && (
                <label className="field">
                  Confirm password
                  <input
                    name="repeat"
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    value={values.repeat}
                    onChange={change}
                    required
                    disabled={!liveCatalog}
                  />
                </label>
              )}
              <button
                className="button primary"
                type="submit"
                disabled={busy || !liveCatalog}
              >
                {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
                <FiArrowRight />
              </button>
            </form>
          )}
          <p className="account-switch">
            {signup ? "Already have an account?" : "New here?"}{" "}
            <Link to={signup ? "/sign-in" : "/sign-up"}>
              {signup ? "Sign in" : "Create an account"}
            </Link>
          </p>
          <Link className="text-link" to="/">
            Continue exploring <FiArrowRight />
          </Link>
        </div>
      </section>
    </Screen>
  );
}
