/* Prototype data — all placeholder content (vendors, products, prices). */
const IMG = (id, w = 600, h) => `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ''}&q=72&auto=format&fit=crop`;

const VENDORS = [
  { id: 'nook-grain', name: 'Nook & Grain', cat: 'Home & Living', city: 'Riyadh', rating: 4.9, reviews: 312, since: 2021, followers: '8.4k', color: '#7a5a3a',
    tagline: 'Slow-made furniture and ceramics for calm homes.', banner: '1524758631624-e2822e304c36', status: 'Active', products: 6, sales: 48210 },
  { id: 'volt-supply', name: 'Volt Supply', cat: 'Electronics', city: 'Jeddah', rating: 4.7, reviews: 1204, since: 2020, followers: '21k', color: '#2b3a67',
    tagline: 'Audio and wearables, tested before they ship.', banner: '1556740738-b6a63e27c4df', status: 'Active', products: 4, sales: 96440 },
  { id: 'rawda-beauty', name: 'Rawda Beauty', cat: 'Beauty & Fragrance', city: 'Dammam', rating: 4.8, reviews: 876, since: 2022, followers: '12k', color: '#a2504a',
    tagline: 'Botanical skincare and oud-led fragrance.', banner: '1612817288484-6f916006741a', status: 'Active', products: 4, sales: 37980 },
  { id: 'thread-co', name: 'Thread & Co', cat: 'Fashion', city: 'Riyadh', rating: 4.6, reviews: 541, since: 2023, followers: '6.1k', color: '#3f5f4a',
    tagline: 'Everyday essentials, cut and sewn locally.', banner: '1490481651871-ab68de25d43d', status: 'Active', products: 6, sales: 29150 },
  { id: 'bean-republic', name: 'Bean Republic', cat: 'Coffee & Food', city: 'Khobar', rating: 4.9, reviews: 958, since: 2021, followers: '15k', color: '#5b3b2a',
    tagline: 'Specialty coffee, roasted every Sunday.', banner: '1447933601403-0c6688de566e', status: 'Active', products: 3, sales: 22610 }
];

const PRODUCTS = [
  { id: 'velvet-sofa', name: 'Juniper Velvet 3-Seater Sofa', vendor: 'nook-grain', cat: 'Home & Living', price: 3490, compare: 4100, rating: 4.9, reviews: 64, img: '1555041469-a586c61ea9bc', badge: 'Bestseller', stock: 7 },
  { id: 'terracotta-sofa', name: 'Terracotta Lounge Sofa', vendor: 'nook-grain', cat: 'Home & Living', price: 2890, rating: 4.8, reviews: 41, img: '1567016432779-094069958ea5', stock: 4 },
  { id: 'oak-stool', name: 'Pale Oak Counter Stool', vendor: 'nook-grain', cat: 'Home & Living', price: 420, rating: 4.7, reviews: 88, img: '1503602642458-232111445657', stock: 22 },
  { id: 'shell-chair', name: 'Shell Bar Chair, Matte Black', vendor: 'nook-grain', cat: 'Home & Living', price: 560, compare: 640, rating: 4.6, reviews: 37, img: '1581539250439-c96689b516dd', stock: 15 },
  { id: 'stone-mug', name: 'Stoneware Mug, Chalk', vendor: 'nook-grain', cat: 'Home & Living', price: 69, rating: 4.9, reviews: 210, img: '1514228742587-6b1558fcca3d', badge: 'Add-on', stock: 140 },
  { id: 'cup-set', name: 'Hand-thrown Cup Set of 4', vendor: 'nook-grain', cat: 'Home & Living', price: 189, rating: 4.8, reviews: 96, img: '1610701596007-11502861dcfa', stock: 31 },

  { id: 'minimal-watch', name: 'Minimal Steel Watch, White', vendor: 'volt-supply', cat: 'Electronics', price: 690, rating: 4.6, reviews: 152, img: '1523275335684-37898b6baf30', stock: 18 },
  { id: 'over-ear', name: 'Over-Ear Wireless Headphones', vendor: 'volt-supply', cat: 'Electronics', price: 899, compare: 1099, rating: 4.8, reviews: 411, img: '1505740420928-5e560c06d30e', badge: '-18%', stock: 26 },
  { id: 'smartwatch', name: 'Active Smartwatch Series 4', vendor: 'volt-supply', cat: 'Electronics', price: 1290, rating: 4.7, reviews: 302, img: '1546868871-7041f2a55e12', badge: 'New', stock: 3 },
  { id: 'studio-phones', name: 'Studio Monitor Headphones', vendor: 'volt-supply', cat: 'Electronics', price: 549, rating: 4.5, reviews: 98, img: '1583394838336-acd977736f90', stock: 40 },

  { id: 'glow-serum', name: 'Amber Glow Face Serum 30ml', vendor: 'rawda-beauty', cat: 'Beauty & Fragrance', price: 179, rating: 4.9, reviews: 388, img: '1608571423902-eed4a5ad8108', badge: 'Bestseller', stock: 64 },
  { id: 'botanical-set', name: 'Botanical Ritual Set', vendor: 'rawda-beauty', cat: 'Beauty & Fragrance', price: 349, compare: 420, rating: 4.8, reviews: 121, img: '1612817288484-6f916006741a', stock: 19 },
  { id: 'body-lotion', name: 'Silk Body Lotion 200ml', vendor: 'rawda-beauty', cat: 'Beauty & Fragrance', price: 95, rating: 4.7, reviews: 207, img: '1620916566398-39f1143ab7be', badge: 'Add-on', stock: 88 },
  { id: 'red-oud', name: 'Red Oud Eau de Parfum 100ml', vendor: 'rawda-beauty', cat: 'Beauty & Fragrance', price: 465, rating: 4.9, reviews: 164, img: '1608528577891-eb055944f2e7', stock: 12 },

  { id: 'knit-poncho', name: 'Cotton Knit Poncho, Natural', vendor: 'thread-co', cat: 'Fashion', price: 239, rating: 4.6, reviews: 58, img: '1434389677669-e08b4cac3105', stock: 23 },
  { id: 'tracksuit', name: 'Saffron Fleece Tracksuit', vendor: 'thread-co', cat: 'Fashion', price: 389, compare: 450, rating: 4.5, reviews: 74, img: '1515886657613-9f3515b0c78f', badge: 'New', stock: 17 },
  { id: 'essentials', name: 'Weekend Essentials Bundle', vendor: 'thread-co', cat: 'Fashion', price: 499, rating: 4.7, reviews: 49, img: '1544441893-675973e31985', stock: 9 },
  { id: 'sunglasses', name: 'Classic Black Sunglasses', vendor: 'thread-co', cat: 'Fashion', price: 159, rating: 4.6, reviews: 133, img: '1572635196237-14b3f281503f', badge: 'Add-on', stock: 51 },
  { id: 'city-backpack', name: 'City Commuter Backpack, Navy', vendor: 'thread-co', cat: 'Fashion', price: 289, rating: 4.8, reviews: 205, img: '1553062407-98eeb64c6a62', stock: 34 },
  { id: 'trail-backpack', name: 'Canvas Trail Backpack', vendor: 'thread-co', cat: 'Fashion', price: 329, rating: 4.7, reviews: 86, img: '1491637639811-60e2756cc1c7', stock: 6 },

  { id: 'single-origin', name: 'Ethiopia Single Origin, 250g', vendor: 'bean-republic', cat: 'Coffee & Food', price: 75, rating: 4.9, reviews: 512, img: '1559056199-641a0ac8b55e', badge: 'Bestseller', stock: 220 },
  { id: 'house-blend', name: 'House Espresso Blend, 1kg', vendor: 'bean-republic', cat: 'Coffee & Food', price: 189, rating: 4.8, reviews: 301, img: '1447933601403-0c6688de566e', stock: 75 },
  { id: 'thermal-bottle', name: 'Thermal Bottle 500ml, Sage', vendor: 'bean-republic', cat: 'Coffee & Food', price: 119, rating: 4.7, reviews: 145, img: '1602143407151-7111542de6e8', badge: 'Add-on', stock: 96 }
];

const CATEGORIES = [
  { name: 'Home & Living', img: '1513694203232-719a280e022f' },
  { name: 'Electronics', img: '1505740420928-5e560c06d30e' },
  { name: 'Beauty & Fragrance', img: '1612817288484-6f916006741a' },
  { name: 'Fashion', img: '1490481651871-ab68de25d43d' },
  { name: 'Coffee & Food', img: '1559056199-641a0ac8b55e' }
];

const vendorById = id => VENDORS.find(v => v.id === id);
const productById = id => PRODUCTS.find(p => p.id === id);
const money = n => 'SAR ' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
