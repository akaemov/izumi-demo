# Изуми — коллекционный дом

Локальная реализация сайта на Next.js 15, React 19, TypeScript. Фирменная палитра, локальные Tenor Sans / Golos Text, исходный векторный логотип из брендбука.

## Запуск

Node.js 22+ (проверено на 24). Из корня репозитория:

```bash
npm ci --cache /workspace/.npm-cache
npm run dev
```

Сервер использует порт 3000. По умолчанию публичный режим скрывает демонстрационные изображения. Для просмотра фотостиля задайте `NEXT_PUBLIC_CONTENT_MODE=preview` в локальном `.env.local`; для публичной сборки — `NEXT_PUBLIC_CONTENT_MODE=public npm run build`. Режим встраивается во время сборки.

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Все разделы реализованы структурно. Для наглядности добавлены 12 явно помеченных демонстрационных схем квартир с условными площадями. Это не реальный ассортимент; цены, адреса и сроки не выдуманы. Демонстрационные карточки видны только в preview. Фото показываются только как обозначенные референсы в preview. CRM не подключена, приём персональных данных отключён; endpoint возвращает 503. Код опубликован в akaemov/izumi-demo, статическая сборка выгружена в gh-pages. Запись в CRM отключена.

Наполнение и ограничения: [docs/CONTENT.md](docs/CONTENT.md). Источник контента: `src/lib/content.ts`. Требуется завершить реестр данных перед коммерческим запуском.

## GitHub Pages

```bash
npm run build:pages
npm run deploy:pages
```

`build:pages` создаёт автономную статическую версию в `out/` с базовым адресом `/izumi-demo/`. Сборка выполняется в игнорируемом `.pages-build/`, серверный endpoint исключён только из статического экспорта. Preview-фотографии помечены как референсы, приём данных отключён. `deploy:pages` публикует экспорт в `gh-pages` без force push и без смены текущей ветки.

Источник публикации GitHub Pages: **Deploy from a branch → gh-pages → / (root)**. Ожидаемый адрес: https://akaemov.github.io/izumi-demo/. Отправка ветки сама по себе не подтверждает включение Pages и завершение публикации.

## Анимации

`src/hooks/useMotion.ts` — однократное раскрытие секций и первого экрана. CSS в конце `globals.css` — переходы меню, модальных окон, галереи и индикатор чтения. Учитывается `prefers-reduced-motion`, включая изменение настройки на открытой странице. Контент не скрывается до появления и остаётся доступным без JS. Прокрутка нативная.

Проверка экспортированной версии: запустите статический сервер с `out/`, размещённым под `/izumi-demo/`, и выполните `PAGES_TEST_URL=http://127.0.0.1:3011/izumi-demo/ node tests/pages-motion.mjs` (системный Chromium либо `CHROMIUM_PATH`).

Презентация концепции скачивается напрямую из хедера и отдельного CTA; файл `public/documents/izumi-presentation.pdf`. Обновление: `node scripts/generate-presentation.mjs`. Документация и плитка — `src/components/MarketingSections.tsx`, их тексты — `src/lib/content.ts`. Ипотечный CTA демонстрационный, отправка и поля отключены по решению пользователя. Браузерная проверка новых блоков: `PAGES_TEST_URL=... node tests/pages-marketing.mjs`.

Параллакс-коллаж: `src/components/ParallaxCollage.tsx`, материалы `collageLayers` в `src/lib/content.ts`. Нативные CSS view timelines, обычная вертикальная прокрутка, сниженная амплитуда на телефоне и отключение при reduced-motion. Без поддержки API остаётся статический коллаж. Блик на фотографиях удалён. Проверка: `PAGES_TEST_URL=... node tests/pages-parallax.mjs`.
