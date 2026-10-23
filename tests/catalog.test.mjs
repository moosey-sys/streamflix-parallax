import { test } from "node:test";
import assert from "node:assert/strict";
import {
  demoCatalog,
  filterCatalog,
  normalizeMovie,
  readSaved,
} from "../src/experience/catalog.mjs";
test("search combines title/cast, type, genre, and saved filters", () => {
  assert.deepEqual(
    filterCatalog(demoCatalog, {
      query: "  ZENDAYA ",
      genre: "Sci-Fi",
      type: "movie",
      saved: ["dune"],
    }).map((x) => x.id),
    ["dune"],
  );
  assert.equal(
    filterCatalog(demoCatalog, { query: "Zendaya", type: "tv" }).length,
    0,
  );
  assert.equal(filterCatalog(demoCatalog, { saved: [] }).length, 0);
});
test("saved list survives malformed browser storage", () => {
  for (const value of ["null", "{}", "broken"])
    assert.deepEqual(readSaved({ getItem: () => value }), []);
  assert.deepEqual(readSaved({ getItem: () => '["dune",4,null]' }), ["dune"]);
  assert.deepEqual(
    readSaved({
      getItem: () => {
        throw Error("blocked");
      },
    }),
    [],
  );
});
test("normalizes legacy Mongo responses and array fields", () => {
  const item = normalizeMovie(
    {
      _id: { $oid: "abc" },
      title: "Example",
      cast: ["A", "B"],
      genre: ["Drama"],
      video: ["abcdefghijk"],
      imageUrl: ["https://example.com/poster.jpg"],
      rating: 0,
      releaseDate: "2024-01-01",
    },
    "tv",
  );
  assert.equal(item.id, "abc");
  assert.equal(item.cast, "A, B");
  assert.equal(item.video, "abcdefghijk");
  assert.equal(item.image, "https://example.com/poster.jpg");
  assert.equal(item.rating, "0");
  assert.equal(item.year, "2024");
  assert.equal(item.type, "tv");
});
