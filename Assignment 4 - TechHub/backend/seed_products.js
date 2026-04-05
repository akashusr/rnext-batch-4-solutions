const { Product } = require('./src/models');

const products = [
  {
    "id": 1,
    "title": "Dell XPS 15",
    "price": 1899.99,
    "description": "High-performance 15-inch laptop with InfinityEdge display and reliable processing power for professionals.",
    "category": "Laptop",
    "image": null,
    "rating_rate": 4.5,
    "rating_count": 120,
    "stock": 45
  },
  {
    "id": 2,
    "title": "Apple Mac Pro Tower",
    "price": 6999.00,
    "description": "The ultimate workstation with M2 Ultra chip, designed for heavy video editing and 3D rendering.",
    "category": "Apple Mac Pro",
    "image": null,
    "rating_rate": 4.8,
    "rating_count": 35,
    "stock": 5
  },
  {
    "id": 3,
    "title": "Mac Studio M2 Max",
    "price": 1999.00,
    "description": "Compact powerhouse featuring the M2 Max chip, extensive connectivity, and silent operation.",
    "category": "Apple Mac Studio",
    "image": null,
    "rating_rate": 4.9,
    "rating_count": 89,
    "stock": 22
  },
  {
    "id": 4,
    "title": "iMac 24-inch Blue",
    "price": 1299.00,
    "description": "Vibrant all-in-one desktop with 4.5K Retina display and M3 chip integration.",
    "category": "Apple iMac",
    "image": null,
    "rating_rate": 4.7,
    "rating_count": 210,
    "stock": 67
  },
  {
    "id": 5,
    "title": "Mac Mini M2",
    "price": 599.00,
    "description": "Small form factor desktop with surprising speed and versatility for home or office setups.",
    "category": "Apple Mac Mini",
    "image": null,
    "rating_rate": 4.6,
    "rating_count": 340,
    "stock": 112
  },
  {
    "id": 6,
    "title": "Alienware Aurora R16",
    "price": 2199.99,
    "description": "Premium gaming PC with optimized airflow, RTX 4070 graphics, and a futuristic chassis.",
    "category": "Gaming PC",
    "image": null,
    "rating_rate": 4.4,
    "rating_count": 78,
    "stock": 18
  },
  {
    "id": 7,
    "title": "HP Pavilion Desktop",
    "price": 749.99,
    "description": "Reliable everyday desktop for browsing, streaming, and office productivity tasks.",
    "category": "Desktop",
    "image": null,
    "rating_rate": 4.2,
    "rating_count": 150,
    "stock": 55
  },
  {
    "id": 8,
    "title": "Lenovo ThinkPad X1 Carbon",
    "price": 1499.00,
    "description": "Ultralight business laptop known for its durability, keyboard quality, and long battery life.",
    "category": "Laptop",
    "image": null,
    "rating_rate": 4.7,
    "rating_count": 95,
    "stock": 30
  },
  {
    "id": 9,
    "title": "Apple Mac Pro Rack",
    "price": 7499.00,
    "description": "Rack-mounted version of the Mac Pro, perfect for server rooms and professional audio studios.",
    "category": "Apple Mac Pro",
    "image": null,
    "rating_rate": 5.0,
    "rating_count": 12,
    "stock": 3
  },
  {
    "id": 10,
    "title": "Mac Studio M2 Ultra",
    "price": 3999.00,
    "description": "The most powerful compact desktop, doubling the performance with the M2 Ultra chip.",
    "category": "Apple Mac Studio",
    "image": null,
    "rating_rate": 4.9,
    "rating_count": 45,
    "stock": 14
  },
  {
    "id": 11,
    "title": "iMac 24-inch Silver",
    "price": 1299.00,
    "description": "Sleek silver all-in-one computer, perfect for minimalist desk setups.",
    "category": "Apple iMac",
    "image": null,
    "rating_rate": 4.7,
    "rating_count": 180,
    "stock": 40
  },
  {
    "id": 12,
    "title": "Mac Mini M2 Pro",
    "price": 1299.00,
    "description": "Enhanced Mac Mini with the Pro chip, supporting more displays and faster processing.",
    "category": "Apple Mac Mini",
    "image": null,
    "rating_rate": 4.8,
    "rating_count": 65,
    "stock": 28
  },
  {
    "id": 13,
    "title": "HP Omen 45L",
    "price": 2499.99,
    "description": "High-end gaming rig with a unique cryo-chamber cooling system and top-tier specs.",
    "category": "Gaming PC",
    "image": null,
    "rating_rate": 4.6,
    "rating_count": 55,
    "stock": 9
  },
  {
    "id": 14,
    "title": "Acer Aspire TC",
    "price": 549.99,
    "description": "Budget-friendly desktop tower offering decent performance for students and home use.",
    "category": "Desktop",
    "image": null,
    "rating_rate": 4.0,
    "rating_count": 220,
    "stock": 85
  },
  {
    "id": 15,
    "title": "MacBook Air M2",
    "price": 1099.00,
    "description": "Incredibly thin and light laptop with silent fanless design and all-day battery life.",
    "category": "Laptop",
    "image": null,
    "rating_rate": 4.8,
    "rating_count": 500,
    "stock": 150
  },
  {
    "id": 16,
    "title": "Corsair Vengeance i7400",
    "price": 2699.99,
    "description": "Pre-built gaming powerhouse with liquid cooling and customizable RGB lighting.",
    "category": "Gaming PC",
    "image": null,
    "rating_rate": 4.5,
    "rating_count": 40,
    "stock": 12
  },
  {
    "id": 17,
    "title": "Dell Inspiron Desktop",
    "price": 649.99,
    "description": "Versatile desktop tower with plenty of ports and expansion slots for future upgrades.",
    "category": "Desktop",
    "image": null,
    "rating_rate": 4.3,
    "rating_count": 130,
    "stock": 60
  },
  {
    "id": 18,
    "title": "ASUS ROG Strix G16",
    "price": 1399.99,
    "description": "Gaming laptop with high refresh rate display and robust cooling for long gaming sessions.",
    "category": "Laptop",
    "image": null,
    "rating_rate": 4.6,
    "rating_count": 88,
    "stock": 25
  },
  {
    "id": 19,
    "title": "iMac 24-inch Pink",
    "price": 1299.00,
    "description": "Playful pink edition of the 24-inch iMac, adding a pop of color to any workspace.",
    "category": "Apple iMac",
    "image": null,
    "rating_rate": 4.8,
    "rating_count": 90,
    "stock": 33
  },
  {
    "id": 20,
    "title": "MSI Aegis RS",
    "price": 1899.00,
    "description": "Esports-ready gaming desktop with standard components for easy future upgrades.",
    "category": "Gaming PC",
    "image": null,
    "rating_rate": 4.3,
    "rating_count": 60,
    "stock": 17
  }
];

const seedProducts = async () => {
    try {
        for (const product of products) {
            await Product.findOrCreate({
                where: { id: product.id },
                defaults: product
            });
            console.log(`Product '${product.title}' created or already exists.`);
        }
        console.log('Product seeding completed.');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
};

seedProducts();
