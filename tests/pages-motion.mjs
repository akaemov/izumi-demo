import { chromium } from "playwright";
import assert from "node:assert/strict";
const url = process.env.PAGES_TEST_URL || "http://127.0.0.1:3010/izumi-demo/";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(url);
    await page.locator("#about h2").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => document.querySelector("#about h2").getAnimations().length > 0,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => document.querySelector("#about h2").getAnimations().length === 0,
    );
    await page.locator("#gallery").scrollIntoViewIfNeeded();
    await page.locator(".gallery-item").first().click();
    await page.locator("dialog[open]").waitFor();
    assert.equal(
      await page
        .locator("dialog")
        .evaluate((el) => el.getAnimations({ subtree: true }).length),
      0,
    );
    await page.keyboard.press("Escape");
    if (width === 390) {
      await page.getByRole("button", { name: "Меню" }).click();
      assert.equal(
        await page
          .locator("#mobile-menu")
          .evaluate((el) => el.getAnimations({ subtree: true }).length),
        0,
      );
      await page.locator("#mobile-menu a").first().click();
    }
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.equal(errors.length, 0, errors.join("\n"));
    await page.close();
    const reduced = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await reduced.goto(url);
    await reduced.locator("#contacts").scrollIntoViewIfNeeded();
    assert.equal(
      await reduced
        .locator(".hero-copy")
        .evaluate((el) => el.getAnimations().length),
      0,
    );
    assert.equal(
      await reduced
        .locator(".contacts")
        .evaluate((el) => el.getAnimations({ subtree: true }).length),
      0,
    );
    await reduced.close();
    const noJS = await browser.newPage({
      viewport: { width, height: 900 },
      javaScriptEnabled: false,
    });
    await noJS.goto(url);
    assert.ok(await noJS.locator("#hero-title").isVisible());
    assert.equal(
      await noJS
        .locator("#hero-title")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    await noJS.locator("#contacts").scrollIntoViewIfNeeded();
    assert.equal(
      await noJS
        .locator(".contacts h2")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    await noJS.close();
    console.log(
      `PASS ${width}px: reveals, live reduced-motion switch, reduced-motion menu/gallery, content without JS, no overflow/errors`,
    );
  }
} finally {
  await browser.close();
}
