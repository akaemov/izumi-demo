import { test, expect } from "@playwright/test";
test("buyer flow, demo catalog, gallery and honest contact state", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Источник");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Меню" }).click();
    await page
      .locator("#mobile-menu")
      .getByRole("link", { name: "Квартиры" })
      .click();
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  }
  await page.getByRole("button", { name: "2-комнатные", exact: true }).click();
  await expect(page.locator(".lot-card")).toHaveCount(3);
  await page.locator(".lot-button").first().click();
  await expect(page.locator("dialog")).toContainText(
    "Демонстрационная планировка",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "2-комнатные", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator(".gallery-item").first().click();
  await expect(page.locator("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Следующее изображение" }).click();
  await expect(page.locator("dialog h3")).toHaveText(
    "Тактильность пространства",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Архитектура", exact: true }).click();
  await expect(page.locator("#gallery")).toContainText("Материалы готовятся");
  await page.getByRole("button", { name: "Все материалы" }).click();
  await page.getByRole("button", { name: "Связаться с командой" }).click();
  await expect(page.locator("dialog")).toContainText(
    "Сейчас отправить обращение через сайт нельзя",
  );
  await page.getByRole("button", { name: "Закрыть окно" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `/tmp/izumi-${info.project.name}.png`,
    fullPage: true,
  });
  const response = await page.request.post("/api/enquiries", {
    data: { name: "No personal data" },
  });
  expect(response.status()).toBe(503);
});
test("missing images and long heading remain usable", async ({ page }) => {
  await page.route("**/_next/image?*", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".hero-visual .image-unavailable")).toBeVisible();
  await page.locator("h1").evaluate((el) => {
    el.textContent =
      "Пространство для вашей самой удивительной и неповторимой истории";
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
