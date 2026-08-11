import birthday from "@/assets/p-birthday.jpg";
import wedding from "@/assets/p-wedding.jpg";
import cupcake from "@/assets/p-cupcake.jpg";
import cookies from "@/assets/p-cookies.jpg";
import brownies from "@/assets/p-brownies.jpg";
import pastries from "@/assets/p-pastries.jpg";
import cheesecake from "@/assets/p-cheesecake.jpg";
import donuts from "@/assets/p-donuts.jpg";
import macarons from "@/assets/p-macarons.jpg";
import chocolate from "@/assets/p-chocolate.jpg";
import g1 from "@/assets/g-1.jpg";
import g2 from "@/assets/g-2.jpg";
import g3 from "@/assets/g-3.jpg";
import g4 from "@/assets/products/cedb1568-119a-4b5b-af04-e22633009b7f.jpg";
import interior from "@/assets/storefront.png";

export type Product = {
  name: string;
  category: string;
  note: string;
  price: string;
  image: string;
  images?: string[];
  badge?: string;
};

export type Category = {
  slug: string;
  label: string;
  images: string[];
};

export const categories: Category[] = [
  { slug: "cakes", label: "Birthday Cakes", images: [birthday, chocolate, wedding] },
  { slug: "cakes", label: "Wedding Cakes", images: [wedding, chocolate, birthday] },
  { slug: "cupcakes", label: "Cupcakes", images: [cupcake, macarons] },
  { slug: "cookies", label: "Cookies", images: [cookies, brownies] },
  { slug: "pastries", label: "Pastries", images: [pastries, g3] },
  { slug: "desserts", label: "Desserts", images: [cheesecake, donuts] },
  { slug: "custom", label: "Custom", images: [interior, g2] },
];

export const products: Product[] = [
  {
    name: "Belgian Truffle Cake",
    category: "Cakes",
    note: "Dark ganache, 3 layers of slow-baked cocoa sponge.",
    price: "₹1,299",
    image: chocolate,
    images: [chocolate, g1, birthday],
    badge: "Best Seller",
  },
  {
    name: "Confetti Celebration",
    category: "Cakes",
    note: "Vanilla bean sponge with hand-piped buttercream.",
    price: "₹1,099",
    image: birthday,
    images: [birthday, g2, chocolate],
    badge: "New",
  },
  {
    name: "Ivory Rose Tier",
    category: "Cakes",
    note: "Three tiers, 24k edible gold, fresh sugar roses.",
    price: "₹6,499",
    image: wedding,
    images: [wedding, g4, g1],
    badge: "Signature",
  },
  {
    name: "Vanilla Cloud Cupcakes",
    category: "Cupcakes",
    note: "Silk buttercream swirl finished with a glazed cherry.",
    price: "₹399 / 6",
    image: cupcake,
    images: [cupcake, macarons, g3],
    badge: "Best seller",
  },
  {
    name: "Brown Butter Cookies",
    category: "Cookies",
    note: "Molten chocolate chunks, sea-salt finish.",
    price: "₹349 / 6",
    image: cookies,
    images: [cookies, brownies, g1],
    badge: "Loved",
  },
  {
    name: "Walnut Fudge Brownies",
    category: "Desserts",
    note: "Crackled top, dense centre, roasted walnuts.",
    price: "₹449 / 6",
    image: brownies,
    images: [brownies, cookies, cheesecake],
  },
  {
    name: "Parisian Macarons",
    category: "Desserts",
    note: "Almond shells with seasonal ganache fillings.",
    price: "₹599 / 9",
    image: macarons,
    images: [macarons, cupcake, g4],
  },
  {
    name: "Butter Croissants",
    category: "Pastries",
    note: "72-hour laminated dough, baked twice daily.",
    price: "₹149 each",
    image: pastries,
    images: [pastries, g3, interior],
    badge: "Fresh daily",
  },
  {
    name: "Glazed Donut Box",
    category: "Desserts",
    note: "Brioche donuts with caramel and cocoa glaze.",
    price: "₹499 / 6",
    image: donuts,
    images: [donuts, cheesecake, macarons],
  },
  {
    name: "Strawberry Cheesecake",
    category: "Desserts",
    note: "Baked New York style with fresh berry compote.",
    price: "₹1,199",
    image: cheesecake,
    images: [cheesecake, donuts, g2],
    badge: "Chef's pick",
  },
];

export const bestSellers: Product[] = [
  products[0]!,
  products[1]!,
  products[2]!,
  products[3]!,
  products[4]!,
  products[5]!,
];

export type GalleryItem = {
  src: string;
  alt: string;
  h?: "tall";
};

export const gallery: GalleryItem[] = [
  { src: g2, alt: "Chef piping buttercream rosettes on a luxury cake", h: "tall" },
  { src: chocolate, alt: "Chocolate truffle cake slice with ganache" },
  { src: g3, alt: "Powdered sugar falling over fresh croissants", h: "tall" },
  { src: wedding, alt: "Three tier wedding cake with roses" },
  { src: g1, alt: "Molten chocolate dripping over a cake", h: "tall" },
  { src: macarons, alt: "Pastel french macarons" },
  { src: g4, alt: "Coffee poured beside a slice of cake" },
  { src: interior, alt: "Warm luxury bakery interior at golden hour", h: "tall" },
];

export const testimonials = [
  {
    quote: "The hazelnut praline cake was the star of our anniversary. Everyone asked where it was from!",
    name: "Priya Sharma",
    role: "Anniversary cake",
  },
  {
    quote: "Vithika designed a two-tier wedding cake exactly from my Pinterest board. It was even prettier.",
    name: "Ananya & Rohan",
    role: "Wedding, Dec 2025",
  },
  {
    quote: "Eggless options that actually taste like the real thing. My whole family is hooked.",
    name: "Kavita Mehta",
    role: "Regular customer",
  },
  {
    quote: "Ordered on WhatsApp at 10am, delivered fresh by 5pm. Same-day magic.",
    name: "Arjun Kapoor",
    role: "Same-day order",
  },
];

export const process = [
  { step: "01", title: "Tell us your idea", text: "A quick call or message about the flavour, size and occasion." },
  { step: "02", title: "We design it", text: "A sketch and quote, with a tasting suggestion if you need one." },
  { step: "03", title: "We bake fresh", text: "Baked on the day of delivery, never frozen, never stored." },
  { step: "04", title: "You celebrate", text: "Hand-delivered, styled and ready for the first slice." },
];

export const instagramGrid: string[] = [
  chocolate,
  macarons,
  donuts,
  cupcake,
  brownies,
  cookies,
];

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
