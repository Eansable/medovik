export interface Medovik {
  id: number;
  name: string;
  price: number;
  prices: Record<number, number>;
  image: string;
  color: string;
  maxWeight: number;
  minWeight: number;
  isLight?: boolean;
}

const medoviki: Medovik[] = [
  {
    id: 10,
    name: "Классический",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/classic.jpg",
    color: "#AF7330",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 5,
    name: "Малиновый",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/raspberry.webp",
    color: "#ED6698",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 11,
    name: "Лимонный",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/lemon.jpg",
    color: "#DBD228",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 3,
    name: "Черничный",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/blueberry.webp",
    color: "#3F4974",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 1,
    name: "Кофейный",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/coffee.webp",
    color: "#453628",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 12,
    name: "Солёная карамель",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/caramel.webp",
    color: "#A85101",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 6,
    name: "Двойная вишня",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/cherry.webp",
    color: "#7F092E",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 4,
    name: "Рафаэлло",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/coconut.webp",
    color: "#F6F2DA",
    isLight: true,
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 13,
    name: "Нутелла",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/nutella.jpg",
    color: "#572912",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 9,
    name: "Наполеон",
    price: 50,
    prices: {
      1: 50,
      1.5: 71,
      2: 87,
      2.5: 113,
      3: 139,
    },
    image: "./img/mobile/cakes/napoleon.webp",
    color: "#DE9F65",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 8,
    name: "Наполеон солёная карамель",
    price: 50,
    prices: {
      1: 55,
      1.5: 77,
      2: 93,
      2.5: 122,
      3: 151,
    },
    image: "./img/mobile/cakes/salt-caramel.webp",
    color: "#9A4A00",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 7,
    name: "Чизкейк",
    price: 50,
    prices: {
      1: 69,
      1.5: 102,
    },
    image: "./img/mobile/cakes/cheese.webp",
    color: "#E7BF7B",
    maxWeight: 1.5,
    minWeight: 1,
  },
];

export function getAll(): Medovik[] {
  return medoviki;
}

export function getById(id: number): Medovik | undefined {
  return medoviki.find((m) => m.id === id);
}

export function updateById(id: number, data: Partial<Omit<Medovik, 'id'>>): Medovik | null {
  const index = medoviki.findIndex((m) => m.id === id);
  if (index === -1) return null;

  medoviki[index] = { ...medoviki[index], ...data };
  return medoviki[index];
}
