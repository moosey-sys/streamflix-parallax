import { demoCatalog, normalizeMovie } from "./catalog.mjs";
export const liveCatalog = import.meta.env.VITE_CATALOG_SOURCE === "api";
export const collections = {
  movie: {
    label: "Movies",
    list: "getMovies",
    detail: "getMovie",
    prefix: "movie",
    route: "/movies",
    form: "/movieform",
    edit: "/editMovie",
  },
  tv: {
    label: "TV shows",
    list: "getTvshows",
    detail: "getTvshows",
    prefix: "tvshow",
    route: "/tvshow",
    form: "/tvshowform",
    edit: "/editTvshow",
  },
  trending: {
    label: "Trending",
    list: "getTrending",
    detail: "getTrending",
    prefix: "trending",
    route: "/trending",
    form: "/trendingform",
    edit: "/editTrending",
  },
};
export async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const signal = options.signal || controller.signal;
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const r = await fetch(`/api/${path}`, {
      ...options,
      signal,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    let data;
    try {
      data = await r.json();
    } catch {
      throw Error(
        "The catalog service returned an unreadable response. Please check the backend connection.",
      );
    }
    if (!r.ok)
      throw Error(
        data.message || data.error || `Request failed (${r.status}).`,
      );
    return data;
  } catch (e) {
    if (e.name === "AbortError")
      throw Error("The service took too long to respond. Please try again.");
    if (e instanceof TypeError)
      throw Error(
        "Cannot connect to the local service. Start the backend and try again.",
      );
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
export function localCatalog() {
  try {
    const raw = localStorage.getItem("streamflix-catalog");
    if (raw) {
      const value = JSON.parse(raw);
      if (
        Array.isArray(value) &&
        value.every(
          (m) =>
            m &&
            typeof m.id === "string" &&
            typeof m.title === "string" &&
            typeof m.genre === "string",
        )
      )
        return value;
    }
  } catch {}
  return demoCatalog.map((m) => ({
    ...m,
    collection: m.type === "tv" ? "tv" : "movie",
  }));
}
export function writeCatalog(items) {
  try {
    localStorage.setItem("streamflix-catalog", JSON.stringify(items));
    window.dispatchEvent(new Event("streamflix-catalog-change"));
  } catch {
    throw Error(
      "Your browser could not save the catalog. Free some storage and try again.",
    );
  }
}
export async function getCollection(kind) {
  if (!liveCatalog)
    return localCatalog().filter((m) => (m.collection || m.type) === kind);
  const data = await apiRequest(collections[kind].list);
  if (!Array.isArray(data))
    throw Error("The service returned an invalid catalog.");
  return data.map((m) => ({
    ...normalizeMovie(m, kind === "tv" ? "tv" : "movie"),
    collection: kind,
    releaseDate: m.releaseDate || "",
  }));
}
export async function getTitle(id, kind = "movie") {
  if (!liveCatalog) {
    const m = localCatalog().find((m) => m.id === id);
    if (!m) throw Error("This title is no longer in your catalog.");
    return m;
  }
  const data = await apiRequest(
    `${collections[kind].detail}/${encodeURIComponent(id)}`,
  );
  return {
    ...normalizeMovie(data, kind === "tv" ? "tv" : "movie"),
    releaseDate: data.releaseDate || "",
    collection: kind,
  };
}
export function titlePayload(m) {
  return {
    title: m.title.trim(),
    cast: m.cast,
    description: m.description,
    duration: m.duration,
    genre: m.genre,
    rating: Number(m.rating),
    releaseDate: m.releaseDate || `${m.year}-01-01`,
    imageUrl: m.image,
    video: m.video,
  };
}
export async function saveTitle(movie, kind, isEdit) {
  if (liveCatalog)
    return apiRequest(
      `${collections[kind].prefix}${isEdit ? "Edit/" + encodeURIComponent(movie.id) : "Upload"}`,
      {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(titlePayload(movie)),
      },
    );
  const items = localCatalog();
  const entry = {
    ...movie,
    title: movie.title.trim(),
    id: isEdit ? movie.id : crypto.randomUUID(),
    type: kind === "tv" ? "tv" : "movie",
    collection: kind,
    year: (movie.releaseDate || movie.year).slice(0, 4),
  };
  if (isEdit && !items.some((m) => m.id === entry.id))
    throw Error("This title was removed. Return to the catalog and try again.");
  writeCatalog(
    isEdit
      ? items.map((m) => (m.id === entry.id ? entry : m))
      : [entry, ...items],
  );
}
export async function deleteTitle(id, kind) {
  if (liveCatalog)
    return apiRequest(
      `${collections[kind].prefix}Delete/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  writeCatalog(localCatalog().filter((m) => m.id !== id));
}
export function videoSource(value = "") {
  if (/^[\w-]{11}$/.test(value)) return { type: "youtube", value };
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : ["www.youtube.com", "youtube.com"].includes(url.hostname)
          ? url.searchParams.get("v") || url.pathname.split("/embed/")[1]
          : null;
    if (id && /^[\w-]{11}$/.test(id)) return { type: "youtube", value: id };
    if (/\.(mp4|webm)$/i.test(url.pathname))
      return { type: "video", value: url.href };
  } catch {}
  return null;
}
