/**
 * All copy and content below was extracted verbatim from the Figma file
 * (key Tn0nyP9sDPCoBdZcDMZPzN). Image filenames retain the Figma imageRef
 * prefix so every asset is traceable back to the source frame.
 */

export const BRAND = {
  name: "KAPRESCO",
  wordmark: "K A P R E S C O",
  tagline: "Sip. Chill. Repeat.",
  logo: "/images/logo.png",
  description:
    "Fresh local brews and a cozy place to pause, connect, and feel at home.",
  phone: "0912-352-1096",
  email: "kapresco@gmail.com",
  site: "www.kapresco.com",
  address: "Madang, City of Mati",
  fullAddress: "Madang, Central, City of Mati, Davao Oriental",
  hours: [
    { label: "Mon–Sat", value: "8:00 AM – 9:00 PM" },
    { label: "Sunday", value: "10:00 AM – 7:00 PM" },
  ],
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Menu", to: "/menu" },
  { label: "Orders", to: "/orders" },
  { label: "Contact Us", to: "/contact" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Menu", to: "/menu" },
      { label: "Best Sellers", to: "/menu?category=best-sellers" },
      { label: "Our Story", to: "/about" },
      { label: "Community", to: "/about#team" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "How we work", to: "/about" },
      { label: "Terms and Policies", to: "/terms" },
      { label: "Services", to: "/about#values" },
      { label: "Pricing", to: "/menu" },
    ],
  },
  {
    heading: "Contact Us",
    links: [
      { label: BRAND.address, to: "/contact" },
      { label: BRAND.phone, href: `tel:${BRAND.phone}` },
      { label: BRAND.email, href: `mailto:${BRAND.email}` },
      { label: BRAND.site, to: "/contact" },
    ],
  },
  {
    heading: "Hours",
    links: [
      { label: BRAND.hours[0].label, to: "/contact" },
      { label: BRAND.hours[0].value, to: "/contact" },
      { label: BRAND.hours[1].label, to: "/contact" },
      { label: BRAND.hours[1].value, to: "/contact" },
    ],
  },
];

/* ---------------- Homepage: 01 - Public Homepage ---------------- */

export const HERO = {
  eyebrow: "WELCOME TO YOUR EVERYDAY CHILL SPOT",
  title: "Your Space to Relax, Refresh, and Connect.",
  body: "Preskong kape, warm smiles, and a cozy space in Mati City — made for morning grinds, slow afternoons, and catch-ups that last.",
  image: "/images/untitled-design-1-5efb0725.png",
  primaryCta: { label: "Explore Our Menu", to: "/menu" },
  secondaryCta: { label: "Visit Kapresco", to: "/contact" },
  details: [
    { icon: "pin", label: "Madang, City of Mati" },
    { icon: "clock", label: "Open until 9:00 PM" },
    { icon: "wifi", label: "Free Wi-Fi" },
  ],
};

export const BESTSELLERS_SECTION = {
  eyebrow: "PABORITO SA KAPRESCO",
  title: "Meet Your Next Favorite Brew",
  description:
    "Four crowd favorites, brewed fresh and served with the laid-back Kapresco feeling.",
  linkLabel: "See the full Kapresco menu",
  linkTo: "/menu",
};

export const WHY_SECTION = {
  eyebrow: "WHY KAPRESCO",
  title: "More Than Coffee — It’s a Preskong Experience",
  description:
    "Friendly, familiar, and always made with care. This is coffee-shop comfort with a distinctly local heart.",
  features: [
    { icon: "bean", title: "Local Flavor", description: "Homegrown taste with a modern twist." },
    { icon: "leaf", title: "Presko Vibes", description: "A cozy space, friendly faces, no pressure." },
    { icon: "tag", title: "Sulit Prices", description: "Premium-quality drinks that stay affordable." },
    { icon: "bolt", title: "Fast & Fresh", description: "Quick service and fresh brews, every time." },
  ],
};

export const EXPERIENCE_SECTION = {
  eyebrow: "THE KAPRESCO EXPERIENCE",
  title: "There’s a Place Here for You",
  description:
    "Solo chill or barkada catch-up, quick coffee or a long stay — everyone gets a warm welcome.",
  audiences: [
    { label: "Students", caption: "A calm corner for study sessions.", image: "/images/experience-image-5edafe61.png" },
    { label: "Freelancers", caption: "Fast Wi-Fi and a steady caffeine flow.", image: "/images/experience-image-1ba12bd5.png" },
    { label: "Barkadas", caption: "Shared drinks, stories, and good laughs.", image: "/images/experience-image-a0f5a5b7.png" },
    { label: "Couples", caption: "Slow afternoons made sweeter together.", image: "/images/image-3-22762982.png" },
    { label: "Customers", caption: "Warm welcomes that feel like home.", image: "/images/coffee-shop-image-34a2f60b.png" },
    { label: "Baristas", caption: "Every cup brewed with care and heart.", image: "/images/experience-image-07c5cb7f.png" },
  ],
};

export const TESTIMONIALS_SECTION = {
  eyebrow: "KAPRESCO MOMENTS",
  title: "Real Stories from Our Kapresco Peeps",
  description:
    "Short, sweet, and straight from the people who make our space feel alive.",
  items: [
    {
      quote: "My favorite tambayan after class. The Chill Latte is always on point!",
      name: "Andrea M. · Student",
      rating: 5,
    },
    {
      quote: "Homey, friendly, and sulit. Caramel Cloud is dangerous.",
      name: "Leah C. · First-timer",
      rating: 5,
    },
    {
      quote: "The vibe is unbeatable. Fast Wi-Fi, great coffee, and the Ube Rush? Lami kaayo!",
      name: "Kevin R. · Freelancer",
      rating: 5,
    },
  ],
};

export const FINAL_CTA = {
  title: "Take a Break. Stay a While.",
  description:
    "Drop by for a fresh brew, a comfy seat, and that easygoing Kapresco feeling. Tara, kape tayo.",
  image: "/images/rectangle-25-139cab64.png",
  actions: [
    { label: "Explore Our Menu", to: "/menu", variant: "gold" },
    { label: "Visit Kapresco", to: "/contact", variant: "white" },
  ],
  visitCard: {
    heading: "See you at the shop",
    details: [BRAND.address, BRAND.hours[0].value],
  },
};

/* ---------------- About Us ---------------- */

export const ABOUT = {
  heroImage: "/images/image-5-ac7974a2.png",
  introTitle: "Welcome to Kapresco — where every cup is brewed for comfort, connection, and chill.",
  introBody:
    "At Kapresco, we serve more than coffee — we offer a place to pause, breathe, and feel at home. Rooted in local culture, our drinks are brewed with heart and inspired by the laid-back presko lifestyle of Mindanao.",
  storyTitle: "Our Story",
  storyBody:
    "Kapresco started as a simple dream — a place where friends could hang out, relax, and enjoy good coffee without breaking the bank. We opened our first shop in Mati City, inspired by the presko vibes of everyday life here in Mindanao. We didn’t want anything fancy — just great brews, warm smiles, and a cozy space you can keep coming back to. Now, we’re growing little by little, but we’re still all about keeping things local, relaxed, and real.",
  missionTitle: "Mission",
  missionBody:
    "To serve quality, affordable coffee that feels like home — brewed fresh, shared with heart, and rooted in Filipino culture. We aim to create a relaxing space where people can unwind, connect, and just enjoy the moment.",
  visionTitle: "Vision",
  visionBody:
    "To be the go-to chill spot in every community — where every cup brings comfort, connection, and presko vibes.",
  valuesTitle: "Core Values",
  /* Icons are the actual Figma artwork for each card: two are exported image
     fills, the other two are vector frames pulled from the Figma images API
     as SVG so they stay crisp. `size` is the frame size Figma uses. */
  values: [
    { icon: "/images/icon-leaf.svg", iconSize: 96, title: "Presko Vibes", body: "We keep it cool, cozy, and welcoming — no pressure, just comfort." },
    { icon: "/images/coffee-cup-1-df32cca8.png", iconSize: 88, title: "Homegrown Flavor", body: "We embrace local tastes and proudly serve Filipino-inspired brews." },
    { icon: "/images/best-price-1-00719f93.png", iconSize: 88, title: "Affordability with Quality", body: "Great coffee shouldn’t cost a fortune — we keep it real and budget-friendly." },
    { icon: "/images/icon-people.svg", iconSize: 120, title: "Community First", body: "Kapresco is built on people — our team, our customers, and our community." },
  ],
  teamTitle: "Meet Kapresco Team",
  teamBody:
    "Behind every cup is a crew that brews with heart. Here's your Kapresco family — always ready to serve preskong vibes!",
  team: [
    { name: "Mark", role: "Kapresco Manager", body: "The calm in the coffee storm. Mark keeps everything smooth and steady so your Kapresco visits are always chill and hassle-free.", image: "/images/chatgpt-image-jun-3-2025-10-45-23-am-1-4cdc672a.png" },
    { name: "Ella", role: "Head Barista", body: "Coffee is her art, and your cup is her canvas. She’s the flavor master behind your favorite brews.", image: "/images/ella's.jpg" },
    { name: "Rhea", role: "Interior & Vibe Curator", body: "She keeps the space fresh, cozy, and uniquely Kapresco — like a tambayan you never want to leave.", image: "/images/chatgpt-image-jun-3-2025-11-27-06-am-1-207b46e2.png" },
    { name: "Paolo", role: "Marketing & Socials", body: "From cool promos to Insta-worthy shots, he’s the guy behind the screen spreading Kapresco love online.", image: "/images/chatgpt-image-jun-3-2025-11-27-03-am-1-464060ed.png" },
    { name: "Jenny", role: "Customer Care", body: "Whether you need a rec or just someone to talk to, Jenny’s the smiling face ready to make your day.", image: "/images/chatgpt-image-jun-3-2025-11-27-00-am-1-464dff26.png" },
  ],
};

/* ---------------- Products ----------------
   Names, descriptions and prices come from the Figma best-sellers row.
   Images are the exported Figma assets for each card.
------------------------------------------------ */

export const PRODUCTS = [
  {
    id: "midnight-brew",
    name: "Midnight Brew",
    description: "Strong and bold — made to keep you going.",
    longDescription:
      "Our boldest espresso blend, brewed dark and served with the kind of confidence that gets you through the all-nighter.",
    price: 89,
    compareAt: 99,
    category: "coffee",
    tags: ["best-sellers", "coffee"],
    image: "/images/product-image-4840b0d1.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 128,
    sizes: ["Regular", "Large"],
    ingredients: "Espresso, water",
    nutrition: { serving: "Regular (12 oz)", calories: 5, caffeine: "150 mg" },
    inStock: true,
  },
  {
    id: "chill-latte",
    name: "Chill Latte",
    description: "Cool, creamy, and perfectly smooth.",
    longDescription:
      "Cool, creamy, and perfectly smooth — your go-to pick-me-up for laid-back days. A refreshing blend of espresso and milk served over ice, made to keep you calm and caffeinated.",
    price: 89,
    category: "coffee",
    tags: ["best-sellers", "coffee"],
    image: "/images/product-image-4bab6797.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 214,
    sizes: ["Regular", "Large"],
    ingredients: "Espresso, steamed milk, ice",
    nutrition: { serving: "Regular (12 oz)", calories: 140, caffeine: "120 mg" },
    inStock: true,
  },
  {
    id: "caramel-cloud",
    name: "Caramel Cloud",
    description: "Sweet, light, and topped with foam.",
    longDescription:
      "Silky espresso folded with caramel and a generous cloud of lightly sweet foam. Sweet, light, and dangerously easy to finish.",
    price: 89,
    category: "coffee",
    tags: ["best-sellers", "coffee"],
    image: "/images/product-image-8b531329.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 176,
    sizes: ["Regular", "Large"],
    ingredients: "Espresso, caramel, milk, foam",
    nutrition: { serving: "Regular (12 oz)", calories: 210, caffeine: "110 mg" },
    inStock: true,
  },
  {
    id: "velvet-macchiato",
    name: "Velvet Macchiato",
    description: "Smooth espresso kissed with a touch of foam.",
    longDescription:
      "Smooth espresso kissed with a touch of foam, layered over cold milk for a velvet finish that goes down easy.",
    price: 89,
    category: "coffee",
    tags: ["best-sellers", "coffee"],
    image: "/images/product-image-4efad0ba.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 142,
    sizes: ["Regular", "Large"],
    ingredients: "Espresso, milk, foam",
    nutrition: { serving: "Regular (12 oz)", calories: 160, caffeine: "115 mg" },
    inStock: true,
  },
  {
    id: "ube-rush",
    name: "Ube Rush",
    description: "Signature purple latte — creamy ube, espresso, and cold milk over ice. Sweet, earthy, and unmistakably Filipino.",
    longDescription:
      "Our signature purple drink — smooth ube halaya blended with espresso and cold milk over ice. Sweet, earthy, and unmistakably Filipino.",
    price: 95,
    category: "coffee",
    tags: ["seasonal", "coffee"],
    image: "/images/product-image-a12b3c92.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 198,
    sizes: ["Regular", "Large"],
    ingredients: "Ube halaya, espresso, milk, ice",
    nutrition: { serving: "Regular (12 oz)", calories: 260, caffeine: "105 mg" },
    inStock: true,
  },
  {
    id: "kopi-kapreco",
    name: "Kopi Kapresco",
    description: "Local classic, Kapresco-style — strong, dark, and served with the warmth of a neighborhood tambayan.",
    longDescription:
      "Black coffee the way it should be — bold, dark, and served with the kind of welcome only a tambayan can give.",
    price: 60,
    category: "coffee",
    tags: ["coffee"],
    image: "/images/product-image-78aaa1d2.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 4,
    reviews: 87,
    sizes: ["Regular"],
    ingredients: "Coffee, water",
    nutrition: { serving: "Regular (8 oz)", calories: 5, caffeine: "180 mg" },
    inStock: true,
  },
  {
    id: "mango-gravity",
    name: "Mango Gravity",
    description: "Sweet ripe mango blended with espresso and cold milk. A tropical pick-me-up that tastes like summer in Mati.",
    longDescription:
      "Sweet ripe mango blended with espresso and cold milk. A tropical pick-me-up that tastes like summer in Mati.",
    price: 95,
    category: "coffee",
    tags: ["seasonal", "coffee"],
    image: "/images/rectangle-7-fddd75d7.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 4,
    reviews: 64,
    sizes: ["Regular", "Large"],
    ingredients: "Mango, espresso, milk, ice",
    nutrition: { serving: "Regular (12 oz)", calories: 240, caffeine: "100 mg" },
    inStock: true,
  },
  {
    id: "dark-choco-mocha",
    name: "Dark Choco Mocha",
    description: "Single-origin dark chocolate melted into espresso and steamed milk. Rich, bittersweet, and best shared.",
    longDescription:
      "Single-origin dark chocolate melted into espresso and steamed milk. Rich, bittersweet, and best shared.",
    price: 95,
    category: "coffee",
    tags: ["coffee"],
    image: "/images/rectangle-9-f059cce6.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 112,
    sizes: ["Regular", "Large"],
    ingredients: "Dark chocolate, espresso, milk",
    nutrition: { serving: "Regular (12 oz)", calories: 290, caffeine: "125 mg" },
    inStock: true,
  },
  {
    id: "matcha-cloud",
    name: "Matcha Cloud",
    description: "Ceremonial-grade matcha whisked smooth with cold milk over ice. Grassy, creamy, and quietly energising.",
    longDescription:
      "Ceremonial-grade matcha whisked smooth with cold milk over ice. Grassy, creamy, and quietly energising.",
    price: 95,
    category: "non-coffee",
    tags: ["non-coffee"],
    image: "/images/rectangle-11-def80dd2.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 4,
    reviews: 58,
    sizes: ["Regular", "Large"],
    ingredients: "Matcha, milk, ice",
    nutrition: { serving: "Regular (12 oz)", calories: 150, caffeine: "70 mg" },
    inStock: true,
  },
  {
    id: "fresh-mint-lemonade",
    name: "Fresh Mint Lemonade",
    description: "Hand-squeezed lemons muddled with fresh mint and a touch of sugar over ice. Zero caffeine, maximum refreshment.",
    longDescription:
      "Hand-squeezed lemons muddled with fresh mint and a touch of sugar over ice. Zero caffeine, maximum refreshment.",
    price: 75,
    category: "non-coffee",
    tags: ["non-coffee"],
    image: "/images/rectangle-13-232ac4e3.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 76,
    sizes: ["Regular", "Large"],
    ingredients: "Lemon, mint, sugar, water",
    nutrition: { serving: "Regular (12 oz)", calories: 120, caffeine: "0 mg" },
    inStock: true,
  },
  {
    id: "choco-milk",
    name: "Choco Milk",
    description: "Rich chocolate whisked into cold milk until thick and sweet. The classic tambayan companion.",
    longDescription:
      "Rich chocolate whisked into cold milk until thick and sweet. The classic tambayan companion.",
    price: 60,
    category: "non-coffee",
    tags: ["non-coffee"],
    image: "/images/rectangle-7-b6a2ab25.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 4,
    reviews: 91,
    sizes: ["Regular", "Large"],
    ingredients: "Chocolate, milk, ice",
    nutrition: { serving: "Regular (12 oz)", calories: 230, caffeine: "15 mg" },
    inStock: true,
  },
  {
    id: "fresh-latte",
    name: "Fresh Latte",
    description: "Cold milk, a double shot of espresso, and ice. Simple, clean, and endlessly drinkable.",
    longDescription:
      "Cold milk, a double shot of espresso, and ice. Simple, clean, and endlessly drinkable.",
    price: 85,
    category: "non-coffee",
    tags: ["non-coffee"],
    image: "/images/rectangle-9-65067489.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 4,
    reviews: 68,
    sizes: ["Regular", "Large"],
    ingredients: "Espresso, milk, ice",
    nutrition: { serving: "Regular (12 oz)", calories: 130, caffeine: "125 mg" },
    inStock: false,
  },
  {
    id: "basil-latte",
    name: "Basil Latte",
    description: "Sweet basil leaves steeped with espresso and honey over cold milk. Herbaceous, mellow, quietly addictive.",
    longDescription:
      "Sweet basil leaves steeped with espresso and honey over cold milk. Herbaceous, mellow, quietly addictive.",
    price: 90,
    category: "seasonal",
    tags: ["seasonal"],
    image: "/images/rectangle-11-02619978.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 4,
    reviews: 47,
    sizes: ["Regular", "Large"],
    ingredients: "Basil, honey, espresso, milk",
    nutrition: { serving: "Regular (12 oz)", calories: 175, caffeine: "110 mg" },
    inStock: false,
  },
  {
    id: "lemon-tart",
    name: "Lemon Tart",
    description: "Flaky shortcrust pastry filled with sharp lemon curd and a light meringue kiss. Best eaten the same day.",
    longDescription:
      "Flaky shortcrust pastry filled with sharp lemon curd and a light meringue kiss. Best eaten the same day.",
    price: 85,
    category: "pastries",
    tags: ["pastries"],
    image: "/images/rectangle-13-a3717ddd.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 84,
    sizes: ["Regular"],
    ingredients: "Wheat flour, butter, lemon, sugar, egg",
    nutrition: { serving: "1 slice", calories: 320, caffeine: "0 mg" },
    inStock: true,
  },
  {
    id: "ube-milk-bread",
    name: "Ube Milk Bread",
    description: "Our signature ube milk bread — pillowy, faintly sweet, and custardy in the middle. Order two.",
    longDescription:
      "Our signature ube milk bread — pillowy, faintly sweet, and custardy in the middle. Order two.",
    price: 60,
    category: "pastries",
    tags: ["pastries"],
    image: "/images/rectangle-7-178d6c22.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 156,
    sizes: ["Regular"],
    ingredients: "Wheat flour, ube, milk, butter, sugar",
    nutrition: { serving: "1 bun", calories: 280, caffeine: "0 mg" },
    inStock: true,
  },
  {
    id: "cinnamon-roll",
    name: "Cinnamon Roll",
    description: "Laminated dough rolled with cinnamon sugar, baked golden, and glazed warm. Comfort in every spiral.",
    longDescription:
      "Laminated dough rolled with cinnamon sugar and baked until golden, then glazed while still warm.",
    price: 75,
    category: "pastries",
    tags: ["pastries"],
    image: "/images/rectangle-9-847599c1.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 5,
    reviews: 133,
    sizes: ["Regular"],
    ingredients: "Wheat flour, butter, cinnamon, sugar",
    nutrition: { serving: "1 roll", calories: 410, caffeine: "0 mg" },
    inStock: true,
  },
  {
    id: "matcha-cookie",
    name: "Matcha Cookie",
    description: "Brown-butter cookie loaded with matcha and white chocolate. Crisp at the edge, fudgy in the middle.",
    longDescription:
      "Brown-butter cookie loaded with matcha and white chocolate. Crisp at the edge, fudgy in the middle.",
    price: 55,
    category: "pastries",
    tags: ["pastries"],
    image: "/images/rectangle-11-4b28dc78.png",
    detailImage: "/images/main-image-769b413f.png",
    rating: 4,
    reviews: 72,
    sizes: ["Regular"],
    ingredients: "Wheat flour, butter, matcha, white chocolate, sugar",
    nutrition: { serving: "1 cookie", calories: 240, caffeine: "0 mg" },
    inStock: false,
  },
];

/* Chip order matches the Figma `Menu — All Products` filter row. */
export const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "coffee", label: "Coffee" },
  { id: "non-coffee", label: "Non-Coffee" },
  { id: "pastries", label: "Pastries" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "seasonal", label: "Seasonal" },
];

export const BESTSELLER_IDS = ["midnight-brew", "chill-latte", "caramel-cloud", "velvet-macchiato"];

export const PRODUCT_REVIEWS = [
  { name: "Andrea M.", rating: 5, body: "My favorite tambayan after class. The Chill Latte is always on point!" },
  { name: "Kevin R.", rating: 5, body: "The vibe is unbeatable. Fast Wi-Fi, great coffee, and the Ube Rush? Lami kaayo!" },
  { name: "Leah C.", rating: 4, body: "Didn’t expect a coffee shop to feel this homey. Staff were kind and the Caramel Cloud was so good!" },
];

export const COFFEE_SIZES = ["Regular", "Large"];

export const TEAM = ABOUT.team;
