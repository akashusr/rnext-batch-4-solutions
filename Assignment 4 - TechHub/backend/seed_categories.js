const { Category } = require('./src/models');

const categories = [
    "Desktop",
    "Gaming PC",
    "Apple Mac Mini",
    "Apple iMac",
    "Apple Mac Studio",
    "Apple Mac Pro",
    "Show All Desktop",
    "Laptop"
];

const seedCategories = async () => {
    try {
        for (const name of categories) {
            await Category.findOrCreate({
                where: { name },
                defaults: { name }
            });
            console.log(`Category '${name}' created or already exists.`);
        }
        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
};

seedCategories();
