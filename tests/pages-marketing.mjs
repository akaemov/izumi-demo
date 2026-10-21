import { chromium } from "playwright";
import assert from "node:assert/strict";
const url = process.env.PAGES_TEST_URL || "http://127.0.0.1:3013/izumi-demo/";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [320, 390, 820, 1100, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(url);
    assert.equal(
      await page
        .locator(".header")
        .evaluate((el) => getComputedStyle(el).borderBottomWidth),
      "0px",
    );
    assert.equal(await page.locator(".reading-progress").count(), 0);
    const downloadLink = page.locator(".header .presentation-download");
    assert.ok(await downloadLink.isVisible());
    const pdf = await page.request.get(
      new URL(await downloadLink.getAttribute("href"), url).href,
    );
    assert.equal(pdf.status(), 200);
    assert.equal((await pdf.body()).subarray(0, 4).toString(), "%PDF");
    const downloadPromise = page.waitForEvent("download");
    await downloadLink.click();
    const download = await downloadPromise;
    assert.ok(download.suggestedFilename().endsWith(".pdf"));
    assert.equal(await download.failure(), null);
    await page.locator(".philosophy-pattern").evaluate((img) => img.decode());
    assert.equal(await page.locator(".benefit-tile").count(), 3);
    assert.equal(await page.locator(".document-item").count(), 8);
    await page.locator(".document-item summary").first().click();
    assert.ok(
      (await page.locator(".document-item[open]").textContent()).includes(
        "Официальный документ пока не предоставлен",
      ),
    );
    assert.equal(
      await page.locator("#family-mortgage input:disabled").count(),
      3,
    );
    assert.ok(await page.locator("#family-mortgage button").isDisabled());
    assert.ok(
      (await page.locator("#mortgage-status").textContent()).includes(
        "не отправляются",
      ),
    );
    const photo = page.locator(".benefit-photo").first();
    await photo.hover();
    assert.equal(
      await photo.evaluate(
        (el) => getComputedStyle(el, "::before").animationName,
      ),
      "glass-shine",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await photo.evaluate(
        (el) => getComputedStyle(el, "::before").animationName,
      ),
      "none",
    );
    for (const id of [
      "about",
      "benefits",
      "presentation",
      "family-mortgage",
      "documents",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `overflow ${width}px ${id}`,
      );
      if (width === 390 || width === 1440)
        await page
          .locator(`#${id}`)
          .screenshot({ path: `/tmp/izumi-${id}-${width}.png` });
    }
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${width}px: header/PDF download, pattern, benefits, docs, demo mortgage, shine/reduced-motion, no overflow/errors`,
    );
  }
} finally {
  await browser.close();
}
