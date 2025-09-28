import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Item model definition
const itemSchema = new mongoose.Schema({
  itemname: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  },
  hotelName: {
    type: String
  },
  hotelCity: {
    type: String
  },
  category: {
    type: String
  }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

// Load environment variables
dotenv.config();

// Food data with realistic names and descriptions
const foodData = [
  // Biryani
  { name: "Chicken Biryani", description: "Aromatic basmati rice cooked with tender chicken pieces and exotic spices", category: "Biryani", minPrice: 280, maxPrice: 350 },
  { name: "Mutton Biryani", description: "Rich and flavorful biryani with succulent mutton pieces and fragrant spices", category: "Biryani", minPrice: 320, maxPrice: 400 },
  { name: "Veg Biryani", description: "Delicious vegetarian biryani with mixed vegetables and aromatic basmati rice", category: "Biryani", minPrice: 220, maxPrice: 280 },
  { name: "Egg Biryani", description: "Classic biryani with boiled eggs and perfectly spiced rice", category: "Biryani", minPrice: 200, maxPrice: 260 },
  { name: "Hyderabadi Biryani", description: "Authentic Hyderabadi style biryani with tender meat and dum cooking", category: "Biryani", minPrice: 350, maxPrice: 450 },
  { name: "Lucknowi Biryani", description: "Royal Lucknowi biryani with fragrant long grain rice and aromatic spices", category: "Biryani", minPrice: 340, maxPrice: 420 },
  { name: "Prawns Biryani", description: "Coastal special biryani with fresh prawns and coastal spices", category: "Biryani", minPrice: 380, maxPrice: 480 },
  { name: "Fish Biryani", description: "Bengal style fish biryani with tender fish pieces and basmati rice", category: "Biryani", minPrice: 300, maxPrice: 380 },

  // Pizza
  { name: "Margherita Pizza", description: "Classic Italian pizza with fresh mozzarella, tomato sauce and basil", category: "Pizza", minPrice: 250, maxPrice: 320 },
  { name: "Pepperoni Pizza", description: "Spicy pepperoni slices with mozzarella cheese on crispy pizza base", category: "Pizza", minPrice: 320, maxPrice: 400 },
  { name: "BBQ Chicken Pizza", description: "Smoky BBQ chicken with onions and bell peppers on cheese base", category: "Pizza", minPrice: 380, maxPrice: 460 },
  { name: "Veggie Supreme Pizza", description: "Loaded with fresh vegetables, olives and cheese", category: "Pizza", minPrice: 300, maxPrice: 380 },
  { name: "Mushroom Pizza", description: "Fresh mushrooms with garlic and herbs on cheesy base", category: "Pizza", minPrice: 280, maxPrice: 350 },
  { name: "Paneer Tikka Pizza", description: "Indian fusion pizza with marinated paneer tikka and bell peppers", category: "Pizza", minPrice: 320, maxPrice: 400 },
  { name: "Chicken Supreme Pizza", description: "Loaded with chicken, mushrooms, peppers and extra cheese", category: "Pizza", minPrice: 400, maxPrice: 480 },
  { name: "Hawaiian Pizza", description: "Sweet pineapple with ham on a cheesy pizza base", category: "Pizza", minPrice: 340, maxPrice: 420 },

  // Burger
  { name: "Chicken Burger", description: "Juicy grilled chicken patty with lettuce, tomato and mayo", category: "Burger", minPrice: 180, maxPrice: 250 },
  { name: "Veg Burger", description: "Crispy vegetable patty with fresh veggies and special sauce", category: "Burger", minPrice: 150, maxPrice: 200 },
  { name: "Cheese Burger", description: "Beef patty with melted cheese, onions and pickles", category: "Burger", minPrice: 220, maxPrice: 280 },
  { name: "Paneer Burger", description: "Grilled paneer patty with Indian spices and fresh vegetables", category: "Burger", minPrice: 170, maxPrice: 230 },
  { name: "Fish Burger", description: "Crispy fish fillet with tartar sauce and fresh lettuce", category: "Burger", minPrice: 200, maxPrice: 260 },
  { name: "Chicken Tikka Burger", description: "Spicy chicken tikka patty with mint chutney and onions", category: "Burger", minPrice: 210, maxPrice: 270 },
  { name: "Mutton Burger", description: "Juicy mutton patty with special sauce and grilled onions", category: "Burger", minPrice: 240, maxPrice: 300 },
  { name: "Double Chicken Burger", description: "Double chicken patties with cheese and special sauce", category: "Burger", minPrice: 280, maxPrice: 350 },

  // Non-Veg
  { name: "Butter Chicken", description: "Creamy and rich chicken curry with aromatic spices", category: "Non-Veg", minPrice: 280, maxPrice: 350 },
  { name: "Chicken Tikka Masala", description: "Marinated chicken tikka in spicy tomato curry", category: "Non-Veg", minPrice: 260, maxPrice: 320 },
  { name: "Mutton Curry", description: "Tender mutton pieces cooked in traditional spices", category: "Non-Veg", minPrice: 320, maxPrice: 400 },
  { name: "Fish Curry", description: "Fresh fish cooked in coconut milk and coastal spices", category: "Non-Veg", minPrice: 280, maxPrice: 350 },
  { name: "Chicken Korma", description: "Mild and creamy chicken curry with cashews and spices", category: "Non-Veg", minPrice: 270, maxPrice: 340 },
  { name: "Tandoori Chicken", description: "Clay oven roasted chicken marinated in yogurt and spices", category: "Non-Veg", minPrice: 300, maxPrice: 380 },
  { name: "Prawn Curry", description: "Fresh prawns in coconut based curry with curry leaves", category: "Non-Veg", minPrice: 350, maxPrice: 450 },
  { name: "Chicken 65", description: "Spicy and crispy fried chicken appetizer from South India", category: "Non-Veg", minPrice: 220, maxPrice: 280 },

  // Veg
  { name: "Paneer Butter Masala", description: "Soft paneer cubes in rich tomato and butter gravy", category: "Veg", minPrice: 220, maxPrice: 280 },
  { name: "Dal Makhani", description: "Creamy black lentils cooked overnight with butter and cream", category: "Veg", minPrice: 180, maxPrice: 240 },
  { name: "Palak Paneer", description: "Fresh spinach curry with soft paneer cubes", category: "Veg", minPrice: 200, maxPrice: 260 },
  { name: "Chole Bhature", description: "Spicy chickpea curry with fluffy deep-fried bread", category: "Veg", minPrice: 160, maxPrice: 220 },
  { name: "Aloo Gobi", description: "Dry curry of potatoes and cauliflower with Indian spices", category: "Veg", minPrice: 140, maxPrice: 180 },
  { name: "Rajma Chawal", description: "Kidney bean curry served with steamed basmati rice", category: "Veg", minPrice: 150, maxPrice: 200 },
  { name: "Malai Kofta", description: "Fried cottage cheese balls in creamy tomato gravy", category: "Veg", minPrice: 210, maxPrice: 270 },
  { name: "Vegetable Pulao", description: "Fragrant rice cooked with mixed vegetables and whole spices", category: "Veg", minPrice: 160, maxPrice: 220 },

  // Beverage
  { name: "Mango Lassi", description: "Creamy yogurt drink blended with sweet mango pulp", category: "Beverage", minPrice: 80, maxPrice: 120 },
  { name: "Cold Coffee", description: "Chilled coffee with milk and ice cream, topped with whipped cream", category: "Beverage", minPrice: 100, maxPrice: 150 },
  { name: "Fresh Lime Soda", description: "Refreshing lime juice with soda and mint leaves", category: "Beverage", minPrice: 60, maxPrice: 100 },
  { name: "Masala Chai", description: "Traditional Indian tea brewed with aromatic spices", category: "Beverage", minPrice: 40, maxPrice: 70 },
  { name: "Banana Shake", description: "Thick and creamy shake made with fresh bananas and milk", category: "Beverage", minPrice: 70, maxPrice: 110 },
  { name: "Rose Milk", description: "Chilled milk flavored with rose syrup and topped with nuts", category: "Beverage", minPrice: 80, maxPrice: 120 },
  { name: "Chocolate Milkshake", description: "Rich chocolate shake with ice cream and whipped cream", category: "Beverage", minPrice: 120, maxPrice: 180 },
  { name: "Buttermilk", description: "Spiced yogurt drink with curry leaves and ginger", category: "Beverage", minPrice: 50, maxPrice: 80 },

  // Bakery
  { name: "Chocolate Cake", description: "Rich and moist chocolate sponge cake with chocolate frosting", category: "Bakery", minPrice: 400, maxPrice: 600 },
  { name: "Vanilla Cupcake", description: "Soft vanilla cupcake topped with buttercream frosting", category: "Bakery", minPrice: 80, maxPrice: 120 },
  { name: "Croissant", description: "Buttery and flaky French pastry, perfect for breakfast", category: "Bakery", minPrice: 120, maxPrice: 180 },
  { name: "Garlic Bread", description: "Crispy bread rolls with garlic butter and herbs", category: "Bakery", minPrice: 100, maxPrice: 150 },
  { name: "Red Velvet Cake", description: "Classic red velvet cake with cream cheese frosting", category: "Bakery", minPrice: 450, maxPrice: 650 },
  { name: "Blueberry Muffin", description: "Soft and fluffy muffin loaded with fresh blueberries", category: "Bakery", minPrice: 90, maxPrice: 140 },
  { name: "Cheese Danish", description: "Flaky pastry filled with creamy cheese and topped with glaze", category: "Bakery", minPrice: 110, maxPrice: 160 },
  { name: "Black Forest Cake", description: "Chocolate cake layered with cherries and whipped cream", category: "Bakery", minPrice: 500, maxPrice: 700 },

  // Additional items to reach 100
  { name: "Chicken Shawarma", description: "Middle Eastern wrap with grilled chicken and garlic sauce", category: "Non-Veg", minPrice: 180, maxPrice: 250 },
  { name: "Falafel Wrap", description: "Crispy falafel balls wrapped with hummus and fresh vegetables", category: "Veg", minPrice: 150, maxPrice: 200 },
  { name: "Pasta Alfredo", description: "Creamy white sauce pasta with herbs and parmesan cheese", category: "Veg", minPrice: 200, maxPrice: 280 },
  { name: "Chicken Pasta", description: "Italian pasta with grilled chicken in tomato basil sauce", category: "Non-Veg", minPrice: 250, maxPrice: 330 },
  { name: "Caesar Salad", description: "Fresh romaine lettuce with caesar dressing and croutons", category: "Veg", minPrice: 180, maxPrice: 240 },
  { name: "Greek Salad", description: "Mediterranean salad with olives, feta cheese and fresh vegetables", category: "Veg", minPrice: 200, maxPrice: 260 },
  { name: "Chicken Salad", description: "Grilled chicken salad with mixed greens and vinaigrette", category: "Non-Veg", minPrice: 220, maxPrice: 280 },
  { name: "Fish and Chips", description: "Crispy battered fish with golden french fries", category: "Non-Veg", minPrice: 280, maxPrice: 350 },
  { name: "Chicken Wings", description: "Spicy buffalo chicken wings with ranch dipping sauce", category: "Non-Veg", minPrice: 200, maxPrice: 270 },
  { name: "Onion Rings", description: "Crispy battered onion rings served with spicy mayo", category: "Veg", minPrice: 120, maxPrice: 180 },
  { name: "French Fries", description: "Golden crispy potato fries with ketchup and mayo", category: "Veg", minPrice: 100, maxPrice: 150 },
  { name: "Nachos Supreme", description: "Loaded nachos with cheese, jalapenos and sour cream", category: "Veg", minPrice: 180, maxPrice: 240 },
  { name: "Spring Rolls", description: "Crispy vegetable spring rolls with sweet chili sauce", category: "Veg", minPrice: 140, maxPrice: 200 },
  { name: "Chicken Momos", description: "Steamed dumplings filled with spiced chicken mince", category: "Non-Veg", minPrice: 160, maxPrice: 220 },
  { name: "Veg Momos", description: "Steamed dumplings filled with fresh vegetables and spices", category: "Veg", minPrice: 140, maxPrice: 190 },
  { name: "Chocolate Brownie", description: "Fudgy chocolate brownie served with vanilla ice cream", category: "Bakery", minPrice: 150, maxPrice: 220 },
  { name: "Cheesecake", description: "Creamy New York style cheesecake with berry compote", category: "Bakery", minPrice: 200, maxPrice: 300 },
  { name: "Tiramisu", description: "Classic Italian dessert with coffee and mascarpone cheese", category: "Bakery", minPrice: 180, maxPrice: 250 },
  { name: "Ice Cream Sundae", description: "Vanilla ice cream with chocolate sauce and fresh fruits", category: "Bakery", minPrice: 120, maxPrice: 180 },
  { name: "Gulab Jamun", description: "Soft and spongy milk dumplings in sugar syrup", category: "Bakery", minPrice: 80, maxPrice: 120 },
  { name: "Rasgulla", description: "Soft cottage cheese balls in light sugar syrup", category: "Bakery", minPrice: 70, maxPrice: 110 },
  { name: "Kulfi", description: "Traditional Indian ice cream with cardamom and pistachios", category: "Bakery", minPrice: 60, maxPrice: 100 },
  { name: "Jalebi", description: "Crispy spiral shaped sweet soaked in sugar syrup", category: "Bakery", minPrice: 90, maxPrice: 140 },
  { name: "Samosa", description: "Crispy pastry filled with spiced potatoes and green peas", category: "Veg", minPrice: 40, maxPrice: 80 },
  { name: "Pakora", description: "Deep fried fritters made with gram flour and vegetables", category: "Veg", minPrice: 60, maxPrice: 120 },
  { name: "Chicken Tikka", description: "Marinated chicken chunks grilled in tandoor oven", category: "Non-Veg", minPrice: 240, maxPrice: 320 },
  { name: "Seekh Kebab", description: "Spiced minced meat grilled on skewers", category: "Non-Veg", minPrice: 200, maxPrice: 280 },
  { name: "Paneer Tikka", description: "Marinated cottage cheese cubes grilled with vegetables", category: "Veg", minPrice: 180, maxPrice: 250 },
  { name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potato curry", category: "Veg", minPrice: 120, maxPrice: 180 },
  { name: "Idli Sambhar", description: "Steamed rice cakes served with lentil soup and chutney", category: "Veg", minPrice: 100, maxPrice: 150 },
  { name: "Uttapam", description: "Thick rice pancake topped with vegetables", category: "Veg", minPrice: 110, maxPrice: 170 },
  { name: "Vada Pav", description: "Mumbai street food - potato fritter in a bun with chutneys", category: "Veg", minPrice: 50, maxPrice: 90 },
  { name: "Pav Bhaji", description: "Spicy vegetable curry served with buttered bread rolls", category: "Veg", minPrice: 120, maxPrice: 180 },
  { name: "Sev Puri", description: "Crispy puris topped with chutneys, vegetables and sev", category: "Veg", minPrice: 80, maxPrice: 130 },
  { name: "Bhel Puri", description: "Puffed rice mixed with chutneys and fresh vegetables", category: "Veg", minPrice: 70, maxPrice: 120 },
  { name: "Dahi Puri", description: "Crispy puris filled with yogurt and sweet chutneys", category: "Veg", minPrice: 90, maxPrice: 140 },
  { name: "Pani Puri", description: "Crispy shells filled with spicy flavored water", category: "Veg", minPrice: 60, maxPrice: 100 },
];

// Restaurant names for variety
const restaurantNames = [
  "Spice Garden", "Royal Kitchen", "Food Paradise", "Tasty Bites", 
  "Golden Curry", "Fresh Flavors", "Hungry Hippo", "Delicious Delights", 
  "Urban Spoon", "Flavor Junction"
];

// Function to get random food image URLs from Unsplash
const getFoodImageUrl = (foodName) => {
  const searchTerm = foodName.toLowerCase().replace(/\s+/g, '-');
  return `https://source.unsplash.com/400x300/?${searchTerm},food`;
};

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (imageUrl, fileName) => {
  try {
    const result = await cloudinary.v2.uploader.upload(imageUrl, {
      public_id: `food_items/${fileName}`,
      folder: 'biteme_foods',
      transformation: [
        { width: 400, height: 300, crop: 'fill' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading image for ${fileName}:`, error.message);
    return null;
  }
};

// Function to generate random price
const getRandomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get random restaurant
const getRandomRestaurant = () => {
  return {
    id: Math.floor(Math.random() * 10) + 1,
    name: restaurantNames[Math.floor(Math.random() * restaurantNames.length)]
  };
};

// Main function to generate and insert data
const generateDummyData = async () => {
  try {
    console.log('🚀 Starting dummy data generation...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/biteme', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing items (optional - comment out if you want to keep existing data)
    // await Item.deleteMany({});
    // console.log('🗑️ Cleared existing items');

    const items = [];
    console.log('📸 Starting image uploads to Cloudinary...');

    for (let i = 0; i < Math.min(100, foodData.length); i++) {
      const food = foodData[i];
      const restaurant = getRandomRestaurant();
      const price = getRandomPrice(food.minPrice, food.maxPrice);
      
      console.log(`Processing ${i + 1}/100: ${food.name}`);
      
      // Get image URL from Unsplash
      const unsplashImageUrl = getFoodImageUrl(food.name);
      
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(
        unsplashImageUrl, 
        `${food.name.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`
      );

      if (!cloudinaryUrl) {
        console.warn(`⚠️ Failed to upload image for ${food.name}, using placeholder`);
      }

      const item = {
        itemname: food.name,
        description: food.description,
        price: price,
        img: cloudinaryUrl || getFoodImageUrl(food.name), // Fallback to Unsplash URL
        category: food.category,
        hotelName: restaurant.name,
        hotelCity: "Mumbai", // You can randomize this too
        rating: Math.floor(Math.random() * 5) + 1,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0, // 30% chance of discount
      };

      items.push(item);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('💾 Inserting items into database...');
    
    // Insert all items into MongoDB
    const result = await Item.insertMany(items);
    
    console.log(`✅ Successfully inserted ${result.length} food items!`);
    console.log('\n📊 Summary:');
    
    // Show category breakdown
    const categoryCount = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} items`);
    });
    
    console.log(`\n💰 Price range: ₹${Math.min(...items.map(i => i.price))} - ₹${Math.max(...items.map(i => i.price))}`);
    console.log(`🏪 Restaurants: ${[...new Set(items.map(i => i.hotelName))].length} different restaurants`);
    
    console.log('\n🖼️ All items have been uploaded with real food images from Cloudinary!');
    console.log('🎉 Dummy data generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating dummy data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
};

// Run the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  generateDummyData();
}

export default generateDummyData;
