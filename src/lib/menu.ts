export type MenuCategory = "classic" | "calzone-focaccia" | "innovative" | "specials";

export interface MenuCategoryInfo {
  id: MenuCategory;
  label: string;
  blurb: string;
}

export interface MenuItem {
  id: string;
  number: number;
  name: string;
  style?: string;
  category: MenuCategory;
  description: string;
  price: number; // GBP — placeholder prices, edit freely
  image?: string;
}

export const MENU_CATEGORIES: MenuCategoryInfo[] = [
  {
    id: "classic",
    label: "Classic Pizzas",
    blurb: "Our wood-fired Neapolitan classics on a traditional tomato or bianca base.",
  },
  {
    id: "calzone-focaccia",
    label: "Calzone & Focaccia",
    blurb: "Folded and stuffed specialties.",
  },
  {
    id: "innovative",
    label: "Innovative Pizzas",
    blurb: "Modern and rustic twists on Italian tradition.",
  },
  {
    id: "specials",
    label: "Limited Time Only",
    blurb: "Hand-picked by the pizzaiolo — available while they last.",
  },
];

// Seed/fallback data only — the live source of truth is Mongo via
// src/lib/db/menuConfig.ts. This array is used to seed the database once and
// as an offline fallback if Mongo is unconfigured or unreachable.
export const MENU: MenuItem[] = [
  {
    id: "margherita",
    number: 1,
    name: "Margherita",
    style: "Traditional Base",
    category: "classic",
    price: 9.5,
    image: "https://data.thefeedfeed.com/static/2021/04/13/16183401006075e904223ae.jpg",
    description: "Tomato, mozzarella, basil, olive oil.",
  },
  {
    id: "bufalina",
    number: 2,
    name: "Bufalina",
    style: "Margherita con Bufala",
    category: "classic",
    price: 13.0,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTS95WYSPFblZrzxmXUcNGNROGg7uib_xsYLYqWMFhRg&s=10",
    description: "Tomato, buffalo mozzarella, basil, olive oil.",
  },
  {
    id: "marinara",
    number: 3,
    name: "Marinara",
    style: "Historic Naples — No Cheese",
    category: "classic",
    price: 11.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbF4nIbd7R8H5Ugiak8LK3jFHSZ3_ULRo6lC7wE3Ru6Q&s=10",
    description: "Tomato, garlic, oregano, basil, olive oil. No cheese.",
  },
  {
    id: "cosacca",
    number: 4,
    name: "Cosacca",
    style: "Historic Naples — 1844",
    category: "classic",
    price: 11.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ76JLGq7RrjabxAASmGaLI7E9ZYoLUAyTVG41MbMh-KA&s=10",
    description: "Tomato, basil, pecorino, olive oil.",
  },
  {
    id: "napoli",
    number: 5,
    name: "Napolitan",
    category: "classic",
    price: 12.5,
    image: "https://italianfoodforever.com/wp-content/uploads/2015/01/napolipizza4.jpg",
    description: "Tomato, mozzarella, anchovies, olives, capers, garlic, oregano.",
  },
  {
    id: "diavola",
    number: 6,
    name: "Diavola",
    style: "Margherita con Salame Piccante",
    category: "classic",
    price: 13.0,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHd4NQF9AoDHLYIDv3yGqhdZq9HBRfQ8WuGZUuR5s9Vw&s=10",
    description: "Tomato, mozzarella, spicy salami, parmesan, basil, olive oil.",
  },
  {
    id: "seven-stars-parma",
    number: 7,
    name: "Parma",
    style: "Prosciutto & Parmesan Classic",
    category: "classic",
    price: 14.5,
    image: "https://theuppercrustpizzeria.co.uk/cdn/shop/products/Parma.jpg?v=1639743529",
    description: "Tomato, parmesan, buffalo mozzarella, Parma ham, rocket.",
  },
  {
    id: "parma-bianca",
    number: 8,
    name: "Parma Bianca",
    style: "White Pizza — Parma Ham & Rocket",
    category: "classic",
    price: 14.0,
    image: "https://ginopizzaovens.com/cdn/shop/articles/gino-pizza-fior-latte-parma-ham-rocket-parmesan.jpg?v=1683056519&width=1500",
    description: "White base, mozzarella, Parma ham, rocket, parmesan, olive oil.",
  },
  {
    id: "prosciutto-e-funghi",
    number: 9,
    name: "Prosciutto e Funghi",
    style: "Classic Neapolitan — Ham & Mushroom",
    category: "classic",
    price: 13.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAP5MdbljTAVL7meY_XhtUQ1HIdHrEIdsxxZk_dqVevQ&s=10",
    description: "Tomato, mozzarella, ham, mushrooms, parmesan, basil, olive oil.",
  },
  {
    id: "capricciosa",
    number: 10,
    name: "Capricciosa",
    style: "Neapolitan Big Four — Ham, Salami, Mushroom & Artichoke",
    category: "classic",
    price: 14.0,
    image: "https://positano.lv/wp-content/uploads/2021/12/Capricciosa-1.png",
    description: "Tomato, mozzarella, ham, salami, mushrooms, artichoke, basil.",
  },
  {
    id: "quattro-formaggi",
    number: 11,
    name: "Quattro Formaggi",
    style: "Classic Neapolitan — Pizza Bianca",
    category: "classic",
    price: 14.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQib4tBZbanA4_Cd1takByQB8S_KSC4VKJpP0-Tey91vQ&s=10",
    description: "White base, mozzarella, ricotta, gorgonzola, parmesan, olive oil.",
  },
  {
    id: "ortolana",
    number: 12,
    name: "Ortolana",
    style: "Gourmet Neapolitan — Presìdi Slow Food Campania Vegetables",
    category: "classic",
    price: 14.5,
    image: "/pizzas/ortolana.png",
    description: "Pacchetelle tomato, Fior di Latte, grilled eggplant & zucchini, roasted Pappacella peppers, artichokes, Parmigiano.",
  },
  {
    id: "ripieno-calzone",
    number: 13,
    name: "Ripieno (Calzone)",
    style: "Folded Neapolitan Calzone — Ricotta, Fior di Latte & Salame",
    category: "calzone-focaccia",
    price: 13.0,
    image: "https://media-cdn.tripadvisor.com/media/photo-s/11/91/05/29/calzone-al-forno-ripieno.jpg",
    description: "Folded calzone: ricotta, mozzarella, salami, tomato, parmesan, basil.",
  },
  {
    id: "double-pepperoni-hot-honey",
    number: 14,
    name: "Double Pepperoni & Hot Honey",
    style: "Modern Crowd-Pleaser",
    category: "innovative",
    price: 13.95,
    image: "https://coolfooddude.com/wp-content/uploads/2020/12/Double-Pepperoni-and-honey-PIzza.jpg",
    description: "Tomato, mozzarella, provolone, double pepperoni, salami, hot honey.",
  },
  {
    id: "chorizo",
    number: 15,
    name: "Chorizo",
    style: "Spanish-Italian Crossover",
    category: "innovative",
    price: 13.5,
    image: "https://image.eatencdn.com/image/1f55d2e1-e560-4a16-94a0-dcc00041e6cb/small/image.jpg",
    description: "Tomato, mozzarella, chorizo, gorgonzola, olive oil.",
  },
  {
    id: "bufala-e-iberico",
    number: 16,
    name: "Bufala e Iberico",
    style: "Pure White Premium",
    category: "innovative",
    price: 15.0,
    image: "https://theuppercrustpizzeria.co.uk/cdn/shop/products/Parma.jpg?v=1639743529",
    description: "Tomato, buffalo mozzarella, jamón ibérico, olive oil.",
  },
  {
    id: "tettoia-four-cheese-truffle",
    number: 17,
    name: "Tettoia — Four Cheese & Truffle",
    style: "Gourmet White Pizza",
    category: "innovative",
    price: 15.5,
    image: "https://rs-menus-api.roocdn.com/images/2018fd22-bd00-4726-bae8-5c9cc89ce052/image.jpeg",
    description: "Mozzarella, gorgonzola, parmesan, buffalo mozzarella, truffle, chilli.",
  },
  {
    id: "cacio-e-pepe",
    number: 18,
    name: "Cacio e Pepe",
    style: "Roman Pasta-Inspired — Pecorino & Black Pepper",
    category: "innovative",
    price: 14.0,
    image: "https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2018/07/02/bb7c436164c0454fb27f55eadbcb9cde_Cacio_e_Pepe_SimoPizza__Credit+Francesco+Sapienza.jpg",
    description: "Pecorino cream, black pepper, olive oil. No tomato.",
  },
  {
    id: "carbonara",
    number: 19,
    name: "Carbonara",
    style: "Pecorino, Crispy Pork & Egg Yolk Drizzle",
    category: "innovative",
    price: 14.5,
    image: "https://www.vincenzosplate.com/wp-content/uploads/2022/10/1500x1500-Photo-4_1951-How-to-Make-CARBONARA-PIZZA-Like-an-Italian-V1.jpg",
    description: "Pecorino, pancetta, egg yolk, black pepper.",
  },
  {
    id: "amatriciana",
    number: 20,
    name: "Amatriciana",
    style: "Roman Pasta-Inspired — Guanciale, Tomato & Pecorino",
    category: "innovative",
    price: 14.0,
    image: "https://doublethespoonfuls.com/wp-content/uploads/2023/07/amatriciana-pizza-finished.jpg",
    description: "Tomato, guanciale, mozzarella, pecorino, chilli.",
  },
  {
    id: "gricia",
    number: 21,
    name: "Gricia",
    style: "Roman Pasta-Inspired — Guanciale & Pecorino, No Tomato",
    category: "innovative",
    price: 14.0,
    image: "https://cache.marieclaire.fr/data/photo/w1475_ci/6w/pizza-a-la-gricia.webp",
    description: "White base, mozzarella, guanciale, pecorino, black pepper.",
  },
  {
    id: "nduja-honey",
    number: 22,
    name: "'Nduja & Hot Honey",
    style: "Calabrian Spice Meets Sweet Heat",
    category: "innovative",
    price: 14.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-QIDb-C5YJ62kzmEGA9VLPE-dkJbayXDcvR90G2p1PjLMsJr48qWq6no&s=10",
    description: "Tomato, mozzarella, 'nduja, chilli, hot honey.",
  },
  {
    id: "calabrese",
    number: 23,
    name: "Calabrese",
    style: "Gorgonzola, 'Nduja & Fior di Latte — White Pizza",
    category: "innovative",
    price: 14.5,
    image: "https://media-cdn.tripadvisor.com/media/photo-s/1b/9e/0f/61/nduja-e-gorgonzola.jpg",
    description: "White base, mozzarella, gorgonzola, 'nduja, parmesan, basil.",
  },
  {
    id: "pesto-burrata",
    number: 24,
    name: "Pesto & Burrata",
    style: "Fresh Pesto & Cold Burrata",
    category: "innovative",
    price: 14.5,
    image: "/pizzas/pesto-burrata.jpeg",
    description: "Tomato, pesto, mozzarella, burrata, olive oil.",
  },
  {
    id: "mortadella-pistachio",
    number: 25,
    name: "Mortadella and Pistachio",
    style: "White Pizza — Mortadella, Ricotta & Pistachio",
    category: "innovative",
    price: 16.5,
    image: "https://myhusbandmakespies.com/wp-content/uploads/2025/07/mortadella-ricotta-pizza-ooni-baked.jpg",
    description: "White base, mozzarella, mortadella, ricotta, pistachio, olive oil.",
  },
  {
    id: "la-oro-verde",
    number: 26,
    name: "La Oro Verde",
    style: "White Pizza — Mortadella, Stracciatella & Pistachio Pesto",
    category: "innovative",
    price: 16.95,
    image: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/a211bd6f00b7a30664e5d05480027f27/Derivates/01948b21d82cfcb00473494c5780e3b3e3d00e52.jpg",
    description: "White base, mortadella, stracciatella, pistachio pesto, basil.",
  },
  {
    id: "boscaiola",
    number: 27,
    name: "Boscaiola",
    style: "Forester's Pizza — Sausage & Mushroom, Pizza Bianca",
    category: "innovative",
    price: 14.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4c90OTCp_IEocTO38KnTvWuXxhkRs-NpLzRLtET9QDw&s=10",
    description: "White base, sausage, mushrooms, parmesan, olive oil. No tomato.",
  },
  {
    id: "cetarese",
    number: 35,
    name: "Cetarese",
    style: "Pizza di Cetara — Amalfi Coast, Post-Bake Anchovy",
    category: "innovative",
    price: 15.0,
    image: "https://lnx.spaghettitaliani.com/si/wp-content/uploads/2022/02/Pizza-Cetarese.jpg",
    description: "Cherry tomatoes, fiordilatte or stracciatella, capers, olives, garlic, oregano, Alici di Cetara anchovies (post-bake).",
  },
];

export function getItemsByCategory(category: MenuCategory): MenuItem[] {
  return MENU.filter((m) => m.category === category);
}

export function getItemById(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}
