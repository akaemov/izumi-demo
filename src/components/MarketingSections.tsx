import Image from "next/image";
import Link from "next/link";
import { assetPath, brandBenefits, projectDocuments } from "@/lib/content";

export const presentationPath = "/documents/izumi-presentation.pdf";

export function PresentationCTA() {
  return (
    <section
      id="presentation"
      className="presentation-cta section"
      aria-labelledby="presentation-title"
    >
      <div className="cta-copy">
        <span className="eyebrow">Изуми / Знакомство с концепцией</span>
        <h2 id="presentation-title">
          Заберите
          <br />
          вдохновение
          <br />
          <em>с собой.</em>
        </h2>
        <p>
          Идея коллекционного дома, его визуальный язык и примеры планировок — в
          одной презентации.
        </p>
        <a
          className="button"
          href={assetPath(presentationPath)}
          download="Изуми — презентация концепции.pdf"
        >
          Скачать презентацию <span aria-hidden="true">↓</span>
        </a>
        <small>
          PDF · концепция сайта. Не является проектной документацией.
        </small>
      </div>
      <a
        className="booklet-scene"
        href={assetPath(presentationPath)}
        download="Изуми — презентация концепции.pdf"
        aria-label="Скачать PDF с концепцией Изуми"
      >
        <div className="booklet">
          <span className="booklet-spine" />
          <Image
            src={assetPath("/media/logo.svg")}
            width={210}
            height={100}
            alt="Изуми — коллекционный дом"
          />
          <span className="booklet-caption">
            Источник
            <br />
            вдохновения
          </span>
          <span className="booklet-footer">Коллекционный дом / Концепция</span>
        </div>
        <span className="booklet-hint">
          Листайте в своём ритме <span aria-hidden="true">↗</span>
        </span>
      </a>
    </section>
  );
}

export function Benefits({ preview }: { preview: boolean }) {
  return (
    <section
      id="benefits"
      className="benefits section"
      aria-labelledby="benefits-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">Изуми / Ценности коллекционного дома</span>
          <h2 id="benefits-title">
            Важное складывается
            <br />
            <em>из простых вещей.</em>
          </h2>
        </div>
        <p>
          Природа. Эстетика. Индивидуальность.
          <br />
          Три грани одной идеи.
        </p>
      </div>
      <div className="benefit-grid">
        {brandBenefits.map((b, i) => (
          <article className="benefit-tile" key={b.title}>
            <a
              className="benefit-photo glass-photo"
              href={b.target}
              aria-label={`Узнать больше: ${b.title}`}
            >
              {preview ? (
                <Image
                  src={assetPath(`/media/${b.image}.webp`)}
                  alt={b.alt}
                  fill
                  sizes="(max-width:760px) 90vw, 29vw"
                />
              ) : (
                <div className="brand-art" />
              )}
              <span className="benefit-number">0{i + 1}</span>
              {preview && <small>Фотостиль бренда · референс</small>}
            </a>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
            <a className="text-link" href={b.target}>
              Подробнее <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
      <p className="benefit-disclaimer">
        Ценности бренда. Конкретные характеристики дома будут представлены после
        подтверждения проекта.
      </p>
    </section>
  );
}

export function FamilyMortgageCTA() {
  return (
    <section
      id="family-mortgage"
      className="mortgage-cta section"
      aria-labelledby="mortgage-title"
    >
      <div className="mortgage-copy">
        <span className="eyebrow">Изуми / Следующий шаг для вашей семьи</span>
        <h2 id="mortgage-title">
          Больше места
          <br />
          для{" "}
          <em>
            семейных
            <br />
            историй.
          </em>
        </h2>
        <p>
          Оставьте заявку на рассмотрение семейной ипотеки, когда откроется
          приём обращений.
        </p>
        <form aria-describedby="mortgage-status">
          <fieldset disabled>
            <legend className="sr-only">
              Демонстрационная форма заявки на семейную ипотеку
            </legend>
            <div className="form-row">
              <label>
                Ваше имя
                <input
                  name="name"
                  type="text"
                  placeholder="Как к вам обращаться"
                  autoComplete="off"
                />
              </label>
              <label>
                Телефон
                <input
                  name="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  autoComplete="off"
                />
              </label>
            </div>
            <label className="consent">
              <input type="checkbox" />Я ознакомлен с информацией об обработке
              персональных данных
            </label>
            <button className="button" type="button" disabled>
              Оставить заявку <span aria-hidden="true">↗</span>
            </button>
          </fieldset>
          <p id="mortgage-status" role="status">
            Демонстрационная форма. Приём заявок пока не открыт, данные не
            собираются и не отправляются.
          </p>
          <Link href="/privacy" className="privacy-link">
            Обработка персональных данных
          </Link>
        </form>
        <small>
          Участие проекта в программе, требования к заёмщикам, ставки и условия
          ещё не подтверждены. Одобрение не гарантируется.
        </small>
      </div>
      <div className="mortgage-art" aria-hidden="true">
        <div className="family-arches">
          <i />
          <i />
          <i />
        </div>
        <span>
          Семья.
          <br />
          Вдохновение.
          <br />
          Свой дом.
        </span>
        <small>Каждая история — особенная</small>
      </div>
    </section>
  );
}

export function Documents() {
  return (
    <section
      id="documents"
      className="documents section"
      aria-labelledby="documents-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">Изуми / Открытая информация</span>
          <h2 id="documents-title">Документация</h2>
        </div>
      </div>
      <p className="documents-intro">
        Важные сведения о проекте — в одном месте. Проверенные документы и
        ссылка на официальную страницу раскрытия информации появятся после
        публикации.
      </p>
      <div className="document-grid">
        {projectDocuments.map(({ id, title }) => (
          <details key={id} className="document-item">
            <summary>
              <div>
                <h3>{title}</h3>
                <span>Готовится к публикации</span>
              </div>
              <b aria-hidden="true">↗</b>
            </summary>
            <p>
              Официальный документ пока не предоставлен. После проверки здесь
              будут доступны его дата и файл для скачивания.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
