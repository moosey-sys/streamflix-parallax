import { test, expect } from "@playwright/test";
import { spawn } from "node:child_process";
let server;
test.beforeAll(async () => {
  server = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      "3001",
      "--strictPort",
    ],
    {
      env: { ...process.env, VITE_CATALOG_SOURCE: "api" },
      windowsHide: true,
      stdio: "ignore",
    },
  );
  for (let n = 0; n < 100; n++) {
    try {
      const r = await fetch("http://127.0.0.1:3001");
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error("API test preview did not start");
});
test.afterAll(() => server?.kill());
test("API failures visibly fall back, and retry replaces demo with live catalog", async ({
  page,
}) => {
  let ready = false;
  await page.route("**/api/**", (route) =>
    route.fulfill(
      ready
        ? {
            json: route.request().url().endsWith("getMovies")
              ? [
                  {
                    _id: { $oid: "live-1" },
                    title: "My local film",
                    cast: ["Test Actor"],
                    genre: ["Drama"],
                    releaseDate: "2025-02-01",
                    imageUrl: "/art/dune.jpg",
                    rating: 9,
                    video: "Way9Dexny3w",
                  },
                ]
              : [],
          }
        : { status: 503, json: { error: "unavailable" } },
    ),
  );
  await page.goto("http://127.0.0.1:3001/movie");
  await expect(
    page.getByText("Your catalog is unavailable. Showing the demo collection."),
  ).toBeVisible();
  ready = true;
  await page.getByRole("button", { name: "Retry connection" }).click();
  await expect(page.locator(".movie-card")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "My local film", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "View My local film" }).click();
  await expect(page.getByText("Starring Test Actor")).toBeVisible();
});
test("an empty API catalog stays empty rather than claiming demo content is live", async ({
  page,
}) => {
  await page.route("**/api/**", (route) => route.fulfill({ json: [] }));
  await page.goto("http://127.0.0.1:3001/movie");
  await expect(page.getByText("No matching titles.")).toBeVisible();
  await expect(page.locator(".movie-card")).toHaveCount(0);
});

test("connected account reports rejection and handles registration and sign-in", async ({
  page,
}) => {
  await page.route("**/api/register", (route) =>
    route.fulfill({
      json: { message: "User registered successfully", user_id: "abc" },
    }),
  );
  await page.goto("http://127.0.0.1:3001/sign-up");
  await page.getByLabel("Name", { exact: true }).fill("Viewer");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("viewer@example.com");
  await page.getByLabel("Password", { exact: true }).fill("test-password");
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("wrong-password");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(
    page.getByText("Your passwords do not match. Please try again."),
  ).toBeVisible();
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("test-password");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.getByText("Your account is ready.")).toBeVisible();
  let valid = false;
  await page.route("**/api/login", (route) =>
    route.fulfill(
      valid
        ? { json: { user_id: "abc" } }
        : { status: 401, json: { message: "Invalid email or password" } },
    ),
  );
  await page.getByRole("link", { name: "Continue to sign in" }).click();
  await page
    .getByLabel("Email address", { exact: true })
    .fill("viewer@example.com");
  await page.getByLabel("Password", { exact: true }).fill("test-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByText("Invalid email or password", { exact: true }),
  ).toBeVisible();
  valid = true;
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
  expect(await page.evaluate(() => sessionStorage.getItem("userID"))).toBe(
    "abc",
  );
  await page.goto("http://127.0.0.1:3001/sign-out");
  await expect(page).toHaveURL(/settings$/);
  expect(
    await page.evaluate(() => sessionStorage.getItem("userID")),
  ).toBeNull();
});

test("connected studio edits serialize correctly and failed writes retain input", async ({
  page,
}) => {
  const record = {
    _id: "live-1",
    title: "Original title",
    genre: "Drama",
    rating: 8,
    releaseDate: "2024-02-01",
    duration: "2h",
    cast: "Actor",
    description: "A story",
    imageUrl: "/art/dune.jpg",
    video: "Way9Dexny3w",
  };
  await page.route("**/api/getMovie/live-1", (route) =>
    route.fulfill({ json: record }),
  );
  await page.route("**/api/getMovies", (route) =>
    route.fulfill({ json: [record] }),
  );
  let valid = false;
  let payload;
  await page.route("**/api/movieEdit/live-1", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill(
      valid
        ? { json: { message: "updated" } }
        : { status: 500, json: { error: "Save failed; retry" } },
    );
  });
  await page.goto("http://127.0.0.1:3001/editMovie/live-1");
  await page.getByLabel("Title", { exact: true }).fill("Updated title");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByText("Save failed; retry")).toBeVisible();
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue(
    "Updated title",
  );
  valid = true;
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page).toHaveURL(/movies$/);
  expect(payload.title).toBe("Updated title");
  expect(payload.rating).toBe(8);
  expect(payload.imageUrl).toBe("/art/dune.jpg");
  expect(payload.releaseDate).toBe("2024-02-01");
});
