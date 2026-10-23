import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FiGrid,
  FiFilm,
  FiTv,
  FiTrendingUp,
  FiUsers,
  FiCreditCard,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { Screen, Loading, ErrorState } from "./Shared";
import {
  collections,
  liveCatalog,
  getCollection,
  getTitle,
  saveTitle,
  deleteTitle,
  apiRequest,
  videoSource,
} from "./service";
const links = [
  ["/dashboard", "Overview", FiGrid],
  ["/movies", "Movies", FiFilm],
  ["/tvshow", "TV shows", FiTv],
  ["/trending", "Trending", FiTrendingUp],
  ["/userTable", "Users", FiUsers],
  ["/order", "Orders", FiCreditCard],
];
const blank = {
  title: "",
  genre: "Drama",
  duration: "",
  rating: "0",
  releaseDate: "",
  cast: "",
  description: "",
  image: "",
  video: "",
};
export default function Studio() {
  const { pathname } = useLocation();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const kind = /tvshow|Tvshow/.test(pathname)
    ? "tv"
    : /trending|Trending/.test(pathname)
      ? "trending"
      : "movie";
  const config = collections[kind];
  const editing = pathname.startsWith("/edit");
  const form = editing || pathname.endsWith("form");
  const dashboard = pathname === "/dashboard";
  const users = ["/user", "/userTable"].includes(pathname);
  const orders = pathname === "/order";
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ movie: 0, tv: 0, trending: 0 });
  const [draft, setDraft] = useState(blank);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [retry, setRetry] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setNotice("");
    setSearch("");
    setConfirm(null);
    (async () => {
      if (form) {
        const nextDraft = editing
          ? { ...blank, ...(await getTitle(movieId, kind)) }
          : { ...blank };
        if (active) {
          setDraft(nextDraft);
          setImageFailed(false);
        }
      } else if (dashboard) {
        const lists = await Promise.all(
          Object.keys(collections).map(getCollection),
        );
        if (active) {
          setStats({
            movie: lists[0].length,
            tv: lists[1].length,
            trending: lists[2].length,
          });
          setItems(lists.flat().slice(0, 5));
        }
      } else if (users || orders) {
        const data = liveCatalog
          ? await apiRequest(users ? "getUsers" : "orders")
          : [];
        if (!Array.isArray(data))
          throw Error("The service returned invalid records.");
        if (active) setItems(data);
      } else {
        const data = await getCollection(kind);
        if (active) setItems(data);
      }
    })()
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pathname, movieId, kind, form, editing, dashboard, users, orders, retry]);
  const submit = async (e) => {
    e.preventDefault();
    setNotice("");
    setBusy(true);
    try {
      if (!draft.title.trim()) throw Error("Enter a title.");
      if (draft.video && !videoSource(draft.video))
        throw Error("Use a YouTube video ID or URL, or a direct MP4/WebM URL.");
      if (
        draft.image &&
        !/^https?:\/\//i.test(draft.image) &&
        !/^\/[^/]/.test(draft.image)
      )
        throw Error("Use an HTTP image URL or a local path beginning with /.");
      await saveTitle(draft, kind, editing);
      navigate(config.route, { state: { saved: true } });
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (id) => {
    setBusy(true);
    setNotice("");
    try {
      if (users) {
        await apiRequest(`userDelete/${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } else await deleteTitle(id, kind);
      setItems(items.filter((m) => (m.id || m._id) !== id));
      setConfirm(null);
      setNotice("Removed successfully.");
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const change = (e) => {
    setDraft({ ...draft, [e.target.name]: e.target.value });
    if (e.target.name === "image") setImageFailed(false);
  };
  const filtered = items.filter((m) =>
    `${m.title || ""} ${m.email || ""} ${m.username || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const title = form
    ? editing
      ? "Refine the story."
      : "Add something worth watching."
    : dashboard
      ? "Your collection, at a glance."
      : users
        ? "The people behind the profiles."
        : orders
          ? "Your subscription records."
          : `${config.label}, thoughtfully curated.`;
  return (
    <Screen className="studio">
      <div className="studio-layout section-wrap">
        <aside className="studio-sidebar">
          <span className="eyebrow">STREAMFLIX STUDIO</span>
          <nav aria-label="Studio navigation">
            {links.map(([href, label, Icon]) => (
              <NavLink key={href} to={href}>
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="studio-mode">
            <span className="live-dot" />
            {liveCatalog ? "Connected API" : "Local workspace"}
            <p>
              {liveCatalog
                ? "Manage your connected catalog."
                : "Your edits stay in this browser."}
            </p>
          </div>
          <Link className="text-link" to="/">
            Back to watching <FiArrowRight />
          </Link>
        </aside>
        <section className="studio-content">
          <div className="eyebrow">
            {form
              ? "THE DETAILS MAKE THE DIFFERENCE"
              : "A LITTLE CURATION GOES A LONG WAY"}
          </div>
          <div className="studio-title">
            <h1>{title}</h1>
            {!form && !dashboard && !users && !orders && (
              <Link className="button primary" to={config.form}>
                <FiPlus /> Add title
              </Link>
            )}
          </div>
          {notice && (
            <p className="inline-notice" role="status">
              {notice}
            </p>
          )}
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorState message={error} onRetry={() => setRetry(retry + 1)} />
          ) : form ? (
            <>
              <Link className="text-link" to={config.route}>
                <FiArrowLeft /> Back to {config.label.toLowerCase()}
              </Link>
              <form className="title-editor" onSubmit={submit}>
                <div className="editor-fields">
                  <div className="field-grid">
                    <label className="field full">
                      Title
                      <input
                        name="title"
                        value={draft.title}
                        onChange={change}
                        required
                        maxLength={160}
                      />
                    </label>
                    <label className="field">
                      Genre
                      <input
                        name="genre"
                        value={draft.genre}
                        onChange={change}
                        required
                      />
                    </label>
                    <label className="field">
                      Release date
                      <input
                        type="date"
                        name="releaseDate"
                        value={
                          draft.releaseDate ||
                          (draft.year ? `${draft.year}-01-01` : "")
                        }
                        onChange={change}
                        required
                      />
                    </label>
                    <label className="field">
                      Duration
                      <input
                        name="duration"
                        placeholder="2h 15m or Series"
                        value={draft.duration}
                        onChange={change}
                        required
                      />
                    </label>
                    <label className="field">
                      Rating (0–10)
                      <input
                        name="rating"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={draft.rating}
                        onChange={change}
                        required
                      />
                    </label>
                    <label className="field full">
                      Cast
                      <input
                        name="cast"
                        placeholder="Separate names with commas"
                        value={draft.cast}
                        onChange={change}
                      />
                    </label>
                    <label className="field full">
                      Synopsis
                      <textarea
                        name="description"
                        rows="4"
                        value={draft.description}
                        onChange={change}
                        required
                      />
                    </label>
                    <label className="field full">
                      Poster image URL
                      <input
                        name="image"
                        placeholder="https://… or /art/example.jpg"
                        value={draft.image}
                        onChange={change}
                        required
                      />
                    </label>
                    <label className="field full">
                      Video or trailer
                      <input
                        name="video"
                        aria-label="Video or trailer"
                        aria-describedby="video-help"
                        placeholder="YouTube URL / ID, or MP4 / WebM URL"
                        value={draft.video}
                        onChange={change}
                      />
                      <small id="video-help">
                        Leave empty to show details without playback.
                      </small>
                    </label>
                  </div>
                  <div className="button-row">
                    <button
                      disabled={busy}
                      className="button primary"
                      type="submit"
                    >
                      <FiCheck />
                      {busy
                        ? "Saving…"
                        : editing
                          ? "Save changes"
                          : "Add to catalog"}
                    </button>
                    <Link className="button secondary" to={config.route}>
                      Cancel
                    </Link>
                  </div>
                </div>
                <aside className="editor-preview">
                  <span className="eyebrow">POSTER PREVIEW</span>
                  {draft.image && !imageFailed ? (
                    <img
                      src={draft.image}
                      alt="Poster preview"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    <div className="poster-placeholder">
                      <FiFilm />
                      <span>
                        {imageFailed
                          ? "Image unavailable"
                          : "Add poster artwork"}
                      </span>
                    </div>
                  )}
                  <h2>{draft.title || "Your next great title"}</h2>
                  <p>
                    {draft.genre} · {draft.duration || "Duration"}
                  </p>
                </aside>
              </form>
            </>
          ) : dashboard ? (
            <>
              <div className="stat-grid">
                {Object.entries(collections).map(([key, c]) => (
                  <Link to={c.route} className="stat-card" key={key}>
                    <span>{c.label}</span>
                    <strong>{stats[key]}</strong>
                    <FiArrowRight />
                  </Link>
                ))}
              </div>
              <div className="studio-feature">
                <span className="eyebrow">MAKE ROOM FOR NEW STORIES</span>
                <h2>
                  A great library starts
                  <br />
                  with a little curiosity.
                </h2>
                <p>Add your own titles and make Streamflix yours.</p>
                <Link className="button primary" to="/movieform">
                  <FiPlus /> Add a film
                </Link>
              </div>
              <h2 className="table-heading">In your collection</h2>
              <div className="overview-list">
                {items.map((m) => (
                  <Link
                    key={`${m.collection}-${m.id}`}
                    to={`${collections[m.collection].edit}/${m.id}`}
                  >
                    <img src={m.image} alt="" />
                    <div>
                      <strong>{m.title}</strong>
                      <span>
                        {m.genre} · {m.year}
                      </span>
                    </div>
                    <FiEdit2 />
                  </Link>
                ))}
                {!items.length && (
                  <p className="muted">
                    Your catalog is empty. Add a title to get started.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {(users || orders) && !liveCatalog ? (
                <div className="state-panel">
                  <span className="eyebrow">LOCAL EDITION</span>
                  <h2>
                    {users
                      ? "Browse without an account."
                      : "No checkout, no charges."}
                  </h2>
                  <p>
                    {users
                      ? "Local profiles are not created or tracked. Your watchlist and library live in your browser. Connect the backend to view its registered users."
                      : "Payments are not connected in the local edition. Connect the backend to inspect its existing order records."}
                  </p>
                  <Link className="button secondary" to="/settings">
                    View preferences <FiArrowRight />
                  </Link>
                </div>
              ) : (
                <>
                  <label className="search-field studio-search">
                    <FiSearch />
                    <input
                      type="search"
                      aria-label="Search records"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={
                        users || orders
                          ? "Search by name or email"
                          : "Search your catalog"
                      }
                    />
                  </label>
                  <div className="table-scroll">
                    <table className="studio-table">
                      <thead>
                        <tr>
                          {(users
                            ? ["Name", "Email", "Actions"]
                            : orders
                              ? ["Email", "Plan", "Method", "Date"]
                              : ["Title", "Genre", "Year", "Rating", "Actions"]
                          ).map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((m) => {
                          const id = m.id || m._id;
                          return (
                            <tr key={id}>
                              {users ? (
                                <>
                                  <td>{m.username}</td>
                                  <td>{m.email}</td>
                                </>
                              ) : orders ? (
                                <>
                                  <td>{m.email}</td>
                                  <td>{m.subscription}</td>
                                  <td>{m.payment_method}</td>
                                  <td>
                                    {m.date
                                      ? new Date(m.date).toLocaleDateString()
                                      : "—"}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>
                                    <div className="table-title">
                                      <img src={m.image} alt="" />
                                      <span>{m.title}</span>
                                    </div>
                                  </td>
                                  <td>{m.genre}</td>
                                  <td>{m.year}</td>
                                  <td>
                                    <span className="rating">★ {m.rating}</span>
                                  </td>
                                </>
                              )}
                              {!orders && (
                                <td>
                                  <div className="table-actions">
                                    {confirm === id ? (
                                      <>
                                        <span>Remove?</span>
                                        <button
                                          disabled={busy}
                                          className="danger-button"
                                          onClick={() => remove(id)}
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          disabled={busy}
                                          className="small-button"
                                          onClick={() => setConfirm(null)}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {!users && (
                                          <Link
                                            className="icon-button"
                                            aria-label={`Edit ${m.title}`}
                                            to={`${config.edit}/${id}`}
                                          >
                                            <FiEdit2 />
                                          </Link>
                                        )}
                                        <button
                                          className="icon-button"
                                          aria-label={`Delete ${m.title || m.username}`}
                                          onClick={() => setConfirm(id)}
                                        >
                                          <FiTrash2 />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {!filtered.length && (
                    <div className="state-panel">
                      <h2>
                        {search ? "No matching records." : "A fresh start."}
                      </h2>
                      <p>
                        {search
                          ? "Try a different search."
                          : "No records in this collection yet."}
                      </p>
                    </div>
                  )}
                  <p className="results-count" aria-live="polite">
                    {filtered.length} records
                  </p>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </Screen>
  );
}
