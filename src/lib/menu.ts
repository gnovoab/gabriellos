export type MenuCategory = "classic";

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
];

export const MENU: MenuItem[] = [
  {
    id: "margherita",
    number: 1,
    name: "Margherita",
    style: "Traditional Base",
    category: "classic",
    price: 9.5,
    image: "https://data.thefeedfeed.com/static/2021/04/13/16183401006075e904223ae.jpg",
    description: "Raw hand-crushed San Marzano tomatoes, sea salt, Fior di Latte mozzarella, extra virgin olive oil and fresh basil.",
  },
  {
    id: "bufalina",
    number: 2,
    name: "Bufalina",
    style: "Margherita con Bufala",
    category: "classic",
    price: 13.0,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTS95WYSPFblZrzxmXUcNGNROGg7uib_xsYLYqWMFhRg&s=10",
    description: "San Marzano tomato sauce, Mozzarella di Bufala Campana DOP, fresh basil and extra virgin olive oil.",
  },
  {
    id: "napoli",
    number: 3,
    name: "Napolitan",
    category: "classic",
    price: 12.5,
    image: "https://italianfoodforever.com/wp-content/uploads/2015/01/napolipizza4.jpg",
    description: "San Marzano tomatoes, mozzarella, Cantabrian anchovies, Kalamata olives, capers, garlic and wild oregano.",
  },
  {
    id: "cosacca",
    number: 4,
    name: "Cosacca",
    style: "Historic Naples — 1844",
    category: "classic",
    price: 11.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ76JLGq7RrjabxAASmGaLI7E9ZYoLUAyTVG41MbMh-KA&s=10",
    description: "San Marzano tomato sauce and fresh basil, finished with a heavy shower of Pecorino Romano DOP and extra virgin olive oil.",
  },
  {
    id: "seven-stars-parma",
    number: 5,
    name: "Parma",
    style: "Post-Bake Flash Process",
    category: "classic",
    price: 14.5,
    image: "https://theuppercrustpizzeria.co.uk/cdn/shop/products/Parma.jpg?v=1639743529",
    description: "San Marzano tomato, Parmigiano-Reggiano, Mozzarella di Bufala DOP, Prosciutto di Parma and fresh wild rocket.",
  },
  {
    id: "parma-bianca",
    number: 6,
    name: "Parma Bianca",
    category: "classic",
    price: 14.0,
    image: "https://ginopizzaovens.com/cdn/shop/articles/gino-pizza-fior-latte-parma-ham-rocket-parmesan.jpg?v=1683056519&width=1500",
    description: "White base (no tomato) with Fior di Latte, Parma ham, rocket, Parmigiano-Reggiano and extra virgin olive oil.",
  },
  {
    id: "bufala-e-fiocco",
    number: 7,
    name: "Bufala e Fiocco",
    style: "Pure White Premium",
    category: "classic",
    price: 15.0,
    image: "https://theuppercrustpizzeria.co.uk/cdn/shop/products/Parma.jpg?v=1639743529",
    description: "San Marzano base with post-bake Mozzarella di Bufala DOP, fiocco di prosciutto and early-harvest Campanian EVOO.",
  },
  {
    id: "diavola",
    number: 8,
    name: "Diavola",
    style: "Margherita con Salame Piccante",
    category: "classic",
    price: 13.0,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHd4NQF9AoDHLYIDv3yGqhdZq9HBRfQ8WuGZUuR5s9Vw&s=10",
    description: "San Marzano tomato, Fior di Latte, spicy Salame Piccante and Parmigiano-Reggiano, finished with fresh basil and EVOO.",
  },
  {
    id: "double-pepperoni-hot-honey",
    number: 9,
    name: "Double Pepperoni & Hot Honey",
    style: "Modern Crowd-Pleaser",
    category: "classic",
    price: 13.95,
    image: "https://coolfooddude.com/wp-content/uploads/2020/12/Double-Pepperoni-and-honey-PIzza.jpg",
    description: "Tomato, mozzarella and aged provolone, double cup-and-char pepperoni and spicy salami, finished with Calabrian hot honey.",
  },
  {
    id: "chorizo",
    number: 10,
    name: "Chorizo",
    style: "Franco Manca inspired",
    category: "classic",
    price: 13.5,
    image: "https://image.eatencdn.com/image/1f55d2e1-e560-4a16-94a0-dcc00041e6cb/small/image.jpg",
    description: "San Marzano tomatoes, mozzarella, cured Iberico chorizo and creamy Gorgonzola, finished with peppery EVOO.",
  },
  {
    id: "quattro-formaggi",
    number: 11,
    name: "Quattro Formaggi",
    style: "Classic Neapolitan — Pizza Bianca",
    category: "classic",
    price: 14.5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQib4tBZbanA4_Cd1takByQB8S_KSC4VKJpP0-Tey91vQ&s=10",
    description: "White pizza with Fior di Latte, ricotta, Gorgonzola DOP and Parmigiano-Reggiano, finished with extra virgin olive oil.",
  },
  {
    id: "tettoia-four-cheese-truffle",
    number: 12,
    name: "Tettoia — Four Cheese & Truffle",
    style: "Gourmet White Pizza",
    category: "classic",
    price: 15.5,
    image: "https://rs-menus-api.roocdn.com/images/2018fd22-bd00-4726-bae8-5c9cc89ce052/image.jpeg",
    description: "Fior di Latte, Gorgonzola DOP, Parmigiano-Reggiano and Bufala DOP with truffle croutons, truffle oil and chilli.",
  },
  {
    id: "pesto-burrata",
    number: 13,
    name: "Pesto & Burrata",
    style: "Fresh Pesto & Cold Burrata",
    category: "classic",
    price: 14.5,
    image: "/pizzas/pesto-burrata.jpeg",
    description: "San Marzano tomato, Genovese basil pesto and Fior di Latte, finished with torn creamy burrata and EVOO.",
  },
  {
    id: "mortadella-pistachio",
    number: 14,
    name: "Mortadella and Pistachio",
    style: "White Pizza — Mortadella, Ricotta & Pistachio",
    category: "classic",
    price: 16.5,
    image: "https://myhusbandmakespies.com/wp-content/uploads/2025/07/mortadella-ricotta-pizza-ooni-baked.jpg",
    description: "Fior di Latte white base finished post-bake with Casertano black pig mortadella, creamy ricotta, crunchy pistachio and Caiazzano extra virgin olive oil.",
  },
  {
    id: "la-oro-verde",
    number: 15,
    name: "La Oro Verde",
    style: "White Pizza — Mortadella, Stracciatella & Pistachio Pesto",
    category: "classic",
    price: 16.95,
    image: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/a211bd6f00b7a30664e5d05480027f27/Derivates/01948b21d82cfcb00473494c5780e3b3e3d00e52.jpg",
    description: "Fior di Latte white base finished post-bake with mortadella, cold stracciatella, pistachio pesto, pistachio granella and fresh basil.",
  },
];

export function getItemsByCategory(category: MenuCategory): MenuItem[] {
  return MENU.filter((m) => m.category === category);
}

export function getItemById(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}
