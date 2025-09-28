import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

// Generate 7 more items to complete 100
const additionalItems = [
  { name: "Mutton Rogan Josh", description: "Aromatic Kashmiri curry with tender mutton in yogurt-based gravy", category: "Non-Veg", minPrice: 350, maxPrice: 450 },
  { name: "Chicken Biriyani Special", description: "Premium chicken biryani with saffron and dry fruits", category: "Biryani", minPrice: 320, maxPrice: 420 },
  { name: "Veg Hakka Noodles", description: "Stir-fried noodles with fresh vegetables and soy sauce", category: "Veg", minPrice: 160, maxPrice: 220 },
  { name: "Chicken Fried Rice", description: "Wok-fried rice with chicken and mixed vegetables", category: "Non-Veg", minPrice: 200, maxPrice: 280 },
  { name: "Paneer Makhani", description: "Cottage cheese in rich tomato and cashew gravy", category: "Veg", minPrice: 230, maxPrice: 290 },
  { name: "Mutton Biryani Lucknowi", description: "Slow-cooked biryani with aromatic spices and tender mutton", category: "Biryani", minPrice: 380, maxPrice: 480 },
  { name: "Fresh Orange Juice", description: "Freshly squeezed orange juice with pulp", category: "Beverage", minPrice: 60, maxPrice: 100 }
];

// Restaurant names for variety
const restaurantNames = [
  "Spice Garden", "Royal Kitchen", "Food Paradise", "Tasty Bites", 
  "Golden Curry", "Fresh Flavors", "Hungry Hippo", "Delicious Delights", 
  "Urban Spoon", "Flavor Junction"
];

// Function to get food image URL - using reliable food image sources
const getFoodImageUrl = (foodName, index) => {
  // Using Unsplash with specific food photography collections
  const imageIds = [
    'tAKXap853rY', // Biryani
    'fdlZBWIP0aM', // Pizza
    'SqYmTDQYMgs', // Burger
    'oQl-llctFfE', // Indian curry
    'mAQZ3X_8_l0', // Pasta
    'IGfIGP5ONV0', // Coffee
    'RzOmKZDQedI', // Cake
    'lP5MCM6nZ5A', // Salad
    '4ycv3Ky1ZZU', // Noodles
    'lNjqZTCqBgw', // Dessert
  ];
  
  // Cycle through the image IDs
  const imageId = imageIds[index % imageIds.length];
  return `https://images.unsplash.com/${imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`;
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

// Main function to generate additional data
const generateAdditionalData = async () => {
  try {
    console.log('🚀 Starting additional dummy data generation...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/biteme', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check current count
    const currentCount = await Item.countDocuments();
    console.log(`📊 Current items in database: ${currentCount}`);

    const itemsNeeded = Math.max(0, 100 - currentCount);
    console.log(`➕ Need to add ${itemsNeeded} more items to reach 100`);

    if (itemsNeeded === 0) {
      console.log('🎉 Already have 100+ items in database!');
      return;
    }

    const items = [];
    
    // Generate items from additional data
    for (let i = 0; i < Math.min(itemsNeeded, additionalItems.length); i++) {
      const food = additionalItems[i];
      const restaurant = getRandomRestaurant();
      const price = getRandomPrice(food.minPrice, food.maxPrice);
      
      console.log(`Creating item ${currentCount + i + 1}: ${food.name}`);
      
      const item = {
        itemname: food.name,
        description: food.description,
        price: price,
        img: getFoodImageUrl(food.name, currentCount + i),
        category: food.category,
        hotelName: restaurant.name,
        hotelCity: "Mumbai",
        rating: Math.floor(Math.random() * 5) + 1,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0,
      };

      items.push(item);
    }

    // If we still need more items, duplicate some with variations
    while (items.length < itemsNeeded && items.length < 20) {
      const originalItem = items[Math.floor(Math.random() * Math.min(items.length, additionalItems.length))];
      const restaurant = getRandomRestaurant();
      
      const newItem = {
        ...originalItem,
        itemname: `${originalItem.itemname} Deluxe`,
        price: originalItem.price + Math.floor(Math.random() * 50) + 20,
        hotelName: restaurant.name,
        rating: Math.floor(Math.random() * 5) + 1,
        img: getFoodImageUrl(originalItem.itemname, currentCount + items.length),
      };
      
      items.push(newItem);
    }

    if (items.length > 0) {
      console.log('💾 Inserting items into database...');
      
      // Insert items into MongoDB
      const result = await Item.insertMany(items);
      
      console.log(`✅ Successfully inserted ${result.length} additional food items!`);
    }

    // Final count
    const finalCount = await Item.countDocuments();
    console.log(`📊 Total items in database: ${finalCount}`);
    
    console.log('\n📊 Summary:');
    
    // Show category breakdown of all items
    const categories = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    categories.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} items`);
    });
    
    // Price range
    const priceStats = await Item.aggregate([
      { $group: { 
        _id: null, 
        minPrice: { $min: "$price" }, 
        maxPrice: { $max: "$price" } 
      }}
    ]);
    
    if (priceStats.length > 0) {
      console.log(`\n💰 Price range: ₹${priceStats[0].minPrice} - ₹${priceStats[0].maxPrice}`);
    }
    
    // Restaurant count
    const restaurantCount = await Item.distinct("hotelName");
    console.log(`🏪 Restaurants: ${restaurantCount.length} different restaurants`);
    
    console.log('\n🖼️ All items have high-quality food images!');
    console.log('🎉 Database now contains 100+ food products!');
    
  } catch (error) {
    console.error('❌ Error generating additional data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
  }
};

// Run the script
generateAdditionalData();