import { test, expect } from "@playwright/test";
test("local studio creates, edits and deletes a title that appears in discovery", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Add a film", exact: true }).click();
  await page.getByLabel("Title", { exact: true }).fill("A Local Adventure");
  await page.getByLabel("Release date", { exact: true }).fill("2025-07-12");
  await page.getByLabel("Duration", { exact: true }).fill("1h 40m");
  await page.getByLabel("Rating (0–10)", { exact: true }).fill("8.1");
  await page
    .getByLabel("Synopsis", { exact: true })
    .fill("An explorer returns home.");
  await page
    .getByLabel("Poster image URL", { exact: true })
    .fill("/art/interstellar.jpg");
  await page
    .getByLabel("Video or trailer", { exact: true })
    .fill("https://www.youtube.com/watch?v=Way9Dexny3w");
  await page
    .getByRole("button", { name: "Add to catalog", exact: true })
    .click();
  await expect(
    page.getByText("A Local Adventure", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Edit A Local Adventure" }).click();
  await page.getByLabel("Title", { exact: true }).fill("A Better Adventure");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.goto("/movie");
  await page.getByRole("button", { name: "View A Better Adventure" }).click();
  await page.getByRole("link", { name: "Open title page" }).click();
  await expect(
    page.getByRole("heading", { name: "A Better Adventure" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "My list", exact: true }).click();
  await expect(
    page.getByText("Added to your list.", { exact: true }),
  ).toBeVisible();
  await page.goto("/movies");
  await page.getByRole("button", { name: "Delete A Better Adventure" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByText("A Better Adventure", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete A Better Adventure" }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.goto("/movie");
  await expect(
    page.getByRole("button", { name: "View A Better Adventure" }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("mobile studio and account layouts remain usable, unknown titles show a useful state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/dashboard",
    "/movies",
    "/movieform",
    "/sign-in",
    "/sign-up",
    "/details/dune",
  ]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/details/missing-title");
  await expect(
    page.getByText("This title is no longer in your catalog."),
  ).toBeVisible();
  await page.goto("/sign-in");
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText(/Account services are not connected/),
  ).toBeVisible();
});
