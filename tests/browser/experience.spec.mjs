import { test, expect } from "@playwright/test";
test("discover, save, persist, search, and keyboard dialog", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "DUNE PART TWO" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Save Interstellar", exact: true })
    .click();
  await page.getByRole("link", { name: "My list", exact: true }).click();
  await expect(page.locator(".movie-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".movie-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "View Interstellar", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "View Interstellar", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Remove Interstellar", exact: true })
    .click();
  await expect(page.getByText("Good stories belong here.")).toBeVisible();
  await page
    .getByRole("button", { name: "Search titles", exact: true })
    .click();
  await page.getByRole("searchbox").fill("zendaya");
  await expect(page.locator(".movie-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("nothingmatches");
  await expect(page.getByText("No matching titles.")).toBeVisible();
  expect(errors).toEqual([]);
});
test("mobile navigation and layout, system reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("link", { name: "TV shows", exact: true }).click();
  await expect(page.locator(".movie-card")).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 400));
  expect(
    await page
      .locator(".hero-background")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  await page.screenshot({ path: ".tools/mobile.png", fullPage: true });
});
test("preferences persist and trailer player uses selected title", async ({
  page,
}) => {
  await page.goto("/settings");
  await page.getByRole("switch").click();
  await page.reload();
  await expect(page.getByRole("switch")).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await page.goto("/movie");
  await page
    .getByRole("button", { name: "View Dune: Part Two", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Watch trailer", exact: true })
    .click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie.com\/embed\/Way9Dexny3w/,
  );
});
