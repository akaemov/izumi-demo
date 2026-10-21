import { chromium } from "playwright";
import assert from "node:assert/strict";
const url = process.env.PAGES_TEST_URL || "http://127.0.0.1:3014/izumi-demo/";
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
    assert.equal(await page.locator(".parallax-layer").count(), 6);
    assert.equal(
      await page.locator('.parallax-layer[data-kind="brand"]').count(),
      3,
    );
    const metrics = await page
      .locator("#inspiration")
      .evaluate((el) => ({
        top: el.getBoundingClientRect().top + scrollY,
        height: el.clientHeight,
        overflow: getComputedStyle(el).overflowY,
      }));
    assert.ok(!["scroll", "auto"].includes(metrics.overflow));
    async function sample(top) {
      return page.evaluate(async (y) => {
        scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
        return [...document.querySelectorAll(".parallax-layer")].map((el) => ({
          id: el.className,
          y: new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
        }));
      }, top);
    }
    assert.ok(
      await page.evaluate(() => CSS.supports("animation-timeline: view()")),
    );
    const a = await sample(metrics.top - 250),
      b = await sample(metrics.top + metrics.height * 0.4);
    const delta = b.map((item, i) => item.y - a[i].y);
    assert.ok(
      delta.some((d) => d > (width < 761 ? 4 : 15)),
      JSON.stringify(delta),
    );
    assert.ok(
      delta.some((d) => d < -(width < 761 ? 4 : 15)),
      JSON.stringify(delta),
    );
    assert.ok(
      new Set(delta.map((n) => Math.round(n))).size >= 4,
      "independent layer speeds",
    );
    for (const image of await page.locator(".parallax-layer img").all())
      await image.evaluate((img) => img.decode());
    await page.emulateMedia({ reducedMotion: "reduce" });
    await sample(metrics.top);
    assert.ok(
      (
        await page
          .locator(".parallax-layer")
          .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform))
      ).every((t) => t === "none"),
    );
    await page
      .locator("#inspiration")
      .screenshot({ path: `/tmp/izumi-parallax-${width}.png` });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const c = await sample(metrics.top + 250);
    assert.ok(c.some((el) => Math.abs(el.y) > 1));
    await page.locator(".benefit-photo").first().hover();
    assert.equal(
      await page
        .locator(".benefit-photo")
        .first()
        .evaluate((el) => getComputedStyle(el, "::before").animationName),
      "none",
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${width}px: six assets, three brand graphics, independent scroll-linked motion, reduced-motion/live switch, no shine/overflow/errors`,
    );
  }
  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  await noJS.goto(url);
  assert.ok(await noJS.locator("#collage-title").isVisible());
  assert.equal(await noJS.locator(".parallax-layer").count(), 6);
  await noJS.close();
  console.log("PASS no-JS: collage content remains visible");
} finally {
  await browser.close();
}
