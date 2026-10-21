import { chromium } from "playwright";
import assert from "node:assert/strict";
const url = process.env.PAGES_TEST_URL || "http://127.0.0.1:3011/izumi-demo/";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(url);
    await page.locator("#apartments").scrollIntoViewIfNeeded();
    for (const [label, rooms] of [
      ["1-комнатные", 1],
      ["2-комнатные", 2],
      ["Студии", 0],
      ["3-комнатные", 3],
    ]) {
      const tab = page.getByRole("button", { name: label, exact: true });
      await tab.click();
      assert.equal(await tab.getAttribute("aria-pressed"), "true");
      assert.equal(await page.locator(".lot-card").count(), 3);
      const plans = await page
        .locator(".lot-plan img")
        .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")));
      assert.equal(new Set(plans).size, 3);
      assert.ok(plans.every((src) => src.includes(`demo-${rooms}-`)));
      await page
        .locator(".lot-plan img")
        .first()
        .evaluate((img) => img.decode());
      assert.ok(
        (await page.locator(".catalog-notice").textContent()).includes(
          "не квартиры ЖК",
        ),
      );
      const columns = await page
        .locator(".lot-results")
        .evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
        );
      assert.equal(columns, width < 600 ? 1 : 3);
      await page.locator(".lot-button").first().click();
      await page.locator("dialog[open]").waitFor();
      assert.ok(
        (await page.locator("dialog").textContent()).includes(
          "Демонстрационная планировка",
        ),
      );
      await page.locator("dialog .plan img").evaluate((img) => img.decode());
      await page.keyboard.press("Escape");
      assert.equal(await tab.getAttribute("aria-pressed"), "true");
      assert.ok(
        await page
          .locator(".lot-button")
          .first()
          .evaluate((el) => el === document.activeElement),
      );
    }
    await page.locator(".lot-button").first().click();
    await page
      .getByRole("button", { name: "Узнать о связи с командой" })
      .click();
    assert.ok(
      (await page.locator("dialog").textContent()).includes("demo-3-1"),
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .locator(".lot-button")
        .first()
        .evaluate((el) => getComputedStyle(el).borderRadius),
      "10px",
    );
    assert.equal(
      await page
        .locator(".hero-visual")
        .evaluate((el) => getComputedStyle(el).borderRadius),
      "10px",
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.deepEqual(errors, []);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page
      .locator("#apartments")
      .evaluate((el) =>
        el.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await page.screenshot({ path: `/tmp/izumi-catalog-${width}.png` });
    await page.close();
    console.log(
      `PASS ${width}px: all four categories, 12 plans, grid, modal/focus, inquiry context, 10px corners, no overflow/errors`,
    );
  }
} finally {
  await browser.close();
}
