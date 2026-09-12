export type MenuCategory = "classic" | "pumpkin";

export interface MenuCategoryInfo {
  id: MenuCategory;
  label: string;
  blurb: string;
}

export interface MenuItem {
  id: string;
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
    id: "pumpkin",
    label: "Pumpkin Base",
    blurb: "Tomato swapped for smooth roasted pumpkin cream — rich, autumnal and a little different.",
  },
];

export const MENU: MenuItem[] = [
  {
    id: "margherita",
    name: "Margherita",
    style: "Traditional Base",
    category: "classic",
    price: 9.5,
    image: "https://data.thefeedfeed.com/static/2021/04/13/16183401006075e904223ae.jpg",
    description: "Raw hand-crushed San Marzano tomatoes, sea salt, Fior di Latte mozzarella, extra virgin olive oil and fresh basil.",
  },
  {
    id: "napoli",
    name: "Napolitan",
    category: "classic",
    price: 12.5,
    image: "https://italianfoodforever.com/wp-content/uploads/2015/01/napolipizza4.jpg",
    description: "San Marzano tomatoes, mozzarella, Cantabrian anchovies, Kalamata olives, capers, garlic and wild oregano.",
  },
  {
    id: "seven-stars-parma",
    name: "Parma",
    style: "Post-Bake Flash Process",
    category: "classic",
    price: 14.5,
    image: "https://theuppercrustpizzeria.co.uk/cdn/shop/products/Parma.jpg?v=1639743529",
    description: "San Marzano tomato, Parmigiano-Reggiano, Mozzarella di Bufala DOP, Prosciutto di Parma and fresh wild rocket.",
  },
  {
    id: "parma-bianca",
    name: "Parma Bianca",
    category: "classic",
    price: 14.0,
    image: "https://ginopizzaovens.com/cdn/shop/articles/gino-pizza-fior-latte-parma-ham-rocket-parmesan.jpg?v=1683056519&width=1500",
    description: "White base (no tomato) with Fior di Latte, Parma ham, rocket, Parmigiano-Reggiano and extra virgin olive oil.",
  },
  {
    id: "chorizo",
    name: "Chorizo",
    style: "Franco Manca inspired",
    category: "classic",
    price: 13.5,
    image: "https://image.eatencdn.com/image/1f55d2e1-e560-4a16-94a0-dcc00041e6cb/small/image.jpg",
    description: "San Marzano tomatoes, mozzarella, cured Iberico chorizo and creamy Gorgonzola, finished with peppery EVOO.",
  },
  {
    id: "double-pepperoni-hot-honey",
    name: "Double Pepperoni & Hot Honey",
    style: "Modern Crowd-Pleaser",
    category: "classic",
    price: 13.95,
    image: "https://coolfooddude.com/wp-content/uploads/2020/12/Double-Pepperoni-and-honey-PIzza.jpg",
    description: "Tomato, mozzarella and aged provolone, double cup-and-char pepperoni and spicy salami, finished with Calabrian hot honey.",
  },
  {
    id: "bufala-e-fiocco",
    name: "Bufala e Fiocco",
    style: "Pure White Premium",
    category: "classic",
    price: 15.0,
    image: "https://theuppercrustpizzeria.co.uk/cdn/shop/products/Parma.jpg?v=1639743529",
    description: "San Marzano base with post-bake Mozzarella di Bufala DOP, fiocco di prosciutto and early-harvest Campanian EVOO.",
  },
  {
    id: "tettoia-four-cheese-truffle",
    name: "Tettoia — Four Cheese & Truffle",
    style: "Gourmet White Pizza",
    category: "classic",
    price: 15.5,
    image: "https://rs-menus-api.roocdn.com/images/2018fd22-bd00-4726-bae8-5c9cc89ce052/image.jpeg",
    description: "Fior di Latte, Gorgonzola DOP, Parmigiano-Reggiano and Bufala DOP with truffle croutons, truffle oil and chilli.",
  },
  {
    id: "pesto-burrata",
    name: "Pesto & Burrata",
    style: "Fresh Pesto & Cold Burrata",
    category: "classic",
    price: 14.5,
    image: "/pizzas/pesto-burrata.jpeg",
    description: "San Marzano tomato, Genovese basil pesto and Fior di Latte, finished with torn creamy burrata and EVOO.",
  },
  {
    id: "sfiziosa-basilico",
    name: "Sfiziosa (Basilico)",
    style: "Mushroom & Pancetta",
    category: "pumpkin",
    price: 13.5,
    description: "Roasted pumpkin cream, Fior di Latte, sautéed mushrooms and pancetta, finished with sage oil and Parmigiano.",
  },
  {
    id: "sfiziosa-signature",
    name: "Sfiziosa Signature Edition",
    style: "Premium Mushroom, Pancetta & Sage",
    category: "pumpkin",
    price: 15.95,
    description: "Pumpkin cream over a Parmigiano scaffold, Fior di Latte, three-mushroom blend and guanciale, crispy sage and brown butter.",
  },
  {
    id: "sfiziosa-aqua",
    name: "Sfiziosa Aqua & Farina",
    style: "Smoked Pork, Burrata & Truffle",
    category: "pumpkin",
    price: 16.5,
    image: "https://foodionista.com/wp-content/uploads/2022/10/zucca-pancetta.jpg",
    description: "Pumpkin cream, Fior di Latte and smoked guanciale, finished with torn burrata, black truffle cream and crispy sage.",
  },
  {
    id: "mantovana",
    name: "Mantovana",
    style: "Gorgonzola & Smoked Boucané",
    category: "pumpkin",
    price: 15.5,
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/c3/7a/78/caption.jpg?w=1100&h=-1&s=1",
    description: "Pumpkin cream, Fior di Latte, quick-pickled red onions, Gorgonzola Dolce and smoked boucané with crispy sage.",
  },
  {
    id: "zucca-pancetta",
    name: "Zucca & Pancetta",
    style: "Simple & Classic",
    category: "pumpkin",
    price: 13.0,
    image: "https://foodionista.com/wp-content/uploads/2022/10/zucca-pancetta.jpg",
    description: "Yellow pumpkin cream, fresh mozzarella, crispy pancetta, fresh basil and extra virgin olive oil.",
  },
];

export function getItemsByCategory(category: MenuCategory): MenuItem[] {
  return MENU.filter((m) => m.category === category);
}

export function getItemById(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id);
}
