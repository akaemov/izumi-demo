import Image from "next/image";
import { assetPath, collageLayers } from "@/lib/content";

/** Native scroll-linked layers; the document owns scrolling, never this section. */
export function ParallaxCollage({ preview }: { preview: boolean }) {
  const layers = collageLayers.filter(
    (layer) => preview || layer.kind === "brand",
  );
  return (
    <section
      id="inspiration"
      className="parallax-collage"
      aria-labelledby="collage-title"
    >
      <span className="eyebrow collage-label">
        Изуми / Вдохновение в движении
      </span>
      <div className="collage-heading">
        <h2 id="collage-title">
          Природа.
          <br />
          Фактура.
          <br />
          <em>Вдохновение.</em>
        </h2>
        <p>
          Разные впечатления.
          <br />
          Одно ощущение — быть на своём месте.
        </p>
      </div>
      <div className="collage-layers">
        {layers.map((layer) => (
          <figure
            key={layer.id}
            className={`parallax-layer layer-${layer.id}`}
            data-kind={layer.kind}
          >
            <Image
              src={assetPath(layer.src)}
              alt={layer.alt}
              fill
              sizes="(max-width:760px) 45vw, 30vw"
            />
            <figcaption>
              <span>{layer.title}</span>
              <small>
                {layer.kind === "reference"
                  ? "Фотостиль бренда"
                  : "Фирменная графика"}
              </small>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="collage-note">
        {preview
          ? "Коллаж из фотостиля и графики брендбука. Не визуализации ЖК."
          : "Фирменная графика из гайдбука «Изуми»."}
      </p>
    </section>
  );
}
