"use client";
import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { useMotion } from "@/hooks/useMotion";
import {
  assetPath,
  apartments,
  filterApartments,
  media,
  reports,
  videos,
  visibleMedia,
  type Media,
  type Apartment,
} from "@/lib/content";
const nav = [
  ["О доме", "about"],
  ["Архитектура", "architecture"],
  ["Расположение", "location"],
  ["Квартиры", "apartments"],
  ["Галерея", "gallery"],
];
function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      className="image-unavailable"
      role="img"
      aria-label="Изображение временно недоступно"
    >
      <span>Материал временно недоступен</span>
    </div>
  ) : (
    <Image {...props} alt={props.alt} onError={() => setFailed(true)} />
  );
}
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}
function Pending({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pending">
      <span className="dot" />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
export default function Site({ preview }: { preview: boolean }) {
  useMotion();
  const [menu, setMenu] = useState(false),
    [category, setCategory] = useState("Все материалы"),
    [rooms, setRooms] = useState("1"),
    [available] = useState(true),
    [active, setActive] = useState<Media | null>(null),
    [selected, setSelected] = useState<Apartment | null>(null),
    [contact, setContact] = useState(false),
    [video, setVideo] = useState<(typeof videos)[number] | null>(null),
    [period, setPeriod] = useState("all");
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = visibleMedia(media, preview);
  const gallery = shown.filter(
    (m) => category === "Все материалы" || m.category === category,
  );
  const lots = filterApartments(apartments, rooms, available, preview);
  const isOpen = !!active || contact || !!selected || !!video;
  useEffect(() => {
    if (isOpen) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  function close() {
    setInquiryId(null);
    setActive(null);
    setSelected(null);
    setContact(false);
    setVideo(null);
  }
  function move(step: number) {
    if (!active) return;
    const index = shown.findIndex((m) => m.id === active.id);
    setActive(shown[(index + step + shown.length) % shown.length]);
  }
  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <a className="skip" href="#main">
        Перейти к содержимому
      </a>
      {preview && (
        <div className="preview-note">
          Предпросмотр концепции <span>·</span> Фотографии — референсы из
          брендбука, не изображения проекта
        </div>
      )}
      <header className="header">
        <a href="#" className="brand" aria-label="Изуми — на главную">
          <Image
            src={assetPath("/media/logo.svg")}
            alt="Изуми — коллекционный дом"
            width={152}
            height={73}
            priority
          />
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {nav.map(([name, id]) => (
            <a key={id} href={`#${id}`}>
              {name}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#apartments">
          Выбрать квартиру <Arrow />
        </a>
        <button
          className="menu-button"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Закрыть" : "Меню"} <span>{menu ? "−" : "+"}</span>
        </button>
      </header>
      {menu && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Мобильная навигация"
        >
          {[
            ...nav,
            ["Условия покупки", "purchase"],
            ["Контакты", "contacts"],
          ].map(([name, id]) => (
            <a key={id} onClick={() => setMenu(false)} href={`#${id}`}>
              {name}
              <Arrow />
            </a>
          ))}
        </nav>
      )}
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <Label>Коллекционный дом «Изуми»</Label>
            <h1 id="hero-title">
              Источник
              <br />
              <em>вдохновения.</em>
              <br />
              Пространство
              <br />
              вашей жизни.
            </h1>
            <div className="hero-bottom">
              <p>
                Дом начинается с ощущения.
                <br />
                Света. Тишины. Принадлежности.
              </p>
              <a
                className="round-link"
                href="#about"
                aria-label="Познакомиться с домом"
              >
                <span>↓</span>
              </a>
            </div>
          </div>
          <div className={`hero-visual ${preview ? "" : "brand-art"}`}>
            {preview && (
              <SafeImage
                src={assetPath("/media/light.webp")}
                alt={media[0].alt}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 51vw"
              />
            )}
            <div className="visual-caption">
              <span>
                {preview
                  ? "Свет. Фактура. Настроение."
                  : "Природа вдохновляет. Дом объединяет."}
              </span>
              <small>
                {preview
                  ? "Фотостиль бренда · референс"
                  : "Фирменная композиция"}
              </small>
            </div>
            <span className="hero-index">01 / ИЗУМИ</span>
          </div>
          <div className="hero-foot">
            <span>Вдохновение в природе. Мастерство в деталях.</span>
            <a href="#about">
              Открыть историю дома <span>↓</span>
            </a>
          </div>
        </section>
        <section id="about" className="section about">
          <div className="section-side">
            <Label>01 / Философия дома</Label>
            <div className="semicircles" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="about-main">
            <h2>
              Особенное —<br />в <em>естественном.</em>
            </h2>
            <div className="two-copy">
              <p>
                В переводе с японского «Изуми» означает водный источник. Символ
                чистоты, движения и жизненной силы. В русском звучании —
                изумление и способность удивлять.
              </p>
              <p>
                Два смысла складываются в одну идею: дом как источник
                вдохновения. Место, где начинается ваша собственная история.
              </p>
            </div>
            <a className="text-link" href="#architecture">
              Почувствовать характер <Arrow />
            </a>
          </div>
        </section>
        <section id="architecture" className="architecture section">
          <div className="section-heading">
            <div>
              <Label>02 / Характер пространства</Label>
              <h2>
                Мастерство
                <br />в деталях
              </h2>
            </div>
            <p>
              Тёплая палитра. Чистые линии.
              <br />
              Выразительные фактуры.
              <br />
              Визуальный язык «Изуми».
            </p>
          </div>
          <div className="architecture-grid">
            <div className="photo-tall">
              {preview ? (
                <SafeImage
                  src={assetPath("/media/interior.webp")}
                  alt={media[1].alt}
                  fill
                  sizes="(max-width:760px) 100vw, 55vw"
                />
              ) : (
                <div className="brand-art" />
              )}
              <span className="image-label">
                {preview
                  ? "Интерьерный референс из брендбука"
                  : "Палитра и ритм бренда"}
              </span>
            </div>
            <div className="architecture-copy">
              <Label>Архитектура будущего дома</Label>
              <h3>
                У каждого дома
                <br />
                свой почерк.
              </h3>
              <p>
                Архитектурный облик «Изуми» будет представлен в официальных
                визуализациях. Здесь появятся фасады, материалы и детали
                проекта.
              </p>
              <div className="material-swatches">
                <span />
                <span />
                <span />
              </div>
              <small>
                Фирменная палитра — настроение, а не спецификация отделки.
              </small>
              <a className="text-link" href="#gallery">
                Открыть галерею <Arrow />
              </a>
            </div>
          </div>
        </section>
        <section id="location" className="location section">
          <div>
            <Label>03 / Окружение</Label>
            <h2>
              Ваш ритм.
              <br />
              Ваше <em>место.</em>
            </h2>
            <p className="intro">
              У дома есть продолжение — город вокруг него.
            </p>
            <Pending title="Знакомство с районом впереди">
              Адрес и координаты уточняются. После подтверждения здесь появятся
              карта, маршруты и точки притяжения.
            </Pending>
          </div>
          <div
            className="location-art"
            aria-label="Абстрактная фирменная композиция, не карта района"
          >
            <span className="location-word">ИЗУМИ</span>
            <div className="orbit one" />
            <div className="orbit two" />
            <div className="orbit three" />
            <small>У каждого места — своя история</small>
          </div>
          <div className="infrastructure">
            {[
              "Повседневная жизнь",
              "Образование",
              "Спорт и отдых",
              "Сервисы рядом",
            ].map((t, i) => (
              <details key={t}>
                <summary>
                  <span>0{i + 1}</span>
                  {t}
                  <b>+</b>
                </summary>
                <p>
                  Список объектов и их статус будут опубликованы после
                  подтверждения расположения. Существующая и планируемая
                  инфраструктура будут указаны отдельно.
                </p>
              </details>
            ))}
          </div>
        </section>
        <section id="spaces" className="spaces section">
          <div className="section-heading">
            <div>
              <Label>04 / Сценарии жизни</Label>
              <h2>
                Быть ближе
                <br />к <em>своему.</em>
              </h2>
            </div>
            <p>
              Вдохновение — в простых моментах.
              <br />
              Во времени для себя.
              <br />В людях рядом.
            </p>
          </div>
          <div className="spaces-grid">
            <div className="garden">
              {preview ? (
                <SafeImage
                  src={assetPath("/media/garden.webp")}
                  alt={media[2].alt}
                  fill
                  sizes="(max-width:760px) 100vw, 50vw"
                />
              ) : (
                <div className="brand-art" />
              )}
              <span className="image-label">
                {preview
                  ? "Атмосферный референс · не территория ЖК"
                  : "Природа как вдохновение"}
              </span>
            </div>
            <div className="space-details">
              {[
                [
                  "Виды и окружение",
                  "Панорамы с указанием направления и точки съёмки появятся после получения материалов.",
                ],
                [
                  "Двор и благоустройство",
                  "Проект озеленения, площадок и мест отдыха готовится к представлению.",
                ],
                [
                  "Внутренние пространства",
                  "Входные группы, холлы и отделка общих зон будут показаны отдельно от квартир.",
                ],
              ].map(([title, text], i) => (
                <article key={title}>
                  <Label>0{i + 1}</Label>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="apartments" className="apartments section">
          <div className="section-heading">
            <div>
              <Label>05 / Выбор квартиры</Label>
              <h2>
                Место для
                <br />
                вашей истории
              </h2>
            </div>
            <p>
              Выбор начинается с того,
              <br />
              что важно именно вам.
            </p>
          </div>
          <div className="catalog-toolbar">
            <div
              className="catalog-tabs"
              role="group"
              aria-label="Тип квартиры"
            >
              {[
                ["1", "1-комнатные"],
                ["2", "2-комнатные"],
                ["0", "Студии"],
                ["3", "3-комнатные"],
              ].map(([value, title]) => (
                <button
                  key={value}
                  aria-pressed={rooms === value}
                  onClick={() => setRooms(value)}
                >
                  {title}
                </button>
              ))}
            </div>
            <span className="catalog-count" aria-live="polite">
              {lots.length} {preview ? "примера" : "варианта"}
            </span>
          </div>
          {preview && (
            <p className="catalog-notice">
              Демонстрационный каталог. Площади и схемы условные — это не
              квартиры ЖК и не предложения о продаже.
            </p>
          )}
          <div className="lot-results" aria-live="polite">
            {lots.length ? (
              lots.map((a) => (
                <article className="lot lot-card" key={a.id}>
                  <div className="lot-top">
                    <span>
                      {a.status === "demo"
                        ? "Пример планировки"
                        : `Квартира ${a.id}`}
                    </span>
                    <span>{String(lots.indexOf(a) + 1).padStart(2, "0")}</span>
                  </div>
                  <button
                    className="lot-plan"
                    onClick={() => setSelected(a)}
                    aria-label={`Открыть планировку ${a.id}`}
                  >
                    {a.plan ? (
                      <SafeImage
                        src={a.plan}
                        alt={`Условная планировка: ${a.rooms === 0 ? "студия" : `${a.rooms}-комнатная`}, ${a.area} м²`}
                        fill
                        sizes="(max-width: 600px) 90vw, (max-width: 1000px) 44vw, 28vw"
                      />
                    ) : (
                      <span>Планировка ожидается</span>
                    )}
                    <span className="plan-expand" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                  <div className="lot-title">
                    <h3>{a.rooms === 0 ? "Студия" : `${a.rooms}-комнатная`}</h3>
                    <span>
                      {a.area.toLocaleString("ru")} <small>м²</small>
                    </span>
                  </div>
                  <p className="lot-caption">
                    {a.status === "demo"
                      ? "Условная площадь · схема для знакомства"
                      : `${a.floor} этаж · ${a.price ? `${a.price.toLocaleString("ru")} ₽` : "Цена уточняется"}`}
                  </p>
                  <button className="lot-button" onClick={() => setSelected(a)}>
                    Смотреть планировку <Arrow />
                  </button>
                </article>
              ))
            ) : (
              <div className="catalog-empty">
                <span className="empty-number">∞</span>
                <div>
                  <h3>
                    {apartments.some((a) => a.status === "confirmed")
                      ? "Подходящих квартир не найдено"
                      : "Ваша квартира — впереди"}
                  </h3>
                  <p>
                    {apartments.some((a) => a.status === "confirmed")
                      ? "Попробуйте изменить параметры выбора."
                      : "Каталог готовится к открытию. Планировки, площади, цены и наличие появятся после подтверждения ассортимента."}
                  </p>
                  <button
                    className="text-link"
                    onClick={() => setContact(true)}
                  >
                    Как узнать о старте выбора <Arrow />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        <section id="purchase" className="purchase section">
          <Label>06 / Условия приобретения</Label>
          <h2>
            Первый шаг
            <br />к своему дому
          </h2>
          <div>
            <p>У каждого пути к дому — свои условия.</p>
            <Pending title="Информация о программах уточняется">
              Ипотека, способы оплаты и условия приобретения будут представлены
              после официального подтверждения. Ставки и платежи пока не
              опубликованы.
            </Pending>
            <a className="text-link" href="#contacts">
              Перейти к контактам <Arrow />
            </a>
          </div>
        </section>
        <section id="gallery" className="gallery section">
          <div className="section-heading">
            <div>
              <Label>07 / Галерея настроения</Label>
              <h2>
                Искусство
                <br />
                замечать
              </h2>
            </div>
            <p>
              {preview
                ? "Подборка из брендбука передаёт характер бренда. Это не визуализации проекта."
                : "Официальные визуализации появятся после подтверждения материалов."}
            </p>
          </div>
          <div className="tabs" role="group" aria-label="Категории галереи">
            {[
              "Все материалы",
              "Атмосфера",
              "Интерьеры",
              "Окружение",
              "Архитектура",
              "Двор",
            ].map((t) => (
              <button
                key={t}
                aria-pressed={category === t}
                onClick={() => setCategory(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="gallery-grid">
            {gallery.length ? (
              gallery.map((m, i) => (
                <button
                  key={m.id}
                  className="gallery-item"
                  onClick={() => setActive(m)}
                >
                  <div>
                    <SafeImage
                      src={m.src}
                      alt={m.alt}
                      fill
                      sizes="(max-width:760px) 90vw, 33vw"
                    />
                    <span className="zoom">↗</span>
                  </div>
                  <span>
                    <small>0{i + 1} / РЕФЕРЕНС</small>
                    {m.title}
                  </span>
                </button>
              ))
            ) : (
              <Pending title="Материалы готовятся">
                В этой категории пока нет подтверждённых изображений.
              </Pending>
            )}
          </div>
        </section>
        <section id="journal" className="journal section">
          <Label>08 / Жизнь проекта</Label>
          <div className="journal-grid">
            <article>
              <h2>В движении</h2>
              <p>Знакомство с домом — в кадре.</p>
              {videos.filter((v) => v.status === "confirmed").length ? (
                videos
                  .filter((v) => v.status === "confirmed")
                  .map((v) => (
                    <button key={v.id} onClick={() => setVideo(v)}>
                      Смотреть «{v.title}» ▷
                    </button>
                  ))
              ) : (
                <Pending title="Видео появится здесь">
                  Видеоматериалы проекта пока не опубликованы.
                </Pending>
              )}
            </article>
            <article>
              <h2>Как растёт дом</h2>
              <label className="period">
                Период отчёта
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="all">Все периоды</option>
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.date}
                    </option>
                  ))}
                </select>
              </label>
              {reports.filter(
                (r) =>
                  r.status === "confirmed" &&
                  (period === "all" || period === r.id),
              ).length ? (
                reports
                  .filter(
                    (r) =>
                      r.status === "confirmed" &&
                      (period === "all" || period === r.id),
                  )
                  .map((r) => (
                    <div key={r.id}>
                      <h3>{r.title}</h3>
                      {r.images.map((m) => (
                        <button key={m.id} onClick={() => setActive(m)}>
                          {m.title}
                        </button>
                      ))}
                    </div>
                  ))
              ) : (
                <Pending title="Фотоотчёты ожидаются">
                  Здесь будут только реальные фотографии строительства с датами
                  съёмки.
                </Pending>
              )}
            </article>
          </div>
        </section>
        <section id="developer" className="developer section">
          <Label>09 / Ответственность и открытость</Label>
          <div>
            <h2>
              За домом — люди.
              <br />
              За словами — документы.
            </h2>
            <div className="two-copy">
              <Pending title="О застройщике">
                Юридическое наименование, опыт и реквизиты будут добавлены после
                проверки.
              </Pending>
              <Pending title="Документы проекта">
                Проектная декларация, разрешения и обязательные раскрытия
                ожидаются.
              </Pending>
            </div>
          </div>
        </section>
        <section id="contacts" className="contacts section">
          <div>
            <Label>10 / Продолжим знакомство</Label>
            <h2>
              Ваша история
              <br />
              начинается
              <br />
              <em>с интереса.</em>
            </h2>
          </div>
          <div className="contact-copy">
            <p>
              Узнать больше о доме.
              <br />
              Задать важный вопрос.
              <br />
              Сделать следующий шаг.
            </p>
            <Pending title="Контакты отдела продаж уточняются">
              Проверенные телефон, адрес офиса и часы работы появятся здесь.
              Приём заявок ещё не открыт.
            </Pending>
            <button className="button light" onClick={() => setContact(true)}>
              Связаться с командой <Arrow />
            </button>
          </div>
        </section>
      </main>
      <footer>
        <a href="#" className="brand">
          <Image
            src={assetPath("/media/logo.svg")}
            alt="Изуми — коллекционный дом"
            width={152}
            height={73}
          />
        </a>
        <p>
          Вдохновение в природе.
          <br />
          Мастерство в деталях.
        </p>
        <div>
          <Link href="/privacy">Обработка персональных данных</Link>
          <small>Концепция сайта · не является публичной офертой</small>
        </div>
        <a href="#" aria-label="В начало страницы" className="back-top">
          ↑
        </a>
      </footer>
      <dialog
        ref={dialog}
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-label={
          active?.title || (selected ? "Просмотр квартиры" : "Связь с командой")
        }
      >
        <button
          className="dialog-close"
          onClick={close}
          aria-label="Закрыть окно"
        >
          ×
        </button>
        {active && (
          <div className="lightbox">
            <div className="lightbox-image" key={active.id}>
              <SafeImage src={active.src} alt={active.alt} fill sizes="90vw" />
            </div>
            <div className="lightbox-caption">
              <button
                onClick={() => move(-1)}
                aria-label="Предыдущее изображение"
              >
                ←
              </button>
              <div>
                <h3>{active.title}</h3>
                <p>
                  {active.status === "demo"
                    ? "Референс из брендбука · не изображение ЖК"
                    : "Материал проекта"}
                </p>
              </div>
              <button
                onClick={() => move(1)}
                aria-label="Следующее изображение"
              >
                →
              </button>
            </div>
          </div>
        )}
        {contact && (
          <div className="contact-dialog">
            <Label>Остаёмся на связи</Label>
            {inquiryId && (
              <p>
                Ваш выбор:{" "}
                {inquiryId.startsWith("demo-")
                  ? "демонстрационная схема"
                  : "квартира"}{" "}
                {inquiryId}. Контекст сохранён до закрытия окна.
              </p>
            )}
            <h2>
              Скоро познакомимся
              <br />
              ближе.
            </h2>
            <p>
              Каналы связи с командой «Изуми» готовятся к открытию. Сейчас
              отправить обращение через сайт нельзя.
            </p>
            <p>
              Мы не собираем ваши персональные данные до подключения защищённого
              приёма заявок и публикации юридических документов.
            </p>
            <button className="button" onClick={close}>
              Продолжить знакомство <Arrow />
            </button>
          </div>
        )}
        {selected && (
          <div className="contact-dialog">
            <Label>
              {selected.status === "demo"
                ? "Демонстрационная планировка"
                : `Квартира ${selected.id}`}
            </Label>
            <h2>
              {selected.rooms === 0 ? "Студия" : `${selected.rooms}-комнатная`}{" "}
              · {selected.area.toLocaleString("ru")} м²
            </h2>
            <p>
              {selected.status === "demo"
                ? "Условная схема и площадь. Не относится к квартирам ЖК, не является предложением о продаже."
                : `${selected.floor} этаж`}
            </p>
            {selected.plan ? (
              <div className="plan">
                <SafeImage
                  src={selected.plan}
                  alt={`Планировка квартиры ${selected.id}`}
                  fill
                  sizes="80vw"
                />
              </div>
            ) : (
              <Pending title="Планировка ожидается">
                Изображение будет доступно после публикации.
              </Pending>
            )}
            <p>
              {selected.status === "demo"
                ? "Иллюстрация помогает представить организацию пространства. Реальные планировки и условия будут опубликованы отдельно."
                : selected.available
                  ? "Условия и наличие требуют подтверждения у отдела продаж."
                  : "Этот лот недоступен для выбора."}
            </p>
            <button
              className="button"
              onClick={() => {
                setInquiryId(selected.id);
                setContact(true);
                setSelected(null);
              }}
            >
              Узнать о связи с командой <Arrow />
            </button>
          </div>
        )}
        {video && (
          <div className="contact-dialog">
            <h2>{video.title}</h2>
            <video
              controls
              autoPlay={false}
              poster={video.poster}
              src={video.src}
              onError={(e) => {
                e.currentTarget.insertAdjacentText(
                  "afterend",
                  "Не удалось загрузить видео. Попробуйте позже.",
                );
              }}
            />
          </div>
        )}
      </dialog>
    </>
  );
}
