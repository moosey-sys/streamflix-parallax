const poster = (name) => `/art/${name}.jpg`;
export const demoCatalog = [
  {
    id: "dune",
    title: "Dune: Part Two",
    year: "2024",
    rating: "8.5",
    duration: "2h 46m",
    genre: "Sci-Fi",
    type: "movie",
    image: poster("dune"),
    backdrop: "/art/dune-hero.jpg",
    video: "Way9Dexny3w",
    description:
      "Destiny is written in sand. Paul Atreides joins the Fremen on a journey of revenge, and faces a choice between the love of his life and the fate of the universe.",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    duration: "2h 49m",
    genre: "Sci-Fi",
    type: "movie",
    image: poster("interstellar"),
    video: "zSWdZVtXT7E",
    description:
      "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",
    cast: "Matthew McConaughey, Anne Hathaway",
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: "2023",
    rating: "8.3",
    duration: "3h",
    genre: "Drama",
    type: "movie",
    image: poster("oppenheimer"),
    video: "uYPbbksJxIg",
    description:
      "A brilliant physicist leads a secret project that will change the world forever.",
    cast: "Cillian Murphy, Emily Blunt",
  },
  {
    id: "batman",
    title: "The Batman",
    year: "2022",
    rating: "7.8",
    duration: "2h 56m",
    genre: "Thriller",
    type: "movie",
    image: poster("batman"),
    video: "mqqft2x_Aa4",
    description:
      "In the shadows of Gotham, a young detective follows a trail of cryptic clues into the heart of the city.",
    cast: "Robert Pattinson, Zoë Kravitz",
  },
  {
    id: "spiderverse",
    title: "Across the Spider-Verse",
    year: "2023",
    rating: "8.6",
    duration: "2h 20m",
    genre: "Animation",
    type: "movie",
    image: poster("spiderverse"),
    video: "cqGjhVJWtEg",
    description:
      "Miles Morales swings across the multiverse and discovers what it really means to be a hero.",
    cast: "Shameik Moore, Hailee Steinfeld",
  },
  {
    id: "poor-things",
    title: "Poor Things",
    year: "2023",
    rating: "7.8",
    duration: "2h 21m",
    genre: "Fantasy",
    type: "movie",
    image: poster("poor-things"),
    video: "RlbR5N6veqw",
    description:
      "An extraordinary young woman embarks on an unforgettable adventure of discovery and liberation.",
    cast: "Emma Stone, Mark Ruffalo",
  },
  {
    id: "onepiece",
    title: "One Piece",
    year: "2023",
    rating: "8.3",
    duration: "Series",
    genre: "Adventure",
    type: "tv",
    image: poster("onepiece"),
    backdrop: "/art/onepiece.jpg",
    video: "Ades3pQbeh8",
    description:
      "A young pirate with a big dream sets sail with an unlikely crew in search of the ultimate treasure.",
    cast: "Iñaki Godoy, Emily Rudd",
  },
  {
    id: "lastofus",
    title: "The Last of Us",
    year: "2023",
    rating: "8.7",
    duration: "Series",
    genre: "Drama",
    type: "tv",
    image: poster("lastofus"),
    video: "uLtkt8BonwM",
    description:
      "Two survivors cross a changed America, finding hope and unexpected connection along the way.",
    cast: "Pedro Pascal, Bella Ramsey",
  },
  {
    id: "severance",
    title: "Severance",
    year: "2022",
    rating: "8.7",
    duration: "Series",
    genre: "Thriller",
    type: "tv",
    image: poster("severance"),
    video: "xEQP4VVuyrY",
    description:
      "At an enigmatic company, employees separate their work memories from their personal lives.",
    cast: "Adam Scott, Britt Lower",
  },
  {
    id: "shogun",
    title: "Shōgun",
    year: "2024",
    rating: "8.6",
    duration: "Series",
    genre: "Drama",
    type: "tv",
    image: poster("shogun"),
    video: "yAN5uspO_hk",
    description:
      "An English sailor becomes entangled in the power struggles of feudal Japan.",
    cast: "Hiroyuki Sanada, Cosmo Jarvis",
  },
];
export function filterCatalog(
  items,
  { query = "", genre = "All", type = "all", saved = null } = {},
) {
  return items.filter(
    (m) =>
      (type === "all" || m.type === type) &&
      (genre === "All" ||
        m.genre.toLowerCase().includes(genre.toLowerCase())) &&
      (!saved || saved.includes(m.id)) &&
      `${m.title} ${m.genre} ${m.cast}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
}
export function normalizeMovie(m, type = "movie") {
  const image = Array.isArray(m.imageUrl) ? m.imageUrl[0] : m.imageUrl;
  return {
    id: String(m._id?.$oid || m._id || m.id),
    title: String(m.title || "Untitled"),
    year: String(m.releaseDate || "").slice(0, 4),
    rating: String(m.rating ?? "—"),
    duration: String(m.duration || ""),
    genre: Array.isArray(m.genre)
      ? m.genre.join(", ")
      : String(m.genre || "Other"),
    type,
    image,
    backdrop: image,
    video: Array.isArray(m.video) ? m.video[0] : m.video,
    description: m.description || "",
    cast: Array.isArray(m.cast) ? m.cast.join(", ") : String(m.cast || ""),
  };
}
export function readSaved(storage) {
  try {
    const value = JSON.parse(
      (storage || globalThis.localStorage).getItem("streamflix-list") || "[]",
    );
    return Array.isArray(value)
      ? value.filter((x) => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}
