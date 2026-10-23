import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiCheck,
  FiPlay,
  FiArrowRight,
  FiArrowLeft,
  FiX,
  FiMenu,
  FiBookmark,
  FiFilm,
  FiSliders,
  FiSun,
  FiChevronRight,
} from "react-icons/fi";
import { filterCatalog, normalizeMovie, readSaved } from "./catalog.mjs";
import "./experience.css";
import { localCatalog, videoSource } from "./service";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => setOpen(false), [location.pathname]);
  return (
    <header className="sf-header">
      <Link className="sf-logo" to="/" aria-label="Streamflix home">
        <span className="logo-symbol">S</span>streamflix
        <span className="logo-dot">.</span>
      </Link>
      <nav
        aria-label="Main navigation"
        className={open ? "sf-nav is-open" : "sf-nav"}
      >
        <NavLink to="/" end>
          Discover
        </NavLink>
        <NavLink to="/movie">Movies</NavLink>
        <NavLink to="/tvshows">TV shows</NavLink>
        <NavLink to="/favoriteList">
          <FiBookmark /> My list
        </NavLink>
      </nav>
      <div className="header-tools">
        <button
          className="icon-button"
          aria-label="Search titles"
          onClick={() => navigate("/search")}
        >
          <FiSearch />
        </button>
        <Link
          className="profile"
          aria-label="Local profile and preferences"
          to="/settings"
        >
          W
        </Link>
        <button
          className="icon-button mobile-menu"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="sf-footer">
      <Link className="sf-logo" to="/">
        streamflix<span className="logo-dot">.</span>
      </Link>
      <span>A world worth watching.</span>
      <div>
        <Link to="/aboutus">About</Link>
        <Link to="/contact">Help & feedback</Link>
        <Link to="/settings">Preferences</Link>
      </div>
      <small>Local preview · Trailers & discovery</small>
    </footer>
  );
}
export function useMotion(disabled, key) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    const update = () => {
      document.documentElement.style.setProperty(
        "--scroll",
        `${disabled || media.matches ? 0 : Math.min(window.scrollY, 1000) * 0.24}px`,
      );
      frame = null;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", scroll);
      media.removeEventListener("change", update);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [disabled, key]);
}
function Card({ movie, onOpen, saved, onSave, index }) {
  return (
    <article className="movie-card" style={{ "--delay": `${index * 35}ms` }}>
      <button
        className="poster-button"
        onClick={() => onOpen(movie)}
        aria-label={`View ${movie.title}`}
      >
        <img
          src={movie.image || "/art/dune-hero.jpg"}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/art/dune-hero.jpg";
          }}
        />
        <span className="poster-shade" />
        <span className="card-rating">★ {movie.rating}</span>
        <span className="card-play">
          <FiPlay />
        </span>
        <span className="card-kind">
          {movie.type === "tv" ? "SERIES" : "FILM"}
        </span>
      </button>
      <button
        className={"save-small " + (saved ? "saved" : "")}
        onClick={() => onSave(movie.id)}
        aria-label={`${saved ? "Remove" : "Save"} ${movie.title}`}
        aria-pressed={saved}
      >
        {saved ? <FiCheck /> : <FiPlus />}
      </button>
      <button className="card-title" onClick={() => onOpen(movie)}>
        {movie.title}
      </button>
      <p>
        {movie.year}
        <span>•</span>
        {movie.genre}
      </p>
    </article>
  );
}
function Detail({ movie, onClose, saved, onSave }) {
  const ref = useRef(null);
  const returnFocus = useRef(document.activeElement);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = "";
      returnFocus.current?.focus();
    };
  }, []);
  const source = videoSource(movie.video);
  const youtube = source?.type === "youtube";
  const direct = source?.type === "video";
  return (
    <dialog
      className="detail-dialog"
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="detail-title"
    >
      <div className="detail-inner">
        <button
          autoFocus
          className="icon-button close-dialog"
          aria-label="Close details"
          onClick={onClose}
        >
          <FiX />
        </button>
        <div className="detail-art">
          {playing && youtube ? (
            <iframe
              title={`${movie.title} trailer`}
              src={`https://www.youtube-nocookie.com/embed/${source.value}?autoplay=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : playing && direct ? (
            <video
              controls
              autoPlay
              src={source?.value}
              onError={() => setFailed(true)}
            />
          ) : (
            <img src={movie.backdrop || movie.image} alt="" />
          )}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {movie.type === "tv" ? "THE SERIES" : "THE FEATURE"}
          </span>
          <h2 id="detail-title">{movie.title}</h2>
          <div className="metadata">
            <span className="rating">★ {movie.rating}</span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            <span>{movie.genre}</span>
          </div>
          <p>{movie.description}</p>
          <p className="cast">
            Starring {movie.cast || "Cast information unavailable"}
          </p>
          <p className="small-note">
            <Link
              to={`${movie.collection === "trending" ? "/trendingDetails" : movie.type === "tv" ? "/tvshowDetails" : "/details"}/${movie.id}`}
            >
              Open title page ↗
            </Link>
          </p>
          <div className="button-row">
            <button
              className="button primary"
              disabled={!youtube && !direct}
              onClick={() => setPlaying(true)}
            >
              <FiPlay />
              {youtube
                ? "Watch trailer"
                : direct
                  ? "Play video"
                  : "Video unavailable"}
            </button>
            <button
              className="button secondary"
              onClick={() => onSave(movie.id)}
            >
              {saved ? <FiCheck /> : <FiPlus />}
              {saved ? "In my list" : "My list"}
            </button>
          </div>
          {playing && youtube && (
            <p className="small-note">
              Trailer not loading?{" "}
              <a
                href={`https://www.youtube.com/watch?v=${source?.value}`}
                target="_blank"
                rel="noreferrer"
              >
                Open on YouTube ↗
              </a>
            </p>
          )}
          {failed && (
            <p role="alert">
              This video could not be loaded. Please check its source.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
export default function Experience() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [catalog, setCatalog] = useState(localCatalog);
  const [status, setStatus] = useState(
    import.meta.env.VITE_CATALOG_SOURCE === "api" ? "loading" : "demo",
  );
  const [attempt, setAttempt] = useState(0);
  const [saved, setSaved] = useState(() => readSaved());
  const [motion, setMotion] = useState(() => {
    try {
      return localStorage.getItem("streamflix-motion") !== "off";
    } catch {
      return true;
    }
  });
  const [selected, setSelected] = useState(null);
  const [feature, setFeature] = useState(0);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("curated");
  const [toast, setToast] = useState("");
  useEffect(() => {
    if (import.meta.env.VITE_CATALOG_SOURCE !== "api") return;
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 10000);
    setStatus("loading");
    Promise.all(
      ["getMovies", "getTvshows", "getTrending"].map(async (endpoint, i) => {
        const r = await fetch(`/api/${endpoint}`, {
          signal: controller.signal,
        });
        if (!r.ok) throw Error("Catalog unavailable");
        const data = await r.json();
        if (!Array.isArray(data)) throw Error("Invalid catalog");
        return data.map((m) => ({
          ...normalizeMovie(m, i === 1 ? "tv" : "movie"),
          collection: i === 1 ? "tv" : i === 2 ? "trending" : "movie",
        }));
      }),
    )
      .then((groups) => {
        setCatalog([...new Map(groups.flat().map((m) => [m.id, m])).values()]);
        setStatus("live");
      })
      .catch(() => {
        if (!controller.signal.aborted || timedOut) setStatus("error");
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuery("");
    setGenre("All");
    setSelected(null);
  }, [path]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(id);
  }, [toast]);
  useMotion(!motion, `${path}-${status}`);
  const save = (id) => {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("streamflix-list", JSON.stringify(next));
      setToast(
        next.includes(id) ? "Added to your list" : "Removed from your list",
      );
    } catch {
      setToast("Saved for this visit. Browser storage is unavailable.");
    }
  };
  const toggleMotion = () => {
    setMotion(!motion);
    try {
      localStorage.setItem("streamflix-motion", motion ? "off" : "on");
    } catch {}
  };
  const featured = [
    catalog.find((m) => m.id === "dune") || catalog[0],
    catalog.find((m) => m.id === "onepiece") || catalog[1],
    catalog.find((m) => m.id === "interstellar") || catalog[2],
  ].filter(Boolean);
  const hero = featured[feature % featured.length];
  const isHome = path === "/";
  const isLibrary = [
    "/movie",
    "/tvshows",
    "/favoriteList",
    "/trendings",
    "/search",
  ].includes(path);
  const genres = ["All", ...new Set(catalog.map((m) => m.genre))];
  let results = filterCatalog(catalog, {
    query,
    genre,
    type: path === "/tvshows" ? "tv" : path === "/movie" ? "movie" : "all",
    saved: path === "/favoriteList" ? saved : null,
  });
  if (sort === "rating")
    results = [...results].sort((a, b) => Number(b.rating) - Number(a.rating));
  if (sort === "year")
    results = [...results].sort((a, b) => Number(b.year) - Number(a.year));
  const cards = (items) =>
    items.map((m, i) => (
      <Card
        key={m.id}
        movie={m}
        index={i}
        onOpen={setSelected}
        saved={saved.includes(m.id)}
        onSave={save}
      />
    ));
  return (
    <div className={`sf-app ${motion ? "" : "motion-off"}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        {isHome && hero && (
          <section className="hero" key={hero.id}>
            <div
              className="hero-background"
              style={{
                backgroundImage: `url('${hero.backdrop || hero.image}')`,
              }}
            />
            <div className="hero-vignette" />
            <div className="hero-content">
              <div className="eyebrow">
                <span className="live-dot" /> THE SPOTLIGHT{" "}
                <span className="eyebrow-divider">/</span> CURATED FOR YOU
              </div>
              <h1>
                {hero.id === "dune" ? (
                  <>
                    DUNE<span>PART TWO</span>
                  </>
                ) : (
                  hero.title
                )}
              </h1>
              <div className="metadata">
                <span className="rating">★ {hero.rating}</span>
                <span>{hero.year}</span>
                <span className="age-label">{hero.genre}</span>
                <span>{hero.duration}</span>
              </div>
              <p>{hero.description}</p>
              <div className="button-row">
                <button
                  className="button primary"
                  onClick={() => setSelected(hero)}
                >
                  <FiPlay /> Explore title
                </button>
                <button
                  className="button secondary"
                  onClick={() => save(hero.id)}
                >
                  {saved.includes(hero.id) ? <FiCheck /> : <FiPlus />} My list
                </button>
              </div>
            </div>
            <div className="hero-bottom">
              <span>
                <span className="tiny-line" /> STORIES THAT STAY WITH YOU
              </span>
              <div className="slide-controls">
                <span>
                  0{(feature % featured.length) + 1}
                  <small> / 0{featured.length}</small>
                </span>
                {featured.map((m, i) => (
                  <button
                    key={m.id}
                    className={feature === i ? "slide-dot active" : "slide-dot"}
                    aria-label={`Feature ${m.title}`}
                    aria-pressed={feature === i}
                    onClick={() => setFeature(i)}
                  />
                ))}
                <button
                  className="icon-button"
                  aria-label="Next featured title"
                  onClick={() => setFeature((feature + 1) % featured.length)}
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </section>
        )}
        {(status === "loading" || status === "error") && (
          <div className="catalog-status" role="status">
            {status === "loading"
              ? "Connecting to your catalog…"
              : "Your catalog is unavailable. Showing the demo collection."}
            {status === "error" && (
              <button onClick={() => setAttempt(attempt + 1)}>
                Retry connection
              </button>
            )}
          </div>
        )}
        {isHome && (
          <>
            <section className="shelf section-wrap reveal">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    THE GOOD STUFF, ALL IN ONE PLACE
                  </span>
                  <h2>
                    Your next obsession<span className="accent">.</span>
                  </h2>
                </div>
                <Link className="text-link" to="/movie">
                  Explore movies <FiArrowRight />
                </Link>
              </div>
              <div className="genre-bar" aria-label="Filter by genre">
                {[
                  "All",
                  "Sci-Fi",
                  "Drama",
                  "Thriller",
                  "Animation",
                  "Adventure",
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={genre === g ? "selected" : ""}
                    aria-pressed={genre === g}
                  >
                    {g === "All" ? "For you" : g}
                  </button>
                ))}
                <span className="collection-label">
                  <span className="live-dot" /> THE CURATED COLLECTION
                </span>
              </div>
              <div className="poster-grid">{cards(results.slice(0, 6))}</div>
              {!results.length && (
                <p className="empty-state">No titles in this genre yet.</p>
              )}
            </section>
            <section className="editorial section-wrap reveal">
              <div className="editorial-image" />
              <div className="editorial-copy">
                <span className="eyebrow">LEAVE THE ORDINARY BEHIND</span>
                <h2>
                  One more episode.
                  <br />A whole new world.
                </h2>
                <p>
                  Big adventures. Unforgettable characters. Find the series
                  you'll be thinking about long after the credits roll.
                </p>
                <Link className="button primary" to="/tvshows">
                  Discover series <FiArrowRight />
                </Link>
              </div>
              <span className="editorial-watermark">EXPLORE</span>
            </section>
            <section className="shelf section-wrap reveal">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">SETTLE IN. STAY A WHILE.</span>
                  <h2>Made for a marathon</h2>
                </div>
                <Link className="text-link" to="/tvshows">
                  All series <FiArrowRight />
                </Link>
              </div>
              <div className="poster-grid series-grid">
                {cards(catalog.filter((m) => m.type === "tv"))}
              </div>
            </section>
            <section className="closing section-wrap reveal">
              <FiFilm />
              <h2>
                Less searching.
                <br />
                <span>More great stories.</span>
              </h2>
              <p>
                Make your own collection. Your next movie night starts here.
              </p>
              <Link className="text-link" to="/favoriteList">
                Build your list <FiArrowRight />
              </Link>
            </section>
          </>
        )}
        {isLibrary && (
          <section className="section-wrap library">
            <div className="eyebrow">YOUR FRONT ROW SEAT</div>
            <h1>
              {path === "/movie"
                ? "Every film, a new feeling."
                : path === "/tvshows"
                  ? "Get lost in a great series."
                  : path === "/favoriteList"
                    ? "Your list. Your kind of story."
                    : path === "/search"
                      ? "Find your next great story."
                      : "Worth talking about."}
            </h1>
            <p className="muted">
              {path === "/favoriteList"
                ? "Your saved titles, ready when you are. Stored on this browser."
                : "Explore the collection and discover something extraordinary."}
            </p>
            <div className="library-tools">
              <label className="search-field">
                <FiSearch />
                <input
                  autoFocus={path === "/search"}
                  type="search"
                  aria-label="Search catalog"
                  placeholder="Search titles, genres, or cast"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label className="sort-field">
                <FiSliders />
                <select
                  aria-label="Sort titles"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="curated">Curated for you</option>
                  <option value="rating">Top rated</option>
                  <option value="year">Newest first</option>
                </select>
              </label>
            </div>
            <div className="genre-bar">
              {genres.map((g) => (
                <button
                  key={g}
                  className={genre === g ? "selected" : ""}
                  aria-pressed={genre === g}
                  onClick={() => setGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="results-count" aria-live="polite">
              {results.length} {results.length === 1 ? "title" : "titles"}
            </p>
            <div className="poster-grid">{cards(results)}</div>
            {!results.length && (
              <div className="empty-state">
                <FiBookmark />
                <h2>
                  {path === "/favoriteList" && !saved.length
                    ? "Good stories belong here."
                    : "No matching titles."}
                </h2>
                <p>
                  {path === "/favoriteList" && !saved.length
                    ? "Tap + on any title to save it for later."
                    : "Try another genre or a different search."}
                </p>
                <button
                  className="button primary"
                  onClick={() => {
                    if (path === "/favoriteList" && !saved.length)
                      navigate("/movie");
                    else {
                      setQuery("");
                      setGenre("All");
                    }
                  }}
                >
                  Explore titles <FiArrowRight />
                </button>
              </div>
            )}
          </section>
        )}
        {!isHome && !isLibrary && (
          <section className="section-wrap information">
            <span className="eyebrow">THE STREAMFLIX EXPERIENCE</span>
            {path === "/settings" ? (
              <>
                <h1>Make yourself at home.</h1>
                <p className="muted">
                  A few little things to make movie night yours.
                </p>
                <div className="settings-row">
                  <div>
                    <h2>
                      <FiSun /> Cinematic motion
                    </h2>
                    <p>
                      Layered parallax and soft transitions. Your system's
                      reduced-motion preference always takes priority.
                    </p>
                  </div>
                  <button
                    className={"toggle " + (motion ? "on" : "")}
                    role="switch"
                    aria-checked={motion}
                    aria-label="Cinematic motion"
                    onClick={toggleMotion}
                  >
                    <span />
                  </button>
                </div>
                <div className="settings-row">
                  <div>
                    <h2>
                      <FiBookmark /> Your collection
                    </h2>
                    <p>
                      {saved.length} saved titles on this browser. No sign-in
                      required for the local experience.
                    </p>
                  </div>
                  <Link className="text-link" to="/favoriteList">
                    Open list <FiChevronRight />
                  </Link>
                </div>
                <div className="settings-row">
                  <div>
                    <h2>
                      <FiFilm /> Your studio
                    </h2>
                    <p>
                      Add titles, update artwork, and manage your collection.
                    </p>
                  </div>
                  <Link className="text-link" to="/dashboard">
                    Open studio <FiChevronRight />
                  </Link>
                </div>
                <div className="settings-row">
                  <div>
                    <h2>Account</h2>
                    <p>
                      {sessionStorage.getItem("email") ||
                        "Explore locally or sign in to a connected library."}
                    </p>
                  </div>
                  <Link
                    className="text-link"
                    to={
                      sessionStorage.getItem("userID")
                        ? "/sign-out"
                        : "/sign-in"
                    }
                  >
                    {sessionStorage.getItem("userID") ? "Sign out" : "Sign in"}
                    <FiChevronRight />
                  </Link>
                </div>
                <div className="settings-row">
                  <div>
                    <h2>
                      <FiFilm /> Catalog
                    </h2>
                    <p>
                      {status === "live"
                        ? "Connected to your API."
                        : "Curated demo catalog. Trailer playback requires an internet connection."}
                    </p>
                  </div>
                </div>
              </>
            ) : path === "/aboutus" ? (
              <>
                <h1>A world worth watching.</h1>
                <p className="large-copy">
                  Great stories take us somewhere new. Streamflix brings films
                  and series together in a thoughtful space built for discovery.
                </p>
                <p className="muted">
                  This local edition includes a curated demo collection,
                  official trailer links, and a personal watchlist. Connect your
                  own catalog to explore your media library.
                </p>
                <Link to="/movie" className="button primary">
                  Find your next story <FiArrowRight />
                </Link>
              </>
            ) : path === "/contact" ? (
              <>
                <h1>A little help, right here.</h1>
                <div className="faq-list">
                  {[
                    [
                      "How do I save a title?",
                      "Select the + button on a poster or in a title’s details. Your list is saved in this browser.",
                    ],
                    [
                      "Where can I watch?",
                      "Open a title and choose Watch trailer. The demo includes trailers, not full-length films. Your connected catalog can supply MP4 or WebM videos.",
                    ],
                    [
                      "Why is a trailer unavailable?",
                      "YouTube videos can have regional or embedding restrictions. Use the Open on YouTube link beneath the player.",
                    ],
                    [
                      "How do I turn off motion?",
                      "Open Preferences and disable Cinematic motion. System reduced-motion settings are also respected.",
                    ],
                  ].map(([q, a]) => (
                    <details key={q}>
                      <summary>
                        {q}
                        <FiPlus />
                      </summary>
                      <p>{a}</p>
                    </details>
                  ))}
                </div>
                <a
                  className="text-link"
                  href="https://github.com/moosey2003/Streamflix/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  Report an issue on GitHub <FiArrowRight />
                </a>
              </>
            ) : path === "/subscription" || path.startsWith("/payment") ? (
              <>
                <h1>You're in. Enjoy exploring.</h1>
                <p className="large-copy">
                  The local edition is free to explore.
                </p>
                <p className="muted">
                  Paid subscriptions and checkout are not connected in this
                  edition. You can browse titles, watch trailers, and build your
                  list right away.
                </p>
                <Link className="button primary" to="/">
                  Start exploring <FiArrowRight />
                </Link>
              </>
            ) : (
              <>
                <h1>This scene is missing.</h1>
                <p className="muted">We couldn't find that page.</p>
                <Link className="button primary" to="/">
                  <FiArrowLeft /> Back to discover
                </Link>
              </>
            )}
          </section>
        )}
      </main>
      <Footer />
      {selected && (
        <Detail
          key={selected.id}
          movie={selected}
          onClose={() => setSelected(null)}
          saved={saved.includes(selected.id)}
          onSave={save}
        />
      )}
      <div className={"toast " + (toast ? "visible" : "")} role="status">
        {toast && (
          <>
            <FiCheck />
            {toast}
          </>
        )}
      </div>
    </div>
  );
}
