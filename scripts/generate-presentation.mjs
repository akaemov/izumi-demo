import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { chromium } from "playwright";
const root = resolve("public");
const html = `<!doctype html><html lang="ru"><meta charset="utf-8"><title>Изуми — презентация концепции</title><style>
@font-face{font-family:Tenor;src:url('/fonts/TenorSans-Regular.ttf')}@font-face{font-family:Golos;src:url('/fonts/GolosText.ttf')}@page{size:A4 landscape;margin:0}*{box-sizing:border-box}body{margin:0;color:#401f28;font-family:Golos;background:#eee9df}.slide{position:relative;width:297mm;height:210mm;padding:18mm;overflow:hidden;break-after:page}.slide:last-child{break-after:auto}h1,h2,h3{font-family:Tenor;font-weight:400;line-height:1.08;letter-spacing:-.04em;margin:0}h1{font-size:61px}h2{font-size:57px}h3{font-size:29px}p{font-size:15px;line-height:1.8}.label{font-size:10px;text-transform:uppercase;letter-spacing:.12em;margin-bottom:27px}.logo{width:165px;height:auto;margin-bottom:27px}.cover{display:grid;grid-template-columns:1.2fr 1fr;gap:48px}.cover-photo{height:165mm;width:100%;object-fit:cover;border-radius:10px}.caption{font-size:10px;line-height:1.6}.footer{position:absolute;bottom:10mm;left:18mm;right:18mm;display:flex;justify-content:space-between;font-size:9px}.gold{color:#9b6c42}.intro{max-width:620px}.cols{display:grid;grid-template-columns:1fr 1fr;gap:45px;margin-top:25px}.scales{position:absolute;width:70%;height:100%;right:0;top:0;object-fit:cover;opacity:.15;z-index:-1}.dark{background:#401f28;color:#eee9df}.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:25px;margin-top:35px}.plan{padding:18px;background:#eee9df;color:#401f28;border-radius:10px}.plan img{width:100%;height:220px;object-fit:contain}.plan p{font-size:12px}.note{font-size:11px;line-height:1.8;margin-top:20px}.tags{display:flex;gap:12px;margin-top:25px}.tags span{padding:12px 18px;border:1px solid #b88955;border-radius:10px;font-size:12px}.closing{display:grid;grid-template-columns:1fr 1fr;gap:65px}.closing img{width:100%;height:140mm;object-fit:cover;border-radius:10px}a{color:inherit}.small{font-size:12px}
</style><body>
<section class="slide cover"><div><img class="logo" src="/media/logo.svg" alt="Изуми"><div class="label">Коллекционный дом / Концепция</div><h1>Источник<br><span class="gold">вдохновения.</span><br>Пространство<br>вашей жизни.</h1><p>Знакомство с идеей и визуальным языком «Изуми».</p><p class="caption">Предварительная презентация концепции сайта.<br>Не является проектной документацией и предложением о продаже.</p></div><div><img class="cover-photo" src="/media/light.webp" alt="Фотостиль бренда"><p class="caption">Фотостиль из брендбука · не изображение проекта</p></div><div class="footer"><span>Изуми / Источник вдохновения</span><span>01</span></div></section>
<section class="slide"><img class="scales" src="/media/scales.webp" alt=""><div class="label">Философия дома</div><h2>Особенное —<br><span class="gold">в естественном.</span></h2><div class="cols"><p>В переводе с японского «Изуми» означает водный источник — символ чистоты, движения и жизненной силы. В русском звучании — изумление и способность удивлять.</p><p>Два смысла складываются в одну идею: дом как источник вдохновения. Тёплая палитра, спокойная типографика и выразительные фактуры формируют характер бренда.</p></div><div class="tags"><span>Вдохновение природой</span><span>Внимание к деталям</span><span>Индивидуальность</span></div><p class="note">Это принципы айдентики. Архитектура, расположение, инфраструктура и характеристики дома ожидают официального подтверждения.</p><div class="footer"><span>Изуми / Концепция бренда</span><span>02</span></div></section>
<section class="slide dark"><div class="label">Примеры организации пространства</div><h2>Место для<br>вашей истории</h2><div class="plans">${[0, 1, 2].map((n) => `<div class="plan"><img src="/media/plans/demo-${n}-1.svg" alt="Условная схема"><h3>${n === 0 ? "Студия" : `${n}-комнатная`}</h3><p>Иллюстративная планировка</p></div>`).join("")}</div><p class="note">Схемы демонстрационные, не относятся к реальным квартирам ЖК. Площади и ассортимент в каталоге условные. Цены, наличие и условия приобретения не опубликованы.</p><div class="footer"><span>Изуми / Не является предложением о продаже</span><span>03</span></div></section>
<section class="slide closing"><div><div class="label">Продолжим знакомство</div><h2>У каждой<br>истории —<br><span class="gold">свой дом.</span></h2><p>Познакомьтесь с визуальной концепцией и демонстрационным каталогом на сайте.</p><p class="small"><a href="https://akaemov.github.io/izumi-demo/">akaemov.github.io/izumi-demo</a></p><p class="note">Адрес, сроки строительства, реквизиты застройщика, официальные документы и контакты отдела продаж пока не подтверждены. Участие в семейной ипотеке и банковские условия уточняются. Приём заявок не открыт.</p></div><div><img src="/media/interior.webp" alt="Интерьерный референс"><p class="caption">Фотостиль бренда · не интерьер ЖК</p></div><div class="footer"><span>Изуми / Предварительная концепция</span><span>04</span></div></section>
</body></html>`;
const server = createServer(async (req, res) => {
  try {
    if (req.url === "/") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(html);
      return;
    }
    const file = resolve(
      root,
      "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
    if (!file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const mime = {
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".ttf": "font/ttf",
    };
    res.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
  });
  await writeFile(resolve(root, "documents/izumi-presentation.pdf"), pdf);
  console.log(`Generated concept presentation: ${pdf.length} bytes`);
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
