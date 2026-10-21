export function assetPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
export type Status = "confirmed" | "pending" | "demo";
export type Media = {
  id: string;
  title: string;
  category: string;
  src: string;
  status: Status;
  alt: string;
};
export type Apartment = {
  id: string;
  rooms: number;
  area: number;
  floor: number;
  price: number | null;
  available: boolean;
  status: Status;
  plan: string | null;
};
export const preview = process.env.NEXT_PUBLIC_CONTENT_MODE === "preview";
export const media: Media[] = [
  {
    id: "light",
    title: "Свет и фактура",
    category: "Атмосфера",
    src: assetPath("/media/light.webp"),
    status: "demo",
    alt: "Солнечный свет и тени на деревянной стене — референс из брендбука",
  },
  {
    id: "interior",
    title: "Тактильность пространства",
    category: "Интерьеры",
    src: assetPath("/media/interior.webp"),
    status: "demo",
    alt: "Бордовое кресло в светлом интерьере — референс из брендбука",
  },
  {
    id: "garden",
    title: "Ближе к природе",
    category: "Окружение",
    src: assetPath("/media/garden.webp"),
    status: "demo",
    alt: "Прогулка по зелёному саду — референс из брендбука",
  },
];
// Explicit examples only: never imply actual inventory, prices, floors or availability.
export const apartments: Apartment[] = [0, 1, 2, 3].flatMap((rooms) =>
  [1, 2, 3].map((variant) => ({
    id: `demo-${rooms}-${variant}`,
    rooms,
    area: [26, 41, 64, 86][rooms] + (variant - 1) * 3.5,
    floor: 0,
    price: null,
    available: false,
    status: "demo" as const,
    plan: assetPath(`/media/plans/demo-${rooms}-${variant}.svg`),
  })),
);
export const videos: {
  id: string;
  title: string;
  src: string;
  poster: string;
  status: Status;
}[] = [];
export const reports: {
  id: string;
  date: string;
  title: string;
  images: Media[];
  status: Status;
}[] = [];
export const project = {
  name: "Изуми",
  descriptor: "Коллекционный дом",
  address: null,
  phone: null,
  email: null,
  developer: null,
  coordinates: null,
};
export function visibleMedia(items: Media[], isPreview: boolean) {
  return items.filter(
    (item) =>
      item.status === "confirmed" || (isPreview && item.status === "demo"),
  );
}
export function filterApartments(
  items: Apartment[],
  rooms: string,
  onlyAvailable: boolean,
  isPreview = false,
) {
  return items.filter(
    (a) =>
      (a.status === "confirmed" || (isPreview && a.status === "demo")) &&
      (rooms === "all" || a.rooms === Number(rooms)) &&
      (a.status === "demo" || !onlyAvailable || a.available),
  );
}
export const missing = [
  [
    "Архитектура",
    "Визуализации, фасады, материалы",
    "public/media/project/ + src/lib/content.ts",
  ],
  [
    "Расположение",
    "Адрес, координаты, существующая и планируемая инфраструктура",
    "project в src/lib/content.ts",
  ],
  [
    "Виды и двор",
    "Подтверждённые панорамы и проект благоустройства",
    "media в src/lib/content.ts",
  ],
  [
    "Общие пространства",
    "Рендеры холлов и спецификации отделки",
    "media в src/lib/content.ts",
  ],
  [
    "Квартиры",
    "Лоты, площади, цены, наличие, SVG-планировки",
    "apartments в src/lib/content.ts",
  ],
  [
    "Покупка",
    "Действующие программы и все ограничения",
    "раздел purchase / источник CMS",
  ],
  [
    "Медиа",
    "Видеоролики, постеры, фотоотчёты с датами",
    "videos и reports в src/lib/content.ts",
  ],
  [
    "Застройщик",
    "Реквизиты, проектная декларация и документы",
    "project / public/documents/",
  ],
  [
    "Контакты",
    "Телефон, адрес офиса, часы работы",
    "project в src/lib/content.ts",
  ],
  [
    "Обращения",
    "CRM endpoint, авторизация, политика обработки данных",
    "серверный адаптер src/lib/leads.ts",
  ],
  [
    "Права",
    "Разрешение на публикацию айдентики и фото",
    "проверить до публикации",
  ],
];

export const brandBenefits = [
  {
    title: "Вдохновение природой",
    text: "В основе «Изуми» — образ источника: чистота, свет и жизненная сила.",
    image: "garden",
    alt: "Сад — атмосферный референс из брендбука",
    target: "#about",
  },
  {
    title: "Внимание к деталям",
    text: "Тёплая палитра, выразительные фактуры и спокойная эстетика бренда.",
    image: "interior",
    alt: "Интерьер — атмосферный референс из брендбука",
    target: "#architecture",
  },
  {
    title: "Своя история дома",
    text: "Познакомьтесь с характером «Изуми» и примерьте разные сценарии пространства.",
    image: "light",
    alt: "Свет и тени — атмосферный референс из брендбука",
    target: "#apartments",
  },
];

const documentTitles = [
  ["declaration", "Проектная декларация"],
  ["permit", "Разрешение на строительство"],
  ["contract", "Проект договора участия в долевом строительстве"],
  ["expertise", "Экспертиза проектной документации"],
  ["notice", "Извещение о начале строительства"],
  ["land", "Схема планировочной организации земельного участка"],
  ["urban", "Градостроительный план"],
  ["audit", "Аудиторское заключение"],
];

export type ProjectDocument = {
  id: string;
  title: string;
  href: string | null;
  date: string | null;
  status: Status;
};
export const projectDocuments: ProjectDocument[] = documentTitles.map(
  ([id, title]) => ({ id, title, href: null, date: null, status: "pending" }),
);

export const collageLayers = [
  {
    id: "garden",
    src: "/media/garden.webp",
    title: "Природа",
    alt: "Прогулка в саду — фотостиль из брендбука, не территория ЖК",
    kind: "reference",
  },
  {
    id: "light",
    src: "/media/light.webp",
    title: "Свет",
    alt: "Солнечные тени — фотостиль из брендбука",
    kind: "reference",
  },
  {
    id: "forms",
    src: "/media/brand-semicircles.svg",
    title: "Ритм",
    alt: "Золотистые полукружия на бордовом фоне — фирменная графика из гайдбука",
    kind: "brand",
  },
  {
    id: "ink",
    src: "/media/brand-ink.webp",
    title: "Движение",
    alt: "Абстрактные бордовые мазки кисти — графика из гайдбука",
    kind: "brand",
  },
  {
    id: "scales",
    src: "/media/scales.webp",
    title: "Тактильность",
    alt: "Рельефный паттерн чешуи из гайдбука Изуми",
    kind: "brand",
  },
  {
    id: "interior",
    src: "/media/interior.webp",
    title: "Фактура",
    alt: "Бордовое кресло в светлом интерьере — фотостиль из брендбука, не интерьер ЖК",
    kind: "reference",
  },
] as const;
